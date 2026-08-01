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

import {
    getPersonalityIcon,
    getProfileImageUrl,
    mapProfileCard,
} from "../../utils/profileMapper";

import MyCardSelector from "../exchange/MyCardSelector";

import styles from "./CardExchangeModal.module.css";

const MAX_MESSAGE_LENGTH = 500;

/*
 * API 응답에서 프로필 카드 배열을 찾는다.
 *
 * 지원하는 형태:
 * response
 * response.items
 * response.data.items
 * response.data.data.items
 */
const extractCardItems = (
    response,
) => {
    if (
        Array.isArray(
            response,
        )
    ) {
        return response;
    }

    if (
        Array.isArray(
            response?.items,
        )
    ) {
        return response.items;
    }

    if (
        Array.isArray(
            response?.data?.items,
        )
    ) {
        return response.data.items;
    }

    if (
        Array.isArray(
            response?.data?.data
                ?.items,
        )
    ) {
        return response.data.data.items;
    }

    return [];
};

/*
 * ExploreProfileCard에서 사용할 수 있도록
 * 백엔드 카드 데이터를 화면 데이터로 변환한다.
 */
const normalizeCard = (
    card,
) => {
    const mappedCard =
        mapProfileCard(
            card || {},
        );

    const nickname =
        card?.nickname ||
        card?.name ||
        "이름 없음";

    const job =
        mappedCard.job ||
        (
            typeof card?.job ===
            "string"
                ? card.job
                : ""
        ) ||
        "";

    const affiliationStatus =
        typeof card?.affiliationStatus ===
        "string"
            ? card.affiliationStatus
            : card?.affiliationStatus
                  ?.name || "";

    const rawPersonality =
        card?.personality ||
        card?.strength ||
        null;

    const personality =
        typeof rawPersonality ===
        "string"
            ? rawPersonality
            : rawPersonality
              ? {
                    ...rawPersonality,
                    icon:
                        getPersonalityIcon(
                            rawPersonality.imageUrl ||
                                rawPersonality.icon,
                        ),
                }
              : null;

    const profileImage =
        getProfileImageUrl(
            card?.profileImageUrl ||
                card?.profileImageUri ||
                card?.profileImage,
        );

    return {
        ...card,

        id:
            card?.id,

        name:
            nickname,

        nickname,

        job,

        jobType:
            job,

        jobTypeName:
            card?.jobTypeName ||
            mappedCard.jobTypeName ||
            job,

        affiliation:
            card?.affiliation ||
            "",

        affiliationType:
            affiliationStatus,

        affiliationStatus,

        introduction:
            card?.description ||
            card?.introduction ||
            "",

        description:
            card?.description ||
            card?.introduction ||
            "",

        profileImage:
            profileImage,

        profileImageUrl:
            profileImage,

        cardImageUrl:
            card?.cardImageUrl ||
            card?.backgroundImageUrl ||
            "",

        backgroundImage:
            card?.cardImageUrl ||
            card?.backgroundImageUrl ||
            "",

        skills:
            mappedCard.skills,

        techStacks:
            mappedCard.techStacks,

        interests:
            mappedCard.interests,

        experiences:
            Array.isArray(
                card?.experiences,
            )
                ? card.experiences
                : [],

        links:
            Array.isArray(
                card?.links,
            )
                ? card.links
                : [],

        strength:
            personality,

        personality,

        purpose:
            card?.purpose ||
            null,

        purposeName:
            typeof card?.purpose ===
            "string"
                ? card.purpose
                : card?.purpose
                      ?.name || "",

        isActive:
            card?.isActive !==
            false,

        isPublic:
            card?.isActive !==
            false,
    };
};

