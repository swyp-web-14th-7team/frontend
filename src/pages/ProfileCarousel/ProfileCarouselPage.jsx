    import { useCallback, useEffect, useRef, useState } from "react";
    import { useNavigate, useParams, useSearchParams } from "react-router-dom";

    import { Swiper, SwiperSlide } from "swiper/react";

    import "swiper/css";

    import {
    createCollection,
    createCollectionGroup,
    deleteCollection,
    getCollectionGroupItems,
    getCollectionGroups,
    moveCollection,
    } from "../../api/collections";

    import LoginModal from "../../components/common/LoginModal/LoginModal";
    import ExploreProfileCard from "../../components/profile/ExploreProfileCard";

    import usePublicProfiles from "../../hooks/usePublicProfiles";
    import useMyProfileCardIds from "../../hooks/useMyProfileCardIds";

    import { isLoggedIn } from "../../utils/auth";
    import { mapProfileCard } from "../../utils/profileMapper";

    import scrapIcon from "../../assets/icons/icon_scrap.svg";

    import styles from "./ProfileCarouselPage.module.css";

    const PURPOSE_HEADER_TEXT = {
    팀빌딩: "팀을 찾고 있어요",
    커피챗: "커피챗 나눠요",
    네트워킹: "새로운 만남을 찾아요",
    교류네트워킹: "새로운 만남을 찾아요",
    };

    const normalizePurposeForHeader = (value = "") =>
    String(value).replace(/\s+/g, "").replace(/[·/]/g, "").toLowerCase();

    const ChevronLeftIcon = () => (
    <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
    </svg>
    );

    const ChevronRightIcon = () => (
    <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
    </svg>
    );

    const BackIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
    </svg>
    );

    const getArrayData = (data) => {
    if (Array.isArray(data)) {
        return data;
    }

    return data?.items || data?.collectionGroups || data?.groups || [];
    };

    const ProfileCarouselPage = () => {
    const navigate = useNavigate();

    const [drawers, setDrawers] = useState([]);
    const [scrapError, setScrapError] = useState("");
    const [isSavingScrap, setIsSavingScrap] = useState(false);

    const { profileId } = useParams();
    const [searchParams] = useSearchParams();

    const { profiles, isLoading, errorMessage } = usePublicProfiles();

    const {
        myProfileCardIds,
        isLoading: isMyProfileCardsLoading,
    } = useMyProfileCardIds();

    const swiperRef = useRef(null);
    const isDraggingRef = useRef(false);
    const dragProgressRef = useRef(null);
    const sideSlidePointerRef = useRef(null);

    const purpose = searchParams.get("purpose");
    const headerText =
        PURPOSE_HEADER_TEXT[normalizePurposeForHeader(purpose)] ?? "";

    /*
    * 탐색 화면에서 선택한 섹션의 purpose가
    * 쿼리스트링으로 전달되면 해당 목적의 카드만 표시합니다.
    *
    * 전체보기에서는 purpose가 없으므로 모든 카드를 표시합니다.
    */
    const carouselProfiles = purpose
        ? profiles.filter((profile) => {
            const purposeNames = Array.isArray(profile.purposes)
            ? profile.purposes
            : [];

            return purposeNames.some((item) => {
            const purposeName =
                typeof item === "string"
                ? item
                : item?.name || item?.purposeName || "";

            return purposeName === purpose;
            });
        })
        : profiles;

    const selectedIndex = carouselProfiles.findIndex(
        (profile) => String(profile.id) === String(profileId),
    );

    const initialSlide = selectedIndex >= 0 ? selectedIndex : 0;

    const [activeIndex, setActiveIndex] = useState(initialSlide);
    const [isDragging, setIsDragging] = useState(false);
    const [dragProgress, setDragProgress] = useState(null);

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isScrapSheetOpen, setIsScrapSheetOpen] = useState(false);

    const [selectedDrawerIds, setSelectedDrawerIds] = useState([]);

    const [isCreatingDrawer, setIsCreatingDrawer] = useState(false);
    const [newDrawerName, setNewDrawerName] = useState("");

    const loadScrapDrawers = useCallback(async (signal) => {
        try {
        const groupData = await getCollectionGroups({ signal });

        const groups = getArrayData(groupData);

        const loadedDrawers = await Promise.all(
            groups.map(async (group) => {
            const itemData = await getCollectionGroupItems(group.id, {
                signal,
            });

            const items = getArrayData(itemData);

            return {
                id: group.id,
                name: group.name,
                profiles: items.map((item) => ({
                ...mapProfileCard(item.card || item.profile || item),
                collectionId: item.collectionId ?? item.id,
                })),
            };
            }),
        );

        setDrawers(loadedDrawers);
        setScrapError("");
        } catch (error) {
        if (error?.name !== "AbortError") {
            console.error("스크랩 서랍 조회 실패:", error);

            setScrapError(error.message || "스크랩 서랍을 불러오지 못했습니다.");
        }
        }
    }, []);

    useEffect(() => {
        /*
        * 비로그인 상태에서는 보관함 API를 호출하지 않습니다.
        */
        if (!isLoggedIn()) {
        return undefined;
        }

        const controller = new AbortController();

        const fetchScrapDrawers = async () => {
        await loadScrapDrawers(controller.signal);
        };

        fetchScrapDrawers();

        return () => {
        controller.abort();
        };
    }, [loadScrapDrawers]);

    const activeProfile = carouselProfiles[activeIndex];

    const isFirstSlide = activeIndex === 0;

    const isLastSlide = activeIndex === carouselProfiles.length - 1;

    const isActiveProfileScrapped = activeProfile
        ? drawers.some((drawer) =>
            drawer.profiles.some(
            (profile) => String(profile.id) === String(activeProfile.id),
            ),
        )
        : false;

    const isActiveProfileMine = activeProfile
        ? myProfileCardIds.has(String(activeProfile.id))
        : false;

    const indicatorProgress =
        carouselProfiles.length <= 1
        ? 0
        : activeIndex / (carouselProfiles.length - 1);

    const displayedProgress =
        dragProgress !== null ? dragProgress : indicatorProgress;

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleProfileClick = (
        clickedProfileId,
        clickedIndex,
    ) => {
        const isDesktop =
        window.matchMedia(
            "(min-width: 769px)",
        ).matches;

        const swiper =
        swiperRef.current;

        if (
        isDesktop &&
        swiper &&
        clickedIndex !== swiper.activeIndex
        ) {
        swiper.slideTo(
            clickedIndex,
            400,
        );
        return;
        }

        navigate(`/profile/${clickedProfileId}`);
    };

    const handleSlidePointerDownCapture = (clickedIndex) => {
        const isDesktop =
        window.matchMedia(
            "(min-width: 769px)",
        ).matches;

        const swiper = swiperRef.current;

        sideSlidePointerRef.current =
        isDesktop &&
        swiper &&
        clickedIndex !== swiper.activeIndex
            ? clickedIndex
            : null;
    };

    const handleSlideClickCapture = (event, clickedIndex) => {
        if (sideSlidePointerRef.current !== clickedIndex) {
        return;
        }

        event.preventDefault();
        event.stopPropagation();

        swiperRef.current?.slideTo(clickedIndex, 400);
        sideSlidePointerRef.current = null;
    };

    const handlePrevSlide = () => {
        swiperRef.current?.slidePrev();
    };

    const handleNextSlide = () => {
        swiperRef.current?.slideNext();
    };

    const handleOpenScrapSheet = () => {
        if (!activeProfile) {
        return;
        }

        /*
        * 비로그인 사용자는 스크랩 바텀시트를 열지 않고
        * 로그인 유도 모달을 표시합니다.
        */
        if (!isLoggedIn()) {
        setIsLoginModalOpen(true);
        return;
        }

        const savedDrawerIds = drawers
        .filter((drawer) =>
            drawer.profiles.some(
            (profile) => String(profile.id) === String(activeProfile.id),
            ),
        )
        .map((drawer) => drawer.id);

        setSelectedDrawerIds(savedDrawerIds);
        setIsCreatingDrawer(false);
        setNewDrawerName("");
        setIsScrapSheetOpen(true);
    };

    const handleCloseScrapSheet = () => {
        setSelectedDrawerIds([]);
        setIsCreatingDrawer(false);
        setNewDrawerName("");
        setIsScrapSheetOpen(false);
    };

    const handleToggleDrawer = (drawerId) => {
        setSelectedDrawerIds((previousDrawerIds) => {
        if (previousDrawerIds.includes(drawerId)) {
            return [];
        }

        return [drawerId];
        });
    };

    const handleSaveScrap = async () => {
        if (!activeProfile || isSavingScrap) {
        return;
        }

        /*
        * 모달이 열린 후 로그인이 해제되는 경우에도
        * 스크랩 API 호출을 차단합니다.
        */
        if (!isLoggedIn()) {
        handleCloseScrapSheet();
        setIsLoginModalOpen(true);
        return;
        }

        if (drawers.length === 0) {
        setScrapError("서랍을 먼저 만들어주세요.");
        return;
        }

        const savedDrawer = drawers.find((drawer) =>
        drawer.profiles.some(
            (profile) => String(profile.id) === String(activeProfile.id),
        ),
        );

        const savedProfile = savedDrawer?.profiles.find(
        (profile) => String(profile.id) === String(activeProfile.id),
        );

        const selectedDrawerId = selectedDrawerIds[0] ?? null;

        setIsSavingScrap(true);
        setScrapError("");

        try {
        if (!savedProfile && selectedDrawerId) {
            await createCollection({
            cardId: activeProfile.id,
            groupId: selectedDrawerId,
            });
        } else if (savedProfile?.collectionId && !selectedDrawerId) {
            await deleteCollection(savedProfile.collectionId);
        } else if (
            savedProfile?.collectionId &&
            selectedDrawerId &&
            String(savedDrawer.id) !== String(selectedDrawerId)
        ) {
            await moveCollection(savedProfile.collectionId, selectedDrawerId);
        }

        await loadScrapDrawers();
        handleCloseScrapSheet();
        } catch (error) {
        console.error("스크랩 저장 실패:", error);

        setScrapError(error.message || "스크랩을 저장하지 못했습니다.");
        } finally {
        setIsSavingScrap(false);
        }
    };

    const handleOpenCreateDrawer = () => {
        setNewDrawerName("");
        setIsCreatingDrawer(true);
    };

    const handleCancelCreateDrawer = () => {
        setNewDrawerName("");
        setIsCreatingDrawer(false);
    };

    const handleCreateDrawer = async (event) => {
        event.preventDefault();

        const trimmedName = newDrawerName.trim();

        if (!trimmedName) {
        return;
        }

        if (!isLoggedIn()) {
        handleCloseScrapSheet();
        setIsLoginModalOpen(true);
        return;
        }

        setScrapError("");

        try {
        const createdGroup = await createCollectionGroup(trimmedName);

        await loadScrapDrawers();

        if (createdGroup?.id) {
            setSelectedDrawerIds([createdGroup.id]);
        }

        setNewDrawerName("");
        setIsCreatingDrawer(false);
        } catch (error) {
        console.error("스크랩 서랍 생성 실패:", error);

        setScrapError(error.message || "새 서랍을 만들지 못했습니다.");
        }
    };

    const getProgressFromPointer = (event, indicatorElement) => {
        const rect = indicatorElement.getBoundingClientRect();

        const pointerX = event.clientX - rect.left;

        const rawProgress = pointerX / rect.width;

        return Math.max(0, Math.min(1, rawProgress));
    };

    const moveCarouselByProgress = (progress) => {
        const swiper = swiperRef.current;

        if (!swiper) {
        return;
        }

        swiper.setProgress(progress, 0);
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();

        setActiveIndex(swiper.activeIndex);
    };

    const handleIndicatorPointerDown = (event) => {
        if (carouselProfiles.length <= 1) {
        return;
        }

        event.preventDefault();

        const indicatorElement = event.currentTarget;

        isDraggingRef.current = true;
        setIsDragging(true);

        indicatorElement.setPointerCapture(event.pointerId);

        const progress = getProgressFromPointer(event, indicatorElement);

        dragProgressRef.current = progress;
        setDragProgress(progress);

        moveCarouselByProgress(progress);
    };

    const handleIndicatorPointerMove = (event) => {
        if (!isDraggingRef.current) {
        return;
        }

        event.preventDefault();

        const progress = getProgressFromPointer(event, event.currentTarget);

        dragProgressRef.current = progress;
        setDragProgress(progress);

        moveCarouselByProgress(progress);
    };

    const finishIndicatorDrag = (event) => {
        if (!isDraggingRef.current) {
        return;
        }

        const indicatorElement = event.currentTarget;

        isDraggingRef.current = false;

        setIsDragging(false);

        const currentProgress = dragProgressRef.current ?? indicatorProgress;

        const nextIndex = Math.round(
        currentProgress * (carouselProfiles.length - 1),
        );

        swiperRef.current?.slideTo(nextIndex, 180);

        setActiveIndex(nextIndex);

        dragProgressRef.current = null;
        setDragProgress(null);

        if (indicatorElement.hasPointerCapture(event.pointerId)) {
        indicatorElement.releasePointerCapture(event.pointerId);
        }
    };

    const handleIndicatorKeyDown = (event) => {
        if (carouselProfiles.length <= 1) {
        return;
        }

        let nextIndex = activeIndex;

        if (event.key === "ArrowLeft") {
        nextIndex = Math.max(activeIndex - 1, 0);
        }

        if (event.key === "ArrowRight") {
        nextIndex = Math.min(activeIndex + 1, carouselProfiles.length - 1);
        }

        if (event.key === "Home") {
        nextIndex = 0;
        }

        if (event.key === "End") {
        nextIndex = carouselProfiles.length - 1;
        }

        if (nextIndex === activeIndex) {
        return;
        }

        event.preventDefault();

        swiperRef.current?.slideTo(nextIndex, 180);

        setActiveIndex(nextIndex);
    };

    if (isLoading) {
        return (
        <main className={styles.container}>
            <div className={styles.pageHeader}>
            <button
                type="button"
                className={styles.backButton}
                onClick={handleBackClick}
                aria-label="이전 화면으로 돌아가기"
            >
                <BackIcon />

                {headerText && <span>{headerText}</span>}
            </button>
            </div>

            <p className={styles.emptyMessage}>프로필을 불러오는 중입니다.</p>
        </main>
        );
    }

    if (errorMessage) {
        return (
        <main className={styles.container}>
            <div className={styles.pageHeader}>
            <button
                type="button"
                className={styles.backButton}
                onClick={handleBackClick}
                aria-label="이전 화면으로 돌아가기"
            >
                <BackIcon />

                {headerText && <span>{headerText}</span>}
            </button>
            </div>

            <p className={styles.emptyMessage}>{errorMessage}</p>
        </main>
        );
    }

    if (carouselProfiles.length === 0) {
        return (
        <main className={styles.container}>
            <div className={styles.pageHeader}>
            <button
                type="button"
                className={styles.backButton}
                onClick={handleBackClick}
                aria-label="이전 화면으로 돌아가기"
            >
                <BackIcon />

                {headerText && <span>{headerText}</span>}
            </button>
            </div>

            <p className={styles.emptyMessage}>해당 목적의 프로필이 없습니다.</p>
        </main>
        );
    }

    return (
        <>
        <main className={styles.container}>
            <div className={styles.pageHeader}>
            <button
                type="button"
                className={styles.backButton}
                onClick={handleBackClick}
                aria-label="이전 화면으로 돌아가기"
            >
                <BackIcon />

                {headerText && <span>{headerText}</span>}
            </button>
            </div>

            <section className={styles.carouselSection}>
            <div className={styles.carouselArea}>
                <button
                type="button"
                className={`${styles.arrowButton} ${styles.leftArrow}`}
                onClick={handlePrevSlide}
                disabled={isFirstSlide}
                aria-label="이전 프로필 보기"
                >
                <ChevronLeftIcon />
                </button>

                <Swiper
                centeredSlides
                slidesPerView="auto"
                initialSlide={initialSlide}
                spaceBetween={20}
                speed={400}
                grabCursor
                watchSlidesProgress
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                onSlideChange={(swiper) => {
                    if (!isDraggingRef.current) {
                    setActiveIndex(swiper.activeIndex);
                    }
                }}
                className={styles.swiper}
                >
                {carouselProfiles.map((profile, index) => (
                    <SwiperSlide
                    key={profile.id}
                    className={styles.slide}
                    onPointerDownCapture={() =>
                        handleSlidePointerDownCapture(index)
                    }
                    onClickCapture={(event) =>
                        handleSlideClickCapture(event, index)
                    }
                    >
                    <ExploreProfileCard
                        profile={{
                        ...profile,
                        isMine: myProfileCardIds.has(
                            String(profile.id),
                        ),
                        }}
                        onClick={(clickedProfileId) =>
                        handleProfileClick(
                            clickedProfileId,
                            index,
                        )
                        }
                    />
                    </SwiperSlide>
                ))}
                </Swiper>

                <button
                type="button"
                className={`${styles.arrowButton} ${styles.rightArrow}`}
                onClick={handleNextSlide}
                disabled={isLastSlide}
                aria-label="다음 프로필 보기"
                >
                <ChevronRightIcon />
                </button>
            </div>

            <div className={styles.actionArea}>
                {!isMyProfileCardsLoading && (
                isActiveProfileMine ? (
                    <span
                    className={styles.exchangedStatus}
                    aria-label="내 프로필 카드"
                    >
                    내 카드
                    </span>
                ) : (
                    <button
                        type="button"
                        className={`${styles.scrapButton} ${
                        isActiveProfileScrapped ? styles.scrapped : ""
                        }`}
                        onClick={handleOpenScrapSheet}
                        disabled={isActiveProfileScrapped}
                        aria-pressed={isActiveProfileScrapped}
                    >
                        <img
                        src={scrapIcon}
                        alt=""
                        className={styles.scrapIcon}
                        />

                        <span>
                        {isActiveProfileScrapped ? "스크랩 완료" : "스크랩"}
                        </span>
                    </button>
                )
                )}
            </div>

            <div className={styles.indicatorContainer}>
                <div
                className={styles.indicator}
                role="slider"
                tabIndex={0}
                aria-label="프로필 카드 이동"
                aria-valuemin={1}
                aria-valuemax={Math.max(carouselProfiles.length, 1)}
                aria-valuenow={activeIndex + 1}
                onPointerDown={handleIndicatorPointerDown}
                onPointerMove={handleIndicatorPointerMove}
                onPointerUp={finishIndicatorDrag}
                onPointerCancel={finishIndicatorDrag}
                onKeyDown={handleIndicatorKeyDown}
                style={{
                    cursor: isDragging ? "grabbing" : "grab",
                }}
                >
                <div
                    className={styles.indicatorThumb}
                    style={{
                    "--indicator-progress": displayedProgress,

                    transition: isDragging ? "none" : undefined,
                    }}
                />
                </div>
            </div>
            </section>
        </main>

        {isScrapSheetOpen && (
            <div
            className={styles.scrapSheetBackdrop}
            onMouseDown={handleCloseScrapSheet}
            >
            <section
                className={styles.scrapSheet}
                role="dialog"
                aria-modal="true"
                aria-labelledby="scrap-sheet-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className={styles.scrapSheetHeader}>
                <h2 id="scrap-sheet-title">
                    {isCreatingDrawer ? "새 서랍 만들기" : "어디에 스크랩할까요?"}
                </h2>

                <button
                    type="button"
                    className={styles.sheetCloseButton}
                    onClick={handleCloseScrapSheet}
                    aria-label="스크랩 선택 닫기"
                >
                    ×
                </button>
                </div>

                {isCreatingDrawer ? (
                <form
                    className={styles.createDrawerForm}
                    onSubmit={handleCreateDrawer}
                >
                    <div className={styles.createDrawerInputHeader}>
                    <label htmlFor="carousel-drawer-name">서랍 이름</label>

                    <span>
                        {newDrawerName.length}
                        /20
                    </span>
                    </div>

                    <input
                    id="carousel-drawer-name"
                    type="text"
                    value={newDrawerName}
                    onChange={(event) => setNewDrawerName(event.target.value)}
                    maxLength={20}
                    placeholder="스크랩 목적, 분류 등을 작성해보세요"
                    autoFocus
                    />

                    <div className={styles.createDrawerActions}>
                    <button
                        type="button"
                        className={styles.cancelCreateButton}
                        onClick={handleCancelCreateDrawer}
                    >
                        취소
                    </button>

                    <button
                        type="submit"
                        className={styles.createDrawerButton}
                        disabled={!newDrawerName.trim()}
                    >
                        만들기
                    </button>
                    </div>
                </form>
                ) : (
                <>
                    {scrapError && (
                    <p
                        role="alert"
                        style={{
                        margin: "0 0 12px",

                        color: "#d92d20",

                        fontSize: "14px",
                        }}
                    >
                        {scrapError}
                    </p>
                    )}

                    <div className={styles.collectionSummary}>
                    <span>컬렉션 {drawers.length}개</span>

                    <button
                        type="button"
                        className={styles.addDrawerButton}
                        onClick={handleOpenCreateDrawer}
                    >
                        서랍 추가
                    </button>
                    </div>

                    <div className={styles.collectionList}>
                    {drawers.length > 0 ? (
                        drawers.map((drawer) => {
                        const selected = selectedDrawerIds.includes(drawer.id);

                        return (
                            <button
                            key={drawer.id}
                            type="button"
                            className={styles.collectionItem}
                            onClick={() => handleToggleDrawer(drawer.id)}
                            aria-pressed={selected}
                            >
                            <span>{drawer.name}</span>

                            <span
                                className={`${styles.selectionIcon} ${
                                selected ? styles.selectedIcon : ""
                                }`}
                                aria-hidden="true"
                            >
                                {selected ? "✓" : "+"}
                            </span>
                            </button>
                        );
                        })
                    ) : (
                        <p
                        style={{
                            margin: 0,
                            color: "#9298ab",
                            fontSize: "14px",
                            textAlign: "center",
                        }}
                        >
                        생성된 서랍이 없습니다. 서랍을 먼저 추가해 주세요.
                        </p>
                    )}
                    </div>

                    <button
                    type="button"
                    className={styles.saveScrapButton}
                    onClick={handleSaveScrap}
                    disabled={isSavingScrap || drawers.length === 0}
                    >
                    {isSavingScrap ? "저장 중..." : "저장"}
                    </button>
                </>
                )}
            </section>
            </div>
        )}

        <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
        />
        </>
    );
    };

    export default ProfileCarouselPage;
