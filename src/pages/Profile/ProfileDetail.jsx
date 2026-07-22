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
    github: FaGithub,
    behance: FaBehance,
    instagram: FaInstagram,
    email: MdEmail,
    website: MdLanguage,
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

const ProfileDetail = () => {
    const { profileId } = useParams();
    const navigate = useNavigate();

    const [drawers, setDrawers] =
        useState([]);

    const [scrapError, setScrapError] =
        useState("");

    const [isSavingScrap, setIsSavingScrap] =
        useState(false);

    /* 스크랩 모달 */

    const [isScrapOpen, setIsScrapOpen] =
        useState(false);

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

    /* 경험 상세 */

    const [
        expandedExperienceIds,
        setExpandedExperienceIds,
    ] = useState([]);

    /* 카드 교환 요청 모달 */

    const [
        isExchangeModalOpen,
        setIsExchangeModalOpen,
    ] = useState(false);

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
                    getArrayData(groupData);

                const loadedDrawers =
                    await Promise.all(
                        groups.map(
                            async (group) => {
                                const itemData =
                                    await getCollectionGroupItems(
                                        group.id,
                                        { signal },
                                    );

                                const items =
                                    getArrayData(
                                        itemData,
                                    );

                                return {
                                    id: group.id,
                                    name: group.name,
                                    profiles:
                                        items.map(
                                            (item) => ({
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

                setDrawers(loadedDrawers);
                setScrapError("");
            } catch (error) {
                if (
                    error?.name !==
                    "AbortError"
                ) {
                    console.error(
                        "스크랩 서랍 조회 실패:",
                        error,
                    );
                    setScrapError(
                        error.message ||
                            "스크랩 서랍을 불러오지 못했습니다.",
                    );
                }
            }
        },
        [],
    );

    useEffect(() => {
        const controller =
            new AbortController();

        const fetchDrawers = async () => {
            await loadDrawers(
                controller.signal,
            );
        };

        fetchDrawers();

        return () => {
            controller.abort();
        };
    }, [loadDrawers]);

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
            <main className={styles.notFound}>
                <p>프로필을 찾을 수 없습니다.</p>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/explore")
                    }
                >
                    탐색으로 돌아가기
                </button>
            </main>
        );
    }

    const isDeveloper =
        profile.job === "frontend" ||
        profile.job === "backend";

    const skillTags = isDeveloper
        ? profile.techStacks || []
        : profile.interests || [];

    const interests =
        profile.interests || [];

    const links = profile.links || [];

    const experiences =
        profile.experiences || [];

    const introduction =
        profile.introduction ||
        profile.description ||
        "안녕하세요. 다양한 사람들과 경험을 나누고 새로운 프로젝트를 함께 만들어가고 싶습니다.";

    /* 경험 펼치기 */

    const handleExperienceToggle = (
        experienceId,
    ) => {
        setExpandedExperienceIds(
            (currentIds) => {
                if (
                    currentIds.includes(
                        experienceId,
                    )
                ) {
                    return currentIds.filter(
                        (id) =>
                            id !== experienceId,
                    );
                }

                return [
                    ...currentIds,
                    experienceId,
                ];
            },
        );
    };

    /* 스크랩 관련 */

    const isProfileInDrawer = (
        drawer,
    ) =>
        drawer.profiles?.some(
            (item) =>
                String(item.id) ===
                String(profile.id),
        );

    const handleOpenScrap = () => {
        const savedDrawerIds = drawers
            .filter(isProfileInDrawer)
            .map((drawer) => drawer.id);

        setSelectedDrawerIds(
            savedDrawerIds,
        );

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
                            id !== drawerId,
                    );
                }

                return [drawerId];
            },
        );
    };

    const handleOpenAddDrawer = () => {
        setNewDrawerName("");
        setIsAddingDrawer(true);
    };

    const handleCancelAddDrawer = () => {
        setNewDrawerName("");
        setIsAddingDrawer(false);
    };

    const handleCreateDrawer = async (
        event,
    ) => {
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
                error.message ||
                    "새 서랍을 만들지 못했습니다.",
            );
        }
    };

    const handleScrapSave = async () => {
        if (isSavingScrap) {
            return;
        }

        const savedDrawer = drawers.find(
            isProfileInDrawer,
        );

        const savedProfile =
            savedDrawer?.profiles.find(
                (item) =>
                    String(item.id) ===
                    String(profile.id),
            );

        const selectedDrawerId =
            selectedDrawerIds[0] ?? null;

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
                    String(selectedDrawerId)
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
                error.message ||
                    "스크랩을 저장하지 못했습니다.",
            );
        } finally {
            setIsSavingScrap(false);
        }
    };

    /* 카드 교환 관련 */

    const handleOpenExchangeModal = () => {
        setIsExchangeModalOpen(true);
    };

    const handleCloseExchangeModal = () => {
        setIsExchangeModalOpen(false);
    };

    const handleSendExchange = (
        requestData,
    ) => {
        /*
         * API 연결 후에는 여기서 요청
         *
         * requestData:
         * {
         *   receiverId,
         *   cardId,
         *   message
         * }
         */

        console.log(
            "카드 교환 요청:",
            requestData,
        );

        setIsExchangeModalOpen(false);

        window.alert(
            `${profile.name}님에게 카드 교환 요청을 보냈습니다.`,
        );
    };

    return (
        <main className={styles.page}>
            {/* 그라디언트 상단 배경 */}

            <div
                className={styles.hero}
                aria-hidden="true"
            />

            <div className={styles.layout}>
                {/* 왼쪽 요약 카드 */}

                <aside
                    className={
                        styles.summaryCard
                    }
                >
                    {profile.profileImage ? (
                        <img
                            src={
                                profile.profileImage
                            }
                            alt={`${profile.name} 프로필`}
                            className={
                                styles.avatar
                            }
                        />
                    ) : (
                        <div
                            className={
                                styles.avatarPlaceholder
                            }
                            aria-label="기본 프로필 이미지"
                        />
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
                            {profile.name}
                        </strong>

                        <span
                            className={styles.job}
                        >
                            {JOB_LABELS[
                                profile.job
                            ] || "직군 미선택"}
                        </span>
                    </div>

                    <p
                        className={
                            styles.affiliation
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
                                styles.strength
                            }
                        >
                            {profile.strength
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
                                {
                                    profile.strength
                                        .title
                                }
                            </span>
                        </div>
                    )}

                    <div
                        className={
                            styles.summaryActions
                        }
                    >
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
                    </div>
                </aside>

                {/* 오른쪽 상세 정보 */}

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
                                        index,
                                    ) => (
                                        <span
                                            key={
                                                interest.id ??
                                                `${interest.name}-${index}`
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

                        {skillTags.length >
                        0 ? (
                            <div
                                className={
                                    styles.tagList
                                }
                            >
                                {skillTags.map(
                                    (
                                        tag,
                                        index,
                                    ) => (
                                        <span
                                            key={
                                                tag.id ??
                                                `${tag.name}-${index}`
                                            }
                                            className={
                                                styles.tag
                                            }
                                        >
                                            {tag.name}
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

                    {/* 링크 */}

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

                        {links.length > 0 ? (
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
                                                aria-label={`${link.label} 링크 열기`}
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
                                                    {
                                                        link.label
                                                    }
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

                    {/* 경험 */}

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
                                    ) => {
                                        const experienceId =
                                            experience.id ??
                                            index;

                                        const isExpanded =
                                            expandedExperienceIds.includes(
                                                experienceId,
                                            );

                                        return (
                                            <article
                                                key={
                                                    experienceId
                                                }
                                                className={`${styles.experienceCard} ${
                                                    isExpanded
                                                        ? styles.expandedExperienceCard
                                                        : ""
                                                }`}
                                            >
                                                <button
                                                    type="button"
                                                    className={
                                                        styles.experienceToggle
                                                    }
                                                    onClick={() =>
                                                        handleExperienceToggle(
                                                            experienceId,
                                                        )
                                                    }
                                                    aria-expanded={
                                                        isExpanded
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
                                                            styles.experienceSummary
                                                        }
                                                    >
                                                        {experience.summary ||
                                                            "프로젝트에서 맡은 역할과 주요 경험을 소개합니다."}
                                                    </p>

                                                    <span
                                                        className={
                                                            styles.expandIcon
                                                        }
                                                        aria-hidden="true"
                                                    >
                                                        {isExpanded
                                                            ? "⌃"
                                                            : "⌄"}
                                                    </span>
                                                </button>

                                                {isExpanded && (
                                                    <div
                                                        className={
                                                            styles.experienceDetail
                                                        }
                                                    >
                                                        <p
                                                            className={
                                                                styles.experienceDescription
                                                            }
                                                        >
                                                            {experience.description ||
                                                                "등록된 상세 내용이 없습니다."}
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
                                                                        "관련 링크 보기"}
                                                                </span>

                                                                <span
                                                                    aria-hidden="true"
                                                                >
                                                                    ↗
                                                                </span>
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                            </article>
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
                                등록된 경험이
                                없습니다.
                            </p>
                        )}
                    </section>
                </article>
            </div>

            {/* 스크랩 모달 */}

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
                                role="alert"
                                style={{
                                    margin: "12px 0",
                                    color: "#d92d20",
                                    fontSize: "14px",
                                }}
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
                                    (drawer) => {
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

            {/* 카드 교환 요청 모달 */}

            {isExchangeModalOpen && (
                <CardExchangeModal
                    receiver={profile}
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
