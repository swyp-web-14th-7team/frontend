    import { useEffect, useMemo, useRef, useState } from "react";
    import { useNavigate, useParams } from "react-router-dom";

    import { getInterests, getJobTypes, getSkills } from "../../api/options";
    import { uploadProfileImage } from "../../api/files";
    import { getMyProfileCard, updateProfileCard } from "../../api/profile";

    import OnboardingLayout from "../../components/common/OnboardingLayout";
    import TagSelectModal from "../../components/onboarding/TagSelectModal";

    import styles from "./ProfileDetailEdit.module.css";

    const DEVELOPER_JOBS = ["frontend", "backend"];

    const JOB_NAME_MAP = {
    frontend: "frontend",
    backend: "backend",
    planner: "planner",
    designer: "designer",
    Frontend: "frontend",
    Backend: "backend",
    Planner: "planner",
    Designer: "designer",
    "Frontend Developer": "frontend",
    "Backend Developer": "backend",
    "프론트엔드 개발자": "frontend",
    "프론트 개발자": "frontend",
    "백엔드 개발자": "backend",
    기획자: "planner",
    디자이너: "designer",
    };

    const LINK_TYPES = [
    { type: 0, label: "Email" },
    { type: 1, label: "Instagram" },
    { type: 2, label: "GitHub" },
    { type: 3, label: "LinkedIn" },
    { type: 4, label: "Behance" },
    { type: 5, label: "Notion" },
    { type: 6, label: "Website" },
    ];

    const createEmptyLink = () => ({
    type: 6,
    value: "",
    });

    const createEmptyExperience = (isRepresentative = false) => ({
    title: "",
    description: "",
    relatedUrl: "",
    isRepresentative,
    });

    const extractItems = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.data?.items)) return response.data.items;
    return [];
    };

    const unwrapProfileCard = (response) =>
    response?.data?.card || response?.card || response?.data || response || {};

    const normalizeJobName = (jobName) =>
    JOB_NAME_MAP[jobName] ||
    String(jobName || "")
        .trim()
        .toLowerCase();

    const getJobName = (profile) => {
    if (typeof profile?.job === "string") return profile.job;

    return (
        profile?.jobType?.name || profile?.job?.name || profile?.jobTypeName || ""
    );
    };

    const normalizeJob = (profile) => normalizeJobName(getJobName(profile));

    const findJobTypeId = (profile, jobTypes) => {
    const directId =
        profile?.jobType?.id ?? profile?.jobTypeId ?? profile?.job?.id;

    if (directId !== undefined && directId !== null) {
        return Number(directId);
    }

    const currentJob = normalizeJob(profile);
    const matchedJob = jobTypes.find(
        (jobType) =>
        normalizeJobName(jobType?.name || jobType?.label) === currentJob,
    );

    return matchedJob?.id ? Number(matchedJob.id) : null;
    };

    const normalizeTagItem = (item, optionType) => {
    if (typeof item === "string") {
        return {
        id: item,
        name: item,
        type: optionType,
        optionType,
        };
    }

    const nestedItem = item?.skill || item?.interest || item;

    return {
        id: nestedItem?.id ?? item?.skillId ?? item?.interestId,
        name: nestedItem?.name || item?.name || "",
        type: optionType,
        optionType,
    };
    };

    const normalizeItems = (items, optionType) => {
    if (!Array.isArray(items)) return [];

    return items
        .map((item) => normalizeTagItem(item, optionType))
        .filter((item) => item.id !== undefined && item.id !== null && item.name);
    };

    const getUniquePositiveIntegerIds = (selectedItems, availableOptions) => {
    const optionIdByName = new Map(
        availableOptions
        .map((option) => {
            const nestedOption = option?.skill || option?.interest || option;
            const name = String(nestedOption?.name || option?.name || "")
            .trim()
            .toLowerCase();
            const id = Number(
            nestedOption?.id ??
                option?.skillId ??
                option?.interestId ??
                option?.id,
            );

            return [name, id];
        })
        .filter(([name, id]) => name && Number.isInteger(id) && id >= 1),
    );

    return [
        ...new Set(
        selectedItems
            .map((item) => {
            const directId = Number(
                item?.id ?? item?.skillId ?? item?.interestId,
            );

            if (Number.isInteger(directId) && directId >= 1) {
                return directId;
            }

            const itemName = String(item?.name || item || "")
                .trim()
                .toLowerCase();

            return optionIdByName.get(itemName);
            })
            .filter((id) => Number.isInteger(id) && id >= 1),
        ),
    ];
    };

    const normalizeLinks = (links) => {
    if (!Array.isArray(links) || links.length === 0) {
        return [createEmptyLink()];
    }

    return links.map((link) => ({
        id: link?.id,
        type: Number(link?.type ?? 6),
        value: link?.value || link?.url || "",
    }));
    };

    const normalizeExperiences = (experiences) => {
    if (!Array.isArray(experiences) || experiences.length === 0) {
        return [createEmptyExperience(true)];
    }

    return [...experiences]
        .sort((first, second) => (first?.sortOrder ?? 0) - (second?.sortOrder ?? 0))
        .map((experience, index) => ({
        id: experience?.id,
        title: experience?.title || "",
        description: experience?.description || experience?.summary || "",
        relatedUrl: experience?.relatedUrl || experience?.url || "",
        isRepresentative: experience?.isRepresentative ?? index === 0,
        }));
    };

    const createSkillSections = (skills) => {
    const sectionMap = new Map();

    skills.forEach((skill) => {
        const categoryName = skill?.category?.name || "기타";

        if (!sectionMap.has(categoryName)) {
        sectionMap.set(categoryName, []);
        }

        sectionMap.get(categoryName).push({
        id: skill.id,
        name: skill.name,
        type: "skill",
        optionType: "skill",
        });
    });

    return Array.from(sectionMap.entries()).map(
        ([categoryName, options], index) => ({
        id: `skill-category-${index}`,
        title: categoryName,
        options,
        }),
    );
    };

    const createInterestSections = (interests) => [
    {
        id: "interests",
        title: "관심 분야",
        options: interests.map((interest) => ({
        id: interest.id,
        name: interest.name,
        type: "interest",
        optionType: "interest",
        })),
    },
    ];

    const getProfileImagePreviewUrl = (imageUrl) => {
    if (!imageUrl) return "";

    if (
        /^blob:|^data:/i.test(imageUrl) ||
        /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(imageUrl)
    ) {
        return imageUrl;
    }

    return `${imageUrl.replace(/\/$/, "")}/72.webp`;
    };

    const TagEditSection = ({ title, description, items, onRemove, onOpen }) => (
    <section className={styles.formSection}>
        <div className={styles.sectionHeading}>
        <div>
            <p className={styles.sectionLabel}>{title}</p>
            <p className={styles.sectionHelp}>{description}</p>
        </div>

        <span className={styles.count}>{items.length}/10</span>
        </div>

        {items.length > 0 && (
        <div className={styles.selectedList}>
            {items.map((item) => (
            <button
                key={`${title}-${item.id}`}
                type="button"
                className={styles.selectedChip}
                onClick={() => onRemove(item.id)}
            >
                {item.name}
                <span aria-hidden="true">×</span>
            </button>
            ))}
        </div>
        )}

        <button type="button" className={styles.addButton} onClick={onOpen}>
        + 추가하기
        </button>
    </section>
    );

    const ProfileDetailEdit = () => {
    const navigate = useNavigate();
    const { profileId } = useParams();
    const imageInputRef = useRef(null);

    const [profile, setProfile] = useState(null);
    const [introduction, setIntroduction] = useState("");
    const [skillOptions, setSkillOptions] = useState([]);
    const [interestOptions, setInterestOptions] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [links, setLinks] = useState([createEmptyLink()]);
    const [experiences, setExperiences] = useState([createEmptyExperience(true)]);
    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [profileImagePreview, setProfileImagePreview] = useState("");
    const [modalType, setModalType] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const job = useMemo(() => normalizeJob(profile), [profile]);
    const isDeveloper = DEVELOPER_JOBS.includes(job);
    const isDesigner = job === "designer";

    const skillSections = useMemo(
        () => createSkillSections(skillOptions),
        [skillOptions],
    );

    const interestSections = useMemo(
        () => createInterestSections(interestOptions),
        [interestOptions],
    );

    useEffect(() => {
        const controller = new AbortController();

        const loadProfile = async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const [profileResponse, jobTypeResponse, interestResponse] =
            await Promise.all([
                getMyProfileCard(profileId, {
                signal: controller.signal,
                }),
                getJobTypes({
                signal: controller.signal,
                }),
                getInterests({
                signal: controller.signal,
                }),
            ]);

            const profileData = unwrapProfileCard(profileResponse);
            const jobTypes = extractItems(jobTypeResponse);
            const jobTypeId = findJobTypeId(profileData, jobTypes);

            const skillResponse = jobTypeId
            ? await getSkills({
                jobTypeId,
                signal: controller.signal,
                })
            : [];

            if (controller.signal.aborted) return;

            const imageUrl =
            profileData?.profileImageUrl || profileData?.profileImageUri || "";

            setProfile(profileData);
            setIntroduction(
            profileData?.description || profileData?.introduction || "",
            );
            setSkillOptions(extractItems(skillResponse));
            setInterestOptions(extractItems(interestResponse));
            setSelectedSkills(normalizeItems(profileData?.skills, "skill"));
            setSelectedInterests(
            normalizeItems(profileData?.interests, "interest"),
            );
            setLinks(normalizeLinks(profileData?.links));
            setExperiences(normalizeExperiences(profileData?.experiences));
            setProfileImageUrl(imageUrl);
            setProfileImagePreview(getProfileImagePreviewUrl(imageUrl));
        } catch (error) {
            if (error?.name === "AbortError") return;

            setErrorMessage(
            error?.message || "세부 프로필 정보를 불러오지 못했습니다.",
            );
        } finally {
            if (!controller.signal.aborted) {
            setIsLoading(false);
            }
        }
        };

        loadProfile();

        return () => controller.abort();
    }, [profileId]);

    const handleBack = () => {
        navigate(`/my-profile/${profileId}`);
    };

    const removeSelectedItem = (setter, itemId) => {
        setter((currentItems) =>
        currentItems.filter((item) => String(item.id) !== String(itemId)),
        );
    };

    const handleProfileImageChange = async (event) => {
        const imageFile = event.target.files?.[0];
        event.target.value = "";

        if (!imageFile) return;

        const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

        if (!allowedTypes.includes(imageFile.type)) {
        setErrorMessage("PNG, JPG, WEBP 이미지만 등록할 수 있습니다.");
        return;
        }

        if (imageFile.size > 5 * 1024 * 1024) {
        setErrorMessage("프로필 이미지는 5MB 이하만 등록할 수 있습니다.");
        return;
        }

        const objectUrl = URL.createObjectURL(imageFile);

        try {
        setIsImageUploading(true);
        setErrorMessage("");
        setProfileImagePreview(objectUrl);

        const uploadResult = await uploadProfileImage(imageFile);

        if (!uploadResult?.url) {
            throw new Error("업로드된 이미지 주소를 받지 못했습니다.");
        }

        setProfileImageUrl(uploadResult.url);
        setProfileImagePreview(getProfileImagePreviewUrl(uploadResult.url));
        } catch (error) {
        setProfileImagePreview(getProfileImagePreviewUrl(profileImageUrl));
        setErrorMessage(error?.message || "프로필 이미지 업로드에 실패했습니다.");
        } finally {
        URL.revokeObjectURL(objectUrl);
        setIsImageUploading(false);
        }
    };

    const handleLinkChange = (index, key, value) => {
        setLinks((currentLinks) =>
        currentLinks.map((link, linkIndex) =>
            linkIndex === index ? { ...link, [key]: value } : link,
        ),
        );
    };

    const addLink = () => {
        if (links.length >= 4) return;
        setLinks((currentLinks) => [...currentLinks, createEmptyLink()]);
    };

    const removeLink = (index) => {
        setLinks((currentLinks) => {
        const nextLinks = currentLinks.filter(
            (_, linkIndex) => linkIndex !== index,
        );

        return nextLinks.length ? nextLinks : [createEmptyLink()];
        });
    };

    const handleExperienceChange = (index, key, value) => {
        setExperiences((currentExperiences) =>
        currentExperiences.map((experience, experienceIndex) =>
            experienceIndex === index
            ? { ...experience, [key]: value }
            : experience,
        ),
        );
    };

    const setRepresentativeExperience = (index) => {
        setExperiences((currentExperiences) =>
        currentExperiences.map((experience, experienceIndex) => ({
            ...experience,
            isRepresentative: experienceIndex === index,
        })),
        );
    };

    const addExperience = () => {
        if (experiences.length >= 5) return;

        setExperiences((currentExperiences) => [
        ...currentExperiences,
        createEmptyExperience(),
        ]);
    };

    const removeExperience = (index) => {
        setExperiences((currentExperiences) => {
        const nextExperiences = currentExperiences.filter(
            (_, experienceIndex) => experienceIndex !== index,
        );

        if (nextExperiences.length === 0) {
            return [createEmptyExperience(true)];
        }

        if (!nextExperiences.some((experience) => experience.isRepresentative)) {
            return nextExperiences.map((experience, experienceIndex) => ({
            ...experience,
            isRepresentative: experienceIndex === 0,
            }));
        }

        return nextExperiences;
        });
    };

    const createExperiencePayload = () => {
        const filledExperiences = experiences.filter((experience) =>
        Boolean(
            experience.title.trim() ||
            experience.description.trim() ||
            experience.relatedUrl.trim(),
        ),
        );

        if (filledExperiences.some((experience) => !experience.title.trim())) {
        throw new Error("경험을 추가하려면 제목을 입력해주세요.");
        }

        const selectedRepresentativeIndex = filledExperiences.findIndex(
        (experience) => experience.isRepresentative,
        );
        const representativeIndex =
        selectedRepresentativeIndex >= 0 ? selectedRepresentativeIndex : 0;

        return filledExperiences.map((experience, index) => {
        const item = {
            title: experience.title.trim(),
            sortOrder: index,
            isRepresentative: index === representativeIndex,
        };

        const description = experience.description.trim();
        const relatedUrl = experience.relatedUrl.trim();

        // 빈 선택값은 ""로 보내지 않고 요청에서 제외한다.
        if (description) item.description = description;
        if (relatedUrl) item.relatedUrl = relatedUrl;

        return item;
        });
    };

    const createRequestBody = () => {
        const trimmedIntroduction = introduction.trim();
        const skillIds = getUniquePositiveIntegerIds(selectedSkills, skillOptions);
        const interestIds = getUniquePositiveIntegerIds(
        selectedInterests,
        interestOptions,
        );

        if (!trimmedIntroduction) {
        throw new Error("한 줄 소개를 입력해주세요.");
        }

        if (isDeveloper && skillIds.length === 0) {
        throw new Error("개발자 프로필에는 스킬을 1개 이상 선택해주세요.");
        }

        if (isDesigner && interestIds.length === 0) {
        throw new Error("디자이너 프로필에는 관심 분야를 1개 이상 선택해주세요.");
        }

        const linkPayload = links
        .filter((link) => link.value.trim())
        .map((link) => ({
            type: Number(link.type),
            value: link.value.trim(),
        }));

        const requestBody = {
        description: trimmedIntroduction,
        skillIds,
        interestIds,
        links: linkPayload,
        experiences: createExperiencePayload(),
        };

        if (profileImageUrl) {
        requestBody.profileImageUrl = profileImageUrl;
        }

        return requestBody;
    };

    const handleSave = async () => {
        setIsSaving(true);
        setErrorMessage("");

        try {
        await updateProfileCard(profileId, createRequestBody());

        navigate(`/my-profile/${profileId}`, {
            replace: true,
        });
        } catch (error) {
        setErrorMessage(error?.message || "세부 프로필을 저장하지 못했습니다.");
        } finally {
        setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
        <OnboardingLayout
            showBackButton={true}
            showProgress={true}
            onBack={handleBack}
            currentStep={2}
            totalSteps={5}
        >
            <p className={styles.statusMessage}>세부 프로필을 불러오는 중입니다.</p>
        </OnboardingLayout>
        );
    }

    if (errorMessage && !profile) {
        return (
        <OnboardingLayout
            showBackButton={true}
            showProgress={true}
            onBack={handleBack}
            currentStep={2}
            totalSteps={5}
        >
            <div className={styles.errorArea}>
            <p className={styles.errorMessage}>{errorMessage}</p>
            <button
                type="button"
                className={styles.backButton}
                onClick={handleBack}
            >
                돌아가기
            </button>
            </div>
        </OnboardingLayout>
        );
    }

    return (
        <OnboardingLayout
        showBackButton={true}
        showProgress={false}
        onBack={handleBack}
        currentStep={2}
        totalSteps={5}
        >
        <section className={styles.container}>
            <div className={styles.titleArea}>
            <h1 className={`headline1 ${styles.title}`}>세부 프로필 수정</h1>
            <p className={`body2 ${styles.description}`}>
                내 카드에 담길 정보를 수정해요
            </p>
            </div>

            <input
            ref={imageInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            hidden
            onChange={handleProfileImageChange}
            />

            <div
            className={styles.profileImage}
            style={{
                position: "relative",
                display: "block",
                width: "96px",
                height: "96px",
                margin: "0 auto 44px",
                flexShrink: 0,
                overflow: "visible",
                borderRadius: "50%",
                background: "#6d748e",
            }}
            >
            <button
                type="button"
                style={{
                position: "absolute",
                inset: 0,
                display: "block",
                width: "100%",
                height: "100%",
                padding: 0,
                overflow: "hidden",
                border: 0,
                borderRadius: "50%",
                background: "#6d748e",
                appearance: "none",
                cursor: isImageUploading ? "wait" : "pointer",
                }}
                onClick={() => imageInputRef.current?.click()}
                disabled={isImageUploading}
                aria-label="프로필 이미지 변경"
            >
                {profileImagePreview ? (
                <img
                    src={profileImagePreview}
                    alt="프로필"
                    onError={() => setProfileImagePreview("")}
                    style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    }}
                />
                ) : (
                <span
                    className={styles.profilePlaceholder}
                    style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: "#6d748e",
                    }}
                />
                )}
            </button>

            <span
                className={styles.editBadge}
                style={{
                right: "0",
                bottom: "0",
                width: "32px",
                height: "32px",
                zIndex: 1,
                pointerEvents: "none",
                }}
            >
                {isImageUploading ? "…" : "✎"}
            </span>
            </div>

            <section className={styles.formSection}>
            <div className={styles.sectionHeading}>
                <div>
                <p className={styles.sectionLabel}>한 줄 소개</p>
                <p className={styles.sectionHelp}>
                    나를 자세히 설명하고 인사를 건네보세요
                </p>
                </div>
                <span className={styles.count}>{introduction.length}/250</span>
            </div>

            <textarea
                className={styles.textarea}
                value={introduction}
                maxLength={250}
                onChange={(event) => setIntroduction(event.target.value)}
                placeholder="한 줄 소개를 입력하세요"
            />
            </section>

            <TagEditSection
            title="관심분야"
            description="관심 있는 분야를 보여주세요"
            items={selectedInterests}
            onRemove={(itemId) =>
                removeSelectedItem(setSelectedInterests, itemId)
            }
            onOpen={() => setModalType("interest")}
            />

            <TagEditSection
            title="스킬"
            description="나의 사용 툴과 역량을 어필해보세요"
            items={selectedSkills}
            onRemove={(itemId) => removeSelectedItem(setSelectedSkills, itemId)}
            onOpen={() => setModalType("skill")}
            />

            <section className={styles.formSection}>
            <div className={styles.sectionHeading}>
                <div>
                <p className={styles.sectionLabel}>링크</p>
                <p className={styles.sectionHelp}>
                    포트폴리오, Github, 이메일 등
                </p>
                </div>
                <span className={styles.count}>
                {links.filter((link) => link.value.trim()).length}
                /4
                </span>
            </div>

            <div className={styles.linkList}>
                {links.map((link, index) => (
                <div
                    key={`${link.id || "link"}-${index}`}
                    className={styles.linkRow}
                >
                    <select
                    className={styles.select}
                    value={link.type}
                    onChange={(event) =>
                        handleLinkChange(index, "type", Number(event.target.value))
                    }
                    >
                    {LINK_TYPES.map((linkType) => (
                        <option key={linkType.type} value={linkType.type}>
                        {linkType.label}
                        </option>
                    ))}
                    </select>

                    <input
                    className={styles.input}
                    value={link.value}
                    onChange={(event) =>
                        handleLinkChange(index, "value", event.target.value)
                    }
                    placeholder="URL 또는 이메일을 입력하세요"
                    />

                    <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeLink(index)}
                    aria-label="링크 삭제"
                    >
                    ×
                    </button>
                </div>
                ))}
            </div>

            <button
                type="button"
                className={styles.addButton}
                onClick={addLink}
                disabled={links.length >= 4}
            >
                + 추가하기
            </button>
            </section>

            <section className={styles.formSection}>
            <div className={styles.sectionHeading}>
                <div>
                <p className={styles.sectionLabel}>경험</p>
                <p className={styles.sectionHelp}>
                    내가 쌓아온 활동을 보여주세요
                </p>
                </div>
                <span className={styles.count}>
                {
                    experiences.filter((experience) => experience.title.trim())
                    .length
                }
                /5
                </span>
            </div>

            <div className={styles.experienceList}>
                {experiences.map((experience, index) => (
                <article
                    key={`${experience.id || "experience"}-${index}`}
                    className={styles.experienceCard}
                >
                    <div className={styles.experienceTop}>
                    <label className={styles.representativeLabel}>
                        <input
                        type="radio"
                        name="representativeExperience"
                        checked={experience.isRepresentative}
                        onChange={() => setRepresentativeExperience(index)}
                        />
                        대표
                    </label>

                    <button
                        type="button"
                        className={styles.removeExperienceButton}
                        onClick={() => removeExperience(index)}
                    >
                        삭제
                    </button>
                    </div>

                    <label className={styles.inputLabel}>
                    제목
                    <span>{experience.title.length}/20</span>
                    </label>
                    <input
                    className={styles.input}
                    value={experience.title}
                    maxLength={20}
                    onChange={(event) =>
                        handleExperienceChange(index, "title", event.target.value)
                    }
                    placeholder="프로젝트명, 대외활동 등을 입력하세요"
                    />

                    <label className={styles.inputLabel}>
                    설명
                    <span>
                        {experience.description.length}
                        /250
                    </span>
                    </label>
                    <textarea
                    className={styles.textarea}
                    value={experience.description}
                    maxLength={250}
                    onChange={(event) =>
                        handleExperienceChange(
                        index,
                        "description",
                        event.target.value,
                        )
                    }
                    placeholder="활동에 대한 설명을 입력하세요"
                    />

                    <label className={styles.inputLabel}>
                    관련 링크
                    <span>선택</span>
                    </label>
                    <input
                    className={styles.input}
                    value={experience.relatedUrl}
                    onChange={(event) =>
                        handleExperienceChange(
                        index,
                        "relatedUrl",
                        event.target.value,
                        )
                    }
                    placeholder="URL을 입력하세요"
                    />
                </article>
                ))}
            </div>

            <button
                type="button"
                className={styles.addButton}
                onClick={addExperience}
                disabled={experiences.length >= 5}
            >
                + 추가하기
            </button>
            </section>

            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

            <div className={styles.bottomButtons}>
            <button
                type="button"
                className={styles.skipButton}
                onClick={handleBack}
                disabled={isSaving || isImageUploading}
            >
                취소
            </button>
            <button
                type="button"
                className={styles.submitButton}
                onClick={handleSave}
                disabled={isSaving || isImageUploading}
            >
                {isSaving ? "저장 중..." : "변경사항 저장"}
            </button>
            </div>
        </section>

        {modalType && (
            <TagSelectModal
            title={modalType === "skill" ? "나의 스킬" : "나의 관심 분야"}
            description="먼저 선택된 3개가 카드에 노출돼요"
            sections={modalType === "skill" ? skillSections : interestSections}
            selectedItems={
                modalType === "skill" ? selectedSkills : selectedInterests
            }
            maxCount={10}
            onClose={() => setModalType(null)}
            onConfirm={(selected) => {
                if (modalType === "skill") {
                setSelectedSkills(selected);
                } else {
                setSelectedInterests(selected);
                }
                setModalType(null);
            }}
            />
        )}
        </OnboardingLayout>
    );
    };

    export default ProfileDetailEdit;
