import { useRef } from "react";

import ExploreProfileCard from "../profile/ExploreProfileCard";

import styles from "./MyCardSelector.module.css";

const MyCardSelector = ({
    cards = [],
    selectedCardId,
    onSelect,
}) => {
    const cardRefs = useRef({});

    const handleSelect = (cardId) => {
        onSelect?.(cardId);

        cardRefs.current[
            cardId
        ]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    };

    /*
     * 공개 여부를 확인합니다.
     *
     * API 응답에 공개 여부 필드가 없으면
     * 기본적으로 공개 카드로 처리합니다.
     *
     * 명확한 비공개 값이 있을 때만
     * 비공개로 표시합니다.
     */
    const getIsPublic = (card) => {
        if (!card) {
            return true;
        }

        /*
         * Boolean 형태
         */
        if (
            typeof card.isPublic ===
            "boolean"
        ) {
            return card.isPublic;
        }

        if (
            typeof card.isPrivate ===
            "boolean"
        ) {
            return !card.isPrivate;
        }

        if (
            typeof card.public ===
            "boolean"
        ) {
            return card.public;
        }

        if (
            typeof card.isVisible ===
            "boolean"
        ) {
            return card.isVisible;
        }

        /*
         * 문자열 형태
         */
        const visibilityValue =
            card.visibility ??
            card.cardVisibility ??
            card.visibilityType ??
            card.publicStatus ??
            card.status;

        if (
            visibilityValue !==
                undefined &&
            visibilityValue !== null
        ) {
            const normalizedValue =
                String(
                    visibilityValue,
                )
                    .trim()
                    .toLowerCase();

            const privateValues = [
                "private",
                "비공개",
                "closed",
                "hidden",
                "false",
                "0",
            ];

            const publicValues = [
                "public",
                "공개",
                "open",
                "visible",
                "true",
                "1",
            ];

            if (
                privateValues.includes(
                    normalizedValue,
                )
            ) {
                return false;
            }

            if (
                publicValues.includes(
                    normalizedValue,
                )
            ) {
                return true;
            }
        }

        /*
         * 공개 여부 필드가 없는 경우에는
         * 공개 카드로 표시합니다.
         */
        return true;
    };

    if (cards.length === 0) {
        return (
            <div className={styles.empty}>
                보낼 수 있는 프로필 카드가
                없습니다.
            </div>
        );
    }

    return (
        <div
            className={styles.selector}
        >
            <div
                className={styles.carousel}
            >
                {cards.map((card) => {
                    const isSelected =
                        String(
                            selectedCardId,
                        ) ===
                        String(card.id);

                    const isPublic =
                        getIsPublic(card);

                    return (
                        <div
                            key={card.id}
                            ref={(element) => {
                                cardRefs.current[
                                    card.id
                                ] = element;
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
                                    profile={card}
                                    onClick={() =>
                                        handleSelect(
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
                                    className={`${styles.badge} ${
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
                                        className={`${styles.badge} ${styles.defaultBadge}`}
                                    >
                                        기본
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div
                className={
                    styles.pagination
                }
                aria-label="카드 선택"
            >
                {cards.map((card) => {
                    const isActive =
                        String(
                            selectedCardId,
                        ) ===
                        String(card.id);

                    return (
                        <button
                            key={card.id}
                            type="button"
                            className={`${styles.dot} ${
                                isActive
                                    ? styles.activeDot
                                    : ""
                            }`}
                            onClick={() =>
                                handleSelect(
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
                })}
            </div>
        </div>
    );
};

export default MyCardSelector;