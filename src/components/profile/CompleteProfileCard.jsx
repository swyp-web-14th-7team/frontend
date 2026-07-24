import {
    makeCardBackgroundUrl,
} from "../../api/cardBackground";

import avatarPlaceholderDefault from "../../assets/images/avatarPlaceholder_default.png";

import styles from "./ProfileCard.module.css";

const JOB_LABELS = {
    planner: "Planner",
    designer: "Designer",
    frontend:
        "Frontend Developer",
    backend:
        "Backend Developer",
};

const CompleteProfileCard = ({
    data,
    name = "홍길동",
    profileImage,
}) => {
    const isDeveloper =
        data.job ===
            "frontend" ||
        data.job ===
            "backend";

    const tags = isDeveloper
        ? data.techStacks || []
        : data.interests || [];

    const cardBackgroundUrl =
        makeCardBackgroundUrl(
            data.cardImageUrl,
        );

    const affiliations = [
        data.affiliationType,
        data.affiliation,
    ].filter(
        (
            value,
            index,
            values,
        ) =>
            Boolean(value) &&
            values.indexOf(
                value,
            ) === index,
    );

    return (
        <article
            className={
                styles.completeCard
            }
            style={
                cardBackgroundUrl
                    ? {
                          backgroundImage:
                              `linear-gradient(
                                  rgba(17, 16, 23, 0.12),
                                  rgba(17, 16, 23, 0.12)
                              ),
                              url("${cardBackgroundUrl}")`,

                          backgroundPosition:
                              "center",

                          backgroundSize:
                              "cover",

                          backgroundRepeat:
                              "no-repeat",
                      }
                    : undefined
            }
        >
            <p
                className={
                    styles.job
                }
            >
                {JOB_LABELS[
                    data.job
                ] ||
                    "직군 미선택"}
            </p>

            <div
                className={
                    styles.completeProfileRow
                }
            >
                <img
                    src={
                        profileImage ||
                        avatarPlaceholderDefault
                    }
                    alt={`${name} 프로필`}
                    className={
                        styles.completeAvatar
                    }
                    onError={(
                        event,
                    ) => {
                        event.currentTarget.onerror =
                            null;

                        event.currentTarget.src =
                            avatarPlaceholderDefault;
                    }}
                />

                <div
                    className={
                        styles.profileInfo
                    }
                >
                    <strong
                        className={
                            styles.completeName
                        }
                    >
                        {name}
                    </strong>

                    <p
                        className={
                            styles.affiliation
                        }
                    >
                        {affiliations.join(
                            " · ",
                        )}
                    </p>
                </div>
            </div>

            <div
                className={
                    styles.tagList
                }
            >
                {tags
                    .slice(0, 3)
                    .map(
                        (
                            tag,
                            index,
                        ) => (
                            <span
                                key={
                                    tag?.id ||
                                    `${tag?.name || tag}-${index}`
                                }
                                className={
                                    styles.tag
                                }
                            >
                                {typeof tag ===
                                "string"
                                    ? tag
                                    : tag?.name}
                            </span>
                        ),
                    )}
            </div>

            <div
                className={
                    styles.introductionBox
                }
            >
                <p
                    className={
                        styles.introductionLabel
                    }
                >
                    한 줄 소개
                </p>

                <p
                    className={
                        styles.introductionText
                    }
                >
                    {data.introduction ||
                        "한 줄 소개가 없습니다."}
                </p>
            </div>

            {data.strength && (
                <div
                    className={
                        styles.completeStrengthBox
                    }
                >
                    {data.strength
                        .icon ? (
                        <img
                            src={
                                data
                                    .strength
                                    .icon
                            }
                            alt=""
                            className={
                                styles.strengthIcon
                            }
                        />
                    ) : (
                        <span
                            className={
                                styles.strengthIconPlaceholder
                            }
                        />
                    )}

                    <div
                        className={
                            styles.strengthInfo
                        }
                    >
                        <span
                            className={
                                styles.strengthText
                            }
                        >
                            {
                                data
                                    .strength
                                    .title
                            }
                        </span>

                        {data.strength
                            .description && (
                            <span
                                className={
                                    styles.strengthDescription
                                }
                            >
                                {
                                    data
                                        .strength
                                        .description
                                }
                            </span>
                        )}
                    </div>
                </div>
            )}
        </article>
    );
};

export default CompleteProfileCard;