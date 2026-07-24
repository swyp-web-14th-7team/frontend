import {
    makeCardBackgroundUrl,
} from "../../api/cardBackground";

import styles from "./ProfileCard.module.css";

const JOB_LABELS = {
    planner: "Planner",
    designer: "Designer",

    frontend:
        "Frontend Developer",

    backend:
        "Backend Developer",
};

const getTagName = (
    tag,
) => {
    if (
        typeof tag === "string"
    ) {
        return tag;
    }

    return tag?.name || "";
};

const ExploreProfileCard = ({
    profile = {},
    onClick,
}) => {
    const isDeveloper =
        profile.job ===
            "frontend" ||
        profile.job ===
            "backend";

    const sourceTags =
        isDeveloper
            ? profile.techStacks ||
              profile.skills ||
              []
            : profile.interests ||
              [];

    const tags = sourceTags
        .map(
            (
                tag,
                index,
            ) => ({
                id:
                    tag?.id ||
                    `tag-${index}`,

                name:
                    getTagName(
                        tag,
                    ),
            }),
        )
        .filter(
            (tag) => tag.name,
        )
        .slice(0, 3);

    const experience =
        typeof profile.representativeExperience ===
        "object"
            ? profile.representativeExperience
            : null;

    const experienceTitle =
        experience?.title ||
        profile.representativeExperienceTitle ||
        (
            typeof profile.representativeExperience ===
            "string"
                ? profile.representativeExperience
                : ""
        ) ||
        "대표 경험이 없습니다.";

    const experienceDescription =
        experience?.description ||
        profile.representativeExperienceDescription ||
        "아직 등록된 대표 경험이 없어요.";

    const strengthTitle =
        profile.strength?.title ||
        profile.strength?.name ||
        "선택한 성향이 없습니다.";

    const strengthIcon =
        profile.strength?.icon ||
        profile.strength?.imageUrl ||
        "";

    /*
     * 같은 소속 정보가 두 번 들어오면
     * 한 번만 표시합니다.
     */
    const affiliationText = [
        profile.affiliationType,
        profile.affiliation,
    ]
        .filter(
            (
                value,
                index,
                values,
            ) =>
                Boolean(value) &&
                values.indexOf(
                    value,
                ) === index,
        )
        .join(" | ");

    /*
     * 사용자가 선택한 카드 배경을
     * 탐색 카드에 표시합니다.
     */
    const cardBackgroundUrl =
        makeCardBackgroundUrl(
            profile.cardImageUrl ||
            profile.cardImage,
        );

    const handleClick = () => {
        if (!profile.id) {
            return;
        }

        onClick?.(
            profile.id,
        );
    };

    return (
        <button
            type="button"
            className={
                styles.cardButton
            }
            onClick={
                handleClick
            }
            aria-label={`${profile.name || "사용자"} 프로필 상세 보기`}
        >
            <article
                className={
                    styles.card
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
                <div
                    className={
                        styles.topRow
                    }
                >
                    <p
                        className={
                            styles.job
                        }
                    >
                        {JOB_LABELS[
                            profile.job
                        ] ||
                            profile.jobTypeName ||
                            "직군 미선택"}
                    </p>
                </div>

                <div
                    className={
                        styles.content
                    }
                >
                    <div
                        className={
                            styles.profileRow
                        }
                    >
                        {profile.profileImage ? (
                            <img
                                src={
                                    profile.profileImage
                                }
                                alt={`${profile.name || "사용자"} 프로필`}
                                className={
                                    styles.avatar
                                }
                            />
                        ) : (
                            <div
                                className={
                                    styles.avatarPlaceholder
                                }
                                aria-hidden="true"
                            >
                                {profile.name
                                    ?.trim()
                                    ?.charAt(
                                        0,
                                    ) ||
                                    "N"}
                            </div>
                        )}

                        <div
                            className={
                                styles.profileInfo
                            }
                        >
                            <strong
                                className={
                                    styles.name
                                }
                            >
                                {profile.name ||
                                    "이름 없음"}
                            </strong>

                            <p
                                className={
                                    styles.affiliation
                                }
                            >
                                {affiliationText ||
                                    "소속 정보 없음"}
                            </p>
                        </div>
                    </div>

                    <div
                        className={
                            styles.tagList
                        }
                    >
                        {tags.length >
                        0 ? (
                            tags.map(
                                (
                                    tag,
                                    index,
                                ) => (
                                    <span
                                        key={`${tag.id}-${index}`}
                                        className={
                                            styles.tag
                                        }
                                    >
                                        {
                                            tag.name
                                        }
                                    </span>
                                ),
                            )
                        ) : (
                            <span
                                className={`${styles.tag} ${styles.emptyTag}`}
                            >
                                등록된 태그 없음
                            </span>
                        )}
                    </div>

                    <div
                        className={
                            styles.experienceBox
                        }
                    >
                        <p
                            className={
                                styles.experienceTitle
                            }
                        >
                            {
                                experienceTitle
                            }
                        </p>

                        <p
                            className={
                                styles.experienceDescription
                            }
                        >
                            {
                                experienceDescription
                            }
                        </p>
                    </div>

                    <div
                        className={
                            styles.strengthBox
                        }
                    >
                        {strengthIcon ? (
                            <img
                                src={
                                    strengthIcon
                                }
                                alt=""
                                className={
                                    styles.strengthIcon
                                }
                            />
                        ) : (
                            <span
                                className={
                                    styles.strengthPlaceholder
                                }
                                aria-hidden="true"
                            />
                        )}

                        <span
                            className={
                                styles.strengthText
                            }
                        >
                            {
                                strengthTitle
                            }
                        </span>
                    </div>
                </div>
            </article>
        </button>
    );
};

export default ExploreProfileCard;