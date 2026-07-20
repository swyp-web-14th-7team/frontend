    import { useRef, useState } from "react";
    import {
    useNavigate,
    useParams,
    useSearchParams,
    } from "react-router-dom";

    import {
    Swiper,
    SwiperSlide,
    } from "swiper/react";

    import "swiper/css";

    import LoginModal from "../../components/common/LoginModal/LoginModal";
    import ExploreProfileCard from "../../components/profile/ExploreProfileCard";

import usePublicProfiles from "../../hooks/usePublicProfiles";

    import scrapIcon from "../../assets/icons/icon_archived.svg";

    import styles from "./ProfileCarouselPage.module.css";

    const PURPOSE_HEADER_TEXT = {
    "팀 빌딩": "팀을 찾고 있어요",
    커피챗: "커피챗 나눠요",
    "교류/네트워킹":
        "새로운 만남을 찾아요",
    };

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

    const ProfileCarouselPage = ({
    drawers = [],
    setDrawers,
    }) => {
    const navigate = useNavigate();

    const { profileId } = useParams();
    const [searchParams] = useSearchParams();

    const {
    profiles,
    isLoading,
    errorMessage,
} = usePublicProfiles();

    const swiperRef = useRef(null);
    const isDraggingRef = useRef(false);
    const dragProgressRef = useRef(null);

    const purpose = searchParams.get("purpose");

    const headerText =
        PURPOSE_HEADER_TEXT[purpose] ?? "";

    /*
    * 목적 탭 API 데이터가 완성될 때까지
    * 전체 공개 프로필을 표시한다.
    */
    const carouselProfiles =
        profiles;

    const selectedIndex =
        carouselProfiles.findIndex(
        (profile) =>
            String(profile.id) ===
            String(profileId),
        );

    const initialSlide =
        selectedIndex >= 0 ? selectedIndex : 0;

    const [activeIndex, setActiveIndex] =
        useState(initialSlide);

    const [isDragging, setIsDragging] =
        useState(false);

    const [dragProgress, setDragProgress] =
        useState(null);

    const [
        isLoginModalOpen,
        setIsLoginModalOpen,
    ] = useState(false);

    const [
        isScrapSheetOpen,
        setIsScrapSheetOpen,
    ] = useState(false);

    const [
        selectedDrawerIds,
        setSelectedDrawerIds,
    ] = useState([]);

    const [
        isCreatingDrawer,
        setIsCreatingDrawer,
    ] = useState(false);

    const [newDrawerName, setNewDrawerName] =
        useState("");

    const activeProfile =
        carouselProfiles[activeIndex];

    const isFirstSlide = activeIndex === 0;

    const isLastSlide =
        activeIndex ===
        carouselProfiles.length - 1;

    const isActiveProfileScrapped =
        activeProfile
        ? drawers.some((drawer) =>
            drawer.profiles.some(
                (profile) =>
                profile.id === activeProfile.id,
            ),
            )
        : false;

    const indicatorProgress =
        carouselProfiles.length <= 1
        ? 0
        : activeIndex /
            (carouselProfiles.length - 1);

    const displayedProgress =
        dragProgress !== null
        ? dragProgress
        : indicatorProgress;

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleProfileClick = (
        clickedProfileId,
    ) => {
        /*
        * TODO: 소셜 로그인 API 연결 후
        * 로그인 검사를 다시 적용합니다.
        */

        navigate(`/profile/${clickedProfileId}`);
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
        * TODO: 소셜 로그인 API 연결 후
        * 아래 로그인 검사를 다시 활성화합니다.
        *
        * if (!isLoggedIn()) {
        *   setIsLoginModalOpen(true);
        *   return;
        * }
        */

        const savedDrawerIds = drawers
        .filter((drawer) =>
            drawer.profiles.some(
            (profile) =>
                profile.id === activeProfile.id,
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
        setSelectedDrawerIds(
        (previousDrawerIds) => {
            if (
            previousDrawerIds.includes(drawerId)
            ) {
            return previousDrawerIds.filter(
                (id) => id !== drawerId,
            );
            }

            return [
            ...previousDrawerIds,
            drawerId,
            ];
        },
        );
    };

    const handleSaveScrap = () => {
        if (
        !activeProfile ||
        typeof setDrawers !== "function"
        ) {
        return;
        }

        setDrawers((previousDrawers) =>
        previousDrawers.map((drawer) => {
            const shouldContainProfile =
            selectedDrawerIds.includes(
                drawer.id,
            );

            const alreadyContainsProfile =
            drawer.profiles.some(
                (profile) =>
                profile.id === activeProfile.id,
            );

            if (
            shouldContainProfile &&
            !alreadyContainsProfile
            ) {
            return {
                ...drawer,

                profiles: [
                ...drawer.profiles,
                activeProfile,
                ],
            };
            }

            if (
            !shouldContainProfile &&
            alreadyContainsProfile
            ) {
            return {
                ...drawer,

                profiles:
                drawer.profiles.filter(
                    (profile) =>
                    profile.id !==
                    activeProfile.id,
                ),
            };
            }

            return drawer;
        }),
        );

        handleCloseScrapSheet();
    };

    const handleOpenCreateDrawer = () => {
        setNewDrawerName("");
        setIsCreatingDrawer(true);
    };

    const handleCancelCreateDrawer = () => {
        setNewDrawerName("");
        setIsCreatingDrawer(false);
    };

    const handleCreateDrawer = (event) => {
        event.preventDefault();

        const trimmedName =
        newDrawerName.trim();

        if (
        !trimmedName ||
        typeof setDrawers !== "function"
        ) {
        return;
        }

        const newDrawerId = Date.now();

        setDrawers((previousDrawers) => [
        ...previousDrawers,
        {
            id: newDrawerId,
            name: trimmedName,
            profiles: [],
        },
        ]);

        /*
        * 새로 생성한 서랍을 자동 선택합니다.
        */
        setSelectedDrawerIds(
        (previousDrawerIds) => [
            ...previousDrawerIds,
            newDrawerId,
        ],
        );

        setNewDrawerName("");
        setIsCreatingDrawer(false);
    };

    const getProgressFromPointer = (
        event,
        indicatorElement,
    ) => {
        const rect =
        indicatorElement.getBoundingClientRect();

        const pointerX =
        event.clientX - rect.left;

        const rawProgress =
        pointerX / rect.width;

        return Math.max(
        0,
        Math.min(1, rawProgress),
        );
    };

    const moveCarouselByProgress = (
        progress,
    ) => {
        const swiper = swiperRef.current;

        if (!swiper) {
        return;
        }

        swiper.setProgress(progress, 0);
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();

        setActiveIndex(swiper.activeIndex);
    };

    const handleIndicatorPointerDown = (
        event,
    ) => {
        if (carouselProfiles.length <= 1) {
        return;
        }

        event.preventDefault();

        const indicatorElement =
        event.currentTarget;

        isDraggingRef.current = true;
        setIsDragging(true);

        indicatorElement.setPointerCapture(
        event.pointerId,
        );

        const progress =
        getProgressFromPointer(
            event,
            indicatorElement,
        );

        dragProgressRef.current = progress;
        setDragProgress(progress);

        moveCarouselByProgress(progress);
    };

    const handleIndicatorPointerMove = (
        event,
    ) => {
        if (!isDraggingRef.current) {
        return;
        }

        event.preventDefault();

        const progress =
        getProgressFromPointer(
            event,
            event.currentTarget,
        );

        dragProgressRef.current = progress;
        setDragProgress(progress);

        moveCarouselByProgress(progress);
    };

    const finishIndicatorDrag = (event) => {
        if (!isDraggingRef.current) {
        return;
        }

        const indicatorElement =
        event.currentTarget;

        isDraggingRef.current = false;
        setIsDragging(false);

        const currentProgress =
        dragProgressRef.current ??
        indicatorProgress;

        const nextIndex = Math.round(
        currentProgress *
            (carouselProfiles.length - 1),
        );

        swiperRef.current?.slideTo(
        nextIndex,
        180,
        );

        setActiveIndex(nextIndex);

        dragProgressRef.current = null;
        setDragProgress(null);

        if (
        indicatorElement.hasPointerCapture(
            event.pointerId,
        )
        ) {
        indicatorElement.releasePointerCapture(
            event.pointerId,
        );
        }
    };

    const handleIndicatorKeyDown = (
        event,
    ) => {
        if (carouselProfiles.length <= 1) {
        return;
        }

        let nextIndex = activeIndex;

        if (event.key === "ArrowLeft") {
        nextIndex = Math.max(
            activeIndex - 1,
            0,
        );
        }

        if (event.key === "ArrowRight") {
        nextIndex = Math.min(
            activeIndex + 1,
            carouselProfiles.length - 1,
        );
        }

        if (event.key === "Home") {
        nextIndex = 0;
        }

        if (event.key === "End") {
        nextIndex =
            carouselProfiles.length - 1;
        }

        if (nextIndex === activeIndex) {
        return;
        }

        event.preventDefault();

        swiperRef.current?.slideTo(
        nextIndex,
        180,
        );

        setActiveIndex(nextIndex);
    };

    if (isLoading) {
    return (
        <main
            className={
                styles.container
            }
        >
            <div
                className={
                    styles.pageHeader
                }
            >
                <button
                    type="button"
                    className={
                        styles.backButton
                    }
                    onClick={
                        handleBackClick
                    }
                    aria-label="이전 화면으로 돌아가기"
                >
                    <BackIcon />
                </button>
            </div>

            <p
                className={
                    styles.emptyMessage
                }
            >
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
                styles.container
            }
        >
            <div
                className={
                    styles.pageHeader
                }
            >
                <button
                    type="button"
                    className={
                        styles.backButton
                    }
                    onClick={
                        handleBackClick
                    }
                    aria-label="이전 화면으로 돌아가기"
                >
                    <BackIcon />
                </button>
            </div>

            <p
                className={
                    styles.emptyMessage
                }
            >
                {errorMessage}
            </p>
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

                {headerText && (
                <span>{headerText}</span>
                )}
            </button>
            </div>

            <p className={styles.emptyMessage}>
            해당 목적의 프로필이 없습니다.
            </p>
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

                {headerText && (
                <span>{headerText}</span>
                )}
            </button>
            </div>

            <section
            className={styles.carouselSection}
            >
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
                spaceBetween={60}
                speed={400}
                grabCursor
                slideToClickedSlide
                watchSlidesProgress
                onSwiper={(swiper) => {
                    swiperRef.current =
                        swiper;

                    swiper.slideTo(
                        initialSlide,
                        0,
                    );

                    setActiveIndex(
                        initialSlide,
                    );
                }}
                onSlideChange={(swiper) => {
                    if (
                    !isDraggingRef.current
                    ) {
                    setActiveIndex(
                        swiper.activeIndex,
                    );
                    }
                }}
                className={styles.swiper}
                >
                {carouselProfiles.map(
                    (profile) => (
                    <SwiperSlide
                        key={profile.id}
                        className={styles.slide}
                    >
                        <ExploreProfileCard
                        profile={profile}
                        onClick={
                            handleProfileClick
                        }
                        />
                    </SwiperSlide>
                    ),
                )}
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
                <button
                type="button"
                className={`${styles.scrapButton} ${
                    isActiveProfileScrapped
                    ? styles.scrapped
                    : ""
                }`}
                onClick={handleOpenScrapSheet}
                aria-pressed={
                    isActiveProfileScrapped
                }
                >
                <img
                    src={scrapIcon}
                    alt=""
                    className={styles.scrapIcon}
                />

                <span>
                    {isActiveProfileScrapped
                    ? "스크랩됨"
                    : "스크랩"}
                </span>
                </button>
            </div>

            <div
                className={
                styles.indicatorContainer
                }
            >
                <div
                className={styles.indicator}
                role="slider"
                tabIndex={0}
                aria-label="프로필 카드 이동"
                aria-valuemin={1}
                aria-valuemax={Math.max(
                    carouselProfiles.length,
                    1,
                )}
                aria-valuenow={activeIndex + 1}
                onPointerDown={
                    handleIndicatorPointerDown
                }
                onPointerMove={
                    handleIndicatorPointerMove
                }
                onPointerUp={
                    finishIndicatorDrag
                }
                onPointerCancel={
                    finishIndicatorDrag
                }
                onKeyDown={
                    handleIndicatorKeyDown
                }
                style={{
                    cursor: isDragging
                    ? "grabbing"
                    : "grab",
                }}
                >
                <div
                    className={
                    styles.indicatorThumb
                    }
                    style={{
                    "--indicator-progress":
                        displayedProgress,

                    transition: isDragging
                        ? "none"
                        : undefined,
                    }}
                />
                </div>
            </div>
            </section>
        </main>

        {isScrapSheetOpen && (
            <div
            className={
                styles.scrapSheetBackdrop
            }
            onMouseDown={
                handleCloseScrapSheet
            }
            >
            <section
                className={styles.scrapSheet}
                role="dialog"
                aria-modal="true"
                aria-labelledby="scrap-sheet-title"
                onMouseDown={(event) =>
                event.stopPropagation()
                }
            >
                <div
                className={
                    styles.scrapSheetHeader
                }
                >
                <h2 id="scrap-sheet-title">
                    {isCreatingDrawer
                    ? "새 서랍 만들기"
                    : "어디에 스크랩할까요?"}
                </h2>

                <button
                    type="button"
                    className={
                    styles.sheetCloseButton
                    }
                    onClick={
                    handleCloseScrapSheet
                    }
                    aria-label="스크랩 선택 닫기"
                >
                    ×
                </button>
                </div>

                {isCreatingDrawer ? (
                <form
                    className={
                    styles.createDrawerForm
                    }
                    onSubmit={handleCreateDrawer}
                >
                    <div
                    className={
                        styles.createDrawerInputHeader
                    }
                    >
                    <label htmlFor="carousel-drawer-name">
                        서랍 이름
                    </label>

                    <span>
                        {newDrawerName.length}/20
                    </span>
                    </div>

                    <input
                    id="carousel-drawer-name"
                    type="text"
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

                    <div
                    className={
                        styles.createDrawerActions
                    }
                    >
                    <button
                        type="button"
                        className={
                        styles.cancelCreateButton
                        }
                        onClick={
                        handleCancelCreateDrawer
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
                ) : (
                <>
                    <div
                    className={
                        styles.collectionSummary
                    }
                    >
                    <span>
                        컬렉션 {drawers.length}개
                    </span>

                    <button
                        type="button"
                        className={
                        styles.addDrawerButton
                        }
                        onClick={
                        handleOpenCreateDrawer
                        }
                    >
                        서랍 추가
                    </button>
                    </div>

                    <div
                    className={
                        styles.collectionList
                    }
                    >
                    {drawers.map((drawer) => {
                        const selected =
                        selectedDrawerIds.includes(
                            drawer.id,
                        );

                        return (
                        <button
                            key={drawer.id}
                            type="button"
                            className={
                            styles.collectionItem
                            }
                            onClick={() =>
                            handleToggleDrawer(
                                drawer.id,
                            )
                            }
                            aria-pressed={selected}
                        >
                            <span>
                            {drawer.name}
                            </span>

                            <span
                            className={`${
                                styles.selectionIcon
                            } ${
                                selected
                                ? styles.selectedIcon
                                : ""
                            }`}
                            aria-hidden="true"
                            >
                            {selected
                                ? "✓"
                                : "+"}
                            </span>
                        </button>
                        );
                    })}
                    </div>

                    <button
                    type="button"
                    className={
                        styles.saveScrapButton
                    }
                    onClick={handleSaveScrap}
                    >
                    저장
                    </button>
                </>
                )}
            </section>
            </div>
        )}

        <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() =>
            setIsLoginModalOpen(false)
            }
        />
        </>
    );
    };

    export default ProfileCarouselPage;