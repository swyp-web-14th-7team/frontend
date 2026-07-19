import {
    useEffect,
    useState,
} from "react";

import MyCardSelector from "../exchange/MyCardSelector";

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
        cards[0]?.id || null,
    );

    const [message, setMessage] =
        useState("");

    const selectedCard = cards.find(
        (card) =>
            card.id ===
            selectedCardId,
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
                    <div>
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
                        <MyCardSelector
                            cards={cards}
                            selectedCardId={
                                selectedCardId
                            }
                            onSelect={
                                setSelectedCardId
                            }
                        />

                        <button
                            type="button"
                            className={
                                styles.primaryButton
                            }
                            onClick={() =>
                                setStep(2)
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
                                styles.actions
                            }
                        >
                            <button
                                type="button"
                                className={
                                    styles.secondaryButton
                                }
                                onClick={() =>
                                    setStep(1)
                                }
                            >
                                이전
                            </button>

                            <button
                                type="button"
                                className={
                                    styles.primaryButton
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