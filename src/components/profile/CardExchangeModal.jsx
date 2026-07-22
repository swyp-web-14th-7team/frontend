import {
    useEffect,
    useState,
} from "react";

import {
    createConnectionRequest,
} from "../../api/connectionRequests";
import {
    getMyProfileCards,
} from "../../api/profile";

import MyCardSelector from "../exchange/MyCardSelector";

import {
    mapProfileCards,
} from "../../utils/profileMapper";

import styles from "./CardExchangeModal.module.css";

const MAX_MESSAGE_LENGTH = 500;

const CardExchangeModal = ({
    receiver,
    onClose,
    onSend,
}) => {
    const [step, setStep] = useState(1);

    const [cards, setCards] = useState([]);

    const [selectedCardId, setSelectedCardId] =
        useState(null);

    const [message, setMessage] =
        useState("");

    const [isLoadingCards, setIsLoadingCards] =
        useState(true);

    const [isSending, setIsSending] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    const selectedCard = cards.find(
        (card) =>
            String(card.id) ===
            String(selectedCardId),
    );

    useEffect(() => {
        const controller =
            new AbortController();

        const fetchMyCards = async () => {
            setIsLoadingCards(true);
            setErrorMessage("");

            try {
                const data =
                    await getMyProfileCards({
                        page: 1,
                        limit: 100,
                        sort: "createdAt",
                        order: "desc",
                        signal:
                            controller.signal,
                    });

                if (controller.signal.aborted) {
                    return;
                }

                const mappedCards =
                    mapProfileCards(
                        data?.items || [],
                    );

                setCards(mappedCards);
                setSelectedCardId(
                    mappedCards[0]?.id ||
                        null,
                );
            } catch (error) {
                if (
                    error?.name ===
                    "AbortError"
                ) {
                    return;
                }

                console.error(
                    "내 카드 조회 실패:",
                    error,
                );

                setErrorMessage(
                    error.message ||
                        "내 카드를 불러오지 못했습니다.",
                );
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoadingCards(false);
                }
            }
        };

        fetchMyCards();

        return () => {
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (
                event.key === "Escape" &&
                !isSending
            ) {
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
    }, [isSending, onClose]);

    const handleSend = async () => {
        if (
            !selectedCard ||
            !receiver?.id ||
            isSending
        ) {
            return;
        }

        setIsSending(true);
        setErrorMessage("");

        try {
            const request =
                await createConnectionRequest({
                    requesterCardId:
                        selectedCard.id,
                    receiverCardId:
                        receiver.id,
                    message:
                        message.trim(),
                });

            onSend?.({
                request,
                receiver,
                requesterCard:
                    selectedCard,
                requesterCardId:
                    selectedCard.id,
                receiverCardId:
                    receiver.id,
                message:
                    message.trim(),
            });
        } catch (error) {
            console.error(
                "카드 교환 요청 실패:",
                error,
            );

            setErrorMessage(
                error.message ||
                    "카드 교환 요청을 보내지 못했습니다.",
            );
        } finally {
            setIsSending(false);
        }
    };

    const handleBackdropClick = (event) => {
        if (
            event.target ===
                event.currentTarget &&
            !isSending
        ) {
            onClose?.();
        }
    };

    return (
        <div
            className={styles.backdrop}
            role="presentation"
            onMouseDown={handleBackdropClick}
        >
            <section
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="exchange-modal-title"
            >
                <header
                    className={styles.modalHeader}
                >
                    <div>
                        <h2 id="exchange-modal-title">
                            교환 요청을 보낼까요?
                        </h2>

                        <p>
                            {step === 1
                                ? "상대가 받을 내 카드를 선택해주세요."
                                : "상대가 받을 간단한 쪽지를 적어보세요."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={onClose}
                        disabled={isSending}
                        aria-label="카드 교환 요청 닫기"
                    >
                        ×
                    </button>
                </header>

                {errorMessage && (
                    <p
                        className={styles.errorMessage}
                        role="alert"
                    >
                        {errorMessage}
                    </p>
                )}

                {step === 1 ? (
                    <div
                        className={styles.selectionStep}
                    >
                        {isLoadingCards ? (
                            <p
                                className={styles.statusMessage}
                            >
                                내 카드를 불러오는 중입니다.
                            </p>
                        ) : (
                            <MyCardSelector
                                cards={cards}
                                selectedCardId={
                                    selectedCardId
                                }
                                onSelect={
                                    setSelectedCardId
                                }
                            />
                        )}

                        <button
                            type="button"
                            className={styles.primaryButton}
                            onClick={() =>
                                setStep(2)
                            }
                            disabled={
                                !selectedCard ||
                                isLoadingCards
                            }
                        >
                            이 카드로 보내기
                        </button>
                    </div>
                ) : (
                    <div
                        className={styles.messageStep}
                    >
                        <div
                            className={styles.messageSection}
                        >
                            <div
                                className={styles.messageLabel}
                            >
                                <label htmlFor="exchange-message">
                                    쪽지
                                </label>

                                <span>
                                    {message.length}/
                                    {MAX_MESSAGE_LENGTH}
                                </span>
                            </div>

                            <textarea
                                id="exchange-message"
                                value={message}
                                onChange={(event) =>
                                    setMessage(
                                        event.target.value,
                                    )
                                }
                                maxLength={MAX_MESSAGE_LENGTH}
                                placeholder="응원, 간략한 내 소개 등을 적어보세요."
                                disabled={isSending}
                                autoFocus
                            />
                        </div>

                        <div
                            className={styles.actions}
                        >
                            <button
                                type="button"
                                className={styles.secondaryButton}
                                onClick={() =>
                                    setStep(1)
                                }
                                disabled={isSending}
                            >
                                이전
                            </button>

                            <button
                                type="button"
                                className={styles.primaryButton}
                                onClick={handleSend}
                                disabled={isSending}
                            >
                                {isSending
                                    ? "보내는 중..."
                                    : "보내기"}
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default CardExchangeModal;
