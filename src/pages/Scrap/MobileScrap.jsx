import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    createCollectionGroup,
    deleteCollection,
    deleteCollectionGroup,
    updateCollectionGroup,
} from "../../api/collections";

import HorizontalProfileCard from "../../components/profile/HorizontalProfileCard";
import ExploreProfileCard from "../../components/profile/ExploreProfileCard";

import removeIcon from "../../assets/icons/icon_remove.svg";

import styles from "./MobileScrap.module.css";

const MobileScrap = ({
    drawers = [],
    onReload,
}) => {
    const navigate = useNavigate();

    const [
        activeDrawerId,
        setActiveDrawerId,
    ] = useState(null);

    const [isEditing, setIsEditing] =
        useState(false);

    const [isMenuOpen, setIsMenuOpen] =
        useState(false);

    const [
        selectedCollectionIds,
        setSelectedCollectionIds,
    ] = useState([]);

    const [
        isCreateOpen,
        setIsCreateOpen,
    ] = useState(false);

    const [
        newDrawerName,
        setNewDrawerName,
    ] = useState("");

    const [
        isRenameOpen,
        setIsRenameOpen,
    ] = useState(false);

    const [
        renameValue,
        setRenameValue,
    ] = useState("");

    const [isWorking, setIsWorking] =
        useState(false);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    const activeDrawer = drawers.find(
        (drawer) =>
            String(drawer.id) ===
            String(activeDrawerId),
    );

    const reloadDrawers = async () => {
        if (
            typeof onReload ===
            "function"
        ) {
            await onReload();
        }
    };

    const handleBack = () => {
        if (
            activeDrawerId !== null
        ) {
            setActiveDrawerId(null);
            setIsEditing(false);
            setIsMenuOpen(false);
            setSelectedCollectionIds(
                [],
            );
            setErrorMessage("");

            return;
        }

        navigate(-1);
    };

    const handleOpenDrawer = (
        drawerId,
    ) => {
        setActiveDrawerId(drawerId);
        setIsEditing(false);
        setIsMenuOpen(false);
        setSelectedCollectionIds([]);
        setErrorMessage("");
    };

    const handleStartEditing =
        () => {
            setSelectedCollectionIds(
                [],
            );
            setIsEditing(true);
            setIsMenuOpen(false);
            setErrorMessage("");
        };

    const handleFinishEditing =
        () => {
            setSelectedCollectionIds(
                [],
            );
            setIsEditing(false);
        };

    const handleSelectProfile = (
        profile,
    ) => {
        if (
            !isEditing ||
            !profile?.collectionId
        ) {
            return;
        }

        const collectionId = String(
            profile.collectionId,
        );

        setSelectedCollectionIds(
            (previousIds) => {
                if (
                    previousIds.includes(
                        collectionId,
                    )
                ) {
                    return previousIds.filter(
                        (id) =>
                            id !==
                            collectionId,
                    );
                }

                return [
                    ...previousIds,
                    collectionId,
                ];
            },
        );
    };

    const handleDeleteSelectedProfiles =
        async () => {
            if (
                selectedCollectionIds.length ===
                    0 ||
                isWorking
            ) {
                return;
            }

            const shouldDelete =
                window.confirm(
                    `선택한 ${selectedCollectionIds.length}개의 스크랩을 삭제하시겠습니까?`,
                );

            if (!shouldDelete) {
                return;
            }

            setIsWorking(true);
            setErrorMessage("");

            try {
                await Promise.all(
                    selectedCollectionIds.map(
                        (
                            collectionId,
                        ) =>
                            deleteCollection(
                                collectionId,
                            ),
                    ),
                );

                setSelectedCollectionIds(
                    [],
                );

                await reloadDrawers();
            } catch (error) {
                console.error(
                    "모바일 스크랩 삭제 실패:",
                    error,
                );

                setErrorMessage(
                    error.message ||
                        "선택한 스크랩을 삭제하지 못했습니다.",
                );
            } finally {
                setIsWorking(false);
            }
        };

    const handleDeleteDrawer =
        async () => {
            if (
                !activeDrawer ||
                isWorking
            ) {
                return;
            }

            const shouldDelete =
                window.confirm(
                    `"${activeDrawer.name}" 서랍을 삭제하시겠습니까?`,
                );

            if (!shouldDelete) {
                return;
            }

            setIsWorking(true);
            setErrorMessage("");

            try {
                await deleteCollectionGroup(
                    activeDrawer.id,
                );

                setActiveDrawerId(
                    null,
                );
                setIsMenuOpen(false);
                setIsEditing(false);
                setSelectedCollectionIds(
                    [],
                );

                await reloadDrawers();
            } catch (error) {
                console.error(
                    "모바일 서랍 삭제 실패:",
                    error,
                );

                setErrorMessage(
                    error.message ||
                        "서랍을 삭제하지 못했습니다.",
                );
            } finally {
                setIsWorking(false);
            }
        };

    const handleCreateDrawer =
        async (event) => {
            event.preventDefault();

            const trimmedName =
                newDrawerName.trim();

            if (
                !trimmedName ||
                isWorking
            ) {
                return;
            }

            setIsWorking(true);
            setErrorMessage("");

            try {
                await createCollectionGroup(
                    trimmedName,
                );

                await reloadDrawers();

                setNewDrawerName("");
                setIsCreateOpen(false);
            } catch (error) {
                console.error(
                    "모바일 서랍 생성 실패:",
                    error,
                );

                setErrorMessage(
                    error.message ||
                        "새 서랍을 만들지 못했습니다.",
                );
            } finally {
                setIsWorking(false);
            }
        };

    const handleOpenRename =
        () => {
            if (!activeDrawer) {
                return;
            }

            setRenameValue(
                activeDrawer.name,
            );

            setErrorMessage("");
            setIsRenameOpen(true);
        };

    const handleRenameDrawer =
        async (event) => {
            event.preventDefault();

            const trimmedName =
                renameValue.trim();

            if (
                !trimmedName ||
                activeDrawerId ===
                    null ||
                isWorking
            ) {
                return;
            }

            setIsWorking(true);
            setErrorMessage("");

            try {
                await updateCollectionGroup(
                    activeDrawerId,
                    trimmedName,
                );

                await reloadDrawers();

                setIsRenameOpen(false);
                setRenameValue("");
            } catch (error) {
                console.error(
                    "모바일 서랍 이름 수정 실패:",
                    error,
                );

                setErrorMessage(
                    error.message ||
                        "서랍 이름을 수정하지 못했습니다.",
                );
            } finally {
                setIsWorking(false);
            }
        };

    return (
        <main
            className={styles.page}
        >
            {activeDrawer ? (
                <>
                    <header
                        className={
                            styles.topBar
                        }
                    >
                        <button
                            type="button"
                            className={
                                styles.topIconButton
                            }
                            onClick={
                                handleBack
                            }
                            aria-label="스크랩 목록으로 돌아가기"
                            disabled={
                                isWorking
                            }
                        >
                            ‹
                        </button>

                        {isEditing ? (
                            <button
                                type="button"
                                className={
                                    styles.doneButton
                                }
                                onClick={
                                    handleFinishEditing
                                }
                                disabled={
                                    isWorking
                                }
                            >
                                완료
                            </button>
                        ) : (
                            <div
                                className={
                                    styles.menuWrapper
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
                                                previous,
                                            ) =>
                                                !previous,
                                        )
                                    }
                                    aria-label="스크랩 서랍 메뉴"
                                    aria-expanded={
                                        isMenuOpen
                                    }
                                    disabled={
                                        isWorking
                                    }
                                >
                                    •••
                                </button>

                                {isMenuOpen && (
                                    <div
                                        className={
                                            styles.menu
                                        }
                                    >
                                        <button
                                            type="button"
                                            onClick={
                                                handleStartEditing
                                            }
                                        >
                                            수정
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                styles.menuDelete
                                            }
                                            onClick={
                                                handleDeleteDrawer
                                            }
                                        >
                                            서랍 삭제
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </header>

                    <section
                        className={
                            styles.detail
                        }
                    >
                        <div
                            className={
                                styles.detailHeader
                            }
                        >
                            <div
                                className={
                                    styles.detailTitle
                                }
                            >
                                <h1>
                                    {
                                        activeDrawer.name
                                    }
                                </h1>

                                {isEditing && (
                                    <button
                                        type="button"
                                        className={
                                            styles.renameButton
                                        }
                                        onClick={
                                            handleOpenRename
                                        }
                                        aria-label="스크랩 서랍 이름 수정"
                                        disabled={
                                            isWorking
                                        }
                                    >
                                        ✎
                                    </button>
                                )}
                            </div>

                            <p>
                                저장된 사람{" "}
                                {
                                    activeDrawer
                                        .profiles
                                        .length
                                }
                                명
                            </p>
                        </div>

                        {errorMessage && (
                            <p
                                role="alert"
                                style={{
                                    color:
                                        "#d92d20",
                                    fontSize:
                                        "14px",
                                }}
                            >
                                {
                                    errorMessage
                                }
                            </p>
                        )}

                        {activeDrawer
                            .profiles
                            .length >
                        0 ? (
                            <div
                                className={
                                    styles.profileCarousel
                                }
                            >
                                {activeDrawer.profiles.map(
                                    (
                                        profile,
                                    ) => {
                                        const selected =
                                            selectedCollectionIds.includes(
                                                String(
                                                    profile.collectionId,
                                                ),
                                            );

                                        return (
                                            <div
                                                key={
                                                    profile.collectionId ||
                                                    profile.id
                                                }
                                                className={`${styles.exploreCardItem} ${
                                                    selected
                                                        ? styles.selectedCard
                                                        : ""
                                                }`}
                                            >
                                                <ExploreProfileCard
                                                    profile={
                                                        profile
                                                    }
                                                    onClick={(
                                                        profileId,
                                                    ) => {
                                                        if (
                                                            isEditing
                                                        ) {
                                                            handleSelectProfile(
                                                                profile,
                                                            );

                                                            return;
                                                        }

                                                        navigate(
                                                            `/profile/${profileId}`,
                                                        );
                                                    }}
                                                />
                                            </div>
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
                                아직 저장된
                                프로필이
                                없습니다.
                            </p>
                        )}
                    </section>

                    {isEditing && (
                        <button
                            type="button"
                            className={
                                styles.trashButton
                            }
                            onClick={
                                handleDeleteSelectedProfiles
                            }
                            disabled={
                                selectedCollectionIds.length ===
                                    0 ||
                                isWorking
                            }
                            aria-label={`${selectedCollectionIds.length}명 삭제`}
                        >
                            <img
                                src={
                                    removeIcon
                                }
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
                    <header
                        className={
                            styles.topBar
                        }
                    >
                        <button
                            type="button"
                            className={
                                styles.topIconButton
                            }
                            onClick={
                                handleBack
                            }
                            aria-label="이전 화면으로 이동"
                        >
                            ‹
                        </button>
                    </header>

                    <div
                        className={
                            styles.overviewHeader
                        }
                    >
                        <h1>스크랩</h1>

                        <button
                            type="button"
                            onClick={() => {
                                setErrorMessage(
                                    "",
                                );

                                setIsCreateOpen(
                                    true,
                                );
                            }}
                            aria-label="새 스크랩 서랍 만들기"
                        >
                            ＋
                        </button>
                    </div>

                    {errorMessage && (
                        <p
                            role="alert"
                            style={{
                                color:
                                    "#d92d20",
                                fontSize:
                                    "14px",
                            }}
                        >
                            {errorMessage}
                        </p>
                    )}

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
                                    <button
                                        type="button"
                                        className={
                                            styles.drawerHeader
                                        }
                                        onClick={() =>
                                            handleOpenDrawer(
                                                drawer.id,
                                            )
                                        }
                                    >
                                        <strong>
                                            {
                                                drawer.name
                                            }
                                        </strong>

                                        <span>
                                            저장된 사람{" "}
                                            {
                                                drawer
                                                    .profiles
                                                    .length
                                            }
                                            명
                                        </span>
                                    </button>

                                    {drawer
                                        .profiles
                                        .length >
                                    0 ? (
                                        <div
                                            className={
                                                styles.smallCardStack
                                            }
                                            onClick={() =>
                                                handleOpenDrawer(
                                                    drawer.id,
                                                )
                                            }
                                        >
                                            {drawer.profiles
                                                .slice(
                                                    0,
                                                    4,
                                                )
                                                .map(
                                                    (
                                                        profile,
                                                        index,
                                                    ) => (
                                                        <button
                                                            key={
                                                                profile.collectionId ||
                                                                profile.id
                                                            }
                                                            type="button"
                                                            className={
                                                                styles.smallCardItem
                                                            }
                                                            style={{
                                                                left: `${
                                                                    20 +
                                                                    index *
                                                                        92
                                                                }px`,

                                                                zIndex:
                                                                    4 -
                                                                    index,
                                                            }}
                                                            onClick={() =>
                                                                handleOpenDrawer(
                                                                    drawer.id,
                                                                )
                                                            }
                                                            aria-label={`${drawer.name} 서랍 열기`}
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
                                                    ),
                                                )}
                                        </div>
                                    ) : (
                                        <p
                                            className={
                                                styles.emptyText
                                            }
                                        >
                                            아직 저장된
                                            프로필이
                                            없습니다.
                                        </p>
                                    )}
                                </section>
                            ),
                        )}
                    </div>
                </>
            )}

            {isCreateOpen && (
                <div
                    className={
                        styles.sheetBackdrop
                    }
                    onMouseDown={() =>
                        !isWorking &&
                        setIsCreateOpen(
                            false,
                        )
                    }
                >
                    <section
                        className={
                            styles.bottomSheet
                        }
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="mobile-create-title"
                        onMouseDown={(
                            event,
                        ) =>
                            event.stopPropagation()
                        }
                    >
                        <div
                            className={
                                styles.sheetHeader
                            }
                        >
                            <h2 id="mobile-create-title">
                                서랍 만들기
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setIsCreateOpen(
                                        false,
                                    )
                                }
                                aria-label="닫기"
                                disabled={
                                    isWorking
                                }
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
                                <label htmlFor="mobile-drawer-name">
                                    서랍 이름
                                </label>

                                <span>
                                    {
                                        newDrawerName.length
                                    }
                                    /20
                                </span>
                            </div>

                            <input
                                id="mobile-drawer-name"
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
                                placeholder="스크랩 목적, 분류 등을 작성해보세요"
                                disabled={
                                    isWorking
                                }
                                autoFocus
                            />

                            {errorMessage && (
                                <p
                                    role="alert"
                                    style={{
                                        color:
                                            "#d92d20",
                                        fontSize:
                                            "14px",
                                    }}
                                >
                                    {
                                        errorMessage
                                    }
                                </p>
                            )}

                            <button
                                type="submit"
                                className={
                                    styles.submitButton
                                }
                                disabled={
                                    !newDrawerName.trim() ||
                                    isWorking
                                }
                            >
                                {isWorking
                                    ? "만드는 중..."
                                    : "만들기"}
                            </button>
                        </form>
                    </section>
                </div>
            )}

            {isRenameOpen && (
                <div
                    className={
                        styles.sheetBackdrop
                    }
                    onMouseDown={() =>
                        !isWorking &&
                        setIsRenameOpen(
                            false,
                        )
                    }
                >
                    <section
                        className={
                            styles.bottomSheet
                        }
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="mobile-rename-title"
                        onMouseDown={(
                            event,
                        ) =>
                            event.stopPropagation()
                        }
                    >
                        <div
                            className={
                                styles.sheetHeader
                            }
                        >
                            <h2 id="mobile-rename-title">
                                서랍 이름 수정
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setIsRenameOpen(
                                        false,
                                    )
                                }
                                aria-label="닫기"
                                disabled={
                                    isWorking
                                }
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={
                                handleRenameDrawer
                            }
                        >
                            <div
                                className={
                                    styles.inputHeader
                                }
                            >
                                <label htmlFor="mobile-rename">
                                    서랍 이름
                                </label>

                                <span>
                                    {
                                        renameValue.length
                                    }
                                    /20
                                </span>
                            </div>

                            <input
                                id="mobile-rename"
                                value={
                                    renameValue
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setRenameValue(
                                        event
                                            .target
                                            .value,
                                    )
                                }
                                maxLength={
                                    20
                                }
                                disabled={
                                    isWorking
                                }
                                autoFocus
                            />

                            {errorMessage && (
                                <p
                                    role="alert"
                                    style={{
                                        color:
                                            "#d92d20",
                                        fontSize:
                                            "14px",
                                    }}
                                >
                                    {
                                        errorMessage
                                    }
                                </p>
                            )}

                            <button
                                type="submit"
                                className={
                                    styles.submitButton
                                }
                                disabled={
                                    !renameValue.trim() ||
                                    isWorking
                                }
                            >
                                {isWorking
                                    ? "수정 중..."
                                    : "수정하기"}
                            </button>
                        </form>
                    </section>
                </div>
            )}
        </main>
    );
};

export default MobileScrap;