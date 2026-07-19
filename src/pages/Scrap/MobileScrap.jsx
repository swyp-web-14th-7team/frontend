    import { useState } from "react";
    import { useNavigate } from "react-router-dom";

    import HorizontalProfileCard from "../../components/profile/HorizontalProfileCard";
    import ExploreProfileCard from "../../components/profile/ExploreProfileCard";

    import removeIcon from "../../assets/icons/icon_remove.svg";

    import styles from "./MobileScrap.module.css";

    const MobileScrap = ({
    drawers,
    setDrawers,
    }) => {
    const navigate = useNavigate();

    const [activeDrawerId, setActiveDrawerId] =
        useState(null);

    const [isEditing, setIsEditing] =
        useState(false);

    const [isMenuOpen, setIsMenuOpen] =
        useState(false);

    const [
        selectedProfileIds,
        setSelectedProfileIds,
    ] = useState([]);

    const [isCreateOpen, setIsCreateOpen] =
        useState(false);

    const [newDrawerName, setNewDrawerName] =
        useState("");

    const [isRenameOpen, setIsRenameOpen] =
        useState(false);

    const [renameValue, setRenameValue] =
        useState("");

    const activeDrawer = drawers.find(
        (drawer) => drawer.id === activeDrawerId,
    );

    const handleBack = () => {
        if (activeDrawerId !== null) {
        setActiveDrawerId(null);
        setIsEditing(false);
        setIsMenuOpen(false);
        setSelectedProfileIds([]);
        return;
        }

        navigate(-1);
    };

    const handleOpenDrawer = (drawerId) => {
        setActiveDrawerId(drawerId);
        setIsEditing(false);
        setIsMenuOpen(false);
        setSelectedProfileIds([]);
    };

    const handleStartEditing = () => {
        setSelectedProfileIds([]);
        setIsEditing(true);
        setIsMenuOpen(false);
    };

    const handleFinishEditing = () => {
        setSelectedProfileIds([]);
        setIsEditing(false);
    };

    const handleSelectProfile = (profileId) => {
        if (!isEditing) {
        return;
        }

        setSelectedProfileIds((previousIds) => {
        if (previousIds.includes(profileId)) {
            return previousIds.filter(
            (id) => id !== profileId,
            );
        }

        return [...previousIds, profileId];
        });
    };

    const handleDeleteSelectedProfiles = () => {
        if (
        selectedProfileIds.length === 0 ||
        activeDrawerId === null
        ) {
        return;
        }

        setDrawers((previousDrawers) =>
        previousDrawers.map((drawer) =>
            drawer.id === activeDrawerId
            ? {
                ...drawer,

                profiles: drawer.profiles.filter(
                    (profile) =>
                    !selectedProfileIds.includes(
                        profile.id,
                    ),
                ),
                }
            : drawer,
        ),
        );

        setSelectedProfileIds([]);
    };

    const handleDeleteDrawer = () => {
        if (!activeDrawer) {
        return;
        }

        const shouldDelete = window.confirm(
        `"${activeDrawer.name}" 서랍을 삭제하시겠습니까?`,
        );

        if (!shouldDelete) {
        return;
        }

        setDrawers((previousDrawers) =>
        previousDrawers.filter(
            (drawer) =>
            drawer.id !== activeDrawer.id,
        ),
        );

        setActiveDrawerId(null);
        setIsMenuOpen(false);
        setIsEditing(false);
        setSelectedProfileIds([]);
    };

    const handleCreateDrawer = (event) => {
        event.preventDefault();

        const trimmedName =
        newDrawerName.trim();

        if (!trimmedName) {
        return;
        }

        setDrawers((previousDrawers) => [
        ...previousDrawers,
        {
            id: Date.now(),
            name: trimmedName,
            profiles: [],
        },
        ]);

        setNewDrawerName("");
        setIsCreateOpen(false);
    };

    const handleOpenRename = () => {
        if (!activeDrawer) {
        return;
        }

        setRenameValue(activeDrawer.name);
        setIsRenameOpen(true);
    };

    const handleRenameDrawer = (event) => {
        event.preventDefault();

        const trimmedName = renameValue.trim();

        if (
        !trimmedName ||
        activeDrawerId === null
        ) {
        return;
        }

        setDrawers((previousDrawers) =>
        previousDrawers.map((drawer) =>
            drawer.id === activeDrawerId
            ? {
                ...drawer,
                name: trimmedName,
                }
            : drawer,
        ),
        );

        setIsRenameOpen(false);
        setRenameValue("");
    };

    return (
        <main className={styles.page}>
        {activeDrawer ? (
            <>
            <header className={styles.topBar}>
                <button
                type="button"
                className={styles.topIconButton}
                onClick={handleBack}
                aria-label="스크랩 목록으로 돌아가기"
                >
                ‹
                </button>

                {isEditing ? (
                <button
                    type="button"
                    className={styles.doneButton}
                    onClick={handleFinishEditing}
                >
                    완료
                </button>
                ) : (
                <div className={styles.menuWrapper}>
                    <button
                    type="button"
                    className={styles.moreButton}
                    onClick={() =>
                        setIsMenuOpen(
                        (previous) => !previous,
                        )
                    }
                    aria-label="스크랩 서랍 메뉴"
                    aria-expanded={isMenuOpen}
                    >
                    •••
                    </button>

                    {isMenuOpen && (
                    <div className={styles.menu}>
                        <button
                        type="button"
                        onClick={handleStartEditing}
                        >
                        수정
                        </button>

                        <button
                        type="button"
                        className={styles.menuDelete}
                        onClick={handleDeleteDrawer}
                        >
                        서랍 삭제
                        </button>
                    </div>
                    )}
                </div>
                )}
            </header>

            <section className={styles.detail}>
                <div className={styles.detailHeader}>
                <div className={styles.detailTitle}>
                    <h1>{activeDrawer.name}</h1>

                    {isEditing && (
                    <button
                        type="button"
                        className={styles.renameButton}
                        onClick={handleOpenRename}
                        aria-label="스크랩 서랍 이름 수정"
                    >
                        ✎
                    </button>
                    )}
                </div>

                <p>
                    저장된 사람{" "}
                    {activeDrawer.profiles.length}명
                </p>
                </div>

                {activeDrawer.profiles.length > 0 ? (
                <div
                    className={styles.profileCarousel}
                >
                    {activeDrawer.profiles.map(
                    (profile) => {
                        const selected =
                        selectedProfileIds.includes(
                            profile.id,
                        );

                        return (
                        <div
                            key={profile.id}
                            className={`${
                            styles.exploreCardItem
                            } ${
                            selected
                                ? styles.selectedCard
                                : ""
                            }`}
                            onClick={() =>
                            handleSelectProfile(
                                profile.id,
                            )
                            }
                        >
                        <ExploreProfileCard
                            profile={profile}
                            onClick={(profileId) => {
                                if (isEditing) {
                                    handleSelectProfile(profileId);
                                    return;
                                }

                                navigate(`/profile/${profileId}`);
                            }}
                        />
                        </div>
                        );
                    },
                    )}
                </div>
                ) : (
                <p className={styles.emptyText}>
                    아직 저장된 프로필이 없습니다.
                </p>
                )}
            </section>

            {isEditing && (
                <button
                type="button"
                className={styles.trashButton}
                onClick={
                    handleDeleteSelectedProfiles
                }
                disabled={
                    selectedProfileIds.length === 0
                }
                aria-label={`${selectedProfileIds.length}명 삭제`}
                >
                <img
                    src={removeIcon}
                    alt=""
                    width="22"
                    height="22"
                    aria-hidden="true"
                />
                </button>
            )}
            </>
        ) : (
            <>
            <header className={styles.topBar}>
                <button
                type="button"
                className={styles.topIconButton}
                onClick={handleBack}
                aria-label="이전 화면으로 이동"
                >
                ‹
                </button>
            </header>

            <div className={styles.overviewHeader}>
                <h1>스크랩</h1>

                <button
                type="button"
                onClick={() =>
                    setIsCreateOpen(true)
                }
                aria-label="새 스크랩 서랍 만들기"
                >
                ＋
                </button>
            </div>

            <div className={styles.drawerList}>
                {drawers.map((drawer) => (
                <section
                    key={drawer.id}
                    className={styles.drawer}
                >
                    <button
                    type="button"
                    className={styles.drawerHeader}
                    onClick={() =>
                        handleOpenDrawer(drawer.id)
                    }
                    >
                    <strong>{drawer.name}</strong>

                    <span>
                        저장된 사람{" "}
                        {drawer.profiles.length}명
                    </span>
                    </button>

                    {drawer.profiles.length > 0 ? (
                    <div
                        className={
                        styles.smallCardStack
                        }
                        onClick={() =>
                        handleOpenDrawer(drawer.id)
                        }
                    >
                        {drawer.profiles
                        .slice(0, 4)
                        .map((profile, index) => (
                            <button
                            key={profile.id}
                            type="button"
                            className={
                                styles.smallCardItem
                            }
                            style={{
                                left: `${
                                20 + index * 92
                                }px`,
                                zIndex: 4 - index,
                            }}
                            onClick={() =>
                                handleOpenDrawer(
                                drawer.id,
                                )
                            }
                            aria-label={`${drawer.name} 서랍 열기`}
                            >
                            <HorizontalProfileCard
                                data={profile}
                                name={profile.name}
                                profileImage={
                                profile.profileImage
                                }
                            />
                            </button>
                        ))}
                    </div>
                    ) : (
                    <p className={styles.emptyText}>
                        아직 저장된 프로필이 없습니다.
                    </p>
                    )}
                </section>
                ))}
            </div>
            </>
        )}

        {isCreateOpen && (
            <div
            className={styles.sheetBackdrop}
            onMouseDown={() =>
                setIsCreateOpen(false)
            }
            >
            <section
                className={styles.bottomSheet}
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-create-title"
                onMouseDown={(event) =>
                event.stopPropagation()
                }
            >
                <div className={styles.sheetHeader}>
                <h2 id="mobile-create-title">
                    서랍 만들기
                </h2>

                <button
                    type="button"
                    onClick={() =>
                    setIsCreateOpen(false)
                    }
                    aria-label="닫기"
                >
                    ×
                </button>
                </div>

                <form onSubmit={handleCreateDrawer}>
                <div className={styles.inputHeader}>
                    <label htmlFor="mobile-drawer-name">
                    서랍 이름
                    </label>

                    <span>
                    {newDrawerName.length}/20
                    </span>
                </div>

                <input
                    id="mobile-drawer-name"
                    value={newDrawerName}
                    onChange={(event) =>
                    setNewDrawerName(
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
                    disabled={!newDrawerName.trim()}
                >
                    만들기
                </button>
                </form>
            </section>
            </div>
        )}

        {isRenameOpen && (
            <div
            className={styles.sheetBackdrop}
            onMouseDown={() =>
                setIsRenameOpen(false)
            }
            >
            <section
                className={styles.bottomSheet}
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-rename-title"
                onMouseDown={(event) =>
                event.stopPropagation()
                }
            >
                <div className={styles.sheetHeader}>
                <h2 id="mobile-rename-title">
                    서랍 이름 수정
                </h2>

                <button
                    type="button"
                    onClick={() =>
                    setIsRenameOpen(false)
                    }
                    aria-label="닫기"
                >
                    ×
                </button>
                </div>

                <form onSubmit={handleRenameDrawer}>
                <div className={styles.inputHeader}>
                    <label htmlFor="mobile-rename">
                    서랍 이름
                    </label>

                    <span>
                    {renameValue.length}/20
                    </span>
                </div>

                <input
                    id="mobile-rename"
                    value={renameValue}
                    onChange={(event) =>
                    setRenameValue(
                        event.target.value,
                    )
                    }
                    maxLength={20}
                    autoFocus
                />

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={!renameValue.trim()}
                >
                    수정하기
                </button>
                </form>
            </section>
            </div>
        )}
        </main>
    );
    };

    export default MobileScrap;