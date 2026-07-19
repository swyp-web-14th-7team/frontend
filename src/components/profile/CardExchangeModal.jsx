import {
    useEffect,
    useRef,
    useState,
} from "react";

import ExploreProfileCard from "./ExploreProfileCard";

import styles from "./CardExchangeModal.module.css";

const MAX_MESSAGE_LENGTH = 250;

const CardExchangeModal = ({
    cards = [],
    receiver,
    onClose,
    onSend,
}) => {
    const [step, setStep] = useState(1);

    const [
        selectedCardId,
        setSelectedCardId,
    ] = useState(
        cards.length > 0
            ? cards[0].id
            : null,
    );

    const [message, setMessage] =
        useState("");

    const cardRefs = useRef({});

    const selectedCard = cards.find(
        (card) =>
            card.id === selectedCardId,
    );

    useEffect(() => {
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
            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [onClose]);

    const scrollCardToCenter = (
        cardId,
    ) => {
        cardRefs.current[
            cardId
        ]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    };

    const handleSelectCard = (
        cardId,
    ) => {
        setSelectedCardId(cardId);
        scrollCardToCenter(cardId);
    };

    const handleMoveToMessage = () => {
        if (!selectedCard) {
            return;
        }

        setStep(2);
    };

    const handlePrevious = () => {
        setStep(1);

        window.requestAnimationFrame(() => {
            if (selectedCardId !== null) {
                scrollCardToCenter(
                    selectedCardId,
                );
            }
        });
    };

    const handleSend = () => {
        if (!selectedCard) {
            return;
        }

        onSend?.({
            receiverId: receiver?.id,
            receiver,
            cardId: selectedCard.id,
            card: selectedCard,
            message: message.trim(),
        });
    };

    const handleBackdropClick = (
        event,
    ) => {
        if (
            event.target ===
            event.currentTarget
        ) {
            onClose?.();
        }
    };

    return (
        <div
            className={styles.backdrop}
            role="presentation"
            onMouseDown={
                handleBackdropClick
            }
        >
            <section
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="exchange-modal-title"
            >
                <header
                    className={
                        styles.modalHeader
                    }
                >
                    <div
                        className={
                            styles.headerText
                        }
                    >
                        <h2 id="exchange-modal-title">
                            교환 요청을
                            보낼까요?
                        </h2>

                        <p>
                            {step === 1
                                ? "상대가 받을 내 카드를 선택해주세요."
                                : "상대가 받을 간단한 쪽지를 적어보세요."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className={
                            styles.closeButton
                        }
                        onClick={onClose}
                        aria-label="카드 교환 요청 닫기"
                    >
                        ×
                    </button>
                </header>

                {step === 1 ? (
                    <div
                        className={
                            styles.selectionStep
                        }
                    >
                        {cards.length > 0 ? (
                            <div
                                className={
                                    styles.cardCarousel
                                }
                            >
                                {cards.map(
                                    (card) => {
                                        const isSelected =
                                            selectedCardId ===
                                            card.id;

                                        const isPublic =
                                            card.visibility ===
                                            "public";

                                        return (
                                            <div
                                                key={
                                                    card.id
                                                }
                                                ref={(
                                                    element,
                                                ) => {
                                                    cardRefs.current[
                                                        card.id
                                                    ] =
                                                        element;
                                                }}
                                                className={
                                                    styles.cardOption
                                                }
                                            >
                                                <div
                                                    className={`${styles.cardWrapper} ${
                                                        isSelected
                                                            ? styles.selectedCard
                                                            : styles.unselectedCard
                                                    }`}
                                                >
                                                    <ExploreProfileCard
                                                        profile={
                                                            card
                                                        }
                                                        onClick={() =>
                                                            handleSelectCard(
                                                                card.id,
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div
                                                    className={
                                                        styles.cardMeta
                                                    }
                                                >
                                                    <span
                                                        className={`${styles.visibilityBadge} ${
                                                            isPublic
                                                                ? styles.publicBadge
                                                                : styles.privateBadge
                                                        }`}
                                                    >
                                                        {isPublic
                                                            ? "공개"
                                                            : "비공개"}
                                                    </span>

                                                    {card.isDefault && (
                                                        <span
                                                            className={
                                                                styles.defaultBadge
                                                            }
                                                        >
                                                            기본
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        ) : (
                            <div
                                className={
                                    styles.emptyCards
                                }
                            >
                                <p>
                                    보낼 수 있는
                                    프로필 카드가
                                    없습니다.
                                </p>
                            </div>
                        )}

                        <div
                            className={
                                styles.pagination
                            }
                            aria-label="카드 선택"
                        >
                            {cards.map(
                                (card) => {
                                    const isActive =
                                        selectedCardId ===
                                        card.id;

                                    return (
                                        <button
                                            key={
                                                card.id
                                            }
                                            type="button"
                                            className={`${styles.paginationDot} ${
                                                isActive
                                                    ? styles.activeDot
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleSelectCard(
                                                    card.id,
                                                )
                                            }
                                            aria-label={`${card.cardName || "프로필 카드"} 선택`}
                                            aria-current={
                                                isActive
                                                    ? "true"
                                                    : undefined
                                            }
                                        />
                                    );
                                },
                            )}
                        </div>

                        <button
                            type="button"
                            className={
                                styles.nextButton
                            }
                            onClick={
                                handleMoveToMessage
                            }
                            disabled={
                                !selectedCard
                            }
                        >
                            이 카드로 보내기
                        </button>
                    </div>
                ) : (
                    <div
                        className={
                            styles.messageStep
                        }
                    >
                        <div
                            className={
                                styles.messageSection
                            }
                        >
                            <div
                                className={
                                    styles.messageLabel
                                }
                            >
                                <label htmlFor="exchange-message">
                                    쪽지
                                </label>

                                <span>
                                    {message.length}/
                                    {
                                        MAX_MESSAGE_LENGTH
                                    }
                                </span>
                            </div>

                            <textarea
                                id="exchange-message"
                                value={message}
                                onChange={(
                                    event,
                                ) =>
                                    setMessage(
                                        event.target
                                            .value,
                                    )
                                }
                                maxLength={
                                    MAX_MESSAGE_LENGTH
                                }
                                placeholder="응원, 간략한 내 소개 등을 적어보세요."
                                autoFocus
                            />
                        </div>

                        <div
                            className={
                                styles.messageActions
                            }
                        >
                            <button
                                type="button"
                                className={
                                    styles.previousButton
                                }
                                onClick={
                                    handlePrevious
                                }
                            >
                                이전
                            </button>

                            <button
                                type="button"
                                className={
                                    styles.sendButton
                                }
                                onClick={
                                    handleSend
                                }
                            >
                                보내기
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default CardExchangeModal;