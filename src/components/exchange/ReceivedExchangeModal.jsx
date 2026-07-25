import {
    useEffect,
    useRef,
    useState,
} from "react";

import { createPortal } from "react-dom";

import ExploreProfileCard from "../profile/ExploreProfileCard";

import styles from "./ReceivedExchangeModal.module.css";

const SWIPE_THRESHOLD = 72;
const MAX_DRAG_DISTANCE = 260;
const TRANSITION_DURATION = 260;

const getCardImage = (card) => {
    return (
        card?.profileImage ||
        card?.profileImageUrl ||
        card?.imageUrl ||
        card?.image ||
        ""
    );
};

const getCardName = (request) => {
    return (
        request?.sender?.name ||
        request?.receivedCard?.name ||
        request?.receivedCard?.nickname ||
        request?.rawRequest?.card?.name ||
        request?.rawRequest?.card?.nickname ||
        "알 수 없는 사용자"
    );
};

const getCardJob = (card) => {
    return (
        card?.job ||
        card?.jobType ||
        card?.jobName ||
        card?.jobTypeName ||
        card?.position ||
        card?.occupation ||
        card?.role ||
        "직군 미설정"
    );
};

const getCardAffiliation = (card) => {
    return (
        card?.affiliation ||
        card?.organization ||
        card?.company ||
        card?.school ||
        "소속 미설정"
    );
};

const getDeveloperJobLabel = (value) => {
    const label = String(value || "").trim().toLowerCase();

    if (
        label.includes("frontend") ||
        label.includes("프론트")
    ) {
        return "Frontend Developer";
    }

    if (
        label.includes("backend") ||
        label.includes("백엔드")
    ) {
        return "Backend Developer";
    }

    if (
        label.includes("designer") ||
        label.includes("디자인")
    ) {
        return "Designer";
    }

    if (
        label.includes("planner") ||
        label.includes("기획")
    ) {
        return "Planner";
    }

    return value || "Developer";
};

const normalizeJobValue = (card) => {
    const rawJob = getCardJob(card);

    const normalizedJob = String(rawJob)
        .trim()
        .toLowerCase();

    if (
        normalizedJob === "frontend" ||
        normalizedJob.includes("frontend") ||
        normalizedJob.includes("프론트")
    ) {
        return "frontend";
    }

    if (
        normalizedJob === "backend" ||
        normalizedJob.includes("backend") ||
        normalizedJob.includes("백엔드")
    ) {
        return "backend";
    }

    if (
        normalizedJob === "designer" ||
        normalizedJob.includes("design") ||
        normalizedJob.includes("디자인")
    ) {
        return "designer";
    }

    if (
        normalizedJob === "planner" ||
        normalizedJob.includes("plan") ||
        normalizedJob.includes("기획")
    ) {
        return "planner";
    }

    return rawJob;
};

const getStrengthLabel = (value) => {
    if (!value) {
        return "";
    }

    if (typeof value === "string") {
        return value;
    }

    return value?.title || value?.name || "";
};

