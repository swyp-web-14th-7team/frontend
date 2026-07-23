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
    mapProfileCard,
} from "../../utils/profileMapper";

import detailStyles from "../Profile/ProfileDetail.module.css";
import styles from "./MyProfileDetail.module.css";

const JOB_LABELS = {
    planner: "Planner",
    designer: "Designer",
    frontend:
        "Frontend Developer",
    backend:
        "Backend Developer",
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

const MyProfileDetail = () => {
    const {
        profileId,
    } = useParams();

    const navigate =
        useNavigate();

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

        const loadProfile =
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
                              [];

                    setProfile(
                        mappedProfile,
                    );

                    setPurposes(
                        purposeItems,
                    );
                } catch (
                    requestError
                ) {
                    if (
                        requestError.name ===
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
                    setIsLoading(
                        false,
                    );
                }
            };

        loadProfile();

        return () => {
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

    const interests =
        profile.interests || [];

    const skills =
        profile.techStacks || [];

    const links =
        profile.links || [];

    const experiences =
        profile.experiences || [];

    const hasDescription =
        Boolean(
            (
                profile.description ||
                profile.introduction
            )?.trim(),
        );

    const hasInterests =
        interests.some(
            (interest) =>
                interest?.id &&
                interest?.name?.trim(),
        );

    const hasSkills =
        skills.some(
            (skill) =>
                skill?.id &&
                skill?.name?.trim(),
        );

    const hasLinks =
        links.length > 0;

    const hasExperiences =
        experiences.length > 0;

    const completionItems = [
        {
            key: "description",
            label: "소개 작성",
            description:
                "나를 더 자세히 설명하고 인사를 건네보세요.",
            completed:
                hasDescription,
        },
        {
            key: "interests",
            label: "관심 분야 선택",
            description:
                "관심 있는 분야를 보여주세요.",
            completed:
                hasInterests,
        },
        {
            key: "skills",
            label: "스킬 추가",
            description:
                "나의 사용 툴과 역량을 어필해보세요.",
            completed:
                hasSkills,
        },
        {
            key: "links",
            label: "링크 첨부",
            description:
                "내 이메일과 포트폴리오를 첨부해보세요.",
            completed:
                hasLinks,
        },
        {
            key: "experiences",
            label: "경험 추가",
            description:
                "내가 쌓아온 활동을 보여주세요.",
            completed:
                hasExperiences,
        },
    ];

    const completedCount =
        completionItems.filter(
            (item) =>
                item.completed,
        ).length;

    const isComplete =
        completedCount ===
        completionItems.length;

    const shareUrl =
        `${window.location.origin}/profile/${profile.id}`;

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

    const handleEdit = () => {
        setIsMenuOpen(false);

        navigate(
            `/my-profile/${profileId}/detail-edit`,
        );
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

            setSelectedPurposeId(
                currentPurpose?.id
                    ? String(
                          currentPurpose.id,
                      )
                    : "",
            );

            setSelectedIsActive(
                profile.isActive,
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
            className={
                detailStyles.page
            }
        >
            <div
                className={
                    detailStyles.hero
                }
                aria-hidden="true"
            />

            <div
                className={
                    detailStyles.layout
                }
            >
                <aside
                    className={`${detailStyles.summaryCard} ${styles.summaryCard}`}
                >
                    <div
                        className={
                            styles.summaryTop
                        }
                    >
                        {profile.profileImage ? (
                            <img
                                src={
                                    profile.profileImage
                                }
                                alt={`${profile.name} 프로필`}
                                className={
                                    detailStyles.avatar
                                }
                            />
                        ) : (
                            <div
                                className={
                                    detailStyles.avatarPlaceholder
                                }
                            />
                        )}

                        <div
                            className={
                                styles.menuArea
                            }
                        >
                            <button
                                type="button"
                                className={
                                    styles.moreButton
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
                            >
                                •••
                            </button>

                            {isMenuOpen && (
                                <div
                                    className={
                                        styles.profileMenu
                                    }
                                >
                                    <button
                                        type="button"
                                        onClick={
                                            handleEdit
                                        }
                                    >
                                        수정하기
                                    </button>

                                    <button
                                        type="button"
                                        className={
                                            styles.deleteMenuButton
                                        }
                                        onClick={
                                            handleOpenDelete
                                        }
                                    >
                                        이 프로필 삭제
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        className={
                            detailStyles.nameRow
                        }
                    >
                        <strong
                            className={
                                detailStyles.name
                            }
                        >
                            {profile.name}
                        </strong>

                        <span
                            className={
                                detailStyles.job
                            }
                        >
                            {JOB_LABELS[
                                profile.job
                            ] ||
                                "직군 미선택"}
                        </span>
                    </div>

                    <p
                        className={
                            detailStyles.affiliation
                        }
                    >
                        {[
                            profile.affiliationType,
                            profile.affiliation,
                        ]
                            .filter(Boolean)
                            .join(" | ") ||
                            "소속 정보 없음"}
                    </p>

                    {profile.strength && (
                        <div
                            className={
                                detailStyles.strength
                            }
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
                                />
                            )}

                            <span
                                className={
                                    detailStyles.strengthText
                                }
                            >
                                {
                                    profile
                                        .strength
                                        .title
                                }
                            </span>
                        </div>
                    )}

                    <div
                        className={
                            detailStyles.summaryActions
                        }
                    >
                        <button
                            type="button"
                            className={
                                detailStyles.scrapButton
                            }
                            onClick={
                                handleShare
                            }
                        >
                            공유하기
                        </button>

                        <button
                            type="button"
                            className={
                                detailStyles.exchangeButton
                            }
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

                {isComplete ? (
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
                                {profile.description ||
                                    profile.introduction}
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

                            <div
                                className={
                                    detailStyles.linkList
                                }
                            >
                                {links.map(
                                    (link) => {
                                        const Icon =
                                            LINK_ICONS[
                                                link.type
                                            ] ||
                                            MdLanguage;

                                        return (
                                            <a
                                                key={
                                                    link.id
                                                }
                                                href={
                                                    link.url
                                                }
                                                target="_blank"
                                                rel="noreferrer"
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
                                                    />
                                                </span>

                                                <span
                                                    className={
                                                        detailStyles.linkLabel
                                                    }
                                                >
                                                    {link.label ||
                                                        link.type}
                                                </span>
                                            </a>
                                        );
                                    },
                                )}
                            </div>
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

                            <div
                                className={
                                    detailStyles.experienceGrid
                                }
                            >
                                {experiences.map(
                                    (
                                        experience,
                                    ) => (
                                        <article
                                            key={
                                                experience.id
                                            }
                                            className={
                                                detailStyles.experienceCard
                                            }
                                        >
                                            <div
                                                className={
                                                    styles.experienceContent
                                                }
                                            >
                                                <strong>
                                                    {
                                                        experience.title
                                                    }
                                                </strong>

                                                <p>
                                                    {experience.description ||
                                                        experience.summary}
                                                </p>

                                                {experience.url && (
                                                    <a
                                                        href={
                                                            experience.url
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        관련 링크
                                                    </a>
                                                )}
                                            </div>
                                        </article>
                                    ),
                                )}
                            </div>
                        </section>
                    </article>
                ) : (
                    <article
                        className={`${detailStyles.detailCard} ${styles.completionCard}`}
                    >
                        <div
                            className={
                                styles.completionHeader
                            }
                        >
                            <h1>
                                세부 프로필
                                완성하기
                            </h1>

                            <span>
                                {completedCount}/
                                {
                                    completionItems.length
                                }{" "}
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
                                            item.key
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
                                                {item.key ===
                                                "description"
                                                    ? "한 줄 소개"
                                                    : item.key ===
                                                        "interests"
                                                      ? "관심 분야"
                                                      : item.key ===
                                                          "skills"
                                                        ? "스킬"
                                                        : item.key ===
                                                            "links"
                                                          ? "링크"
                                                          : "경험"}
                                            </span>

                                            <strong>
                                                {
                                                    item.label
                                                }
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
                                            onClick={
                                                handleEdit
                                            }
                                        >
                                            {item.completed
                                                ? "완료"
                                                : "설정하기"}
                                        </button>
                                    </div>
                                ),
                            )}
                        </div>
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
                        navigate(
                            "/profile",
                        )
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
                    onMouseDown={() =>
                        !isSavingVisibility &&
                        setIsVisibilityModalOpen(
                            false,
                        )
                    }
                >
                    <section
                        className={
                            styles.visibilityModal
                        }
                        role="dialog"
                        aria-modal="true"
                        onMouseDown={(
                            event,
                        ) =>
                            event.stopPropagation()
                        }
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