const CardExchangeModal = ({
    receiver,
    onClose,
    onSend,
}) => {
    const [
        step,
        setStep,
    ] = useState(1);

    const [
        cards,
        setCards,
    ] = useState([]);

    const [
        selectedCardId,
        setSelectedCardId,
    ] = useState(null);

    const [
        message,
        setMessage,
    ] = useState("");

    const [
        isLoadingCards,
        setIsLoadingCards,
    ] = useState(true);

    const [
        isSending,
        setIsSending,
    ] = useState(false);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    const selectedCard =
        cards.find(
            (card) =>
                String(
                    card.id,
                ) ===
                String(
                    selectedCardId,
                ),
        ) || null;

    /*
     * 내 프로필 카드 조회
     */
    useEffect(() => {
        const controller =
            new AbortController();

        const fetchMyCards =
            async () => {
                setIsLoadingCards(
                    true,
                );

                setErrorMessage(
                    "",
                );

                try {
                    const response =
                        await getMyProfileCards({
                            page: 1,
                            limit: 100,
                            sort: "createdAt",
                            order: "desc",

                            signal:
                                controller.signal,
                        });

                    if (
                        controller.signal
                            .aborted
                    ) {
                        return;
                    }

                    console.log(
                        "내 카드 API 응답:",
                        response,
                    );

                    const rawCards =
                        extractCardItems(
                            response,
                        );

                    console.log(
                        "추출된 내 카드:",
                        rawCards,
                    );

                    const normalizedCards =
                        rawCards
                            .filter(
                                (card) =>
                                    card &&
                                    card.id,
                            )
                            .map(
                                normalizeCard,
                            );

                    console.log(
                        "화면용 내 카드:",
                        normalizedCards,
                    );

                    setCards(
                        normalizedCards,
                    );

                    setSelectedCardId(
                        normalizedCards[0]
                            ?.id ||
                            null,
                    );

                    if (
                        normalizedCards.length ===
                        0
                    ) {
                        setErrorMessage(
                            "내 프로필 카드를 불러왔지만 표시할 카드 데이터가 없습니다.",
                        );
                    }
                } catch (error) {
                    if (
                        error?.name ===
                            "AbortError" ||
                        controller.signal
                            .aborted
                    ) {
                        return;
                    }

                    console.error(
                        "내 카드 조회 실패:",
                        error,
                    );

                    setCards(
                        [],
                    );

                    setSelectedCardId(
                        null,
                    );

                    setErrorMessage(
                        error?.message ||
                            "내 카드를 불러오지 못했습니다.",
                    );
                } finally {
                    if (
                        !controller.signal
                            .aborted
                    ) {
                        setIsLoadingCards(
                            false,
                        );
                    }
                }
            };

        fetchMyCards();

        return () => {
            controller.abort();
        };
    }, []);

    /*
     * ESC 키로 모달 닫기
     */
    useEffect(() => {
        const handleKeyDown = (
            event,
        ) => {
            if (
                event.key ===
                    "Escape" &&
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
    }, [
        isSending,
        onClose,
    ]);

    const handleNextStep =
        () => {
            if (
                !selectedCard ||
                isLoadingCards
            ) {
                return;
            }

            setErrorMessage(
                "",
            );

            setStep(2);
        };

    const handleSend =
        async () => {
            if (
                !selectedCard ||
                !receiver?.id ||
                isSending
            ) {
                return;
            }

            setIsSending(
                true,
            );

            setErrorMessage(
                "",
            );

            try {
                const trimmedMessage =
                    message.trim();

                const request =
                    await createConnectionRequest({
                        requesterCardId:
                            selectedCard.id,

                        receiverCardId:
                            receiver.id,

                        message:
                            trimmedMessage,
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
                        trimmedMessage,
                });
            } catch (error) {
                console.error(
                    "카드 교환 요청 실패:",
                    error,
                );

                setErrorMessage(
                    error?.message ||
                        "카드 교환 요청을 보내지 못했습니다.",
                );
            } finally {
                setIsSending(
                    false,
                );
            }
        };

    const handleBackdropClick = (
        event,
    ) => {
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
            className={
                styles.backdrop
            }
            role="presentation"
            onMouseDown={
                handleBackdropClick
            }
        >
            <section
                className={
                    styles.modal
                }
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
                        onClick={
                            onClose
                        }
                        disabled={
                            isSending
                        }
                        aria-label="카드 교환 요청 닫기"
                    >
                        ×
                    </button>
                </header>

                {errorMessage && (
                    <p
                        className={
                            styles.errorMessage
                        }
                        role="alert"
                    >
                        {
                            errorMessage
                        }
                    </p>
                )}

                {step === 1 ? (
                    <div
                        className={
                            styles.selectionStep
                        }
                    >
                        {isLoadingCards ? (
                            <p
                                className={
                                    styles.statusMessage
                                }
                            >
                                내 카드를
                                불러오는
                                중입니다.
                            </p>
                        ) : cards.length >
                          0 ? (
                            <MyCardSelector
                                cards={
                                    cards
                                }
                                selectedCardId={
                                    selectedCardId
                                }
                                onSelect={
                                    setSelectedCardId
                                }
                            />
                        ) : null}

                        <button
                            type="button"
                            className={
                                styles.primaryButton
                            }
                            onClick={
                                handleNextStep
                            }
                            disabled={
                                !selectedCard ||
                                isLoadingCards
                            }
                        >
                            이 카드로
                            보내기
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
                                    {
                                        message.length
                                    }
                                    /
                                    {
                                        MAX_MESSAGE_LENGTH
                                    }
                                </span>
                            </div>

                            <textarea
                                id="exchange-message"
                                value={
                                    message
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setMessage(
                                        event
                                            .target
                                            .value,
                                    )
                                }
                                maxLength={
                                    MAX_MESSAGE_LENGTH
                                }
                                placeholder="응원, 간략한 내 소개 등을 적어보세요."
                                disabled={
                                    isSending
                                }
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
                                    setStep(
                                        1,
                                    )
                                }
                                disabled={
                                    isSending
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
                                disabled={
                                    isSending ||
                                    !selectedCard
                                }
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
