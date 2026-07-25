import {
    useEffect,
    useRef,
    useState,
} from "react";

import { createPortal } from "react-dom";

import styles from "./ReceivedExchangeModal.module.css";

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
        card?.jobName ||
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

const getCardIntroduction = (card) => {
    return (
        card?.introduction ||
        card?.bio ||
        card?.description ||
        card?.summary ||
        "나를 소개하는 한마디가 아직 등록되지 않았어요."
    );
};

const normalizeTags = (value) => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item) => {
            if (typeof item === "string") {
                return item;
            }

            return (
                item?.name ||
                item?.title ||
                item?.label ||
                ""
            );
        })
        .filter(Boolean);
};

const ReceivedExchangeModal = ({
    request,
    onClose,
    onReject,
    onAccept,
}) => {
    const [isMessageOpen, setIsMessageOpen] =
        useState(false);

    const [dragOffset, setDragOffset] =
        useState(0);

    const [isSwipeHintVisible, setIsSwipeHintVisible] =
        useState(true);

    const dragStartYRef = useRef(null);
    const dragOffsetRef = useRef(0);

    /*
     * "위로 밀어 쪽지를 확인해보세요" 안내 문구는
     * 모달이 열리고 잠깐 보였다가 자동으로 사라진다.
     */
    useEffect(() => {
        const hintTimer = setTimeout(() => {
            setIsSwipeHintVisible(false);
        }, 2200);

        return () => {
            clearTimeout(hintTimer);
        };
    }, []);

    const receivedCard =
        request?.receivedCard ||
        request?.rawRequest?.card ||
        {};

    const senderName =
        getCardName(request);

    const profileImage =
        request?.sender?.profileImage ||
        getCardImage(receivedCard);

    const job =
        getCardJob(receivedCard);

    const affiliation =
        getCardAffiliation(receivedCard);

    const introduction =
        getCardIntroduction(receivedCard);

    const skills =
        normalizeTags(
            receivedCard?.skills ||
                receivedCard?.skillTags,
        ).slice(0, 3);

    const interests =
        normalizeTags(
            receivedCard?.interests ||
                receivedCard?.interestTags ||
                receivedCard?.interestAreas,
        );

    const message =
        request?.message ||
        request?.rawRequest?.message ||
        "전달된 메시지가 없습니다.";

    const requestId =
        request?.id ||
        request?.rawRequest?.id;

    const getStrengthLabel = (
        value,
    ) => {
        if (!value) {
            return "";
        }

        if (typeof value === "string") {
            return value;
        }

        return (
            value?.title ||
            value?.name ||
            ""
        );
    };

    const strength =
        getStrengthLabel(
            receivedCard?.strength,
        ) ||
        getStrengthLabel(
            receivedCard?.strengthName,
        ) ||
        getStrengthLabel(
            receivedCard?.communicationType,
        ) ||
        getStrengthLabel(
            receivedCard?.communicationTypeName,
        ) ||
        interests[0] ||
        "새로운 연결";

    useEffect(() => {
        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

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
        };
    }, [onClose]);

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

const handlePointerDown = (event) => {
    dragStartYRef.current = event.clientY;
    dragOffsetRef.current = 0;

    event.currentTarget.setPointerCapture?.(
        event.pointerId,
    );
};

const handlePointerMove = (event) => {
    if (dragStartYRef.current === null) {
        return;
    }

    const difference =
        event.clientY -
        dragStartYRef.current;

    const nextOffset = Math.max(
        -160,
        Math.min(0, difference),
    );

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

    if (dragOffsetRef.current <= -35) {
        setIsMessageOpen(
            (previous) => !previous,
        );
    }

    setDragOffset(0);
    dragOffsetRef.current = 0;
    dragStartYRef.current = null;
};

