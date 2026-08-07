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
    getConnections,
} from "../../api/connections";

import usePublicProfile from "../../hooks/usePublicProfile";
import useMyProfileCardIds from "../../hooks/useMyProfileCardIds";

import {
    mapProfileCard,
} from "../../utils/profileMapper";

import {
    isLoggedIn,
} from "../../utils/auth";

import profileDetailBackground from "../../assets/images/profile-detail-background.png";

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

const getLinkLabel = (link) => {
    if (link?.type === "email") {
        return "email";
    }

    const labels = {
        blog: "Blog",
        github: "Github",
        behance: "Behance",
        instagram: "Instagram",
        notion: "Notion",
        linkedin: "LinkedIn",
        website: "Website",
    };

    return (
        labels[link?.type] ||
        link?.label ||
        link?.type ||
        "링크"
    );
};

const getExperienceLinkLabel = (experience) => {
    if (!experience?.url) {
        return "";
    }

    try {
        return new URL(experience.url)
            .hostname
            .replace(/^www\./, "");
    } catch {
        return experience.url;
    }
};

const ProfileDetail = () => {
   const {
    profileId,
    connectionId,
} = useParams();
    const navigate = useNavigate();

    const [drawers, setDrawers] = useState([]);
    const [scrapError, setScrapError] = useState("");
    const [isSavingScrap, setIsSavingScrap] = useState(false);
    const [isScrapOpen, setIsScrapOpen] = useState(false);

    const [
        selectedDrawerIds,
        setSelectedDrawerIds,
    ] = useState([]);

    const [
        isAddingDrawer,
        setIsAddingDrawer,
    ] = useState(false);

    const [newDrawerName, setNewDrawerName] = useState("");

    const [
        isExchangeModalOpen,
        setIsExchangeModalOpen,
    ] = useState(false);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [connectedProfileCardIds, setConnectedProfileCardIds] =
        useState(() => new Set());

    const [isConnectionsLoading, setIsConnectionsLoading] =
        useState(() => isLoggedIn() && !connectionId);

   const {
    profile,
    isLoading,
    errorMessage,
} = usePublicProfile(
    profileId,
    connectionId,
);

    const {
        myProfileCardIds,
        isLoading: isMyProfileCardsLoading,
    } = useMyProfileCardIds();

    const loadDrawers = useCallback(async (signal) => {
        try {
            const groupData = await getCollectionGroups({
                signal,
            });

            const groups = getArrayData(groupData);

            const loadedDrawers = await Promise.all(
                groups.map(async (group) => {
                    const itemData =
                        await getCollectionGroupItems(
                            group.id,
                            { signal },
                        );

                    const items = getArrayData(itemData);

                    return {
                        id: group.id,
                        name: group.name,

                        profiles: items.map((item) => ({
                            ...mapProfileCard(
                                item.card ||
                                    item.profile ||
                                    item,
                            ),

                            collectionId:
                                item.collectionId ??
                                item.id,
                        })),
                    };
                }),
            );

            setDrawers(loadedDrawers);
            setScrapError("");
        } catch (error) {
            if (error?.name === "AbortError") {
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
    }, []);

    useEffect(() => {
        /*
         * 보관함에서 연 카드는 스크랩할 수 없으므로
         * 서랍 목록도 불러오지 않습니다.
         */
        if (connectionId) {
            return undefined;
        }

        const controller = new AbortController();

        const timerId = window.setTimeout(() => {
            void loadDrawers(controller.signal);
        }, 0);

        return () => {
            window.clearTimeout(timerId);
            controller.abort();
        };
    }, [connectionId, loadDrawers]);

    useEffect(() => {
        /*
         * 보관함 경로에서는 connectionId만으로 판별할 수 있습니다.
         * 공개 프로필 경로에서는 교환 완료 목록의 카드 ID와 비교합니다.
         */
        if (connectionId || !isLoggedIn()) {
            return undefined;
        }

        const controller = new AbortController();

        const loadConnectedProfileCardIds = async () => {
            try {
                const connectionData = await getConnections({
                    page: 1,
                    limit: 100,
                    sort: "createdAt",
                    order: "desc",
                    signal: controller.signal,
                });

                if (controller.signal.aborted) {
                    return;
                }

                const connections = getArrayData(
                    connectionData?.data ?? connectionData,
                );

                const profileCardIds = connections
                    .map(
                        (connection) =>
                            connection?.card?.id ??
                            connection?.profileCard?.id ??
                            connection?.profile?.id,
                    )
                    .filter(
                        (id) => id !== null && id !== undefined,
                    )
                    .map(String);

                setConnectedProfileCardIds(
                    new Set(profileCardIds),
                );
            } catch (error) {
                if (error?.name === "AbortError") {
                    return;
                }

                console.error(
                    "보관함 카드 확인 실패:",
                    error,
                );

                setConnectedProfileCardIds(new Set());
            } finally {
                if (!controller.signal.aborted) {
                    setIsConnectionsLoading(false);
                }
            }
        };

        void loadConnectedProfileCardIds();

        return () => {
            controller.abort();
        };
    }, [connectionId]);

    if (isLoading) {
        return (
            <main className={styles.notFound}>
                <p>프로필을 불러오는 중입니다.</p>
            </main>
        );
    }

    if (errorMessage) {
        return (
            <main className={styles.notFound}>
                <p>{errorMessage}</p>

                <button
                    type="button"
                    onClick={() => navigate("/explore")}
                >
                    탐색으로 돌아가기
                </button>
            </main>
        );
    }

    if (!profile) {
        return (
            <main className={styles.notFound}>
                <p>프로필을 찾을 수 없습니다.</p>

                <button
                    type="button"
                    onClick={() => navigate("/explore")}
                >
                    탐색으로 돌아가기
                </button>
            </main>
        );
    }

    const isOwnProfileCard =
        !connectionId &&
        myProfileCardIds.has(
            String(profile.id),
        );

    /*
     * 보관함(/saved/:connectionId)에서 연 카드는
     * 이미 교환이 성립된 카드이므로
     * 스크랩과 교환 요청을 노출하지 않습니다.
     */
    const isFromSavedList =
        Boolean(connectionId);

    const isConnectedProfileCard =
        isFromSavedList ||
        connectedProfileCardIds.has(String(profile.id));

    const isProfileActionLoading =
        isMyProfileCardsLoading ||
        (isLoggedIn() && !isFromSavedList && isConnectionsLoading);

    const interests = (profile.interests || [])
        .map((interest, index) => ({
            id:
                interest?.id ??
                `interest-${index}`,

            name: getTagName(interest),
        }))
        .filter((interest) => interest.name);

    const skills = (
        profile.techStacks ||
        profile.skills ||
        []
    )
        .map((skill, index) => ({
            id:
                skill?.id ??
                `skill-${index}`,

            name: getTagName(skill),
        }))
        .filter((skill) => skill.name);

    const links = profile.links || [];
    const experiences = profile.experiences || [];

    const introduction =
        profile.introduction ||
        profile.description ||
        "등록된 한 줄 소개가 없습니다.";

    const affiliationText = [
        profile.affiliationType,
        profile.affiliation,
    ]
        .filter(
            (value, index, values) =>
                Boolean(value) &&
                values.indexOf(value) === index,
        )
        .join(" | ");

    const isProfileInDrawer = (drawer) =>
        drawer.profiles?.some(
            (item) =>
                String(item.id) ===
                String(profile.id),
        );

    const handleOpenScrap = () => {
        if (isOwnProfileCard) {
            return;
        }

        setIsMobileMenuOpen(false);

        const savedDrawerIds = drawers
            .filter(isProfileInDrawer)
            .map((drawer) => drawer.id);

        setSelectedDrawerIds(savedDrawerIds);
        setNewDrawerName("");
        setIsAddingDrawer(false);
        setIsScrapOpen(true);
    };

    const handleCloseScrap = () => {
        setIsScrapOpen(false);
        setSelectedDrawerIds([]);
        setNewDrawerName("");
        setIsAddingDrawer(false);
    };

    const handleDrawerToggle = (drawerId) => {
        setSelectedDrawerIds((currentIds) => {
            if (currentIds.includes(drawerId)) {
                return currentIds.filter(
                    (id) => id !== drawerId,
                );
            }

            // 프로필 하나는 하나의 서랍에 저장
            return [drawerId];
        });
    };

    const handleOpenAddDrawer = () => {
        setNewDrawerName("");
        setIsAddingDrawer(true);
    };

    const handleCancelAddDrawer = () => {
        setNewDrawerName("");
        setIsAddingDrawer(false);
    };

    const handleCreateDrawer = async (event) => {
        event.preventDefault();

        const trimmedName = newDrawerName.trim();

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

            if (createdGroup?.id) {
                setSelectedDrawerIds([
                    createdGroup.id,
                ]);
            }

            setNewDrawerName("");
            setIsAddingDrawer(false);
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

const handleScrapSave = async () => {
    if (isSavingScrap) {
        return;
    }

    if (drawers.length === 0) {
        setScrapError(
            "서랍을 먼저 만들어주세요.",
        );
        return;
    }

    const savedDrawer =
        drawers.find(
            isProfileInDrawer,
        );

    const savedProfile =
        savedDrawer?.profiles.find(
            (item) =>
                String(item.id) ===
                String(profile.id),
        );

    const selectedDrawerId =
        selectedDrawerIds[0] ??
        null;

    setIsSavingScrap(true);
    setScrapError("");

    try {
        if (
            !savedProfile &&
            selectedDrawerId
        ) {
            await createCollection({
                cardId: profile.id,
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
            String(savedDrawer.id) !==
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
        setIsSavingScrap(false);
    }
};

    const handleOpenExchangeModal = () => {
        if (isOwnProfileCard) {
            return;
        }

        setIsMobileMenuOpen(false);
        setIsExchangeModalOpen(true);
    };

    const handleCloseExchangeModal = () => {
        setIsExchangeModalOpen(false);
    };

    const handleSendExchange = (requestData) => {
        console.log(
            "카드 교환 요청:",
            requestData,
        );

        setIsExchangeModalOpen(false);

        window.alert(
            `${profile.name}님에게 카드 교환 요청을 보냈습니다.`,
        );
    };

    const handleMobileBack = () => {
        navigate(-1);
    };

    return (
        <main className={styles.page}>
            <div
                className={styles.hero}
                style={{
                    backgroundImage: `url("${profileDetailBackground}")`,
                }}
                aria-hidden="true"
            />

            <div className={styles.layout}>
                <aside
                    className={`${styles.summaryCard} ${
                        isFromSavedList
                            ? styles.summaryCardCompact
                            : ""
                    }`}
                >
                    <button
                        type="button"
                        className={styles.mobileBackButton}
                        onClick={handleMobileBack}
                        aria-label="이전 화면으로 돌아가기"
                    >
                        ‹
                    </button>

                    {!isConnectedProfileCard &&
                        !isProfileActionLoading &&
                        !isOwnProfileCard && (
                            <div className={styles.mobileMenuArea}>
                                <button
                                    type="button"
                                    className={styles.mobileMoreButton}
                                    onClick={() =>
                                        setIsMobileMenuOpen(
                                            (current) => !current,
                                        )
                                    }
                                    aria-label="프로필 메뉴"
                                    aria-expanded={isMobileMenuOpen}
                                >
                                    •••
                                </button>

                                {isMobileMenuOpen && (
                                    <div
                                        className={styles.mobileProfileMenu}
                                        role="menu"
                                    >
                                        <button
                                            type="button"
                                            onClick={handleOpenScrap}
                                            role="menuitem"
                                        >
                                            스크랩하기
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleOpenExchangeModal}
                                            role="menuitem"
                                        >
                                            카드 교환 요청
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                    <div className={styles.profileBlock}>
                        {profile.profileImage ? (
                            <img
                                src={profile.profileImage}
                                alt={`${profile.name || "사용자"} 프로필`}
                                className={styles.avatar}
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
                                    ?.charAt(0) || "N"}
                            </div>
                        )}

                        <div className={styles.identity}>
                            <div className={styles.nameRow}>
                                <strong className={styles.name}>
                                    {profile.name ||
                                        "이름 없음"}
                                </strong>

                                <span className={styles.job}>
                                    {JOB_LABELS[
                                        profile.job
                                    ] ||
                                        profile.jobTypeName ||
                                        "직군 미선택"}
                                </span>
                            </div>

                            <p className={styles.affiliation}>
                                {affiliationText ||
                                    "소속 정보 없음"}
                            </p>
                        </div>
                    </div>

                    {profile.strength ? (
                        <div className={styles.strength}>
                            {profile.strength.icon ? (
                                <img
                                    src={
                                        profile.strength
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
                                {profile.strength.title ||
                                    profile.strength.name ||
                                    "성향 정보 없음"}
                            </span>
                        </div>
                    ) : (
                        <div
                            className={
                                styles.strengthEmpty
                            }
                            aria-hidden="true"
                        />
                    )}

                    {/*
                      * 보관함에서 연 카드는 액션이 없으므로
                      * 빈 여백이 생기지 않도록 영역째 렌더링하지 않습니다.
                      */}
                    {!isConnectedProfileCard && !isProfileActionLoading && (
                        <div className={styles.summaryActions}>
                            {isOwnProfileCard ? (
                                <span
                                    className={
                                        styles.ownCardStatus
                                    }
                                >
                                    내 카드
                                </span>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className={styles.exchangeButton}
                                        onClick={
                                            handleOpenExchangeModal
                                        }
                                    >
                                        카드 교환 요청
                                    </button>

                                    <button
                                        type="button"
                                        className={styles.scrapButton}
                                        onClick={handleOpenScrap}
                                    >
                                        스크랩하기
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </aside>

                <article className={styles.detailCard}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            한 줄 소개
                        </h2>

                        <p className={styles.introduction}>
                            {introduction}
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            관심분야
                        </h2>

                        {interests.length > 0 ? (
                            <div className={styles.tagList}>
                                {interests.map(
                                    (interest) => (
                                        <span
                                            key={
                                                interest.id
                                            }
                                            className={
                                                styles.tag
                                            }
                                        >
                                            {interest.name}
                                        </span>
                                    ),
                                )}
                            </div>
                        ) : (
                            <p className={styles.emptyText}>
                                등록된 관심 분야가 없습니다.
                            </p>
                        )}
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            스킬
                        </h2>

                        {skills.length > 0 ? (
                            <div className={styles.tagList}>
                                {skills.map((skill) => (
                                    <span
                                        key={skill.id}
                                        className={styles.tag}
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className={styles.emptyText}>
                                등록된 스킬이 없습니다.
                            </p>
                        )}
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            링크
                        </h2>

                        {links.length > 0 ? (
                            <div className={styles.linkList}>
                                {links.map(
                                    (link, index) => {
                                        const LinkIcon =
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
                                                href={link.url}
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
                                                aria-label={`${getLinkLabel(link)} 열기`}
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
                                                    {getLinkLabel(
                                                        link,
                                                    )}
                                                </span>
                                            </a>
                                        );
                                    },
                                )}
                            </div>
                        ) : (
                            <p className={styles.emptyText}>
                                등록된 링크가 없습니다.
                            </p>
                        )}
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            경험
                        </h2>

                        {experiences.length > 0 ? (
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
                                                    {getExperienceLinkLabel(
                                                        experience,
                                                    )}
                                                </a>
                                            )}
                                        </article>
                                    ),
                                )}
                            </div>
                        ) : (
                            <p className={styles.emptyText}>
                                등록된 경험이 없습니다.
                            </p>
                        )}
                    </section>
                </article>
            </div>

            {isScrapOpen && !isFromSavedList && (
                <div
                    className={styles.modalBackdrop}
                    role="presentation"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleCloseScrap();
                        }
                    }}
                >
                    <section
                        className={styles.scrapModal}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="scrap-modal-title"
                    >
                        <div className={styles.modalHeader}>
                            <h2 id="scrap-modal-title">
                                어디에 스크랩할까요?
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

                        <div className={styles.scrapSummary}>
                            <span>
                                컬렉션 {drawers.length}개
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
                                                event.target
                                                    .value,
                                            )
                                        }
                                        maxLength={20}
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
                                className={styles.scrapError}
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
                            {drawers.length > 0 ? (
                                drawers.map((drawer) => {
                                    const isSelected =
                                        selectedDrawerIds.includes(
                                            drawer.id,
                                        );

                                    return (
                                        <button
                                            key={drawer.id}
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
                                                {drawer.name}
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
                                })
                            ) : (
                                <p
                                    className={
                                        styles.emptyDrawerText
                                    }
                                >
                                    생성된 서랍이 없습니다.
                                    서랍을 먼저 추가해 주세요.
                                </p>
                            )}
                        </div>

                        <button
    type="button"
    className={styles.saveButton}
    onClick={handleScrapSave}
    disabled={
        isSavingScrap ||
        drawers.length === 0
    }
>
    {isSavingScrap
        ? "저장 중..."
        : "저장"}
</button>
                    </section>
                </div>
            )}

            {isExchangeModalOpen &&
                !isOwnProfileCard &&
                !isFromSavedList && (
                <CardExchangeModal
                    receiver={profile}
                    onClose={
                        handleCloseExchangeModal
                    }
                    onSend={handleSendExchange}
                />
            )}
        </main>
    );
};

export default ProfileDetail;
