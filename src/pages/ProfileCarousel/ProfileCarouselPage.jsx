import { useRef, useState } from "react";
import {
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import LoginModal from "../../components/common/LoginModal/LoginModal";
import ExploreProfileCard from "../../components/profile/ExploreProfileCard";

import { isLoggedIn } from "../../utils/auth";

import profiles from "../../mocks/profiles";

import scrapIcon from "../../assets/icons/icon_archived.svg";

import styles from "./ProfileCarouselPage.module.css";

const PURPOSE_HEADER_TEXT = {
    "팀 빌딩": "팀을 찾고 있어요",
    커피챗: "커피챗 나눠요",
    "교류/네트워킹": "새로운 만남을 찾아요",
};

const ChevronLeftIcon = () => {
    return (
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
};

const ChevronRightIcon = () => {
    return (
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
};

const BackIcon = () => {
    return (
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
};

const ProfileCarouselPage = () => {
    const navigate = useNavigate();

    const { profileId } = useParams();
    const [searchParams] = useSearchParams();

    const swiperRef = useRef(null);

    const isDraggingRef = useRef(false);
    const dragProgressRef = useRef(null);

    /*
     * 전체보기에서 넘어오면 purpose는 null이다.
     * 다른 탭에서 넘어오면 해당 탭 이름이 들어온다.
     */
    const purpose = searchParams.get("purpose");

    /*
     * 전체보기에서는 빈 문자열이 되므로
     * 이전 버튼 옆에 문구가 표시되지 않는다.
     */
    const headerText =
        PURPOSE_HEADER_TEXT[purpose] ?? "";

    /*
     * 탐색 화면에서 선택한 목적에 해당하는
     * 프로필만 캐러셀에 표시한다.
     */
    const carouselProfiles = purpose
        ? profiles.filter((profile) =>
              (profile.purposes || []).includes(
                  purpose,
              ),
          )
        : profiles;

    /*
     * 탐색 화면에서 클릭한 프로필의
     * 필터링된 배열 내부 위치를 찾는다.
     */
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

    const [
        isLoginModalOpen,
        setIsLoginModalOpen,
    ] = useState(false);

    const [dragProgress, setDragProgress] =
        useState(null);

    /*
     * 현재는 새로고침하면 초기화되는
     * 임시 스크랩 상태다.
     */
    const [
        scrappedProfileIds,
        setScrappedProfileIds,
    ] = useState([]);

    const activeProfile =
        carouselProfiles[activeIndex];

    const isFirstSlide = activeIndex === 0;

    const isLastSlide =
        activeIndex ===
        carouselProfiles.length - 1;

    const isActiveProfileScrapped =
        activeProfile
            ? scrappedProfileIds.includes(
                  activeProfile.id,
              )
            : false;

    /*
     * 현재 카드의 위치를
     * 0부터 1 사이의 값으로 변환한다.
     */
    const indicatorProgress =
        carouselProfiles.length <= 1
            ? 0
            : activeIndex /
              (carouselProfiles.length - 1);

    /*
     * 드래그 중에는 포인터의 위치를 사용하고,
     * 드래그 중이 아니면 현재 카드 위치를 사용한다.
     */
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
         * 로그인하지 않은 상태에서는
         * 상세 프로필 대신 로그인 모달을 표시한다.
         */
        if (!isLoggedIn()) {
            setIsLoginModalOpen(true);
            return;
        }

        /*
         * 로그인한 상태에서는
         * 선택한 프로필의 상세 페이지로 이동한다.
         */
        navigate(
            `/profile/${clickedProfileId}`,
        );
    };


    const handlePrevSlide = () => {
        swiperRef.current?.slidePrev();
    };


    const handleNextSlide = () => {
        swiperRef.current?.slideNext();
    };


    const handleScrapClick = () => {
        if (!activeProfile) {
            return;
        }

        setScrappedProfileIds(
            (previousIds) => {
                const isAlreadyScrapped =
                    previousIds.includes(
                        activeProfile.id,
                    );

                if (isAlreadyScrapped) {
                    return previousIds.filter(
                        (savedProfileId) =>
                            savedProfileId !==
                            activeProfile.id,
                    );
                }

                return [
                    ...previousIds,
                    activeProfile.id,
                ];
            },
        );
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

        /*
         * 카드 단위로 끊기지 않고
         * 드래그 위치에 맞춰 연속으로 이동한다.
         */
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

        const indicatorElement =
            event.currentTarget;

        const progress =
            getProgressFromPointer(
                event,
                indicatorElement,
            );

        dragProgressRef.current = progress;
        setDragProgress(progress);

        moveCarouselByProgress(progress);
    };


    const finishIndicatorDrag = (
        event,
    ) => {
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

        /*
         * 포인터를 놓은 위치에서 가장 가까운
         * 프로필 카드의 index를 계산한다.
         */
        const nextIndex = Math.round(
            currentProgress *
                (carouselProfiles.length - 1),
        );

        /*
         * 가장 가까운 카드의 중앙으로
         * 빠르게 정렬한다.
         */
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

    if (carouselProfiles.length === 0) {
        return (
            <main className={styles.container}>
                <div
                    className={styles.pageHeader}
                >
                    <button
                        type="button"
                        className={
                            styles.backButton
                        }
                        onClick={handleBackClick}
                        aria-label="이전 화면으로 돌아가기"
                    >
                        <BackIcon />

                        {headerText && (
                            <span>
                                {headerText}
                            </span>
                        )}
                    </button>
                </div>

                <p
                    className={
                        styles.emptyMessage
                    }
                >
                    해당 목적의 프로필이
                    없습니다.
                </p>
            </main>
        );
    }

    return (
        <>
            <main
                className={styles.container}
            >
                {/* 상단 이전 버튼과 문구 */}

                <div
                    className={styles.pageHeader}
                >
                    <button
                        type="button"
                        className={
                            styles.backButton
                        }
                        onClick={handleBackClick}
                        aria-label="이전 화면으로 돌아가기"
                    >
                        <BackIcon />

                        {headerText && (
                            <span>
                                {headerText}
                            </span>
                        )}
                    </button>
                </div>

                {/* 프로필 카드 캐러셀 */}

                <section
                    className={
                        styles.carouselSection
                    }
                >
                    <div
                        className={
                            styles.carouselArea
                        }
                    >
                        <button
                            type="button"
                            className={`${styles.arrowButton} ${styles.leftArrow}`}
                            onClick={
                                handlePrevSlide
                            }
                            disabled={
                                isFirstSlide
                            }
                            aria-label="이전 프로필 보기"
                        >
                            <ChevronLeftIcon />
                        </button>

                        <Swiper
                            centeredSlides
                            slidesPerView="auto"
                            initialSlide={
                                initialSlide
                            }
                            spaceBetween={60}
                            speed={400}
                            grabCursor
                            slideToClickedSlide
                            watchSlidesProgress
                            onSwiper={(swiper) => {
                                swiperRef.current =
                                    swiper;
                            }}
                            onSlideChange={(
                                swiper,
                            ) => {
                                if (
                                    !isDraggingRef.current
                                ) {
                                    setActiveIndex(
                                        swiper.activeIndex,
                                    );
                                }
                            }}
                            className={
                                styles.swiper
                            }
                        >
                            {carouselProfiles.map(
                                (profile) => (
                                    <SwiperSlide
                                        key={
                                            profile.id
                                        }
                                        className={
                                            styles.slide
                                        }
                                    >
                                        <ExploreProfileCard
                                            profile={
                                                profile
                                            }
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
                            onClick={
                                handleNextSlide
                            }
                            disabled={isLastSlide}
                            aria-label="다음 프로필 보기"
                        >
                            <ChevronRightIcon />
                        </button>
                    </div>

                    {/* 스크랩 버튼 */}

                    <div
                        className={
                            styles.actionArea
                        }
                    >
                        <button
                            type="button"
                            className={`${
                                styles.scrapButton
                            } ${
                                isActiveProfileScrapped
                                    ? styles.scrapped
                                    : ""
                            }`}
                            onClick={
                                handleScrapClick
                            }
                            aria-pressed={
                                isActiveProfileScrapped
                            }
                        >
                            <img
                                src={scrapIcon}
                                alt=""
                                className={
                                    styles.scrapIcon
                                }
                            />

                            <span>
                                {isActiveProfileScrapped
                                    ? "스크랩됨"
                                    : "스크랩"}
                            </span>
                        </button>
                    </div>

                    {/* 드래그형 인디케이터 */}

                    <div
                        className={
                            styles.indicatorContainer
                        }
                    >
                        <div
                            className={
                                styles.indicator
                            }
                            role="slider"
                            tabIndex={0}
                            aria-label="프로필 카드 이동"
                            aria-valuemin={1}
                            aria-valuemax={Math.max(
                                carouselProfiles.length,
                                1,
                            )}
                            aria-valuenow={
                                activeIndex + 1
                            }
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
                                    transition:
                                        isDragging
                                            ? "none"
                                            : undefined,
                                }}
                            />
                        </div>
                    </div>
                </section>
            </main>

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