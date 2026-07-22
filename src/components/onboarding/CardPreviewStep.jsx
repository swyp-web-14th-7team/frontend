import {
    makeCardBackgroundUrl,
} from "../../api/cardBackground";

import OnboardingLayout from "../common/OnboardingLayout";

import styles from "./CardPreviewStep.module.css";

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

const CardPreviewStep = ({
    data,
    backgrounds = [],
    isLoading = false,
    isSubmitting = false,
    errorMessage = "",
    onSelect,
    onSubmit,
    onBack,
    currentStep,
    totalSteps,
}) => {
    const isDeveloper =
        data.job ===
            "frontend" ||
        data.job === "backend";

    const tags = isDeveloper
        ? data.techStacks || []
        : data.interests || [];

    const selectedImageUrl =
        makeCardBackgroundUrl(
            data.cardImageUrl,
        );

    const experience =
        data.experiences?.[0] ||
        data.representativeExperience ||
        null;

    const experienceTitle =
        experience?.title ||
        "대표 경험이 없습니다";

    const experienceDescription =
        experience?.description ||
        "아직 등록된 대표 경험이 없어요.";

    return (
        <OnboardingLayout
            showBackButton={true}
            showProgress={true}
            onBack={onBack}
            currentStep={currentStep}
            totalSteps={totalSteps}
        >
            <section
                className={
                    styles.container
                }
            >
                <div
                    className={
                        styles.heading
                    }
                >
                    <h1
                        className={`headline1 ${styles.title}`}
                    >
                        카드 미리보기
                    </h1>

                    <p
                        className={`body2 ${styles.description}`}
                    >
                        마음에 드는
                        디자인을
                        선택해주세요
                    </p>
                </div>

                <article
                    className={
                        styles.previewCard
                    }
                    style={
                        selectedImageUrl
                            ? {
                                  backgroundImage:
                                      `linear-gradient(
                                          rgba(39, 117, 230, 0.14),
                                          rgba(39, 117, 230, 0.14)
                                      ),
                                      url("${selectedImageUrl}")`,
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
                            styles.profileRow
                        }
                    >
                        {data.profileImagePreview ||
                        data.profileImage ? (
                            <img
                                src={
                                    data.profileImagePreview ||
                                    data.profileImage
                                }
                                alt="프로필"
                                className={
                                    styles.avatar
                                }
                            />
                        ) : (
                            <div
                                className={
                                    styles.avatarPlaceholder
                                }
                            >
                                {(data.name ||
                                    data.nickname ||
                                    "N")
                                    .slice(
                                        0,
                                        1,
                                    )}
                            </div>
                        )}

                        <div
                            className={
                                styles.profileText
                            }
                        >
                            <strong
                                className={
                                    styles.name
                                }
                            >
                                {data.name ||
                                    data.nickname ||
                                    "이름 없음"}
                            </strong>

                            <p
                                className={
                                    styles.affiliation
                                }
                            >
                                {[
                                    data.affiliationType,
                                    data.affiliation,
                                ]
                                    .filter(
                                        Boolean,
                                    )
                                    .join(
                                        " | ",
                                    ) ||
                                    "소속 미입력"}
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
                                            `${getTagName(
                                                tag,
                                            )}-${index}`
                                        }
                                        className={
                                            styles.tag
                                        }
                                    >
                                        {getTagName(
                                            tag,
                                        )}
                                    </span>
                                ),
                            )}
                    </div>

                    <div
                        className={
                            styles.experience
                        }
                    >
                        <strong
                            className={
                                styles.experienceTitle
                            }
                        >
                            {
                                experienceTitle
                            }
                        </strong>

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
                            styles.strength
                        }
                    >
                        {data.strength
                            ?.icon && (
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
                        )}

                        <strong>
                            {data.strength
                                ?.title ||
                                "성향 미선택"}
                        </strong>
                    </div>
                </article>

                {isLoading && (
                    <p
                        className={
                            styles.message
                        }
                    >
                        배경 이미지를
                        불러오는
                        중입니다.
                    </p>
                )}

                {!isLoading &&
                    errorMessage && (
                        <p
                            className={
                                styles.error
                            }
                        >
                            {
                                errorMessage
                            }
                        </p>
                    )}

                {!isLoading &&
                    !errorMessage && (
                        <div
                            className={
                                styles.backgroundList
                            }
                        >
                            {backgrounds.map(
                                (
                                    background,
                                ) => {
                                    const isSelected =
                                        data.cardBackgroundImageId ===
                                        background.id;

                                    return (
                                        <button
                                            key={
                                                background.id
                                            }
                                            type="button"
                                            className={`${styles.backgroundButton} ${
                                                isSelected
                                                    ? styles.selected
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                onSelect(
                                                    background,
                                                )
                                            }
                                            aria-label="카드 배경 선택"
                                            aria-pressed={
                                                isSelected
                                            }
                                        >
                                            <img
                                                src={makeCardBackgroundUrl(
                                                    background.imageUrl,
                                                )}
                                                alt=""
                                                className={
                                                    styles.backgroundImage
                                                }
                                            />
                                        </button>
                                    );
                                },
                            )}
                        </div>
                    )}

                <button
                    type="button"
                    className={`body1 ${styles.submitButton}`}
                    onClick={
                        onSubmit
                    }
                    disabled={
                        !data.cardImageUrl ||
                        isLoading ||
                        isSubmitting ||
                        Boolean(
                            errorMessage,
                        )
                    }
                >
                    {isSubmitting
                        ? "만드는 중..."
                        : "만들기"}
                </button>
            </section>
        </OnboardingLayout>
    );
};

export default CardPreviewStep;