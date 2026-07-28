    import { useMemo, useState } from "react";

    import { uploadProfileImage } from "../../api/files";

    import OnboardingLayout from "../common/OnboardingLayout";
    import TagSelectModal from "./TagSelectModal";

    import styles from "./CardDetailStep.module.css";

    const MAX_LINKS = 4;
    const MAX_EXPERIENCES = 5;

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

    const getProfileImagePreviewUrl = (imageUrl) => {
    const normalizedUrl = String(imageUrl || "").trim();

    if (!normalizedUrl) {
        return "";
    }

    if (/\.(?:avif|gif|jpe?g|png|webp)(?:\?.*)?$/i.test(normalizedUrl)) {
        return normalizedUrl;
    }

    return `${normalizedUrl.replace(/\/+$/, "")}/72.webp`;
    };

    const createSkillSections = (skills) => {
    const sectionMap = new Map();

    skills.forEach((skill) => {
        const categoryName = skill.category?.name || "기타";

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

    const isDeveloperJob = (data) => {
    const jobText = [
        data?.job,
        data?.jobLabel,
        data?.jobType?.name,
        data?.jobTypeName,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    return /frontend|backend|프론트|백엔드/.test(jobText);
    };

    const CardDetailStep = ({
    data,
    skills = [],
    interests = [],
    onChange,
    onNext,
    onBack,
    currentStep,
    totalSteps,
    }) => {
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [imageError, setImageError] = useState("");

    const isDeveloper = isDeveloperJob(data);
    const skillSections = useMemo(() => createSkillSections(skills), [skills]);
    const interestSections = useMemo(
        () => createInterestSections(interests),
        [interests],
    );

    /*
    * BasicStep과 DetailStep은 서로 반대 항목을 받습니다.
    * - 기획자·디자이너: Basic 관심분야 / Detail 스킬
    * - 개발자: Basic 스킬 / Detail 관심분야
    */
    const detailTagConfig = isDeveloper
        ? {
            key: "interests",
            label: "관심분야",
            modalTitle: "관심 분야 선택",
            modalDescription: "관심 있는 분야를 선택해주세요.",
            sections: interestSections,
            selectedItems: data.interests || [],
        }
        : {
            key: "techStacks",
            label: "스킬",
            modalTitle: "스킬 선택",
            modalDescription: "사용하는 기술과 역량을 선택해주세요.",
            sections: skillSections,
            selectedItems: data.techStacks || [],
        };

    const links =
        Array.isArray(data.links) && data.links.length > 0
        ? data.links
        : [createEmptyLink()];

    const experiences =
        Array.isArray(data.experiences) && data.experiences.length > 0
        ? data.experiences
        : [createEmptyExperience(true)];

    const updateLink = (index, key, value) => {
        onChange({
        links: links.map((link, linkIndex) =>
            linkIndex === index
            ? {
                ...link,
                [key]: value,
                }
            : link,
        ),
        });
    };

    const addLink = () => {
        if (links.length >= MAX_LINKS) {
        return;
        }

        onChange({
        links: [...links, createEmptyLink()],
        });
    };

    const removeLink = (index) => {
        const nextLinks = links.filter((_, linkIndex) => linkIndex !== index);

        onChange({
        links: nextLinks.length > 0 ? nextLinks : [createEmptyLink()],
        });
    };

    const updateExperience = (index, key, value) => {
        onChange({
        experiences: experiences.map((experience, experienceIndex) =>
            experienceIndex === index
            ? {
                ...experience,
                [key]: value,
                }
            : experience,
        ),
        });
    };

    const addExperience = () => {
        if (experiences.length >= MAX_EXPERIENCES) {
        return;
        }

        onChange({
        experiences: [...experiences, createEmptyExperience(false)],
        });
    };

    const removeExperience = (index) => {
        const nextExperiences = experiences.filter(
        (_, experienceIndex) => experienceIndex !== index,
        );

        onChange({
        experiences:
            nextExperiences.length > 0
            ? nextExperiences.map((experience, experienceIndex) => ({
                ...experience,
                isRepresentative:
                    experienceIndex === 0 ? true : experience.isRepresentative,
                }))
            : [createEmptyExperience(true)],
        });
    };

    const handleProfileImageChange = async (event) => {
        const imageFile = event.target.files?.[0];
        event.target.value = "";

        if (!imageFile) {
        return;
        }

        const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

        if (!allowedTypes.includes(imageFile.type)) {
        setImageError("PNG, JPG, WEBP 이미지만 등록할 수 있습니다.");
        return;
        }

        if (imageFile.size > 5 * 1024 * 1024) {
        setImageError("프로필 이미지는 5MB 이하만 등록할 수 있습니다.");
        return;
        }

        const objectUrl = URL.createObjectURL(imageFile);

        try {
        setIsImageUploading(true);
        setImageError("");

        onChange({
            profileImagePreview: objectUrl,
        });

        const uploadResult = await uploadProfileImage(imageFile);

        if (!uploadResult?.url) {
            throw new Error("업로드된 이미지 주소를 받지 못했습니다.");
        }

        onChange({
            profileImageUrl: uploadResult.url,
            profileImagePreview: getProfileImagePreviewUrl(uploadResult.url),
        });
        } catch (error) {
        onChange({
            profileImagePreview: getProfileImagePreviewUrl(data.profileImageUrl),
        });

        setImageError(error?.message || "프로필 이미지 업로드에 실패했습니다.");
        } finally {
        URL.revokeObjectURL(objectUrl);
        setIsImageUploading(false);
        }
    };

    return (
        <OnboardingLayout
        showBackButton={true}
        showProgress={true}
        onBack={onBack}
        currentStep={currentStep}
        totalSteps={totalSteps}
        >
        <section className={styles.container}>
            <header className={styles.titleArea}>
            <h1 className={`headline1 ${styles.title}`}>
                더 자세한 설명을 덧붙여보세요
            </h1>

            <p className={`caption1 ${styles.description}`}>
                카드의 세부 프로필에 등록되는 정보예요
            </p>
            </header>

            <div className={styles.profileImageBox}>
            <div className={styles.profileCircle}>
                {data.profileImagePreview && (
                <img
                    src={data.profileImagePreview}
                    alt="선택한 프로필"
                    className={styles.profileImage}
                />
                )}
            </div>

            <label className={styles.editButton} aria-label="프로필 이미지 수정">
                <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleProfileImageChange}
                disabled={isImageUploading}
                className={styles.imageInput}
                />

                {isImageUploading ? "…" : "✎"}
            </label>
            </div>

            {imageError && <p className={styles.errorMessage}>{imageError}</p>}

            <div className={styles.form}>
            <section className={styles.field}>
                <div className={styles.fieldHeader}>
                <label className={styles.label}>{detailTagConfig.label}</label>

                <span className={styles.count}>
                    {detailTagConfig.selectedItems.length}/10
                </span>
                </div>

                {detailTagConfig.selectedItems.length > 0 && (
                <div className={styles.tagList}>
                    {detailTagConfig.selectedItems.map((item) => (
                    <span key={item.id} className={styles.tag}>
                        {item.name}
                    </span>
                    ))}
                </div>
                )}

                <button
                type="button"
                className={styles.addButton}
                onClick={() => setIsTagModalOpen(true)}
                >
                + 추가하기
                </button>
            </section>

            <section className={styles.field}>
                <div className={styles.fieldHeader}>
                <label className={styles.label}>링크</label>

                <span className={styles.count}>
                    {links.filter((link) => String(link.value || "").trim()).length}
                    /{MAX_LINKS}
                </span>
                </div>

                <div className={styles.linkList}>
                {links.map((link, index) => (
                    <div
                    key={link.id || `link-${index}`}
                    className={styles.linkRow}
                    >
                    <select
                        className={styles.linkSelect}
                        value={Number(link.type ?? 6)}
                        onChange={(event) =>
                        updateLink(index, "type", Number(event.target.value))
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
                        type="text"
                        value={link.value || ""}
                        onChange={(event) =>
                        updateLink(index, "value", event.target.value)
                        }
                        placeholder="포트폴리오, Github, 이메일 등"
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
                disabled={links.length >= MAX_LINKS}
                >
                + 추가하기
                </button>
            </section>

            <section className={styles.field}>
                <div className={styles.fieldHeader}>
                <label className={styles.label}>경험</label>

                <span className={styles.count}>
                    {experiences.length}/{MAX_EXPERIENCES}
                </span>
                </div>

                <div className={styles.experienceList}>
                {experiences.map((experience, index) => (
                    <article
                    key={experience.id || `experience-${index}`}
                    className={styles.experienceCard}
                    >
                    <label className={styles.representativeRow}>
                        <input
                        type="radio"
                        name="representative-experience"
                        checked={Boolean(experience.isRepresentative)}
                        onChange={() =>
                            onChange({
                            experiences: experiences.map((item, itemIndex) => ({
                                ...item,
                                isRepresentative: itemIndex === index,
                            })),
                            })
                        }
                        />
                        대표
                    </label>

                    <div className={styles.experienceHeader}>
                        <span>제목</span>
                        <span>
                        {(experience.title || "").length}
                        /20
                        </span>
                    </div>

                    <input
                        className={styles.input}
                        type="text"
                        value={experience.title || ""}
                        maxLength={20}
                        onChange={(event) =>
                        updateExperience(index, "title", event.target.value)
                        }
                        placeholder="프로젝트명, 대외활동 등을 입력해보세요"
                    />

                    <div className={styles.experienceHeader}>
                        <span>설명</span>
                        <span>
                        {(experience.description || "").length}
                        /250
                        </span>
                    </div>

                    <textarea
                        className={styles.textarea}
                        value={experience.description || ""}
                        maxLength={250}
                        onChange={(event) =>
                        updateExperience(index, "description", event.target.value)
                        }
                        placeholder="텍스트를 입력하세요"
                    />

                    <span className={styles.experienceLabel}>관련 링크</span>

                    <input
                        className={styles.input}
                        type="url"
                        value={experience.relatedUrl || ""}
                        onChange={(event) =>
                        updateExperience(index, "relatedUrl", event.target.value)
                        }
                        placeholder="URL (선택)"
                    />

                    {experiences.length > 1 && (
                        <button
                        type="button"
                        className={styles.removeExperienceButton}
                        onClick={() => removeExperience(index)}
                        >
                        경험 삭제
                        </button>
                    )}
                    </article>
                ))}
                </div>

                <button
                type="button"
                className={styles.addButton}
                onClick={addExperience}
                disabled={experiences.length >= MAX_EXPERIENCES}
                >
                추가하기
                </button>
            </section>
            </div>

            <div className={styles.actions}>
            <button type="button" className={styles.skipButton} onClick={onNext}>
                건너뛰기
            </button>

            <button
                type="button"
                className={styles.submitButton}
                onClick={onNext}
            >
                등록
            </button>
            </div>
        </section>

        {isTagModalOpen && (
            <TagSelectModal
            title={detailTagConfig.modalTitle}
            description={detailTagConfig.modalDescription}
            sections={detailTagConfig.sections}
            selectedItems={detailTagConfig.selectedItems}
            maxCount={10}
            onClose={() => setIsTagModalOpen(false)}
            onConfirm={(selectedItems) => {
                onChange({
                [detailTagConfig.key]: selectedItems,
                });
                setIsTagModalOpen(false);
            }}
            />
        )}
        </OnboardingLayout>
    );
    };

    export default CardDetailStep;