const handlePointerCancel = (event) => {
    event.currentTarget.releasePointerCapture?.(
        event.pointerId,
    );

    setDragOffset(0);
    dragOffsetRef.current = 0;
    dragStartYRef.current = null;
};

    const handleBackdropClick = (event) => {
        if (
            event.target ===
            event.currentTarget
        ) {
            onClose?.();
        }
    };

    return createPortal(
        <div
            className={styles.modalOverlay}
            role="presentation"
            onMouseDown={handleBackdropClick}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 99999,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                background: "rgba(0, 0, 0, 0.6)",
            }}
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
                <header
                    className={styles.header}
                >
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
                        className={
                            styles.closeButton
                        }
                        onClick={onClose}
                        aria-label="닫기"
                    >
                        ×
                    </button>
                </header>

                <div
                    className={styles.content}
                >
                    {!isMessageOpen ? (
                        <div
                            className={
                                styles.cardStep
                            }
                        >
                            <div
                                className={
                                    styles.dragArea
                                }
                
                                style={{
                                    transform: `translateY(${dragOffset}px)`,
                                    touchAction: "none",
                                }}

                                onPointerDown={handlePointerDown}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                                onPointerCancel={handlePointerCancel}
                            >
                                <article
                                    className={
                                        styles.profileCard
                                    }
                                >
                                    <p
                                        className={
                                            styles.cardJob
                                        }
                                    >
                                        {job}
                                    </p>

                                    <div
                                        className={
                                            styles.cardProfileRow
                                        }
                                    >
                                        <div
                                            className={
                                                styles.cardProfileImageWrapper
                                            }
                                        >
                                            {profileImage ? (
                                                <img
                                                    src={
                                                        profileImage
                                                    }
                                                    alt={`${senderName} 프로필`}
                                                    className={
                                                        styles.cardProfileImage
                                                    }
                                                />
                                            ) : (
                                                <span
                                                    className={
                                                        styles.cardProfileFallback
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
                                                styles.cardProfileInfo
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

                                    {skills.length >
                                        0 && (
                                        <div
                                            className={
                                                styles.cardTagList
                                            }
                                        >
                                            {skills.map(
                                                (
                                                    skill,
                                                    index,
                                                ) => (
                                                    <span
                                                        key={`${skill}-${index}`}
                                                    >
                                                        {
                                                            skill
                                                        }
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    )}

                                    <div
                                        className={
                                            styles.cardIntroduction
                                        }
                                    >
                                        <strong>
                                            노디:{" "}
                                        </strong>

                                        <span>
                                            {
                                                introduction
                                            }
                                        </span>
                                    </div>

                                    <div
                                        className={
                                            styles.cardStrength
                                        }
                                    >
                                        <span
                                            className={
                                                styles.strengthIcon
                                            }
                                        >
                                            ❯❯
                                        </span>

                                        <span>
                                            실험력{" "}
                                            <strong>
                                                {
                                                    strength
                                                }
                                            </strong>
                                        </span>
                                    </div>
                                </article>

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
                        </div>
                    ) : (
                        <div
    className={styles.messageStep}
    style={{
        transform: `translateY(${dragOffset}px)`,
        touchAction: "none",
    }}
    onPointerDown={handlePointerDown}
    onPointerMove={handlePointerMove}
    onPointerUp={handlePointerUp}
    onPointerCancel={handlePointerCancel}
>
    <p className={styles.messageJob}>
        {job}
    </p>

    <div className={styles.messageProfile}>
        <div
            className={
                styles.messageProfileImageWrapper
            }
        >
            {profileImage ? (
                <img
                    src={profileImage}
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
                        .slice(0, 1)
                        .toUpperCase()}
                </span>
            )}
        </div>

        <div
            className={
                styles.messageProfileInfo
            }
        >
            <strong>{senderName}</strong>
            <span>{affiliation}</span>
        </div>
    </div>

    <div className={styles.messageBox}>
        {message}
    </div>
</div>
                    )}
                </div>

                <footer
                    className={styles.footer}
                >
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