import {
    useCallback,
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

import CardExchangeModal from "../../components/profile/CardExchangeModal";

import {
    createCollection,
    createCollectionGroup,
    deleteCollection,
    getCollectionGroupItems,
    getCollectionGroups,
    moveCollection,
} from "../../api/collections";

import {
    makeCardBackgroundUrl,
} from "../../api/cardBackground";

import {
    deleteProfileCard,
    updateProfileCard,
} from "../../api/profile";

import {
    getPurposes,
} from "../../api/options";

import usePublicProfile from "../../hooks/usePublicProfile";

import {
    mapProfileCard,
} from "../../utils/profileMapper";

import styles from "./ProfileDetail.module.css";

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

const getArrayData = (data) => {
    if (Array.isArray(data)) {
        return data;
    }

    return (
        data?.items ||
        data?.collectionGroups ||
        data?.groups ||
        []
    );
};

const getTagName = (tag) => {
    if (typeof tag === "string") {
        return tag;
    }

    return tag?.name || "";
};

const ProfileDetail = () => {
    const { profileId } = useParams();

    const navigate =
        useNavigate();

    const [
        drawers,
        setDrawers,
    ] = useState([]);

    const [
        scrapError,
        setScrapError,
    ] = useState("");

    const [
        isSavingScrap,
        setIsSavingScrap,
    ] = useState(false);

    const [
        isScrapOpen,
        setIsScrapOpen,
    ] = useState(false);

    const [
        selectedDrawerIds,
        setSelectedDrawerIds,
    ] = useState([]);

    const [
        isAddingDrawer,
        setIsAddingDrawer,
    ] = useState(false);

    const [
        newDrawerName,
        setNewDrawerName,
    ] = useState("");

    const [
        isActionMenuOpen,
        setIsActionMenuOpen,
    ] = useState(false);

    const [
        isExchangeModalOpen,
        setIsExchangeModalOpen,
    ] = useState(false);

    const [
        purposes,
        setPurposes,
    ] = useState([]);

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
        isDeleteModalOpen,
        setIsDeleteModalOpen,
    ] = useState(false);

    const [
        isDeleting,
        setIsDeleting,
    ] = useState(false);

    const [
        ownerActionError,
        setOwnerActionError,
    ] = useState("");

    const {
        profile,
        isLoading,
        errorMessage,
    } = usePublicProfile(
        profileId,
    );

    const loadDrawers = useCallback(
        async (signal) => {
            try {
                const groupData =
                    await getCollectionGroups({
                        signal,
                    });

                const groups =
                    getArrayData(
                        groupData,
                    );

                const loadedDrawers =
                    await Promise.all(
                        groups.map(
                            async (
                                group,
                            ) => {
                                const itemData =
                                    await getCollectionGroupItems(
                                        group.id,
                                        {
                                            signal,
                                        },
                                    );

                                const items =
                                    getArrayData(
                                        itemData,
                                    );

                                return {
                                    id:
                                        group.id,

                                    name:
                                        group.name,

                                    profiles:
                                        items.map(
                                            (
                                                item,
                                            ) => ({
                                                ...mapProfileCard(
                                                    item.card ||
                                                        item.profile ||
                                                        item,
                                                ),

                                                collectionId:
                                                    item.collectionId ??
                                                    item.id,
                                            }),
                                        ),
                                };
                            },
                        ),
                    );

                setDrawers(
                    loadedDrawers,
                );

                setScrapError("");
            } catch (error) {
                if (
                    error?.name ===
                    "AbortError"
                ) {
                    return;
                }

                console.error(
                    "스크랩 서랍 조회 실패:",
                    error,
                );

                setScrapError(
                    error?.message ||
                        "스크랩 서랍을 불러오지 못했습니다.",
                );
            }
        },
        [],
    );


useEffect(() => {
    const controller =
        new AbortController();

    const timerId =
        window.setTimeout(() => {
            void loadDrawers(
                controller.signal,
            );
        }, 0);

    return () => {
        window.clearTimeout(
            timerId,
        );

        controller.abort();
    };
}, [loadDrawers]);

    useEffect(() => {
        const controller =
            new AbortController();

        const loadPurposes = async () => {
            try {
                const result =
                    await getPurposes({
                        signal:
                            controller.signal,
                    });

                const items =
                    Array.isArray(result)
                        ? result
                        : result?.items ??
                          result?.data?.items ??
                          [];

                setPurposes(items);
            } catch (error) {
                if (
                    error?.name !==
                    "AbortError"
                ) {
                    console.error(
                        "프로필 목적 조회 실패:",
                        error,
                    );
                }
            }
        };

        void loadPurposes();

        return () => {
            controller.abort();
        };
    }, []);


    if (isLoading) {
        return (
            <main
                className={
                    styles.notFound
                }
            >
                <p>
                    프로필을 불러오는
                    중입니다.
                </p>
            </main>
        );
    }

    if (errorMessage) {
        return (
            <main
                className={
                    styles.notFound
                }
            >
                <p>
                    {errorMessage}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/explore",
                        )
                    }
                >
                    탐색으로 돌아가기
                </button>
            </main>
        );
    }

    if (!profile) {
        return (
            <main
                className={
                    styles.notFound
                }
            >
                <p>
                    프로필을 찾을 수
                    없습니다.
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/explore",
                        )
                    }
                >
                    탐색으로 돌아가기
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
        profile.introduction ||
        profile.description ||
        "등록된 한 줄 소개가 없습니다.";

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

    const storedUserId =
        localStorage.getItem("userId") ||
        localStorage.getItem("memberId") ||
        localStorage.getItem("currentUserId");

    const profileOwnerId =
        profile.userId ??
        profile.memberId ??
        profile.ownerId ??
        profile.user?.id ??
        profile.member?.id;

    const isMyProfile = Boolean(
        profile.isMine ??
            profile.isOwner ??
            profile.mine ??
            (
                storedUserId &&
                profileOwnerId &&
                String(storedUserId) ===
                    String(profileOwnerId)
            ),
    );

    const isProfileInDrawer = (
        drawer,
    ) =>
        drawer.profiles?.some(
            (item) =>
                String(item.id) ===
                String(profile.id),
        );

    const handleBack = () => {
        navigate(-1);
    };

    const handleActionMenuToggle =
        () => {
            setIsActionMenuOpen(
                (
                    currentValue,
                ) =>
                    !currentValue,
            );
        };

    const handleOpenScrap = () => {
        const savedDrawerIds =
            drawers
                .filter(
                    isProfileInDrawer,
                )
                .map(
                    (drawer) =>
                        drawer.id,
                );

        setSelectedDrawerIds(
            savedDrawerIds,
        );

        setNewDrawerName("");
        setIsAddingDrawer(
            false,
        );
        setIsActionMenuOpen(
            false,
        );
        setIsScrapOpen(true);
    };

    const handleCloseScrap = () => {
        setIsScrapOpen(false);
        setSelectedDrawerIds(
            [],
        );
        setNewDrawerName("");
        setIsAddingDrawer(
            false,
        );
    };

    const handleDrawerToggle = (
        drawerId,
    ) => {
        setSelectedDrawerIds(
            (currentIds) => {
                if (
                    currentIds.includes(
                        drawerId,
                    )
                ) {
                    return currentIds.filter(
                        (id) =>
                            id !==
                            drawerId,
                    );
                }

                /*
                 * 하나의 프로필은 한 서랍에만
                 * 저장할 수 있으므로 단일 선택
                 */
                return [drawerId];
            },
        );
    };

    const handleOpenAddDrawer =
        () => {
            setNewDrawerName("");
            setIsAddingDrawer(
                true,
            );
        };

    const handleCancelAddDrawer =
        () => {
            setNewDrawerName("");
            setIsAddingDrawer(
                false,
            );
        };

    const handleCreateDrawer =
        async (event) => {
            event.preventDefault();

            const trimmedName =
                newDrawerName.trim();

            if (!trimmedName) {
                return;
            }

            setScrapError("");

            try {
                const createdGroup =
                    await createCollectionGroup(
                        trimmedName,
                    );

                await loadDrawers();

                if (
                    createdGroup?.id
                ) {
                    setSelectedDrawerIds(
                        [
                            createdGroup.id,
                        ],
                    );
                }

                setNewDrawerName("");

                setIsAddingDrawer(
                    false,
                );
            } catch (error) {
                console.error(
                    "서랍 생성 실패:",
                    error,
                );

                setScrapError(
                    error?.message ||
                        "새 서랍을 만들지 못했습니다.",
                );
            }
        };

    const handleScrapSave =
        async () => {
            if (
                isSavingScrap
            ) {
                return;
            }

            const savedDrawer =
                drawers.find(
                    isProfileInDrawer,
                );

            const savedProfile =
                savedDrawer?.profiles.find(
                    (item) =>
                        String(
                            item.id,
                        ) ===
                        String(
                            profile.id,
                        ),
                );

            const selectedDrawerId =
                selectedDrawerIds[0] ??
                null;

            setIsSavingScrap(
                true,
            );

            setScrapError("");

            try {
                if (
                    !savedProfile &&
                    selectedDrawerId
                ) {
                    await createCollection({
                        cardId:
                            profile.id,

                        groupId:
                            selectedDrawerId,
                    });
                } else if (
                    savedProfile?.collectionId &&
                    !selectedDrawerId
                ) {
                    await deleteCollection(
                        savedProfile.collectionId,
                    );
                } else if (
                    savedProfile?.collectionId &&
                    selectedDrawerId &&
                    String(
                        savedDrawer.id,
                    ) !==
                        String(
                            selectedDrawerId,
                        )
                ) {
                    await moveCollection(
                        savedProfile.collectionId,
                        selectedDrawerId,
                    );
                }

                await loadDrawers();

                handleCloseScrap();
            } catch (error) {
                console.error(
                    "스크랩 저장 실패:",
                    error,
                );

                setScrapError(
                    error?.message ||
                        "스크랩을 저장하지 못했습니다.",
                );
            } finally {
                setIsSavingScrap(
                    false,
                );
            }
        };

    const handleOpenExchangeModal =
        () => {
            setIsActionMenuOpen(
                false,
            );

            setIsExchangeModalOpen(
                true,
            );
        };

    const handleCloseExchangeModal =
        () => {
            setIsExchangeModalOpen(
                false,
            );
        };

    const handleSendExchange = (
        requestData,
    ) => {
        console.log(
            "카드 교환 요청:",
            requestData,
        );

        setIsExchangeModalOpen(
            false,
        );

        window.alert(
            `${profile.name}님에게 카드 교환 요청을 보냈습니다.`,
        );
    };

    const handleEditMyProfile = () => {
        setIsActionMenuOpen(false);

        navigate(
            `/my-profile/${profile.id}/detail-edit`,
        );
    };

    const handleOpenVisibility = () => {
        const currentPurposeName =
            profile.purposes?.[0] ??
            profile.purpose?.name;

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
            Boolean(profile.isActive),
        );

        setOwnerActionError("");
        setIsActionMenuOpen(false);
        setIsVisibilityModalOpen(true);
    };

    const handleSaveVisibility =
        async () => {
            if (
                selectedIsActive &&
                !selectedPurposeId
            ) {
                setOwnerActionError(
                    "공개 목적을 선택해주세요.",
                );
                return;
            }

            try {
                setIsSavingVisibility(true);
                setOwnerActionError("");

                const requestBody = {
                    isActive:
                        selectedIsActive,
                };

                if (selectedPurposeId) {
                    requestBody.purposeId =
                        Number(
                            selectedPurposeId,
                        );
                }

                await updateProfileCard(
                    profile.id,
                    requestBody,
                );

                setIsVisibilityModalOpen(
                    false,
                );

                window.location.reload();
            } catch (error) {
                setOwnerActionError(
                    error?.message ||
                        "공개 설정을 변경하지 못했습니다.",
                );
            } finally {
                setIsSavingVisibility(
                    false,
                );
            }
        };

    const handleOpenDelete = () => {
        setIsActionMenuOpen(false);

        if (profile.isDefault) {
            window.alert(
                "기본 프로필 카드는 삭제할 수 없습니다.",
            );
            return;
        }

        setOwnerActionError("");
        setIsDeleteModalOpen(true);
    };

    const handleDeleteProfile =
        async () => {
            try {
                setIsDeleting(true);
                setOwnerActionError("");

                await deleteProfileCard(
                    profile.id,
                );

                navigate("/profile", {
                    replace: true,
                });
            } catch (error) {
                setOwnerActionError(
                    error?.message ||
                        "프로필을 삭제하지 못했습니다.",
                );
                setIsDeleteModalOpen(
                    false,
                );
            } finally {
                setIsDeleting(false);
            }
        };

    return (
        <main className={styles.page}>
            <div className={styles.layout}>
                <aside
                    className={
                        styles.summaryCard
                    }
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
                        className={
                            styles.backButton
                        }
                        onClick={
                            handleBack
                        }
                        aria-label="이전 화면으로 돌아가기"
                    >
                        ‹
                    </button>

                    <div
                        className={
                            styles.actionMenuArea
                        }
                    >
                        <button
                            type="button"
                            className={
                                styles.moreButton
                            }
                            onClick={
                                handleActionMenuToggle
                            }
                            aria-label="프로필 메뉴 열기"
                            aria-expanded={
                                isActionMenuOpen
                            }
                        >
                            •••
                        </button>

                        {isActionMenuOpen && (
                            <div
                                className={
                                    styles.summaryActions
                                }
                            >
                                {isMyProfile ? (
                                    <>
                                        <button
                                            type="button"
                                            className={
                                                styles.ownerMenuButton
                                            }
                                            onClick={
                                                handleEditMyProfile
                                            }
                                        >
                                            수정하기
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                styles.ownerMenuButton
                                            }
                                            onClick={
                                                handleOpenVisibility
                                            }
                                        >
                                            공개설정 변경
                                        </button>

                                        <button
                                            type="button"
                                            className={`${styles.ownerMenuButton} ${styles.deleteMenuButton}`}
                                            onClick={
                                                handleOpenDelete
                                            }
                                        >
                                            이 프로필 삭제
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className={
                                                styles.scrapButton
                                            }
                                            onClick={
                                                handleOpenScrap
                                            }
                                        >
                                            스크랩하기
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                styles.exchangeButton
                                            }
                                            onClick={
                                                handleOpenExchangeModal
                                            }
                                        >
                                            카드 교환 요청
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {profile.profileImage ? (
                        <img
                            src={
                                profile.profileImage
                            }
                            alt={`${profile.name || "사용자"} 프로필`}
                            className={
                                styles.avatar
                            }
                        />
                    ) : (
                        <div
                            className={
                                styles.avatarPlaceholder
                            }
                            aria-hidden="true"
                        >
                            {profile.name
                                ?.trim()
                                ?.charAt(0) ||
                                "N"}
                        </div>
                    )}

                    <div
                        className={
                            styles.nameRow
                        }
                    >
                        <strong
                            className={
                                styles.name
                            }
                        >
                            {profile.name ||
                                "이름 없음"}
                        </strong>

                        <span
                            className={
                                styles.job
                            }
                        >
                            {JOB_LABELS[
                                profile.job
                            ] ||
                                profile.jobTypeName ||
                                "직군 미선택"}
                        </span>
                    </div>

                    <p
                        className={
                            styles.affiliation
                        }
                    >
                        {affiliationText ||
                            "소속 정보 없음"}
                    </p>

                    {profile.strength && (
                        <div
                            className={
                                styles.strength
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
                                        styles.strengthIcon
                                    }
                                />
                            ) : (
                                <span
                                    className={
                                        styles.strengthPlaceholder
                                    }
                                    aria-hidden="true"
                                />
                            )}

                            <span
                                className={
                                    styles.strengthText
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
                </aside>

                <article
                    className={
                        styles.detailCard
                    }
                >
                    <section
                        className={
                            styles.section
                        }
                    >
                        <h2
                            className={
                                styles.sectionTitle
                            }
                        >
                            한 줄 소개
                        </h2>

                        <p
                            className={
                                styles.introduction
                            }
                        >
                            {introduction}
                        </p>
                    </section>

                    <section
                        className={
                            styles.section
                        }
                    >
                        <h2
                            className={
                                styles.sectionTitle
                            }
                        >
                            관심 분야
                        </h2>

                        {interests.length >
                        0 ? (
                            <div
                                className={
                                    styles.tagList
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
                                                styles.tag
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
                                    styles.emptyText
                                }
                            >
                                등록된 관심 분야가
                                없습니다.
                            </p>
                        )}
                    </section>

                    <section
                        className={
                            styles.section
                        }
                    >
                        <h2
                            className={
                                styles.sectionTitle
                            }
                        >
                            스킬
                        </h2>

                        {skills.length >
                        0 ? (
                            <div
                                className={
                                    styles.tagList
                                }
                            >
                                {skills.map(
                                    (skill) => (
                                        <span
                                            key={
                                                skill.id
                                            }
                                            className={
                                                styles.tag
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
                                    styles.emptyText
                                }
                            >
                                등록된 스킬이
                                없습니다.
                            </p>
                        )}
                    </section>

                    <section
                        className={
                            styles.section
                        }
                    >
                        <h2
                            className={
                                styles.sectionTitle
                            }
                        >
                            링크
                        </h2>

                        {links.length >
                        0 ? (
                            <div
                                className={
                                    styles.linkList
                                }
                            >
                                {links.map(
                                    (
                                        link,
                                        index,
                                    ) => {
                                        const LinkIcon =
                                            LINK_ICONS[
                                                link
                                                    .type
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
                                                    styles.linkItem
                                                }
                                                aria-label={`${link.label || link.type || "링크"} 열기`}
                                            >
                                                <span
                                                    className={
                                                        styles.linkCircle
                                                    }
                                                >
                                                    <LinkIcon
                                                        className={
                                                            styles.linkIcon
                                                        }
                                                        aria-hidden="true"
                                                    />
                                                </span>

                                                <span
                                                    className={
                                                        styles.linkLabel
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
                                    styles.emptyText
                                }
                            >
                                등록된 링크가
                                없습니다.
                            </p>
                        )}
                    </section>

                    <section
                        className={
                            styles.section
                        }
                    >
                        <h2
                            className={
                                styles.sectionTitle
                            }
                        >
                            경험
                        </h2>

                        {experiences.length >
                        0 ? (
                            <div
                                className={
                                    styles.experienceGrid
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
                                                styles.experienceCard
                                            }
                                        >
                                            <div
                                                className={
                                                    styles.experienceContent
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles.experienceTitleRow
                                                    }
                                                >
                                                    {experience.isRepresentative && (
                                                        <span
                                                            className={
                                                                styles.representativeBadge
                                                            }
                                                        >
                                                            대표
                                                        </span>
                                                    )}

                                                    <strong
                                                        className={
                                                            styles.experienceTitle
                                                        }
                                                    >
                                                        {experience.title ||
                                                            "프로젝트 경험"}
                                                    </strong>
                                                </div>

                                                <p
                                                    className={
                                                        styles.experienceDescription
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
                                                            styles.experienceLink
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
                                    styles.emptyText
                                }
                            >
                                등록된 경험이
                                없습니다.
                            </p>
                        )}
                    </section>
                </article>
            </div>

            {isScrapOpen && (
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
                            event.currentTarget
                        ) {
                            handleCloseScrap();
                        }
                    }}
                >
                    <section
                        className={
                            styles.scrapModal
                        }
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="scrap-modal-title"
                    >
                        <div
                            className={
                                styles.modalHeader
                            }
                        >
                            <h2 id="scrap-modal-title">
                                어디에
                                스크랩할까요?
                            </h2>

                            <button
                                type="button"
                                className={
                                    styles.closeButton
                                }
                                onClick={
                                    handleCloseScrap
                                }
                                aria-label="스크랩 창 닫기"
                            >
                                ×
                            </button>
                        </div>

                        <div
                            className={
                                styles.scrapSummary
                            }
                        >
                            <span>
                                컬렉션{" "}
                                {drawers.length}개
                            </span>

                            <button
                                type="button"
                                className={
                                    styles.addDrawerButton
                                }
                                onClick={
                                    handleOpenAddDrawer
                                }
                            >
                                서랍 추가
                            </button>
                        </div>

                        {isAddingDrawer && (
                            <form
                                className={
                                    styles.addDrawerForm
                                }
                                onSubmit={
                                    handleCreateDrawer
                                }
                            >
                                <div
                                    className={
                                        styles.addDrawerInputRow
                                    }
                                >
                                    <input
                                        type="text"
                                        value={
                                            newDrawerName
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            setNewDrawerName(
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        maxLength={
                                            20
                                        }
                                        placeholder="새 서랍 이름을 입력해 주세요"
                                        aria-label="새 서랍 이름"
                                        autoFocus
                                    />

                                    <span>
                                        {
                                            newDrawerName.length
                                        }
                                        /20
                                    </span>
                                </div>

                                <div
                                    className={
                                        styles.addDrawerActions
                                    }
                                >
                                    <button
                                        type="button"
                                        className={
                                            styles.cancelDrawerButton
                                        }
                                        onClick={
                                            handleCancelAddDrawer
                                        }
                                    >
                                        취소
                                    </button>

                                    <button
                                        type="submit"
                                        className={
                                            styles.createDrawerButton
                                        }
                                        disabled={
                                            !newDrawerName.trim()
                                        }
                                    >
                                        만들기
                                    </button>
                                </div>
                            </form>
                        )}

                        {scrapError && (
                            <p
                                className={
                                    styles.scrapError
                                }
                                role="alert"
                            >
                                {scrapError}
                            </p>
                        )}

                        <div
                            className={
                                styles.scrapDrawerList
                            }
                        >
                            {drawers.length >
                            0 ? (
                                drawers.map(
                                    (
                                        drawer,
                                    ) => {
                                        const isSelected =
                                            selectedDrawerIds.includes(
                                                drawer.id,
                                            );

                                        return (
                                            <button
                                                key={
                                                    drawer.id
                                                }
                                                type="button"
                                                className={
                                                    styles.scrapDrawerButton
                                                }
                                                onClick={() =>
                                                    handleDrawerToggle(
                                                        drawer.id,
                                                    )
                                                }
                                                aria-pressed={
                                                    isSelected
                                                }
                                            >
                                                <span
                                                    className={
                                                        styles.scrapDrawerName
                                                    }
                                                >
                                                    {
                                                        drawer.name
                                                    }
                                                </span>

                                                <span
                                                    className={`${styles.scrapStatusIcon} ${
                                                        isSelected
                                                            ? styles.selectedStatusIcon
                                                            : ""
                                                    }`}
                                                    aria-hidden="true"
                                                >
                                                    {isSelected
                                                        ? "✓"
                                                        : "+"}
                                                </span>
                                            </button>
                                        );
                                    },
                                )
                            ) : (
                                <p
                                    className={
                                        styles.emptyDrawerText
                                    }
                                >
                                    생성된 서랍이
                                    없습니다. 서랍을
                                    먼저 추가해 주세요.
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            className={
                                styles.saveButton
                            }
                            onClick={
                                handleScrapSave
                            }
                            disabled={
                                isSavingScrap
                            }
                        >
                            {isSavingScrap
                                ? "저장 중..."
                                : "저장"}
                        </button>
                    </section>
                </div>
            )}

            {isVisibilityModalOpen && (
                <div
                    className={
                        styles.modalBackdrop
                    }
                    role="presentation"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
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
                        aria-labelledby="visibility-modal-title"
                    >
                        <div
                            className={
                                styles.modalHeader
                            }
                        >
                            <h2 id="visibility-modal-title">
                                공개 설정 변경
                            </h2>

                            <button
                                type="button"
                                className={
                                    styles.closeButton
                                }
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
                            <label htmlFor="profile-purpose">
                                프로필 목적
                            </label>

                            <select
                                id="profile-purpose"
                                value={
                                    selectedPurposeId
                                }
                                onChange={(event) =>
                                    setSelectedPurposeId(
                                        event.target.value,
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
                            <span>
                                프로필 공개
                            </span>

                            <button
                                type="button"
                                className={`${styles.toggle} ${
                                    selectedIsActive
                                        ? styles.toggleOn
                                        : ""
                                }`}
                                onClick={() =>
                                    setSelectedIsActive(
                                        (current) =>
                                            !current,
                                    )
                                }
                                aria-pressed={
                                    selectedIsActive
                                }
                            >
                                <span>
                                    {selectedIsActive
                                        ? "ON"
                                        : "OFF"}
                                </span>
                                <i aria-hidden="true" />
                            </button>
                        </div>

                        {ownerActionError && (
                            <p
                                className={
                                    styles.ownerActionError
                                }
                                role="alert"
                            >
                                {ownerActionError}
                            </p>
                        )}

                        <button
                            type="button"
                            className={
                                styles.visibilitySaveButton
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
                    role="presentation"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setIsDeleteModalOpen(
                                false,
                            );
                        }
                    }}
                >
                    <section
                        className={
                            styles.deleteModal
                        }
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-modal-title"
                    >
                        <span
                            className={
                                styles.deleteIcon
                            }
                            aria-hidden="true"
                        >
                            !
                        </span>

                        <h2 id="delete-modal-title">
                            프로필을 삭제할까요?
                        </h2>

                        <p>
                            삭제한 프로필은 다시 복구할 수 없습니다.
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
                                disabled={
                                    isDeleting
                                }
                            >
                                취소
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleDeleteProfile
                                }
                                disabled={
                                    isDeleting
                                }
                            >
                                {isDeleting
                                    ? "삭제 중..."
                                    : "삭제"}
                            </button>
                        </div>
                    </section>
                </div>
            )}

            {isExchangeModalOpen && (
                <CardExchangeModal
                    receiver={
                        profile
                    }
                    onClose={
                        handleCloseExchangeModal
                    }
                    onSend={
                        handleSendExchange
                    }
                />
            )}
        </main>
    );
};

export default ProfileDetail;