const ReceivedExchangeModal = ({
    request,
    onClose,
    onReject,
    onAccept,
}) => {
    const [activeScreen, setActiveScreen] =
        useState("card");

    const [dragOffset, setDragOffset] =
        useState(0);

    const [isDragging, setIsDragging] =
        useState(false);

    const [isLeaving, setIsLeaving] =
        useState(false);

    const [isEntering, setIsEntering] =
        useState(false);

    const [isSwipeHintVisible, setIsSwipeHintVisible] =
        useState(true);

    const dragStartYRef = useRef(null);
    const dragOffsetRef = useRef(0);
    const transitionTimerRef = useRef(null);
    const enterFrameRef = useRef(null);

    const receivedCard =
        request?.receivedCard ||
        request?.rawRequest?.card ||
        {};

    const senderName = getCardName(request);

    const profileImage =
        request?.sender?.profileImage ||
        request?.sender?.profileImageUrl ||
        getCardImage(receivedCard);

    const job = getCardJob(receivedCard);

    const affiliation =
        getCardAffiliation(receivedCard);

    const message =
        request?.message ||
        request?.rawRequest?.message ||
        "전달된 메시지가 없습니다.";

    const requestId =
        request?.id ||
        request?.rawRequest?.id;

    const strengthLabel =
        getStrengthLabel(receivedCard?.strength) ||
        getStrengthLabel(receivedCard?.strengthName) ||
        getStrengthLabel(
            receivedCard?.communicationType,
        ) ||
        getStrengthLabel(
            receivedCard?.communicationTypeName,
        ) ||
        "새로운 연결";

    const exchangeProfile = {
        id:
            receivedCard?.id ||
            receivedCard?.cardId ||
            requestId ||
            "exchange-preview",

        name: senderName,

        job: normalizeJobValue(receivedCard),

        jobTypeName:
            receivedCard?.jobTypeName ||
            receivedCard?.jobName ||
            receivedCard?.position ||
            job,

        affiliationType:
            receivedCard?.affiliationType ||
            receivedCard?.organizationType ||
            "",

        affiliation:
            receivedCard?.affiliation ||
            receivedCard?.organization ||
            receivedCard?.company ||
            receivedCard?.school ||
            "",

        profileImage,

        techStacks:
            receivedCard?.techStacks ||
            receivedCard?.skills ||
            receivedCard?.skillTags ||
            [],

        skills:
            receivedCard?.skills ||
            receivedCard?.skillTags ||
            [],

        interests:
            receivedCard?.interests ||
            receivedCard?.interestTags ||
            receivedCard?.interestAreas ||
            [],

        representativeExperience:
            receivedCard?.representativeExperience ||
            null,

        representativeExperienceTitle:
            receivedCard
                ?.representativeExperienceTitle ||
            receivedCard?.experienceTitle ||
            receivedCard?.projectTitle ||
            "대표 경험이 없습니다.",

        representativeExperienceDescription:
            receivedCard
                ?.representativeExperienceDescription ||
            receivedCard?.experienceDescription ||
            receivedCard?.projectDescription ||
            receivedCard?.introduction ||
            receivedCard?.bio ||
            receivedCard?.description ||
            receivedCard?.summary ||
            "아직 등록된 대표 경험이 없어요.",

        strength:
            typeof receivedCard?.strength ===
            "object"
                ? receivedCard.strength
                : {
                      title: strengthLabel,
                      icon:
                          receivedCard
                              ?.strengthIcon ||
                          receivedCard
                              ?.strengthImageUrl ||
                          receivedCard
                              ?.communicationTypeIcon ||
                          "",
                  },

        cardImageUrl:
            receivedCard?.cardImageUrl ||
            receivedCard?.cardImage ||
            receivedCard?.backgroundImageUrl ||
            receivedCard?.backgroundImage ||
            "",
    };

    useEffect(() => {
        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose?.();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );

            if (transitionTimerRef.current) {
                window.clearTimeout(
                    transitionTimerRef.current,
                );
            }

            if (enterFrameRef.current) {
                window.cancelAnimationFrame(
                    enterFrameRef.current,
                );
            }
        };
    }, [onClose]);

    useEffect(() => {
        const hintTimer = window.setTimeout(() => {
            setIsSwipeHintVisible(false);
        }, 2200);

        return () => {
            window.clearTimeout(hintTimer);
        };
    }, []);

    const handleReject = () => {
        if (!requestId) {
            window.alert(
                "교환 요청 정보를 확인할 수 없습니다.",
            );

            return;
        }

        onReject?.(requestId);
    };

    const handleAccept = () => {
        if (!requestId) {
            window.alert(
                "교환 요청 정보를 확인할 수 없습니다.",
            );

            return;
        }

        onAccept?.(requestId);
    };

    const resetDrag = () => {
        dragStartYRef.current = null;
        dragOffsetRef.current = 0;

        setDragOffset(0);
        setIsDragging(false);
    };

    const moveToNextScreen = () => {
        if (isLeaving) {
            return;
        }

        setIsDragging(false);
        setIsLeaving(true);
        setDragOffset(0);

        transitionTimerRef.current =
            window.setTimeout(() => {
                setActiveScreen((currentScreen) =>
                    currentScreen === "card"
                        ? "message"
                        : "card",
                );

                setIsLeaving(false);
                setIsEntering(true);

                enterFrameRef.current =
                    window.requestAnimationFrame(() => {
                        enterFrameRef.current =
                            window.requestAnimationFrame(
                                () => {
                                    setIsEntering(false);
                                },
                            );
                    });
            }, TRANSITION_DURATION);
    };

    const handlePointerDown = (event) => {
        if (isLeaving || isEntering) {
            return;
        }

        dragStartYRef.current = event.clientY;
        dragOffsetRef.current = 0;

        setIsDragging(true);
        setIsSwipeHintVisible(false);

        event.currentTarget.setPointerCapture?.(
            event.pointerId,
        );
    };

    const handlePointerMove = (event) => {
        if (
            dragStartYRef.current === null ||
            isLeaving
        ) {
            return;
        }

        const difference =
            event.clientY -
            dragStartYRef.current;

        /*
         * 아래 방향 스와이프는 사용하지 않는다.
         * 손가락이 아래로 움직이면 화면은 제자리에서
         * 아주 약하게만 저항하고 전환되지 않는다.
         */
        const nextOffset =
            difference < 0
                ? Math.max(
                      -MAX_DRAG_DISTANCE,
                      difference,
                  )
                : 0;

        dragOffsetRef.current = nextOffset;
        setDragOffset(nextOffset);
    };

    const handlePointerUp = (event) => {
        if (dragStartYRef.current === null) {
            return;
        }

        event.currentTarget.releasePointerCapture?.(
            event.pointerId,
        );

        const shouldMove =
            dragOffsetRef.current <=
            -SWIPE_THRESHOLD;

        dragStartYRef.current = null;
        dragOffsetRef.current = 0;

        if (shouldMove) {
            moveToNextScreen();
            return;
        }

        setDragOffset(0);
        setIsDragging(false);
    };

    const handlePointerCancel = (event) => {
        event.currentTarget.releasePointerCapture?.(
            event.pointerId,
        );

        resetDrag();
    };

    const handleBackdropClick = (event) => {
        if (
            event.target ===
            event.currentTarget
        ) {
            onClose?.();
        }
    };

    const screenClassName = [
        styles.screen,
        isDragging ? styles.dragging : "",
        isLeaving ? styles.leaving : "",
        isEntering ? styles.entering : "",
    ]
        .filter(Boolean)
        .join(" ");

    const screenStyle = isDragging
        ? {
              transform: `translateY(${dragOffset}px)`,
          }
        : undefined;

    return createPortal(
        <div
            className={styles.modalOverlay}
            role="presentation"
            onMouseDown={handleBackdropClick}
        >
            <section
                className={styles.modalContainer}
                role="dialog"
                aria-modal="true"
                aria-labelledby="received-exchange-title"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                <header className={styles.header}>
                    <div>
                        <h1
                            id="received-exchange-title"
                            className={styles.title}
                        >
                            {senderName}님과 카드를
                            교환하고 싶어해요
                        </h1>

                        <p
                            className={
                                styles.description
                            }
                        >
                            교환 요청을 수락하면 서로의
                            보관함에
                            <br />
                            상대의 카드가 보관돼요.
                        </p>
                    </div>

                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="닫기"
                    >
                        ×
                    </button>
                </header>

                <div className={styles.content}>
                    <div
                        className={styles.viewport}
                    >
                        <div
                            className={screenClassName}
                            style={screenStyle}
                            onPointerDown={
                                handlePointerDown
                            }
                            onPointerMove={
                                handlePointerMove
                            }
                            onPointerUp={
                                handlePointerUp
                            }
                            onPointerCancel={
                                handlePointerCancel
                            }
                        >
                            {activeScreen ===
                            "card" ? (
                                <div
                                    className={
                                        styles.cardScreen
                                    }
                                >
                                    <div
                                        className={
                                            styles.exchangeCardPreview
                                        }
                                    >
                                        <ExploreProfileCard
                                            profile={
                                                exchangeProfile
                                            }
                                        />
                                    </div>

                                    <span
                                        className={`${
                                            styles.swipeGuide
                                        } ${
                                            isSwipeHintVisible
                                                ? ""
                                                : styles.swipeGuideHidden
                                        }`}
                                        aria-hidden="true"
                                    >
                                        위로 밀어 쪽지를
                                        확인해보세요
                                    </span>
                                </div>
                            ) : (
                                <div
                                    className={
                                        styles.messageScreen
                                    }
                                >
                                    <p
                                        className={
                                            styles.messageJob
                                        }
                                    >
                                        {getDeveloperJobLabel(job)}
                                    </p>

                                    <div
                                        className={
                                            styles.messageProfile
                                        }
                                    >
                                        <div
                                            className={
                                                styles.messageProfileImageWrapper
                                            }
                                        >
                                            {profileImage ? (
                                                <img
                                                    src={
                                                        profileImage
                                                    }
                                                    alt={`${senderName} 프로필`}
                                                    className={
                                                        styles.messageProfileImage
                                                    }
                                                />
                                            ) : (
                                                <span
                                                    className={
                                                        styles.messageProfileFallback
                                                    }
                                                >
                                                    {senderName
                                                        .slice(
                                                            0,
                                                            1,
                                                        )
                                                        .toUpperCase()}
                                                </span>
                                            )}
                                        </div>

                                        <div
                                            className={
                                                styles.messageProfileInfo
                                            }
                                        >
                                            <strong>
                                                {
                                                    senderName
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    affiliation
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className={
                                            styles.messageBox
                                        }
                                    >
                                        {message}
                                    </div>

                                    <span
                                        className={
                                            styles.messageSwipeGuide
                                        }
                                        aria-hidden="true"
                                    >
                                        위로 밀어 카드를
                                        확인해보세요
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <footer className={styles.footer}>
                    <button
                        type="button"
                        className={
                            styles.rejectButton
                        }
                        onClick={handleReject}
                    >
                        거절
                    </button>

                    <button
                        type="button"
                        className={
                            styles.acceptButton
                        }
                        onClick={handleAccept}
                    >
                        수락하기
                    </button>
                </footer>
            </section>
        </div>,
        document.body,
    );
};

export default ReceivedExchangeModal;
