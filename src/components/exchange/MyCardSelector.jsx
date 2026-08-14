import { useRef } from "react";

import ExploreProfileCard from "../profile/ExploreProfileCard";

import {
    getProfileImageUrl,
} from "../../utils/profileMapper";

import defaultProfileImage from "../../assets/images/avatarPlaceholder_default.png";

import styles from "./MyCardSelector.module.css";

const getCardId = (card) => {
    return (
        card?.id ??
        card?.profileCardId ??
        card?.cardId ??
        null
    );
};

const getIsPublic = (card) => {
    if (
        typeof card?.isPublic ===
        "boolean"
    ) {
        return card.isPublic;
    }

    if (
        typeof card?.isPrivate ===
        "boolean"
    ) {
        return !card.isPrivate;
    }

    if (
        typeof card?.isActive ===
        "boolean"
    ) {
        return card.isActive;
    }

    if (card?.visibility) {
        return (
            String(card.visibility)
                .trim()
                .toLowerCase() ===
            "public"
        );
    }

    return true;
};

const normalizeCard = (card) => {
    const cardId =
        getCardId(card);

    const rawProfileImage =
        card?.profileImageUrl ||
        card?.profileImage ||
        card?.imageUrl ||
        card?.image ||
        "";

    const profileImage =
        getProfileImageUrl(
            rawProfileImage,
        ) ||
        defaultProfileImage;

    return {
        ...card,

        id: cardId,

        name:
            card?.name ||
            card?.nickname ||
            card?.userName ||
            "이름 없음",

        nickname:
            card?.nickname ||
            card?.name ||
            card?.userName ||
            "이름 없음",

        profileImageUrl:
            profileImage,

        profileImage:
            profileImage,

        imageUrl:
            profileImage,

        image:
            profileImage,

        job:
            card?.job ||
            card?.jobTypeName ||
            card?.jobName ||
            card?.jobType ||
            "",

        jobType:
            card?.jobType ||
            card?.jobTypeName ||
            card?.jobName ||
            card?.job ||
            "",

        introduction:
            card?.introduction ||
            card?.description ||
            "",

        description:
            card?.description ||
            card?.introduction ||
            "",

        cardImageUrl:
            card?.cardImageUrl ||
            card?.backgroundImageUrl ||
            card?.backgroundImage ||
            "",

        backgroundImage:
            card?.backgroundImage ||
            card?.backgroundImageUrl ||
            card?.cardImageUrl ||
            "",
    };
};

const MyCardSelector = ({
    cards = [],
    selectedCardId,
    onSelect,
}) => {
    const cardRefs =
        useRef({});

    const normalizedCards =
        Array.isArray(cards)
            ? cards
                  .map(normalizeCard)
                  .filter(
                      (card) =>
                          card.id !==
                              null &&
                          card.id !==
                              undefined,
                  )
            : [];



    const handleSelect = (
        cardId,
    ) => {
        onSelect?.(cardId);

        cardRefs.current[
            cardId
        ]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    };

    if (
        normalizedCards.length ===
        0
    ) {
        return (
            <div
                className={
                    styles.empty
                }
            >
                보낼 수 있는 프로필 카드가
                없습니다.
            </div>
        );
    }

    return (
        <div
            className={
                styles.selector
            }
        >
            <div
                className={
                    styles.carousel
                }
            >
                {normalizedCards.map(
                    (card) => {
                        const isSelected =
                            String(
                                selectedCardId,
                            ) ===
                            String(
                                card.id,
                            );

                        const isPublic =
                            getIsPublic(
                                card,
                            );

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

                                </div>
                            </div>
                        );
                    },
                )}
            </div>

            <div
                className={
                    styles.pagination
                }
                aria-label="카드 선택"
            >
                {normalizedCards.map(
                    (card) => {
                        const isActive =
                            String(
                                selectedCardId,
                            ) ===
                            String(
                                card.id,
                            );

                        return (
                            <button
                                key={
                                    card.id
                                }
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
                                aria-label={`${
                                    card.cardName ||
                                    card.nickname ||
                                    card.name ||
                                    "프로필 카드"
                                } 선택`}
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
        </div>
    );
};

export default MyCardSelector;
