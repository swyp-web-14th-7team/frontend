import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
    createCollectionGroup,
    deleteCollection,
    deleteCollectionGroup,
    getCollectionGroupItems,
    getCollectionGroups,
    updateCollectionGroup,
} from "../../api/collections";

import HorizontalProfileCard from "../../components/profile/HorizontalProfileCard";
import ExploreProfileCard from "../../components/profile/ExploreProfileCard";

import MobileScrap from "./MobileScrap";

import { mapProfileCard } from "../../utils/profileMapper";

import styles from "./Scrap.module.css";

const CARD_SCROLL_DISTANCE = 222;

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

const Scrap = () => {
    const navigate = useNavigate();

    const [drawers, setDrawers] =
        useState([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState("");

    const [hoveredProfile, setHoveredProfile] =
        useState(null);

    const [isManaging, setIsManaging] =
        useState(false);

    const [
        selectedProfiles,
        setSelectedProfiles,
    ] = useState([]);

    const [
        isCreateModalOpen,
        setIsCreateModalOpen,
    ] = useState(false);

    const [drawerName, setDrawerName] =
        useState("");

    const [
        editingDrawerId,
        setEditingDrawerId,
    ] = useState(null);

    const [
        editingDrawerName,
        setEditingDrawerName,
    ] = useState("");

    const cardListRefs = useRef({});

    const loadDrawers = useCallback(
        async (signal) => {
            setIsLoading(true);
            setErrorMessage("");

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
                                    name:
                                        group.name ||
                                        "이름 없는 서랍",
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
            } catch (error) {
                if (
                    error?.name !==
                    "AbortError"
                ) {
                    console.error(
                        "스크랩 조회 실패:",
                        error,
                    );
                    setErrorMessage(
                        error.message ||
                            "스크랩을 불러오지 못했습니다.",
                    );
                }
            } finally {
                if (!signal?.aborted) {
                    setIsLoading(false);
                }
            }
        },
        [],
    );

    useEffect(() => {
        const controller = new AbortController();

        const fetchDrawers = async () => {
            await loadDrawers(controller.signal);
        };

        fetchDrawers();

        return () => {
            controller.abort();
        };
    }, [loadDrawers]);

    const getSelectionKey = (
        drawerId,
        profile,
    ) =>
        String(
            profile.collectionId ??
                `${drawerId}-${profile.id}`,
        );

    const isProfileSelected = (
        drawerId,
        profile,
    ) => {
        const selectionKey = getSelectionKey(
            drawerId,
            profile,
        );

        return selectedProfiles.includes(
            selectionKey,
        );
    };

    const handleNext = (drawerId) => {
        cardListRefs.current[
            drawerId
        ]?.scrollBy({
            left: CARD_SCROLL_DISTANCE,
            behavior: "smooth",
        });
    };

    const handlePrevious = (drawerId) => {
        cardListRefs.current[
            drawerId
        ]?.scrollBy({
            left: -CARD_SCROLL_DISTANCE,
            behavior: "smooth",
        });
    };

    const handleStartManaging = () => {
        setSelectedProfiles([]);
        setHoveredProfile(null);
        setIsManaging(true);
    };

    const handleFinishManaging = () => {
        setSelectedProfiles([]);
        setHoveredProfile(null);
        setIsManaging(false);
    };

    const handleSelectProfile = (
        drawerId,
        profile,
    ) => {
        const selectionKey = getSelectionKey(
            drawerId,
            profile,
        );

        setSelectedProfiles(
            (previousSelected) => {
                if (
                    previousSelected.includes(
                        selectionKey,
                    )
                ) {
                    return previousSelected.filter(
                        (key) =>
                            key !== selectionKey,
                    );
                }

                return [
                    ...previousSelected,
                    selectionKey,
                ];
            },
        );
    };

    /*
     * 일반 모드:
     * 세부 프로필 화면으로 이동
     *
     * 관리 모드:
     * 프로필 선택 또는 선택 해제
     */
    const handleProfileClick = (
        drawerId,
        profile,
    ) => {
        if (isManaging) {
            handleSelectProfile(
                drawerId,
                profile,
            );

            return;
        }

        navigate(`/profile/${profile.id}`);
    };

    const handlePreviewProfileClick = (
        profileId,
    ) => {
        if (isManaging) {
            return;
        }

        navigate(`/profile/${profileId}`);
    };

    const handleDeleteSelectedProfiles =
        async () => {
            if (
                selectedProfiles.length === 0
            ) {
                return;
            }

            setErrorMessage("");

            try {
                await Promise.all(
                    selectedProfiles.map(
                        (collectionId) =>
                            deleteCollection(
                                collectionId,
                            ),
                    ),
                );

                setSelectedProfiles([]);
                setHoveredProfile(null);
                await loadDrawers();
            } catch (error) {
                console.error(
                    "스크랩 삭제 실패:",
                    error,
                );
                setErrorMessage(
                    error.message ||
                        "선택한 스크랩을 삭제하지 못했습니다.",
                );
            }
        };

    /* 새 서랍 생성 */

    const handleOpenCreateModal = () => {
        setDrawerName("");
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setDrawerName("");
        setIsCreateModalOpen(false);
    };

    const handleCreateDrawer = async (event) => {
        event.preventDefault();

        const trimmedName =
            drawerName.trim();

        if (
            !trimmedName
        ) {
            return;
        }

        setErrorMessage("");

        try {
            await createCollectionGroup(
                trimmedName,
            );
            handleCloseCreateModal();
            await loadDrawers();
        } catch (error) {
            console.error(
                "서랍 생성 실패:",
                error,
            );
            setErrorMessage(
                error.message ||
                    "서랍을 만들지 못했습니다.",
            );
        }
    };

    /* 서랍 이름 수정 */

    const handleOpenEditDrawer = (
        drawer,
    ) => {
        setEditingDrawerId(drawer.id);
        setEditingDrawerName(drawer.name);
    };

    const handleCloseEditDrawer = () => {
        setEditingDrawerId(null);
        setEditingDrawerName("");
    };

    const handleUpdateDrawerName = async (
        event,
    ) => {
        event.preventDefault();

        const trimmedName =
            editingDrawerName.trim();

        if (
            !trimmedName ||
            editingDrawerId === null
        ) {
            return;
        }

        setErrorMessage("");

        try {
            await updateCollectionGroup(
                editingDrawerId,
                trimmedName,
            );
            handleCloseEditDrawer();
            await loadDrawers();
        } catch (error) {
            console.error(
                "서랍 이름 수정 실패:",
                error,
            );
            setErrorMessage(
                error.message ||
                    "서랍 이름을 수정하지 못했습니다.",
            );
        }
    };

    /* 서랍 삭제 */

    const handleDeleteDrawer = async (
        drawer,
    ) => {
        const shouldDelete =
            window.confirm(
                `"${drawer.name}" 서랍을 삭제하시겠습니까?\n서랍에 저장된 프로필도 함께 제거됩니다.`,
            );

        if (
            !shouldDelete
        ) {
            return;
        }

        setErrorMessage("");

        try {
            await deleteCollectionGroup(
                drawer.id,
            );
            setSelectedProfiles([]);
            setHoveredProfile(null);
            await loadDrawers();
        } catch (error) {
            console.error(
                "서랍 삭제 실패:",
                error,
            );
            setErrorMessage(
                error.message ||
                    "서랍을 삭제하지 못했습니다.",
            );
        }
    };

    return (
        <>
            {/* 데스크톱 스크랩 화면 */}

            <main className={styles.page}>
                <div
                    className={styles.header}
                >
                    <h1>스크랩</h1>

                    {isManaging ? (
                        <div
                            className={
                                styles.manageActions
                            }
                        >
                            <button
                                type="button"
                                className={
                                    styles.deleteSelectedButton
                                }
                                onClick={
                                    handleDeleteSelectedProfiles
                                }
                                disabled={
                                    selectedProfiles.length ===
                                    0
                                }
                            >
                                {
                                    selectedProfiles.length
                                }
                                개 삭제
                            </button>

                            <button
                                type="button"
                                className={
                                    styles.doneButton
                                }
                                onClick={
                                    handleFinishManaging
                                }
                            >
                                완료
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            className={
                                styles.manageButton
                            }
                            onClick={
                                handleStartManaging
                            }
                        >
                            관리하기
                        </button>
                    )}
                </div>

                {isLoading && (
                    <p className={styles.statusMessage}>
                        스크랩을 불러오는 중입니다.
                    </p>
                )}

                {errorMessage && (
                    <p className={styles.errorMessage}>
                        {errorMessage}
                    </p>
                )}

                <div
                    className={
                        styles.content
                    }
                >
                    <div
                        className={
                            styles.drawerList
                        }
                    >
                        {drawers.map(
                            (drawer) => (
                                <section
                                    key={
                                        drawer.id
                                    }
                                    className={
                                        styles.drawer
                                    }
                                >
                                    <div
                                        className={
                                            styles.drawerHeader
                                        }
                                    >
                                        <div
                                            className={
                                                styles.drawerTitle
                                            }
                                        >
                                            <h2>
                                                {
                                                    drawer.name
                                                }
                                            </h2>

                                            {isManaging ? (
                                                <button
                                                    type="button"
                                                    className={
                                                        styles.editNameButton
                                                    }
                                                    onClick={() =>
                                                        handleOpenEditDrawer(
                                                            drawer,
                                                        )
                                                    }
                                                    aria-label={`${drawer.name} 이름 수정`}
                                                >
                                                    ✎
                                                </button>
                                            ) : (
                                                <span>
                                                    저장된
                                                    사람{" "}
                                                    {
                                                        drawer
                                                            .profiles
                                                            .length
                                                    }
                                                    명
                                                </span>
                                            )}
                                        </div>

                                        {isManaging && (
                                            <button
                                                type="button"
                                                className={
                                                    styles.deleteDrawerButton
                                                }
                                                onClick={() =>
                                                    handleDeleteDrawer(
                                                        drawer,
                                                    )
                                                }
                                            >
                                                서랍
                                                삭제
                                            </button>
                                        )}
                                    </div>

                                    {drawer
                                        .profiles
                                        .length >
                                    0 ? (
                                        <div
                                            className={
                                                styles.cardSlider
                                            }
                                        >
                                            <button
                                                type="button"
                                                className={`${styles.slideButton} ${styles.previousButton}`}
                                                onClick={() =>
                                                    handlePrevious(
                                                        drawer.id,
                                                    )
                                                }
                                                aria-label={`${drawer.name} 이전 프로필 보기`}
                                            >
                                                ‹
                                            </button>

                                            <div
                                                ref={(
                                                    element,
                                                ) => {
                                                    cardListRefs.current[
                                                        drawer.id
                                                    ] =
                                                        element;
                                                }}
                                                className={
                                                    styles.cardList
                                                }
                                            >
                                                {drawer.profiles.map(
                                                    (
                                                        profile,
                                                    ) => {
                                                        const selected =
                                                            isProfileSelected(
                                                                drawer.id,
                                                                profile,
                                                            );

                                                        return (
                                                            <button
                                                                key={
                                                                    profile.id
                                                                }
                                                                type="button"
                                                                className={`${styles.cardItem} ${
                                                                    selected
                                                                        ? styles.selectedCard
                                                                        : ""
                                                                }`}
                                                                onClick={() =>
                                                                    handleProfileClick(
                                                                        drawer.id,
                                                                        profile,
                                                                    )
                                                                }
                                                                onMouseEnter={() => {
                                                                    if (
                                                                        !isManaging
                                                                    ) {
                                                                        setHoveredProfile(
                                                                            profile,
                                                                        );
                                                                    }
                                                                }}
                                                                onMouseLeave={() => {
                                                                    if (
                                                                        !isManaging
                                                                    ) {
                                                                        setHoveredProfile(
                                                                            null,
                                                                        );
                                                                    }
                                                                }}
                                                                onFocus={() => {
                                                                    if (
                                                                        !isManaging
                                                                    ) {
                                                                        setHoveredProfile(
                                                                            profile,
                                                                        );
                                                                    }
                                                                }}
                                                                onBlur={() => {
                                                                    if (
                                                                        !isManaging
                                                                    ) {
                                                                        setHoveredProfile(
                                                                            null,
                                                                        );
                                                                    }
                                                                }}
                                                                aria-pressed={
                                                                    isManaging
                                                                        ? selected
                                                                        : undefined
                                                                }
                                                                aria-label={
                                                                    isManaging
                                                                        ? `${profile.name} 선택`
                                                                        : `${profile.name} 세부 프로필 보기`
                                                                }
                                                            >
                                                                <HorizontalProfileCard
                                                                    data={
                                                                        profile
                                                                    }
                                                                    name={
                                                                        profile.name
                                                                    }
                                                                    profileImage={
                                                                        profile.profileImage
                                                                    }
                                                                />
                                                            </button>
                                                        );
                                                    },
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                className={`${styles.slideButton} ${styles.nextButton}`}
                                                onClick={() =>
                                                    handleNext(
                                                        drawer.id,
                                                    )
                                                }
                                                aria-label={`${drawer.name} 다음 프로필 보기`}
                                            >
                                                ›
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            className={
                                                styles.emptyDrawer
                                            }
                                        >
                                            아직
                                            저장된
                                            프로필이
                                            없습니다.
                                        </div>
                                    )}
                                </section>
                            ),
                        )}

                        {!isManaging && (
                            <button
                                type="button"
                                className={
                                    styles.createDrawerButton
                                }
                                onClick={
                                    handleOpenCreateModal
                                }
                            >
                                <span
                                    aria-hidden="true"
                                >
                                    ＋
                                </span>

                                새 스크랩 서랍
                                만들기
                            </button>
                        )}
                    </div>

                    <aside
                        className={
                            styles.preview
                        }
                    >
                        {hoveredProfile ? (
                            <ExploreProfileCard
                                profile={
                                    hoveredProfile
                                }
                                onClick={
                                    handlePreviewProfileClick
                                }
                            />
                        ) : (
                            <p
                                className={
                                    styles.previewGuide
                                }
                            >
                                카드에 커서를
                                올려보세요.
                            </p>
                        )}
                    </aside>
                </div>

                {/* 새 서랍 만들기 모달 */}

                {isCreateModalOpen && (
                    <div
                        className={
                            styles.modalBackdrop
                        }
                        onMouseDown={
                            handleCloseCreateModal
                        }
                    >
                        <section
                            className={
                                styles.modal
                            }
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="create-drawer-title"
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
                                <h2 id="create-drawer-title">
                                    서랍 만들기
                                </h2>

                                <button
                                    type="button"
                                    className={
                                        styles.closeButton
                                    }
                                    onClick={
                                        handleCloseCreateModal
                                    }
                                    aria-label="서랍 생성 모달 닫기"
                                >
                                    ×
                                </button>
                            </div>

                            <form
                                onSubmit={
                                    handleCreateDrawer
                                }
                            >
                                <div
                                    className={
                                        styles.inputHeader
                                    }
                                >
                                    <label htmlFor="drawer-name">
                                        서랍 이름
                                    </label>

                                    <span>
                                        {
                                            drawerName.length
                                        }
                                        /20
                                    </span>
                                </div>

                                <input
                                    id="drawer-name"
                                    type="text"
                                    value={
                                        drawerName
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setDrawerName(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    maxLength={
                                        20
                                    }
                                    placeholder="스크랩 목적, 분류 등을 작성해보세요"
                                    autoFocus
                                />

                                <button
                                    type="submit"
                                    className={
                                        styles.submitButton
                                    }
                                    disabled={
                                        !drawerName.trim()
                                    }
                                >
                                    만들기
                                </button>
                            </form>
                        </section>
                    </div>
                )}

                {/* 서랍 이름 수정 모달 */}

                {editingDrawerId !==
                    null && (
                    <div
                        className={
                            styles.modalBackdrop
                        }
                        onMouseDown={
                            handleCloseEditDrawer
                        }
                    >
                        <section
                            className={
                                styles.modal
                            }
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="edit-drawer-title"
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
                                <h2 id="edit-drawer-title">
                                    서랍 이름 수정
                                </h2>

                                <button
                                    type="button"
                                    className={
                                        styles.closeButton
                                    }
                                    onClick={
                                        handleCloseEditDrawer
                                    }
                                    aria-label="이름 수정 모달 닫기"
                                >
                                    ×
                                </button>
                            </div>

                            <form
                                onSubmit={
                                    handleUpdateDrawerName
                                }
                            >
                                <div
                                    className={
                                        styles.inputHeader
                                    }
                                >
                                    <label htmlFor="edit-drawer-name">
                                        서랍 이름
                                    </label>

                                    <span>
                                        {
                                            editingDrawerName.length
                                        }
                                        /20
                                    </span>
                                </div>

                                <input
                                    id="edit-drawer-name"
                                    type="text"
                                    value={
                                        editingDrawerName
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setEditingDrawerName(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    maxLength={
                                        20
                                    }
                                    placeholder="서랍 이름을 입력해 주세요"
                                    autoFocus
                                />

                                <button
                                    type="submit"
                                    className={
                                        styles.submitButton
                                    }
                                    disabled={
                                        !editingDrawerName.trim()
                                    }
                                >
                                    수정하기
                                </button>
                            </form>
                        </section>
                    </div>
                )}
            </main>

            {/* 모바일 스크랩 화면 */}

            <MobileScrap
                drawers={drawers}
                onReload={loadDrawers}
            />
        </>
    );
};

export default Scrap;
