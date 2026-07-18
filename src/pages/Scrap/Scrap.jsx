    import { useRef, useState } from "react";

    import HorizontalProfileCard from "../../components/profile/HorizontalProfileCard";
    import ExploreProfileCard from "../../components/profile/ExploreProfileCard";
    import MobileScrap from "../../pages/Scrap/MobileScrap";

    import profiles from "../../mocks/profiles";

    import styles from "./Scrap.module.css";

    const CARD_SCROLL_DISTANCE = 222;

    const INITIAL_DRAWERS = [
    {
        id: 1,
        name: "보류함 2",
        profiles: profiles.slice(0, 8),
    },
    {
        id: 2,
        name: "팀원후보",
        profiles: profiles.slice(8, 16),
    },
    ];

    const Scrap = () => {
    const [hoveredProfile, setHoveredProfile] =
        useState(null);

    const [drawers, setDrawers] =
        useState(INITIAL_DRAWERS);

    const [isManaging, setIsManaging] =
        useState(false);

    const [selectedProfiles, setSelectedProfiles] =
        useState([]);

    const [isCreateModalOpen, setIsCreateModalOpen] =
        useState(false);

    const [drawerName, setDrawerName] =
        useState("");

    const [editingDrawerId, setEditingDrawerId] =
        useState(null);

    const [editingDrawerName, setEditingDrawerName] =
        useState("");

    const cardListRefs = useRef({});

    const getSelectionKey = (
        drawerId,
        profileId,
    ) => `${drawerId}-${profileId}`;

    const isProfileSelected = (
        drawerId,
        profileId,
    ) => {
        const selectionKey = getSelectionKey(
        drawerId,
        profileId,
        );

        return selectedProfiles.includes(selectionKey);
    };

    const handleNext = (drawerId) => {
        cardListRefs.current[drawerId]?.scrollBy({
        left: CARD_SCROLL_DISTANCE,
        behavior: "smooth",
        });
    };

    const handlePrevious = (drawerId) => {
        cardListRefs.current[drawerId]?.scrollBy({
        left: -CARD_SCROLL_DISTANCE,
        behavior: "smooth",
        });
    };

    const handleStartManaging = () => {
        setSelectedProfiles([]);
        setIsManaging(true);
    };

    const handleFinishManaging = () => {
        setSelectedProfiles([]);
        setIsManaging(false);
    };

    const handleSelectProfile = (
        drawerId,
        profile,
    ) => {
        if (!isManaging) {
        return;
        }

        const selectionKey = getSelectionKey(
        drawerId,
        profile.id,
        );

        setSelectedProfiles((previousSelected) => {
        if (
            previousSelected.includes(selectionKey)
        ) {
            return previousSelected.filter(
            (key) => key !== selectionKey,
            );
        }

        return [
            ...previousSelected,
            selectionKey,
        ];
        });
    };

    const handleDeleteSelectedProfiles = () => {
        if (selectedProfiles.length === 0) {
        return;
        }

        setDrawers((previousDrawers) =>
        previousDrawers.map((drawer) => ({
            ...drawer,

            profiles: drawer.profiles.filter(
            (profile) => {
                const selectionKey =
                getSelectionKey(
                    drawer.id,
                    profile.id,
                );

                return !selectedProfiles.includes(
                selectionKey,
                );
            },
            ),
        })),
        );

        setSelectedProfiles([]);
        setHoveredProfile(null);
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

    const handleCreateDrawer = (event) => {
        event.preventDefault();

        const trimmedName = drawerName.trim();

        if (!trimmedName) {
        return;
        }

        const newDrawer = {
        id: Date.now(),
        name: trimmedName,
        profiles: [],
        };

        setDrawers((previousDrawers) => [
        ...previousDrawers,
        newDrawer,
        ]);

        handleCloseCreateModal();
    };

    /* 서랍 이름 수정 */

    const handleOpenEditDrawer = (drawer) => {
        setEditingDrawerId(drawer.id);
        setEditingDrawerName(drawer.name);
    };

    const handleCloseEditDrawer = () => {
        setEditingDrawerId(null);
        setEditingDrawerName("");
    };

    const handleUpdateDrawerName = (event) => {
        event.preventDefault();

        const trimmedName =
        editingDrawerName.trim();

        if (
        !trimmedName ||
        editingDrawerId === null
        ) {
        return;
        }

        setDrawers((previousDrawers) =>
        previousDrawers.map((drawer) =>
            drawer.id === editingDrawerId
            ? {
                ...drawer,
                name: trimmedName,
                }
            : drawer,
        ),
        );

        handleCloseEditDrawer();
    };

    /* 서랍 삭제 */

    const handleDeleteDrawer = (drawer) => {
        const shouldDelete = window.confirm(
        `"${drawer.name}" 서랍을 삭제하시겠습니까?\n서랍에 저장된 프로필도 함께 제거됩니다.`,
        );

        if (!shouldDelete) {
        return;
        }

        setDrawers((previousDrawers) =>
        previousDrawers.filter(
            (currentDrawer) =>
            currentDrawer.id !== drawer.id,
        ),
        );

        setSelectedProfiles(
        (previousSelected) =>
            previousSelected.filter(
            (selectionKey) =>
                !selectionKey.startsWith(
                `${drawer.id}-`,
                ),
            ),
        );

        setHoveredProfile(null);
    };

    return (
        <>
        {/* 데스크톱 스크랩 화면 */}

        <main className={styles.page}>
            <div className={styles.header}>
            <h1>스크랩</h1>

            {isManaging ? (
                <div className={styles.manageActions}>
                <button
                    type="button"
                    className={
                    styles.deleteSelectedButton
                    }
                    onClick={
                    handleDeleteSelectedProfiles
                    }
                    disabled={
                    selectedProfiles.length === 0
                    }
                >
                    {selectedProfiles.length}개 삭제
                </button>

                <button
                    type="button"
                    className={styles.doneButton}
                    onClick={handleFinishManaging}
                >
                    완료
                </button>
                </div>
            ) : (
                <button
                type="button"
                className={styles.manageButton}
                onClick={handleStartManaging}
                >
                관리하기
                </button>
            )}
            </div>

            <div className={styles.content}>
            <div className={styles.drawerList}>
                {drawers.map((drawer) => (
                <section
                    key={drawer.id}
                    className={styles.drawer}
                >
                    <div
                    className={styles.drawerHeader}
                    >
                    <div
                        className={styles.drawerTitle}
                    >
                        <h2>{drawer.name}</h2>

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
                            저장된 사람{" "}
                            {drawer.profiles.length}명
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
                            handleDeleteDrawer(drawer)
                        }
                        >
                        서랍 삭제
                        </button>
                    )}
                    </div>

                    {drawer.profiles.length > 0 ? (
                    <div
                        className={styles.cardSlider}
                    >
                        <button
                        type="button"
                        className={`${styles.slideButton} ${styles.previousButton}`}
                        onClick={() =>
                            handlePrevious(drawer.id)
                        }
                        aria-label={`${drawer.name} 이전 프로필 보기`}
                        >
                        ‹
                        </button>

                        <div
                        ref={(element) => {
                            cardListRefs.current[
                            drawer.id
                            ] = element;
                        }}
                        className={styles.cardList}
                        >
                        {drawer.profiles.map(
                            (profile) => {
                            const selected =
                                isProfileSelected(
                                drawer.id,
                                profile.id,
                                );

                            return (
                                <button
                                key={profile.id}
                                type="button"
                                className={`${
                                    styles.cardItem
                                } ${
                                    selected
                                    ? styles.selectedCard
                                    : ""
                                }`}
                                onClick={() =>
                                    handleSelectProfile(
                                    drawer.id,
                                    profile,
                                    )
                                }
                                onMouseEnter={() =>
                                    setHoveredProfile(
                                    profile,
                                    )
                                }
                                onMouseLeave={() =>
                                    setHoveredProfile(
                                    null,
                                    )
                                }
                                onFocus={() =>
                                    setHoveredProfile(
                                    profile,
                                    )
                                }
                                onBlur={() =>
                                    setHoveredProfile(
                                    null,
                                    )
                                }
                                aria-pressed={
                                    isManaging
                                    ? selected
                                    : undefined
                                }
                                >
                                <HorizontalProfileCard
                                    data={profile}
                                    name={profile.name}
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
                            handleNext(drawer.id)
                        }
                        aria-label={`${drawer.name} 다음 프로필 보기`}
                        >
                        ›
                        </button>
                    </div>
                    ) : (
                    <div
                        className={styles.emptyDrawer}
                    >
                        아직 저장된 프로필이
                        없습니다.
                    </div>
                    )}
                </section>
                ))}

                {!isManaging && (
                <button
                    type="button"
                    className={
                    styles.createDrawerButton
                    }
                    onClick={handleOpenCreateModal}
                >
                    <span aria-hidden="true">＋</span>
                    새 스크랩 서랍 만들기
                </button>
                )}
            </div>

            <aside className={styles.preview}>
                {hoveredProfile ? (
                <ExploreProfileCard
                    profile={hoveredProfile}
                />
                ) : (
                <p
                    className={styles.previewGuide}
                >
                    카드에 커서를 올려보세요.
                </p>
                )}
            </aside>
            </div>

            {/* 데스크톱 새 서랍 만들기 모달 */}

            {isCreateModalOpen && (
            <div
                className={styles.modalBackdrop}
                onMouseDown={
                handleCloseCreateModal
                }
            >
                <section
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-drawer-title"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
                >
                <div
                    className={styles.modalHeader}
                >
                    <h2 id="create-drawer-title">
                    서랍 만들기
                    </h2>

                    <button
                    type="button"
                    className={styles.closeButton}
                    onClick={
                        handleCloseCreateModal
                    }
                    aria-label="서랍 생성 모달 닫기"
                    >
                    ×
                    </button>
                </div>

                <form
                    onSubmit={handleCreateDrawer}
                >
                    <div
                    className={styles.inputHeader}
                    >
                    <label htmlFor="drawer-name">
                        서랍 이름
                    </label>

                    <span>
                        {drawerName.length}/20
                    </span>
                    </div>

                    <input
                    id="drawer-name"
                    type="text"
                    value={drawerName}
                    onChange={(event) =>
                        setDrawerName(
                        event.target.value,
                        )
                    }
                    maxLength={20}
                    placeholder="스크랩 목적, 분류 등을 작성해보세요"
                    autoFocus
                    />

                    <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={!drawerName.trim()}
                    >
                    만들기
                    </button>
                </form>
                </section>
            </div>
            )}

            {/* 데스크톱 서랍 이름 수정 모달 */}

            {editingDrawerId !== null && (
            <div
                className={styles.modalBackdrop}
                onMouseDown={
                handleCloseEditDrawer
                }
            >
                <section
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-drawer-title"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
                >
                <div
                    className={styles.modalHeader}
                >
                    <h2 id="edit-drawer-title">
                    서랍 이름 수정
                    </h2>

                    <button
                    type="button"
                    className={styles.closeButton}
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
                    className={styles.inputHeader}
                    >
                    <label htmlFor="edit-drawer-name">
                        서랍 이름
                    </label>

                    <span>
                        {editingDrawerName.length}/20
                    </span>
                    </div>

                    <input
                    id="edit-drawer-name"
                    type="text"
                    value={editingDrawerName}
                    onChange={(event) =>
                        setEditingDrawerName(
                        event.target.value,
                        )
                    }
                    maxLength={20}
                    placeholder="서랍 이름을 입력해 주세요"
                    autoFocus
                    />

                    <button
                    type="submit"
                    className={styles.submitButton}
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
            setDrawers={setDrawers}
        />
        </>
    );
    };

    export default Scrap;