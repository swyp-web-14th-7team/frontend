    import { useEffect, useLayoutEffect, useState } from "react";

    import { useNavigate, useParams } from "react-router-dom";

    import { FaBehance, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

    import { MdArticle, MdEmail, MdLanguage } from "react-icons/md";

    import {
    deleteProfileCard,
    getMyProfileCard,
    updateProfileCard,
    } from "../../api/profile";

    import { getPurposes } from "../../api/options";

    import { makeCardBackgroundUrl } from "../../api/cardBackground";

    import { mapProfileCard } from "../../utils/profileMapper";

    import styles from "./MyProfileDetail.module.css";

    const JOB_LABELS = {
    planner: "Planner",
    designer: "Designer",
    frontend: "Frontend Developer",
    backend: "Backend Developer",
    };

    const LINK_ICONS = {
    blog: MdArticle,
    notion: MdArticle,
    github: FaGithub,
    linkedin: FaLinkedin,
    behance: FaBehance,
    instagram: FaInstagram,
    email: MdEmail,
    website: MdLanguage,
    };

    const getItems = (response) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.items)) {
        return response.items;
    }

    if (Array.isArray(response?.data?.items)) {
        return response.data.items;
    }

    return [];
    };

    const getJobLabel = (profile) => {
    const job =
        typeof profile?.job === "string"
        ? profile.job
        : profile?.job?.name ||
            profile?.jobType?.name ||
            profile?.jobTypeName ||
            "";

    return JOB_LABELS[job] || job || "직군 미설정";
    };

    const getAffiliationText = (profile) => {
    return [profile?.affiliationType, profile?.affiliation]
        .filter(
        (value, index, values) =>
            Boolean(value) && values.indexOf(value) === index,
        )
        .join(" | ");
    };

    const hasText = (value) => {
    return Boolean(String(value || "").trim());
    };

    const getTagName = (tag) => {
    if (typeof tag === "string") {
        return tag.trim();
    }

    return String(tag?.name || "").trim();
    };

    const getLinkValue = (link) => {
    const value = String(link?.url || link?.value || "")
        .replace(/^mailto:/i, "")
        .trim();

    if (!value) {
        return "";
    }

    const label = String(link?.label || link?.type || "").trim();

    return label ? `${label}: ${value}` : value;
    };

    const getExperienceValue = (experience) => {
    const title = String(experience?.title || "").trim();

    const description = String(
        experience?.description || experience?.summary || "",
    ).trim();

    const relatedUrl = String(
        experience?.relatedUrl || experience?.url || "",
    ).trim();

    return [title, description, relatedUrl].filter(Boolean).join(" · ");
    };

    const getLinkHref = (link) => {
    const value = String(link?.url || link?.value || "").trim();

    if (!value) {
        return "";
    }

    if (String(link?.type || "").toLowerCase() === "email") {
        return value.startsWith("mailto:") ? value : `mailto:${value}`;
    }

    return value;
    };

    const MyProfileDetail = () => {
    const { profileId } = useParams();

    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);

    const [purposes, setPurposes] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [loadError, setLoadError] = useState("");

    const [actionError, setActionError] = useState("");

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [isVisibilityModalOpen, setIsVisibilityModalOpen] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedPurposeId, setSelectedPurposeId] = useState("");

    const [selectedIsActive, setSelectedIsActive] = useState(false);

    const [isSavingVisibility, setIsSavingVisibility] = useState(false);

    const [isDeleting, setIsDeleting] = useState(false);

    const [shareMessage, setShareMessage] = useState("");

    useEffect(() => {
        if (actionError !== "마지막 프로필 카드는 삭제할 수 없습니다.") {
        return undefined;
        }

        const timerId = window.setTimeout(() => {
        setActionError("");
        }, 4000);

        return () => {
        window.clearTimeout(timerId);
        };
    }, [actionError]);

    /*
    * 이전 화면의 스크롤 위치가 유지되면서
    * 헤더와 히어로 영역이 잘리는 문제를 방지합니다.
    */
    useLayoutEffect(() => {
        window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
        });

        document.documentElement.scrollTop = 0;

        document.body.scrollTop = 0;
    }, [profileId]);

    useEffect(() => {
        const controller = new AbortController();

        const loadProfile = async () => {
        try {
            setIsLoading(true);
            setLoadError("");

            const [profileResponse, purposeResponse] = await Promise.all([
            getMyProfileCard(profileId, {
                signal: controller.signal,
            }),

            getPurposes({
                signal: controller.signal,
            }),

            ]);

            if (controller.signal.aborted) {
            return;
            }

            const rawProfile =
            profileResponse?.data?.card ??
            profileResponse?.card ??
            profileResponse?.data ??
            profileResponse;

            setProfile(mapProfileCard(rawProfile || {}));

            setPurposes(getItems(purposeResponse));
        } catch (error) {
            if (error?.name === "AbortError") {
            return;
            }

            setLoadError(error?.message || "프로필을 불러오지 못했습니다.");
        } finally {
            if (!controller.signal.aborted) {
            setIsLoading(false);
            }
        }
        };

        loadProfile();

        return () => {
        controller.abort();
        };
    }, [profileId]);

    if (isLoading) {
        return (
        <main className={styles.notFound}>
            <p>프로필을 불러오는 중입니다.</p>
        </main>
        );
    }

    if (loadError || !profile) {
        return (
        <main className={styles.notFound}>
            <p>{loadError || "프로필을 찾을 수 없습니다."}</p>

            <button type="button" onClick={() => navigate("/profile")}>
            내 프로필로 돌아가기
            </button>
        </main>
        );
    }

    const interests = Array.isArray(profile.interests) ? profile.interests : [];

    const skills =
        Array.isArray(profile.techStacks) && profile.techStacks.length > 0
        ? profile.techStacks
        : Array.isArray(profile.skills)
            ? profile.skills
            : [];

    const links = Array.isArray(profile.links) ? profile.links : [];

    const experiences = Array.isArray(profile.experiences)
        ? profile.experiences
        : [];

    const introduction = profile.description || profile.introduction || "";

    const affiliationText = getAffiliationText(profile);

    const cardBackgroundUrl = makeCardBackgroundUrl(
        profile.cardImageUrl || profile.cardImage,
    );

    const strengthTitle =
        typeof profile.strength === "string"
        ? profile.strength
        : profile.strength?.title || profile.strength?.name || "";

    const strengthIcon =
        typeof profile.strength === "object" ? profile.strength?.icon : null;

    const hasIntroduction = hasText(introduction);

    const interestNames = interests.map(getTagName).filter(Boolean);

    const skillNames = skills.map(getTagName).filter(Boolean);

    const linkValues = links.map(getLinkValue).filter(Boolean);

    const experienceValues = experiences.map(getExperienceValue).filter(Boolean);

    const hasInterests = interestNames.length > 0;

    const hasSkills = skillNames.length > 0;

    const hasLinks = linkValues.length > 0;

    const hasExperiences = experienceValues.length > 0;

    const completionItems = [
        {
        key: "introduction",
        category: "한 줄 소개",
        title: "소개 작성",
        description: "나를 더 자세히 설명하고 인사를 건네보세요",
        value: introduction,
        completed: hasIntroduction,
        },
        {
        key: "interests",
        category: "관심분야",
        title: "관심 분야 선택",
        description: "관심 있는 도메인을 보여주세요",
        value: interestNames.join(" · "),
        completed: hasInterests,
        },
        {
        key: "skills",
        category: "스킬",
        title: "스킬 추가",
        description: "나의 사용 툴, 역량을 어필해보세요",
        value: skillNames.join(" · "),
        completed: hasSkills,
        },
        {
        key: "links",
        category: "링크",
        title: "링크 첨부",
        description: "내 이메일, 포트폴리오를 첨부해보세요",
        value: linkValues.join(" · "),
        completed: hasLinks,
        },
        {
        key: "experiences",
        category: "경험",
        title: "경험 추가",
        description: "내가 쌓아온 활동을 보여주세요",
        value: experienceValues.join(" · "),
        completed: hasExperiences,
        },
    ];

    const renderCompletedContent = (item) => {
        if (item.key === "interests") {
        return (
            <div className={styles.completionTags}>
            {interests.map((interest, index) => (
                <span key={interest?.id ?? `interest-${index}`}>
                {getTagName(interest)}
                </span>
            ))}
            </div>
        );
        }

        if (item.key === "skills") {
        return (
            <div className={styles.completionTags}>
            {skills.map((skill, index) => (
                <span key={skill?.id ?? `skill-${index}`}>{getTagName(skill)}</span>
            ))}
            </div>
        );
        }

        if (item.key === "links") {
        return (
            <div className={styles.completionLinks}>
            {links.map((link, index) => {
                const type = String(link?.type || "website").toLowerCase();
                const Icon = LINK_ICONS[type] || MdLanguage;
                const href = getLinkHref(link);
                const isEmail = type === "email" || href.startsWith("mailto:");

                return (
                <a
                    key={link?.id ?? `${type}-${index}`}
                    href={href}
                    target={isEmail ? undefined : "_blank"}
                    rel={isEmail ? undefined : "noreferrer"}
                >
                    <span className={styles.completionLinkCircle}>
                    <Icon aria-hidden="true" />
                    </span>

                    <span>{link?.label || link?.type || "링크"}</span>
                </a>
                );
            })}
            </div>
        );
        }

        if (item.key === "experiences") {
        return (
            <div className={styles.completionExperiences}>
            {experiences.map((experience, index) => {
                const description = String(
                experience?.description || experience?.summary || "",
                ).trim();

                const relatedUrl = String(
                experience?.relatedUrl || experience?.url || "",
                ).trim();

                return (
                <article
                    key={experience?.id ?? `experience-${index}`}
                    className={styles.completionExperience}
                >
                    <div className={styles.completionExperienceTitle}>
                    {experience?.isRepresentative && <span>대표</span>}

                    <strong>{experience?.title || "프로젝트 경험"}</strong>
                    </div>

                    {description && <p>{description}</p>}

                    {relatedUrl && (
                    <a href={relatedUrl} target="_blank" rel="noreferrer">
                        {experience?.linkLabel || "관련 링크 보기"}
                        <span aria-hidden="true">↗</span>
                    </a>
                    )}
                </article>
                );
            })}
            </div>
        );
        }

        return <p className={styles.completionValue}>{item.value}</p>;
    };

    const completedCount = completionItems.filter(
        (item) => item.completed,
    ).length;

    const shareUrl = `${window.location.origin}/profile/${profile.id}`;

    const handleEdit = (section) => {
        setIsMenuOpen(false);

        navigate(`/my-profile/${profileId}/detail-edit`, {
        state: {
            section,
        },
        });
    };

    const handleShare = async () => {
        setShareMessage("");
        setActionError("");

        if (!profile.isActive) {
        setShareMessage("프로필을 공개한 후 공유할 수 있습니다.");

        return;
        }

        try {
        await navigator.clipboard.writeText(shareUrl);

        setShareMessage("공개 프로필 링크를 복사했습니다.");
        } catch {
        setShareMessage("링크를 복사하지 못했습니다.");
        }
    };

    const handleOpenVisibility = () => {
        const profilePurposeId = profile.purposeId ?? profile.purpose?.id;

        const purposeName =
        typeof profile.purpose === "string"
            ? profile.purpose
            : profile.purpose?.name || profile.purposes?.[0];

        const matchedPurpose = purposes.find(
        (purpose) => purpose.name === purposeName,
        );

        setSelectedPurposeId(
        profilePurposeId
            ? String(profilePurposeId)
            : matchedPurpose?.id
            ? String(matchedPurpose.id)
            : "",
        );

        setSelectedIsActive(Boolean(profile.isActive));

        setActionError("");

        setIsVisibilityModalOpen(true);

        setIsMenuOpen(false);
    };

    const handleSaveVisibility = async () => {
        if (isSavingVisibility) {
        return;
        }

        if (selectedIsActive && !selectedPurposeId) {
        setActionError("공개 목적을 선택해주세요.");

        return;
        }

        try {
        setIsSavingVisibility(true);

        setActionError("");

        const requestBody = {
            isActive: selectedIsActive,
        };

        if (selectedPurposeId) {
            requestBody.purposeId = Number(selectedPurposeId);
        }

        await updateProfileCard(profile.id, requestBody);

        const selectedPurpose = purposes.find(
            (purpose) => String(purpose.id) === String(selectedPurposeId),
        );

        setProfile((currentProfile) => ({
            ...currentProfile,

            isActive: selectedIsActive,

            ...(selectedPurpose
            ? {
                purposeId: selectedPurpose.id,

                purpose: selectedPurpose,

                purposes: [selectedPurpose.name],
                }
            : {}),
        }));

        setIsVisibilityModalOpen(false);
        } catch (error) {
        setActionError(error?.message || "공개 설정을 변경하지 못했습니다.");
        } finally {
        setIsSavingVisibility(false);
        }
    };

    const handleOpenDelete = () => {
        setIsMenuOpen(false);
        setActionError("");

        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (isDeleting) {
        return;
        }

        try {
        setIsDeleting(true);

        setActionError("");

        await deleteProfileCard(profile.id);

        navigate("/profile", {
            replace: true,
        });
        } catch (error) {
        setActionError(
            error?.status === 409
            ? "마지막 프로필 카드는 삭제할 수 없습니다."
            : error?.message || "프로필을 삭제하지 못했습니다.",
        );

        setIsDeleteModalOpen(false);
        } finally {
        setIsDeleting(false);
        }
    };

    return (
        <main className={styles.page}>
        <div
            className={styles.hero}
            style={
            cardBackgroundUrl
                ? {
                    backgroundImage: `
                                    linear-gradient(
                                        rgba(56, 132, 236, 0.1),
                                        rgba(224, 235, 218, 0.08)
                                    ),
                                    url("${cardBackgroundUrl}")
                                `,
                }
                : undefined
            }
            aria-hidden="true"
        />

        <div className={styles.layout}>
            <aside className={styles.summaryCard}>
            <div className={styles.menuArea}>
                <button
                type="button"
                className={styles.moreButton}
                onClick={() => setIsMenuOpen((current) => !current)}
                aria-label="프로필 관리 메뉴"
                aria-expanded={isMenuOpen}
                >
                •••
                </button>

                {isMenuOpen && (
                <div className={styles.profileMenu}>
                    <button type="button" onClick={() => handleEdit("profile")}>
                    수정하기
                    </button>

                    <button
                    type="button"
                    className={styles.deleteMenuButton}
                    onClick={handleOpenDelete}
                    >
                    이 프로필 삭제
                    </button>
                </div>
                )}
            </div>

            <div className={styles.profileBlock}>
                {profile.profileImage ? (
                <img
                    src={profile.profileImage}
                    alt={`${profile.name || "사용자"} 프로필`}
                    className={styles.avatar}
                />
                ) : (
                <div className={styles.avatarPlaceholder} aria-hidden="true">
                    {profile.name?.trim()?.charAt(0) || "N"}
                </div>
                )}

                <div className={styles.identity}>
                <div className={styles.nameRow}>
                    <strong className={styles.name}>
                    {profile.name || "이름 없음"}
                    </strong>

                    <span className={styles.job}>{getJobLabel(profile)}</span>
                </div>

                <p className={styles.affiliation}>
                    {affiliationText || "소속 정보 없음"}
                </p>
                </div>

                {strengthTitle ? (
                <div className={styles.strength}>
                    {strengthIcon ? (
                    <img
                        src={strengthIcon}
                        alt=""
                        className={styles.strengthIcon}
                    />
                    ) : (
                    <span
                        className={styles.strengthPlaceholder}
                        aria-hidden="true"
                    />
                    )}

                    <span className={styles.strengthText}>{strengthTitle}</span>
                </div>
                ) : (
                <div className={styles.strengthEmpty} aria-hidden="true" />
                )}
            </div>

            <div className={styles.ownerActions}>
                <button
                type="button"
                className={styles.shareButton}
                onClick={handleShare}
                >
                공유하기
                </button>

                <button
                type="button"
                className={styles.visibilityButton}
                onClick={handleOpenVisibility}
                >
                공개 설정 변경
                </button>

                {shareMessage && (
                <p className={styles.shareMessage} role="status">
                    {shareMessage}
                </p>
                )}
            </div>
            </aside>

            <article className={styles.completionCard}>
            <div className={styles.completionHeader}>
                <h1>세부 프로필 완성하기</h1>

                <span>
                {completedCount}/{completionItems.length} 완료
                </span>
            </div>

            <div className={styles.completionList}>
                {completionItems.map((item) => (
                <section key={item.key} className={styles.completionItem}>
                    <div className={styles.completionItemContent}>
                    <span className={styles.completionCategory}>
                        {item.category}
                    </span>

                    {item.completed ? (
                        renderCompletedContent(item)
                    ) : (
                        <>
                        <strong>{item.title}</strong>

                        <p>{item.description}</p>
                        </>
                    )}
                    </div>

                    <button
                    type="button"
                    className={
                        item.completed
                        ? styles.completedButton
                        : styles.configureButton
                    }
                    onClick={() => handleEdit(item.key)}
                    >
                    {item.completed ? "수정하기" : "설정하기"}
                    </button>
                </section>
                ))}
            </div>
            </article>
        </div>

        <div className={styles.backArea}>
            <button type="button" onClick={() => navigate("/profile")}>
            ‹ 메인으로 돌아가기
            </button>
        </div>

        {actionError && (
            <p className={styles.pageError} role="alert">
            {actionError}
            </p>
        )}

        {isVisibilityModalOpen && (
            <div
            className={styles.modalBackdrop}
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !isSavingVisibility) {
                setIsVisibilityModalOpen(false);
                }
            }}
            >
            <section
                className={styles.visibilityModal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="visibility-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className={styles.modalHeader}>
                <h2 id="visibility-title">공개 설정 변경</h2>

                <button
                    type="button"
                    onClick={() => setIsVisibilityModalOpen(false)}
                    aria-label="공개 설정 닫기"
                >
                    ×
                </button>
                </div>

                <div className={styles.settingRow}>
                    <label htmlFor="profile-purpose">목적</label>

                    <select
                    id="profile-purpose"
                    value={selectedPurposeId}
                    onChange={(event) => setSelectedPurposeId(event.target.value)}
                    >
                    <option value="">목적 선택</option>

                    {purposes.map((purpose) => (
                        <option key={purpose.id} value={purpose.id}>
                        {purpose.name}
                        </option>
                    ))}
                    </select>
                </div>

                <div className={styles.settingRow}>
                <span>공개</span>

                <button
                    type="button"
                    className={`${styles.toggle} ${
                    selectedIsActive ? styles.toggleOn : ""
                    }`}
                    onClick={() => setSelectedIsActive((current) => !current)}
                    role="switch"
                    aria-checked={selectedIsActive}
                >
                    <span>{selectedIsActive ? "ON" : "OFF"}</span>

                    <i />
                </button>
                </div>

                <button
                type="button"
                className={styles.saveButton}
                onClick={handleSaveVisibility}
                disabled={isSavingVisibility}
                >
                {isSavingVisibility ? "저장 중..." : "저장"}
                </button>
            </section>
            </div>
        )}

        {isDeleteModalOpen && (
            <div
            className={styles.modalBackdrop}
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !isDeleting) {
                setIsDeleteModalOpen(false);
                }
            }}
            >
            <section
                className={styles.deleteModal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <span className={styles.deleteIcon} aria-hidden="true">
                ×
                </span>

                <h2 id="delete-title">삭제하시겠어요?</h2>

                <p>이 프로필은 다시 복구할 수 없게 돼요.</p>

                <div className={styles.deleteActions}>
                <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeleting}
                >
                    취소
                </button>

                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? "삭제 중..." : "삭제하기"}
                </button>
                </div>
            </section>
            </div>
        )}
        </main>
    );
    };

    export default MyProfileDetail;
