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

import ExploreProfileCard from "../../components/profile/ExploreProfileCard";
import HorizontalProfileCard from "../../components/profile/HorizontalProfileCard";
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

const PencilIcon = () => (
    <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
    >
        <path
            d="M13.8 3.2a1.7 1.7 0 0 1 2.4 2.4L7.1 14.7 3.8 16l1.3-3.3 8.7-9.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const TrashIcon = () => (
    <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
    >
        <path
            d="M4.5 6h11M8 3.5h4M6 6l.6 10h6.8L14 6M8.4 9v4.5M11.6 9v4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <path
            d="m15 18-6-6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const ChevronRightIcon = () => (
    <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <path
            d="m9 6 6 6-6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const Scrap = () => {
    const navigate = useNavigate();

    const [drawers, setDrawers] =
        useState([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    const [
        hoveredProfile,
        setHoveredProfile,
    ] = useState(null);

    const [isManaging, setIsManaging] =
        useState(false);

    const [
        selectedProfiles,
        setSelectedProfiles,
    ] = useState([]);

    const [
        sliderStates,
        setSliderStates,
    ] = useState({});

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
                                        {
                                            signal,
                                        },
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

                setDrawers(
                    loadedDrawers,
                );
            } catch (error) {
                if (
                    error?.name ===
                    "AbortError"
                ) {
                    return;
                }

                console.error(
                    "스크랩 조회 실패:",
                    error,
                );

                setErrorMessage(
                    error.message ||
                        "스크랩을 불러오지 못했습니다.",
                );
            } finally {
                if (!signal?.aborted) {
                    setIsLoading(false);
                }
            }
        },
        [],
    );

    useEffect(() => {
        const controller =
            new AbortController();

        loadDrawers(
            controller.signal,
        );

        return () => {
            controller.abort();
        };
    }, [loadDrawers]);

    const updateSliderState =
        useCallback(
            (drawerId) => {
                const element =
                    cardListRefs.current[
                        drawerId
                    ];

                if (!element) {
                    return;
                }

                const maxScrollLeft =
                    Math.max(
                        0,
                        element.scrollWidth -
                            element.clientWidth,
                    );

                const nextState = {
                    canPrevious:
                        element.scrollLeft >
                        2,

                    canNext:
                        element.scrollLeft <
                        maxScrollLeft - 2,
                };

                setSliderStates(
                    (
                        currentStates,
                    ) => {
                        const currentState =
                            currentStates[
                                drawerId
                            ];

                        if (
                            currentState
                                ?.canPrevious ===
                                nextState.canPrevious &&
                            currentState
                                ?.canNext ===
                                nextState.canNext
                        ) {
                            return currentStates;
                        }

                        return {
                            ...currentStates,

                            [drawerId]:
                                nextState,
                        };
                    },
                );
            },
            [],
        );

    useEffect(() => {
        const updateAllSliders =
            () => {
                drawers.forEach(
                    (drawer) => {
                        updateSliderState(
                            drawer.id,
                        );
                    },
                );
            };

        const frame =
            window.requestAnimationFrame(
                updateAllSliders,
            );

        window.addEventListener(
            "resize",
            updateAllSliders,
        );

        return () => {
            window.cancelAnimationFrame(
                frame,
            );

            window.removeEventListener(
                "resize",
                updateAllSliders,
            );
        };
    }, [
        drawers,
        updateSliderState,
    ]);

    const getSelectionKey = (
        drawerId,
        profile,
    ) => {
        return String(
            profile.collectionId ??
                `${drawerId}-${profile.id}`,
        );
    };

    const isProfileSelected = (
        drawerId,
        profile,
    ) => {
        const selectionKey =
            getSelectionKey(
                drawerId,
                profile,
            );

        return selectedProfiles.includes(
            selectionKey,
        );
    };

    const handleNext = (
        drawerId,
    ) => {
        cardListRefs.current[
            drawerId
        ]?.scrollBy({
            left:
                CARD_SCROLL_DISTANCE,

            behavior:
                "smooth",
        });
    };

    const handlePrevious = (
        drawerId,
    ) => {
        cardListRefs.current[
            drawerId
        ]?.scrollBy({
            left:
                -CARD_SCROLL_DISTANCE,

            behavior:
                "smooth",
        });
    };

    const handleOpenProfile = (
        profileId,
    ) => {
        if (!profileId) {
            return;
        }

        navigate(
            `/profile/${profileId}`,
        );
    };

    const handleStartManaging =
        () => {
            setSelectedProfiles(
                [],
            );

            setHoveredProfile(
                null,
            );

            setIsManaging(
                true,
            );
        };

    const handleFinishManaging =
        () => {
            setSelectedProfiles(
                [],
            );

            setHoveredProfile(
                null,
            );

            setIsManaging(
                false,
            );
        };

    const handleSelectProfile = (
        drawerId,
        profile,
    ) => {
        const selectionKey =
            getSelectionKey(
                drawerId,
                profile,
            );

        setSelectedProfiles(
            (
                currentSelected,
            ) => {
                if (
                    currentSelected.includes(
                        selectionKey,
                    )
                ) {
                    return currentSelected.filter(
                        (key) =>
                            key !==
                            selectionKey,
                    );
                }

                return [
                    ...currentSelected,
                    selectionKey,
                ];
            },
        );
    };

    const handleProfileClick = (
        drawerId,
        profile,
    ) => {
        setHoveredProfile(
            profile,
        );

        if (isManaging) {
            handleSelectProfile(
                drawerId,
                profile,
            );

            return;
        }

        handleOpenProfile(
            profile.id,
        );
    };

    const handlePreviewProfileClick = (
        profileId,
    ) => {
        if (isManaging) {
            return;
        }

        handleOpenProfile(
            profileId,
        );
    };

    const handleDeleteSelectedProfiles =
        async () => {
            if (
                selectedProfiles.length ===
                0
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

    const handleOpenCreateModal =
        () => {
            setDrawerName("");

            setIsCreateModalOpen(
                true,
            );
        };

    const handleCloseCreateModal =
        () => {
            setDrawerName("");

            setIsCreateModalOpen(
                false,
            );
        };

    const handleCreateDrawer =
        async (event) => {
            event.preventDefault();

            const trimmedName =
                drawerName.trim();

            if (!trimmedName) {
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

    const handleOpenEditDrawer = (
        drawer,
    ) => {
        setEditingDrawerId(
            drawer.id,
        );

        setEditingDrawerName(
            drawer.name,
        );
    };

    const handleCloseEditDrawer =
        () => {
            setEditingDrawerId(
                null,
            );

            setEditingDrawerName(
                "",
            );
        };

    const handleUpdateDrawerName =
        async (event) => {
            event.preventDefault();

            const trimmedName =
                editingDrawerName.trim();

            if (
                !trimmedName ||
                editingDrawerId ===
                    null
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

    const handleDeleteDrawer =
        async (drawer) => {
            const shouldDelete =
                window.confirm(
                    `"${drawer.name}" 서랍을 삭제하시겠습니까?\n서랍에 저장된 프로필도 함께 제거됩니다.`,
                );

            if (!shouldDelete) {
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
            <main
                className={
                    styles.page
                }
            >
                <div
                    className={
                        styles.header
                    }
                >
                    <h1>
                        스크랩
                    </h1>

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
                                <TrashIcon />

                                <span>
                                    {
                                        selectedProfiles.length
                                    }
                                    개 삭제
                                </span>
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
                    <p
                        className={
                            styles.statusMessage
                        }
                    >
                        스크랩을 불러오는 중입니다.
                    </p>
                )}

                {errorMessage && (
                    <p
                        className={
                            styles.errorMessage
                        }
                        role="alert"
                    >
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
                            (drawer) => {
                                const sliderState =
                                    sliderStates[
                                        drawer.id
                                    ];

                                const canPrevious =
                                    sliderState
                                        ?.canPrevious ??
                                    false;

                                const canNext =
                                    sliderState
                                        ?.canNext ??
                                    drawer.profiles
                                        .length >
                                        4;

                                return (
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
                                                        <PencilIcon />
                                                    </button>
                                                ) : (
                                                    <span>
                                                        저장된 사람{" "}
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
                                                    서랍 삭제
                                                </button>
                                            )}
                                        </div>

                                        {drawer
                                            .profiles
                                            .length >
                                        0 ? (
                                            <div
                                                className={`${styles.cardSlider} ${
                                                    canPrevious
                                                        ? styles.cardSliderCanPrevious
                                                        : ""
                                                } ${
                                                    canNext
                                                        ? styles.cardSliderCanNext
                                                        : ""
                                                }`}
                                            >
                                                {canPrevious && (
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
                                                        <ChevronLeftIcon />
                                                    </button>
                                                )}

                                                <div
                                                    ref={(
                                                        element,
                                                    ) => {
                                                        if (
                                                            element
                                                        ) {
                                                            cardListRefs.current[
                                                                drawer.id
                                                            ] =
                                                                element;
                                                        } else {
                                                            delete cardListRefs
                                                                .current[
                                                                drawer.id
                                                            ];
                                                        }
                                                    }}
                                                    className={
                                                        styles.cardList
                                                    }
                                                    onScroll={() =>
                                                        updateSliderState(
                                                            drawer.id,
                                                        )
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
                                                                        profile.collectionId ??
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
                                                                    onMouseEnter={() =>
                                                                        setHoveredProfile(
                                                                            profile,
                                                                        )
                                                                    }
                                                                    onFocus={() =>
                                                                        setHoveredProfile(
                                                                            profile,
                                                                        )
                                                                    }
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

                                                {canNext && (
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
                                                        <ChevronRightIcon />
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div
                                                className={
                                                    styles.emptyDrawer
                                                }
                                            >
                                                아직 담아둔 카드가 없어요
                                            </div>
                                        )}
                                    </section>
                                );
                            },
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

                                새 스크랩 서랍 만들기
                            </button>
                        )}
                    </div>

                    <aside
                        className={`${styles.preview} ${
                            isManaging
                                ? styles.previewManaging
                                : ""
                        }`}
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
                                카드에 커서를 올려보세요
                            </p>
                        )}
                    </aside>
                </div>

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
                                <h2
                                    id="create-drawer-title"
                                >
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
                                <h2
                                    id="edit-drawer-title"
                                >
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

            <MobileScrap
                drawers={drawers}
                onReload={loadDrawers}
            />
        </>
    );
};

export default Scrap;
