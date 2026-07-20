import {
    useMemo,
    useRef,
    useState,
} from "react";

import {
    uploadProfileImage,
} from "../../api/files";

import OnboardingLayout from "../common/OnboardingLayout";
import CommonCardForm from "./CommonCardForm";
import DeveloperCardForm from "./DeveloperCardForm";
import GeneralCardForm from "./GeneralCardForm";
import TagSelectModal from "./TagSelectModal";
import StrengthTypeModal from "./StrengthTypeModal";

import styles from "./CardBasicStep.module.css";

const createSkillSections = (
    skills,
) => {
    const sectionMap =
        new Map();

    skills.forEach((skill) => {
        const categoryName =
            skill.category?.name ||
            "기타";

        if (
            !sectionMap.has(
                categoryName,
            )
        ) {
            sectionMap.set(
                categoryName,
                [],
            );
        }

        sectionMap
            .get(categoryName)
            .push({
                id: skill.id,

                name: skill.name,

                type: "skill",

                optionType:
                    "skill",
            });
    });

    return Array.from(
        sectionMap.entries(),
    ).map(
        (
            [categoryName, options],
            index,
        ) => ({
            id: `skill-category-${index}`,

            title: categoryName,

            options,
        }),
    );
};

const CardBasicStep = ({
    data,
    skills = [],
    interests = [],
    personalities = [],
    affiliationStatuses = [],
    isSubmitting = false,
    submitError = "",
    onChange,
    onSubmit,
    onBack,
    currentStep,
    totalSteps,
}) => {
    const [
        modalType,
        setModalType,
    ] = useState(null);

    const imageInputRef =
    useRef(null);

    const [
        isImageUploading,
        setIsImageUploading,
    ] = useState(false);

    const [
        imageError,
        setImageError,
    ] = useState("");

    const handleChange = (
        key,
        value,
    ) => {
        onChange({
            [key]: value,
        });
    };

    const isDeveloper =
        data.job === "frontend" ||
        data.job === "backend";

    const skillSections =
        useMemo(
            () =>
                createSkillSections(
                    skills,
                ),
            [skills],
        );

    const interestSections =
        useMemo(() => {
            const interestOptions =
                interests.map(
                    (interest) => ({
                        id:
                            interest.id,

                        name:
                            interest.name,

                        type:
                            "interest",

                        optionType:
                            "interest",
                    }),
                );

            return [
                {
                    id: "interests",

                    title:
                        "관심 분야",

                    options:
                        interestOptions,
                },

                ...skillSections,
            ];
        }, [
            interests,
            skillSections,
        ]);

        const handleImageButtonClick =
    () => {
        if (isImageUploading) {
            return;
        }

        imageInputRef.current?.click();
    };

const handleProfileImageChange =
    async (event) => {
        const imageFile =
            event.target.files?.[0];

        event.target.value = "";

        if (!imageFile) {
            return;
        }

        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/webp",
        ];

        if (
            !allowedTypes.includes(
                imageFile.type,
            )
        ) {
            setImageError(
                "PNG, JPG, WEBP 이미지만 등록할 수 있습니다.",
            );

            return;
        }

        const maxFileSize =
            5 * 1024 * 1024;

        if (
            imageFile.size >
            maxFileSize
        ) {
            setImageError(
                "이미지는 5MB 이하만 등록할 수 있습니다.",
            );

            return;
        }

        try {
            setIsImageUploading(
                true,
            );

            setImageError("");

            const previewUrl =
                URL.createObjectURL(
                    imageFile,
                );

            handleChange(
                "profileImagePreview",
                previewUrl,
            );

            const uploadData =
                await uploadProfileImage(
                    imageFile,
                );

            if (!uploadData?.url) {
                throw new Error(
                    "업로드된 이미지 주소를 받지 못했습니다.",
                );
            }

            handleChange(
                "profileImageUrl",
                uploadData.url,
            );

            handleChange(
                "profileImagePreview",
                `${uploadData.url.replace(
                    /\/$/,
                    "",
                )}/72.webp`,
            );

            URL.revokeObjectURL(
                previewUrl,
            );
        } catch (error) {
            console.error(
                "프로필 이미지 업로드 실패:",
                error,
            );

            handleChange(
                "profileImageUrl",
                "",
            );

            setImageError(
                error.message ||
                    "이미지 업로드에 실패했습니다.",
            );
        } finally {
            setIsImageUploading(
                false,
            );
        }
    };

    /*
     * 스킬과 관심 분야는
     * 직군에 따라 없을 수 있으므로
     * 필수 조건에서 제외한다.
     */
    const isFormValid =
        Boolean(
            data.affiliationStatusId,
        ) &&
        (
            data.affiliation || ""
        ).trim() !== "" &&
        (
            data.introduction || ""
        ).trim() !== "" &&
        Boolean(data.strength);

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
                        styles.textArea
                    }
                >
                    <h1
                        className={`headline1 ${styles.title}`}
                    >
                        카드에 들어갈
                        정보를
                        <br
                            className={
                                styles.mobileBr
                            }
                        />
                        알려주세요
                    </h1>

                    <p
                        className={`caption1 ${styles.description}`}
                    >
                        나를 소개하기 위해
                        기본적인 정보를
                        작성해보세요
                    </p>
                </div>

                <div
                    className={
                        styles.profileImageBox
                    }
                >
                    <div
                        className={
                            styles.profileCircle
                        }
                    >
                        {data.profileImagePreview && (
                            <img
                                src={
                                    data.profileImagePreview
                                }
                                alt="선택한 프로필"
                                className={
                                    styles.profileImage
                                }
                            />
                        )}
                    </div>

                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={
                            handleProfileImageChange
                        }
                        hidden
                    />

                    <button
                        type="button"
                        className={
                            styles.editButton
                        }
                        onClick={
                            handleImageButtonClick
                        }
                        disabled={
                            isImageUploading
                        }
                        aria-label="프로필 이미지 수정"
                    >
                        {isImageUploading
                            ? "…"
                            : "✎"}
                    </button>
                </div>

                {imageError && (
                    <p
                        style={{
                            margin: "8px 0 0",
                            color: "#e5484d",
                            textAlign: "center",
                        }}
                    >
                        {imageError}
                    </p>
                )}

                <div
                    className={
                        styles.form
                    }
                >
                    <CommonCardForm
                        data={data}
                        affiliationStatuses={
                            affiliationStatuses
                        }
                        handleChange={
                            handleChange
                        }
                    />

                    {isDeveloper ? (
                        <DeveloperCardForm
                            data={data}
                            onOpenStackModal={() =>
                                setModalType(
                                    "techStacks",
                                )
                            }
                        />
                    ) : (
                        <GeneralCardForm
                            data={data}
                            onOpenInterestModal={() =>
                                setModalType(
                                    "interests",
                                )
                            }
                        />
                    )}

                    <div
                        className={
                            styles.field
                        }
                    >
                        <label
                            className={`caption1 ${styles.label}`}
                        >
                            저는 이런
                            사람이에요
                        </label>

                        {data.strength ? (
                            <button
                                type="button"
                                className={
                                    styles.selectedStrength
                                }
                                onClick={() =>
                                    setModalType(
                                        "strength",
                                    )
                                }
                            >
                                {data
                                    .strength
                                    .icon && (
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

                                <span
                                    className={
                                        styles.strengthText
                                    }
                                >
                                    <span
                                        className={`caption1 ${styles.strengthTitle}`}
                                    >
                                        {
                                            data
                                                .strength
                                                .title
                                        }
                                    </span>
                                </span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                className={
                                    styles.addButton
                                }
                                onClick={() =>
                                    setModalType(
                                        "strength",
                                    )
                                }
                            >
                                + 선택하기
                            </button>
                        )}
                    </div>

                    <div
                        className={
                            styles.introductionField
                        }
                    >
                        <textarea
                            className={
                                styles.textarea
                            }
                            value={
                                data.introduction ||
                                ""
                            }
                            maxLength={
                                250
                            }
                            onChange={(
                                event,
                            ) =>
                                handleChange(
                                    "introduction",
                                    event
                                        .target
                                        .value,
                                )
                            }
                            placeholder="성격, 역량 등을 작성해주세요"
                        />

                        <p
                            className={
                                styles.count
                            }
                        >
                            {
                                (
                                    data.introduction ||
                                    ""
                                ).length
                            }
                            /250
                        </p>
                    </div>
                </div>

                {submitError && (
                    <p
                        style={{
                            margin:
                                "12px 0 0",

                            color:
                                "#e5484d",

                            textAlign:
                                "center",
                        }}
                    >
                        {submitError}
                    </p>
                )}

                <button
                    type="button"
                    onClick={
                        onSubmit
                    }
                    disabled={
                        !isFormValid ||
                        isSubmitting
                    }
                    className={`body1 ${
                        isFormValid &&
                        !isSubmitting
                            ? styles.nextButtonActive
                            : styles.nextButton
                    }`}
                >
                    {isSubmitting
                        ? "생성 중..."
                        : "만들기"}
                </button>
            </section>

            {modalType ===
                "techStacks" && (
                <TagSelectModal
                    title="나의 스킬 및 툴"
                    description="먼저 선택된 3개가 카드에 노출돼요"
                    sections={
                        skillSections
                    }
                    selectedItems={
                        data.techStacks ||
                        []
                    }
                    maxCount={10}
                    onClose={() =>
                        setModalType(
                            null,
                        )
                    }
                    onConfirm={(
                        selected,
                    ) => {
                        handleChange(
                            "techStacks",
                            selected,
                        );

                        setModalType(
                            null,
                        );
                    }}
                />
            )}

            {modalType ===
                "interests" && (
                <TagSelectModal
                    title="나의 관심 분야 및 툴"
                    description="먼저 선택된 3개가 카드에 노출돼요"
                    sections={
                        interestSections
                    }
                    selectedItems={
                        data.interests ||
                        []
                    }
                    maxCount={10}
                    onClose={() =>
                        setModalType(
                            null,
                        )
                    }
                    onConfirm={(
                        selected,
                    ) => {
                        handleChange(
                            "interests",
                            selected,
                        );

                        setModalType(
                            null,
                        );
                    }}
                />
            )}

            {modalType ===
                "strength" && (
                <StrengthTypeModal
                    options={
                        personalities
                    }
                    selectedItem={
                        data.strength
                    }
                    onClose={() =>
                        setModalType(
                            null,
                        )
                    }
                    onConfirm={(
                        selected,
                    ) => {
                        handleChange(
                            "strength",
                            selected,
                        );

                        setModalType(
                            null,
                        );
                    }}
                />
            )}
        </OnboardingLayout>
    );
};

export default CardBasicStep;