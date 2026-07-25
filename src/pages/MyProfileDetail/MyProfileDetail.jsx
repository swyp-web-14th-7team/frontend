import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    FaBehance,
    FaGithub,
    FaInstagram,
} from "react-icons/fa";

import {
    MdArticle,
    MdEmail,
    MdLanguage,
} from "react-icons/md";

import {
    deleteProfileCard,
    getMyProfileCard,
    updateProfileCard,
} from "../../api/profile";

import {
    getPurposes,
} from "../../api/options";

import {
    makeCardBackgroundUrl,
} from "../../api/cardBackground";

import {
    mapProfileCard,
} from "../../utils/profileMapper";

import detailStyles from "../Profile/ProfileDetail.module.css";
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
    behance: FaBehance,
    instagram: FaInstagram,
    email: MdEmail,
    website: MdLanguage,
    linkedin: MdLanguage,
};

const getTagName = (tag) => {
    if (typeof tag === "string") {
        return tag;
    }

    return tag?.name || "";
};

const MyProfileDetail = () => {
    const { profileId } = useParams();
    const navigate = useNavigate();

    const [
        profile,
        setProfile,
    ] = useState(null);

    const [
        purposes,
        setPurposes,
    ] = useState([]);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        isMenuOpen,
        setIsMenuOpen,
    ] = useState(false);

    const [
        isDeleteModalOpen,
        setIsDeleteModalOpen,
    ] = useState(false);

    const [
        isDeleting,
        setIsDeleting,
    ] = useState(false);

    const [
        isVisibilityModalOpen,
        setIsVisibilityModalOpen,
    ] = useState(false);

    const [
        selectedPurposeId,
        setSelectedPurposeId,
    ] = useState("");

    const [
        selectedIsActive,
        setSelectedIsActive,
    ] = useState(false);

    const [
        isSavingVisibility,
        setIsSavingVisibility,
    ] = useState(false);

    const [
        shareMessage,
        setShareMessage,
    ] = useState("");

    useEffect(() => {
        const controller =
            new AbortController();

        const timerId =
            window.setTimeout(
                async () => {
                    try {
                        const [
                            profileResult,
                            purposeResult,
                        ] =
                            await Promise.all(
                                [
                                    getMyProfileCard(
                                        profileId,
                                        {
                                            signal:
                                                controller
                                                    .signal,
                                        },
                                    ),

                                    getPurposes({
                                        signal:
                                            controller
                                                .signal,
                                    }),
                                ],
                            );

                        const mappedProfile =
                            mapProfileCard(
                                profileResult ||
                                    {},
                            );

                        const purposeItems =
                            Array.isArray(
                                purposeResult,
                            )
                                ? purposeResult
                                : purposeResult
                                      ?.items ??
                                  purposeResult
                                      ?.data
                                      ?.items ??
                                  [];

                        setProfile(
                            mappedProfile,
                        );

                        setPurposes(
                            purposeItems,
                        );

                        setError("");
                    } catch (
                        requestError
                    ) {
                        if (
                            requestError?.name ===
                            "AbortError"
                        ) {
                            return;
                        }

                        setError(
                            requestError
                                ?.message ||
                                "프로필을 불러오지 못했습니다.",
                        );
                    } finally {
                        if (
                            !controller
                                .signal
                                .aborted
                        ) {
                            setIsLoading(
                                false,
                            );
                        }
                    }
                },
                0,
            );

        return () => {
            window.clearTimeout(
                timerId,
            );

            controller.abort();
        };
    }, [profileId]);

    if (isLoading) {
        return (
            <main
                className={
                    detailStyles.notFound
                }
            >
                <p>
                    프로필을 불러오는
                    중입니다.
                </p>
            </main>
        );
    }

    if (
        error ||
        !profile
    ) {
        return (
            <main
                className={
                    detailStyles.notFound
                }
            >
                <p>
                    {error ||
                        "프로필을 찾을 수 없습니다."}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/profile",
                        )
                    }
                >
                    내 프로필로 돌아가기
                </button>
            </main>
        );
    }

    const interests = (
        profile.interests || []
    )
        .map(
            (
                interest,
                index,
            ) => ({
                id:
                    interest?.id ??
                    `interest-${index}`,

                name:
                    getTagName(
                        interest,
                    ),
            }),
        )
        .filter(
            (interest) =>
                interest.name,
        );

    const skills = (
        profile.techStacks ||
        profile.skills ||
        []
    )
        .map(
            (
                skill,
                index,
            ) => ({
                id:
                    skill?.id ??
                    `skill-${index}`,

                name:
                    getTagName(
                        skill,
                    ),
            }),
        )
        .filter(
            (skill) =>
                skill.name,
        );

    const links =
        profile.links || [];

    const experiences =
        profile.experiences || [];

    const introduction =
        profile.description ||
        profile.introduction ||
        "등록된 한 줄 소개가 없습니다.";

    const hasIntroduction = Boolean(
        (
            profile.description ||
            profile.introduction ||
            ""
        ).trim(),
    );

    const completionItems = [
        {
            category: "한 줄 소개",
            field: "introduction",
            title: "소개 작성",
            description:
                "나를 더 자세히 설명하고 인사를 건네보세요",
            completed: hasIntroduction,
        },
        {
            category: "관심분야",
            field: "interests",
            title: "관심 분야 선택",
            description:
                "관심 있는 도메인을 보여주세요",
            completed: interests.length > 0,
        },
        {
            category: "스킬",
            field: "skills",
            title: "스킬 추가",
            description:
                "나의 사용 툴, 역량을 어필해보세요",
            completed: skills.length > 0,
        },
        {
            category: "링크",
            field: "links",
            title: "링크 첨부",
            description:
                "내 이메일, 포트폴리오를 첨부해보세요",
            completed: links.some(
                (link) =>
                    Boolean(
                        link?.url?.trim?.(),
                    ),
            ),
        },
        {
            category: "경험",
            field: "experiences",
            title: "경험 추가",
            description:
                "내가 쌓아온 활동을 보여주세요",
            completed: experiences.some(
                (experience) =>
                    Boolean(
                        experience?.title?.trim?.() ||
                            experience?.description?.trim?.() ||
                            experience?.summary?.trim?.() ||
                            experience?.url?.trim?.(),
                    ),
            ),
        },
    ];

    const completedDetailCount =
        completionItems.filter(
            (item) => item.completed,
        ).length;

    const isDetailIncomplete =
        completedDetailCount < 5;

    const affiliationText = [
        profile.affiliationType,
        profile.affiliation,
    ]
        .filter(
            (
                value,
                index,
                values,
            ) =>
                Boolean(value) &&
                values.indexOf(
                    value,
                ) === index,
        )
        .join(" | ");

    const cardBackgroundUrl =
        makeCardBackgroundUrl(
            profile.cardImageUrl ||
                profile.cardImage,
        );

    const shareUrl =
        `${window.location.origin}/profile/${profile.id}`;

    const handleBack = () => {
        navigate(-1);
    };

    const handleEdit = (field) => {
        setIsMenuOpen(false);

        const editPath =
            `/my-profile/${profileId}/detail-edit`;

        navigate(
            field
                ? `${editPath}?field=${field}#${field}`
                : editPath,
            {
                state: field
                    ? { focusField: field }
                    : undefined,
            },
        );
    };

    const handleShare =
        async () => {
            if (!profile.isActive) {
                setShareMessage(
                    "프로필을 공개한 후 공유할 수 있습니다.",
                );

                return;
            }

            try {
                await navigator.clipboard.writeText(
                    shareUrl,
                );

                setShareMessage(
                    "공개 프로필 링크를 복사했습니다.",
                );
            } catch {
                setShareMessage(
                    "링크를 복사하지 못했습니다.",
                );
            }
        };

    const handleOpenVisibility =
        () => {
            const currentPurposeName =
                profile.purposes?.[0];

            const currentPurpose =
                purposes.find(
                    (purpose) =>
                        purpose.name ===
                        currentPurposeName,
                );

            const currentPurposeId =
                profile.purposeId ??
                profile.purpose?.id ??
                currentPurpose?.id ??
                1;

            setSelectedPurposeId(
                String(currentPurposeId),
            );

            setSelectedIsActive(
                Boolean(
                    profile.isActive,
                ),
            );

            setIsVisibilityModalOpen(
                true,
            );

            setIsMenuOpen(false);
        };

    const handleSaveVisibility =
        async () => {
            if (
                selectedIsActive &&
                !selectedPurposeId
            ) {
                setError(
                    "공개 목적을 선택해주세요.",
                );

                return;
            }

            try {
                setIsSavingVisibility(
                    true,
                );

                setError("");

                const requestBody = {
                    isActive:
                        selectedIsActive,
                };

                if (
                    selectedPurposeId
                ) {
                    requestBody.purposeId =
                        Number(
                            selectedPurposeId,
                        );
                }

                await updateProfileCard(
                    profile.id,
                    requestBody,
                );

                const purpose =
                    purposes.find(
                        (item) =>
                            String(
                                item.id,
                            ) ===
                            selectedPurposeId,
                    );

                setProfile(
                    (
                        currentProfile,
                    ) => ({
                        ...currentProfile,

                        isActive:
                            selectedIsActive,

                        purposes:
                            purpose
                                ? [
                                      purpose.name,
                                  ]
                                : currentProfile.purposes,
                    }),
                );

                setIsVisibilityModalOpen(
                    false,
                );
            } catch (
                requestError
            ) {
                setError(
                    requestError
                        ?.message ||
                        "공개 설정을 변경하지 못했습니다.",
                );
            } finally {
                setIsSavingVisibility(
                    false,
                );
            }
        };

    const handleOpenDelete =
        () => {
            setIsMenuOpen(false);

            if (
                profile.isDefault
            ) {
                window.alert(
                    "기본 프로필 카드는 삭제할 수 없습니다.",
                );

                return;
            }

            setIsDeleteModalOpen(
                true,
            );
        };

    const handleDelete =
        async () => {
            try {
                setIsDeleting(
                    true,
                );

                await deleteProfileCard(
                    profile.id,
                );

                navigate(
                    "/profile",
                    {
                        replace: true,
                    },
                );
            } catch (
                requestError
            ) {
                setError(
                    requestError
                        ?.message ||
                        "프로필을 삭제하지 못했습니다.",
                );

                setIsDeleteModalOpen(
                    false,
                );
            } finally {
                setIsDeleting(
                    false,
                );
            }
        };

    return (
        <main
            className={`${detailStyles.page} ${styles.page}`}
        >
            <div
                className={`${detailStyles.layout} ${styles.layout}`}
            >
                <aside
                    className={`${detailStyles.summaryCard} ${styles.summaryCard}`}
                    style={
                        cardBackgroundUrl
                            ? {
                                  backgroundImage: `
                                      linear-gradient(
                                          rgba(22, 25, 38, 0.12),
                                          rgba(22, 25, 38, 0.24)
                                      ),
                                      url("${cardBackgroundUrl}")
                                  `,
                                  backgroundPosition:
                                      "center",
                                  backgroundSize:
                                      "cover",
                                  backgroundRepeat:
                                      "no-repeat",
                              }
                            : undefined
                    }
                >
                    <button
                        type="button"
                        className={`${detailStyles.backButton} ${styles.backButton}`}
                        onClick={
                            handleBack
                        }
                        aria-label="이전 화면으로 돌아가기"
                    >
                        ‹
                    </button>

                    <div
                        className={`${detailStyles.actionMenuArea} ${styles.actionMenuArea}`}
                    >
                        <button
                            type="button"
                            className={
                                detailStyles.moreButton
                            }
                            onClick={() =>
                                setIsMenuOpen(
                                    (
                                        currentValue,
                                    ) =>
                                        !currentValue,
                                )
                            }
                            aria-label="프로필 관리 메뉴"
                            aria-expanded={
                                isMenuOpen
                            }
                        >
                            •••
                        </button>

                        {isMenuOpen && (
                            <div
                                className={`${detailStyles.summaryActions} ${styles.profileMenu}`}
                            >
                                <button
                                    type="button"
                                    className={
                                        detailStyles.scrapButton
                                    }
                                    onClick={() =>
                                        handleEdit()
                                    }
                                >
                                    수정하기
                                </button>

                                <button
                                    type="button"
                                    className={styles.mobileVisibilityButton}
                                    onClick={
                                        handleOpenVisibility
                                    }
                                >
                                    공개설정 변경
                                </button>

                                <button
                                    type="button"
                                    className={`${detailStyles.exchangeButton} ${styles.deleteMenuButton}`}
                                    onClick={
                                        handleOpenDelete
                                    }
                                >
                                    이 프로필 삭제
                                </button>
                            </div>
                        )}
                    </div>

                    <div
                        className={
                            styles.summaryContent
                        }
                    >
                    {profile.profileImage ? (
                        <img
                            src={
                                profile.profileImage
                            }
                            alt={`${profile.name || "사용자"} 프로필`}
                            className={`${detailStyles.avatar} ${styles.avatar}`}
                        />
                    ) : (
                        <div
                            className={`${detailStyles.avatarPlaceholder} ${styles.avatar}`}
                            aria-hidden="true"
                        >
                            {profile.name
                                ?.trim()
                                ?.charAt(0) ||
                                "N"}
                        </div>
                    )}

                    <div
                        className={`${detailStyles.nameRow} ${styles.nameRow}`}
                    >
                        <strong
                            className={`${detailStyles.name} ${styles.name}`}
                        >
                            {profile.name ||
                                "이름 없음"}
                        </strong>

                        <span
                            className={`${detailStyles.job} ${styles.job}`}
                        >
                            {JOB_LABELS[
                                profile.job
                            ] ||
                                profile.jobTypeName ||
                                "직군 미선택"}
                        </span>
                    </div>

                    <p
                        className={`${detailStyles.affiliation} ${styles.affiliation}`}
                    >
                        {affiliationText ||
                            "소속 정보 없음"}
                    </p>

                    {profile.strength && (
                        <div
                            className={`${detailStyles.strength} ${styles.strength}`}
                        >
                            {profile
                                .strength
                                .icon ? (
                                <img
                                    src={
                                        profile
                                            .strength
                                            .icon
                                    }
                                    alt=""
                                    className={
                                        detailStyles.strengthIcon
                                    }
                                />
                            ) : (
                                <span
                                    className={
                                        detailStyles.strengthPlaceholder
                                    }
                                    aria-hidden="true"
                                />
                            )}

                            <span
                                className={
                                    detailStyles.strengthText
                                }
                            >
                                {profile
                                    .strength
                                    .title ||
                                    profile
                                        .strength
                                        .name ||
                                    "성향 정보 없음"}
                            </span>
                        </div>
                    )}
                    </div>

                    <div
                        className={
                            styles.ownerActions
                        }
                    >
                        <button
                            type="button"
                            onClick={
                                handleShare
                            }
                        >
                            공유하기
                        </button>

                        <button
                            type="button"
                            onClick={
                                handleOpenVisibility
                            }
                        >
                            공개 설정 변경
                        </button>
                    </div>

                    {shareMessage && (
                        <p
                            className={
                                styles.shareMessage
                            }
                            role="status"
                        >
                            {shareMessage}
                        </p>
                    )}
                </aside>

                {isDetailIncomplete ? (
                    <article
                        className={`${detailStyles.detailCard} ${styles.completionCard}`}
                    >
                        <div
                            className={
                                styles.completionHeader
                            }
                        >
                            <h1>
                                세부 프로필 완성하기
                            </h1>

                            <span>
                                {completedDetailCount}/5
                                완료
                            </span>
                        </div>

                        <div
                            className={
                                styles.completionList
                            }
                        >
                            {completionItems.map(
                                (item) => (
                                    <div
                                        key={
                                            item.category
                                        }
                                        className={
                                            styles.completionItem
                                        }
                                    >
                                        <div>
                                            <span
                                                className={
                                                    styles.completionCategory
                                                }
                                            >
                                                {
                                                    item.category
                                                }
                                            </span>

                                            <strong>
                                                {item.title}
                                            </strong>

                                            <p>
                                                {
                                                    item.description
                                                }
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className={
                                                item.completed
                                                    ? styles.completedButton
                                                    : styles.configureButton
                                            }
                                            onClick={() =>
                                                handleEdit(
                                                    item.field,
                                                )
                                            }
                                        >
                                            {item.completed
                                                ? "수정하기"
                                                : "설정하기"}
                                        </button>
                                    </div>
                                ),
                            )}
                        </div>
                    </article>
                ) : (
                <article
                    className={
                        detailStyles.detailCard
                    }
                >
                    <section
                        className={
                            detailStyles.section
                        }
                    >
                        <h2
                            className={
                                detailStyles.sectionTitle
                            }
                        >
                            한 줄 소개
                        </h2>

                        <p
                            className={
                                detailStyles.introduction
                            }
                        >
                            {introduction}
                        </p>
                    </section>

                    <section
                        className={
                            detailStyles.section
                        }
                    >
                        <h2
                            className={
                                detailStyles.sectionTitle
                            }
                        >
                            관심 분야
                        </h2>

                        {interests.length >
                        0 ? (
                            <div
                                className={
                                    detailStyles.tagList
                                }
                            >
                                {interests.map(
                                    (
                                        interest,
                                    ) => (
                                        <span
                                            key={
                                                interest.id
                                            }
                                            className={
                                                detailStyles.tag
                                            }
                                        >
                                            {
                                                interest.name
                                            }
                                        </span>
                                    ),
                                )}
                            </div>
                        ) : (
                            <p
                                className={
                                    detailStyles.emptyText
                                }
                            >
                                등록된 관심 분야가
                                없습니다.
                            </p>
                        )}
                    </section>

                    <section
                        className={
                            detailStyles.section
                        }
                    >
                        <h2
                            className={
                                detailStyles.sectionTitle
                            }
                        >
                            스킬
                        </h2>

                        {skills.length >
                        0 ? (
                            <div
                                className={
                                    detailStyles.tagList
                                }
                            >
                                {skills.map(
                                    (skill) => (
                                        <span
                                            key={
                                                skill.id
                                            }
                                            className={
                                                detailStyles.tag
                                            }
                                        >
                                            {
                                                skill.name
                                            }
                                        </span>
                                    ),
                                )}
                            </div>
                        ) : (
                            <p
                                className={
                                    detailStyles.emptyText
                                }
                            >
                                등록된 스킬이
                                없습니다.
                            </p>
                        )}
                    </section>

                    <section
                        className={
                            detailStyles.section
                        }
                    >
                        <h2
                            className={
                                detailStyles.sectionTitle
                            }
                        >
                            링크
                        </h2>

                        {links.length >
                        0 ? (
                            <div
                                className={
                                    detailStyles.linkList
                                }
                            >
                                {links.map(
                                    (
                                        link,
                                        index,
                                    ) => {
                                        const Icon =
                                            LINK_ICONS[
                                                link.type
                                            ] ||
                                            MdLanguage;

                                        const isEmail =
                                            link.type ===
                                                "email" ||
                                            link.url?.startsWith(
                                                "mailto:",
                                            );

                                        return (
                                            <a
                                                key={
                                                    link.id ??
                                                    `${link.type}-${index}`
                                                }
                                                href={
                                                    link.url
                                                }
                                                target={
                                                    isEmail
                                                        ? undefined
                                                        : "_blank"
                                                }
                                                rel={
                                                    isEmail
                                                        ? undefined
                                                        : "noreferrer"
                                                }
                                                className={
                                                    detailStyles.linkItem
                                                }
                                            >
                                                <span
                                                    className={
                                                        detailStyles.linkCircle
                                                    }
                                                >
                                                    <Icon
                                                        className={
                                                            detailStyles.linkIcon
                                                        }
                                                        aria-hidden="true"
                                                    />
                                                </span>

                                                <span
                                                    className={
                                                        detailStyles.linkLabel
                                                    }
                                                >
                                                    {link.label ||
                                                        link.type ||
                                                        "링크"}
                                                </span>
                                            </a>
                                        );
                                    },
                                )}
                            </div>
                        ) : (
                            <p
                                className={
                                    detailStyles.emptyText
                                }
                            >
                                등록된 링크가
                                없습니다.
                            </p>
                        )}
                    </section>

                    <section
                        className={
                            detailStyles.section
                        }
                    >
                        <h2
                            className={
                                detailStyles.sectionTitle
                            }
                        >
                            경험
                        </h2>

                        {experiences.length >
                        0 ? (
                            <div
                                className={
                                    detailStyles.experienceGrid
                                }
                            >
                                {experiences.map(
                                    (
                                        experience,
                                        index,
                                    ) => (
                                        <article
                                            key={
                                                experience.id ??
                                                `experience-${index}`
                                            }
                                            className={
                                                detailStyles.experienceCard
                                            }
                                        >
                                            <div
                                                className={
                                                    detailStyles.experienceContent
                                                }
                                            >
                                                <div
                                                    className={
                                                        detailStyles.experienceTitleRow
                                                    }
                                                >
                                                    {experience.isRepresentative && (
                                                        <span
                                                            className={
                                                                detailStyles.representativeBadge
                                                            }
                                                        >
                                                            대표
                                                        </span>
                                                    )}

                                                    <strong
                                                        className={
                                                            detailStyles.experienceTitle
                                                        }
                                                    >
                                                        {experience.title ||
                                                            "프로젝트 경험"}
                                                    </strong>
                                                </div>

                                                <p
                                                    className={
                                                        detailStyles.experienceDescription
                                                    }
                                                >
                                                    {experience.description ||
                                                        experience.summary ||
                                                        "등록된 경험 설명이 없습니다."}
                                                </p>

                                                {experience.url && (
                                                    <a
                                                        href={
                                                            experience.url
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={
                                                            detailStyles.experienceLink
                                                        }
                                                    >
                                                        <span>
                                                            {experience.linkLabel ||
                                                                "관련 링크"}
                                                        </span>

                                                        <span
                                                            aria-hidden="true"
                                                        >
                                                            ↗
                                                        </span>
                                                    </a>
                                                )}
                                            </div>
                                        </article>
                                    ),
                                )}
                            </div>
                        ) : (
                            <p
                                className={
                                    detailStyles.emptyText
                                }
                            >
                                등록된 경험이
                                없습니다.
                            </p>
                        )}
                    </section>
                </article>
                )}
            </div>

            <div
                className={
                    styles.backArea
                }
            >
                <button
                    type="button"
                    onClick={() =>
                        navigate("/profile")
                    }
                >
                    ‹ 메인으로 돌아가기
                </button>
            </div>

            {error && (
                <p
                    className={
                        styles.pageError
                    }
                    role="alert"
                >
                    {error}
                </p>
            )}

            {isVisibilityModalOpen && (
                <div
                    className={
                        styles.modalBackdrop
                    }
                    role="presentation"
                    onMouseDown={(
                        event,
                    ) => {
                        if (
                            event.target ===
                                event.currentTarget &&
                            !isSavingVisibility
                        ) {
                            setIsVisibilityModalOpen(
                                false,
                            );
                        }
                    }}
                >
                    <section
                        className={
                            styles.visibilityModal
                        }
                        role="dialog"
                        aria-modal="true"
                    >
                        <div
                            className={
                                styles.modalHeader
                            }
                        >
                            <h2>
                                공개 설정 변경
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setIsVisibilityModalOpen(
                                        false,
                                    )
                                }
                                aria-label="공개 설정 창 닫기"
                            >
                                ×
                            </button>
                        </div>

                        <div
                            className={
                                styles.settingRow
                            }
                        >
                            <label
                                htmlFor="purpose"
                            >
                                목적
                            </label>

                            <select
                                id="purpose"
                                value={
                                    selectedPurposeId
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setSelectedPurposeId(
                                        event
                                            .target
                                            .value,
                                    )
                                }
                            >
                                <option value="">
                                    목적 선택
                                </option>

                                {purposes.map(
                                    (purpose) => (
                                        <option
                                            key={
                                                purpose.id
                                            }
                                            value={
                                                purpose.id
                                            }
                                        >
                                            {
                                                purpose.name
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>

                        <div
                            className={
                                styles.settingRow
                            }
                        >
                            <span>공개</span>

                            <button
                                type="button"
                                className={`${styles.toggle} ${
                                    selectedIsActive
                                        ? styles.toggleOn
                                        : ""
                                }`}
                                onClick={() =>
                                    setSelectedIsActive(
                                        (
                                            currentValue,
                                        ) =>
                                            !currentValue,
                                    )
                                }
                                role="switch"
                                aria-checked={
                                    selectedIsActive
                                }
                            >
                                <span>
                                    {selectedIsActive
                                        ? "ON"
                                        : "OFF"}
                                </span>

                                <i />
                            </button>
                        </div>

                        <button
                            type="button"
                            className={
                                styles.saveButton
                            }
                            onClick={
                                handleSaveVisibility
                            }
                            disabled={
                                isSavingVisibility
                            }
                        >
                            {isSavingVisibility
                                ? "저장 중..."
                                : "저장"}
                        </button>
                    </section>
                </div>
            )}

            {isDeleteModalOpen && (
                <div
                    className={
                        styles.modalBackdrop
                    }
                >
                    <section
                        className={
                            styles.deleteModal
                        }
                        role="dialog"
                        aria-modal="true"
                    >
                        <span
                            className={
                                styles.deleteIcon
                            }
                        >
                            ×
                        </span>

                        <h2>
                            삭제하시겠어요?
                        </h2>

                        <p>
                            이 프로필은 다시
                            복구할 수 없게 돼요.
                        </p>

                        <div
                            className={
                                styles.deleteActions
                            }
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setIsDeleteModalOpen(
                                        false,
                                    )
                                }
                            >
                                취소
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleDelete
                                }
                                disabled={
                                    isDeleting
                                }
                            >
                                {isDeleting
                                    ? "삭제 중..."
                                    : "삭제하기"}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
};

export default MyProfileDetail;
