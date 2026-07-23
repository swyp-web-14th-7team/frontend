import {
    useRef,
    useState,
} from "react";

import ExploreProfileCard from "../profile/ExploreProfileCard";

import styles from "./ReceivedExchangeModal.module.css";

const SWIPE_DISTANCE = 40;

const ReceivedExchangeModal = ({
    request,
    onClose,
    onReject,
    onAccept,
}) => {
    const [view, setView] =
        useState("card");

    const gestureRef = useRef({
        pointerId: null,
        startY: 0,
        currentY: 0,
    });

    if (!request) {
        return null;
    }

    const canSwipe =
        view === "card" ||
        view === "message";

    const showMessage = () => {
        setView("message");
    };

    const showCard = () => {
        setView("card");
    };

    const resetGesture = () => {
        gestureRef.current = {
            pointerId: null,
            startY: 0,
            currentY: 0,
        };
    };

    const handlePointerDown = (
        event,
    ) => {
        if (!canSwipe) {
            return;
        }

        gestureRef.current = {
            pointerId: event.pointerId,
            startY: event.clientY,
            currentY: event.clientY,
        };

        event.currentTarget.setPointerCapture?.(
            event.pointerId,
        );
    };

    const handlePointerMove = (
        event,
    ) => {
        if (
            gestureRef.current
                .pointerId !==
            event.pointerId
        ) {
            return;
        }

        gestureRef.current.currentY =
            event.clientY;
    };

    const handlePointerUp = (
        event,
    ) => {
        if (
            gestureRef.current
                .pointerId !==
            event.pointerId
        ) {
            return;
        }

        const distance =
            gestureRef.current.currentY -
            gestureRef.current.startY;

        if (
            event.currentTarget
                .hasPointerCapture?.(
                    event.pointerId,
                )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId,
            );
        }

        resetGesture();

        if (
            view === "card" &&
            distance <= -SWIPE_DISTANCE
        ) {
            showMessage();
            return;
        }

        if (
            view === "message" &&
            distance >= SWIPE_DISTANCE
        ) {
            showCard();
        }
    };

    const handlePointerCancel = (
        event,
    ) => {
        if (
            event.currentTarget
                .hasPointerCapture?.(
                    event.pointerId,
                )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId,
            );
        }

        resetGesture();
    };

    const handleWheel = (event) => {
        if (!canSwipe) {
            return;
        }

        if (
            view === "card" &&
            event.deltaY > 20
        ) {
            showMessage();
            return;
        }

        if (
            view === "message" &&
            event.deltaY < -20
        ) {
            showCard();
        }
    };

    const handleAccept = () => {
        onAccept?.(request.id);
    };

    const handleSecondaryAction = () => {
        onReject?.(request.id);
    };

    return (
        <div
            className={styles.backdrop}
            role="presentation"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose?.();
                }
            }}
        >
            <section
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="received-exchange-title"
            >
                <header
                    className={
                        styles.modalHeader
                    }
                >
                    <div>
                        <h2 id="received-exchange-title">
                            {request.sender.name}님이
                            카드 교환을 요청했어요
                        </h2>

                        <p>
                            교환 요청을 수락하면 서로의
                            보관함에 상대의 카드가 보관돼요.
                        </p>
                    </div>

                    <button
                        type="button"
                        className={
                            styles.closeButton
                        }
                        onClick={onClose}
                        aria-label="교환 요청 닫기"
                    >
                        ×
                    </button>
                </header>

                <div
                    className={`${styles.content} ${
                        canSwipe
                            ? styles.swipeContent
                            : ""
                    }`}
                    onPointerDown={
                        canSwipe
                            ? handlePointerDown
                            : undefined
                    }
                    onPointerMove={
                        canSwipe
                            ? handlePointerMove
                            : undefined
                    }
                    onPointerUp={
                        canSwipe
                            ? handlePointerUp
                            : undefined
                    }
                    onPointerCancel={
                        canSwipe
                            ? handlePointerCancel
                            : undefined
                    }
                    onWheel={
                        canSwipe
                            ? handleWheel
                            : undefined
                    }
                >
                    {view === "card" && (
                        <div
                            className={
                                styles.cardView
                            }
                        >
                            <div
                                className={
                                    styles.receivedCard
                                }
                            >
                                <ExploreProfileCard
                                    profile={
                                        request.receivedCard
                                    }
                                />
                            </div>

                            <button
                                type="button"
                                className={
                                    styles.swipeGuide
                                }
                                onPointerDown={(
                                    event,
                                ) => {
                                    event.stopPropagation();
                                }}
                                onPointerUp={(
                                    event,
                                ) => {
                                    event.stopPropagation();
                                }}
                                onClick={(
                                    event,
                                ) => {
                                    event.stopPropagation();
                                    showMessage();
                                }}
                            >
                                위로 밀어 쪽지를
                                확인해보세요
                            </button>
                        </div>
                    )}

                    {view === "message" && (
                        <div
                            className={
                                styles.messageView
                            }
                        >
                            <div
                                className={
                                    styles.sender
                                }
                            >
                                {request.sender
                                    .profileImage ? (
                                    <img
                                        src={
                                            request
                                                .sender
                                                .profileImage
                                        }
                                        alt={`${request.sender.name} 프로필`}
                                    />
                                ) : (
                                    <span
                                        className={
                                            styles.avatarPlaceholder
                                        }
                                        aria-hidden="true"
                                    />
                                )}

                                <div>
                                    <strong>
                                        {
                                            request
                                                .sender
                                                .name
                                        }
                                    </strong>

                                    <span>
                                        {[
                                            request
                                                .receivedCard
                                                .affiliationType,
                                            request
                                                .receivedCard
                                                .affiliation,
                                        ]
                                            .filter(
                                                Boolean,
                                            )
                                            .join(
                                                " | ",
                                            )}
                                    </span>
                                </div>
                            </div>

                            <p
                                className={
                                    styles.message
                                }
                            >
                                {
                                    request.message
                                }
                            </p>

                            <button
                                type="button"
                                className={
                                    styles.backToCard
                                }
                                onPointerDown={(
                                    event,
                                ) => {
                                    event.stopPropagation();
                                }}
                                onPointerUp={(
                                    event,
                                ) => {
                                    event.stopPropagation();
                                }}
                                onClick={(
                                    event,
                                ) => {
                                    event.stopPropagation();
                                    showCard();
                                }}
                            >
                                카드를 다시 보기
                            </button>
                        </div>
                    )}

                </div>

                <div
                    className={
                        styles.actions
                    }
                >
                    <button
                        type="button"
                        className={
                            styles.secondaryButton
                        }
                        onClick={
                            handleSecondaryAction
                        }
                    >
                        거절
                    </button>

                    <button
                        type="button"
                        className={
                            styles.primaryButton
                        }
                        onClick={
                            handleAccept
                        }
                    >
                        수락하기
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ReceivedExchangeModal;
