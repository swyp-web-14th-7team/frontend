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
                        selectedCardId ===
                        card.id;

                    const isPublic =
                        card.visibility ===
                        "public";

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
                        selectedCardId ===
                        card.id;

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