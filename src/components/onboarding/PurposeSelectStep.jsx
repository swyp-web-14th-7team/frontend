import OnboardingLayout from "../common/OnboardingLayout";

import styles from "./PurposeSelectStep.module.css";

const PURPOSE_DESCRIPTION_MAP = {
    "팀 빌딩":
        "사이드 프로젝트, 창업",

    팀빌딩:
        "사이드 프로젝트, 창업",

    커피챗:
        "멘토링, 이직",

    네트워킹:
        "친목, 인맥",
};

const PurposeSelectStep = ({
    data,
    purposeOptions = [],
    isLoading = false,
    isSubmitting = false,
    errorMessage = "",
    submitError = "",
    onChange,
    onNext,
    onBack,
    currentStep,
    totalSteps,
}) => {
    const handleSelectPurpose = (
        purpose,
    ) => {
        if (isSubmitting) {
            return;
        }

        onChange({
            purposeId:
                purpose.id,

            purposeName:
                purpose.name,
        });
    };

    /*
     * 저장에 실패한 경우에는 다시 시도할 수 있어야 하므로
     * 목적 목록 조회 실패만 진행을 막습니다.
     */
    const handleNext = () => {
        if (
            !data.purposeId ||
            isLoading ||
            isSubmitting ||
            errorMessage
        ) {
            return;
        }

        onNext();
    };

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
                        styles.titleArea
                    }
                >
                    <h1
                        className={`headline1 ${styles.title}`}
                    >
                        어떤 목적의 카드를
                        만드시나요?
                    </h1>

                    <p
                        className={`body2 ${styles.description}`}
                    >
                        목적에 맞는 섹션에
                        카드를 공개해요
                    </p>
                </div>

                {isLoading && (
                    <p
                        className={
                            styles.statusMessage
                        }
                    >
                        목적을 불러오는
                        중입니다.
                    </p>
                )}

                {!isLoading &&
                    (errorMessage ||
                        submitError) && (
                        <p
                            className={
                                styles.errorMessage
                            }
                        >
                            {errorMessage ||
                                submitError}
                        </p>
                    )}

                {!isLoading &&
                    !errorMessage && (
                        <div
                            className={
                                styles.purposeList
                            }
                        >
                            {purposeOptions.map(
                                (
                                    purpose,
                                    index,
                                ) => {
                                    const isSelected =
                                        String(
                                            data.purposeId,
                                        ) ===
                                        String(
                                            purpose.id,
                                        );

                                    return (
                                        <button
                                            key={
                                                purpose.id
                                            }
                                            type="button"
                                            className={`${styles.purposeItem} ${
                                                isSelected
                                                    ? styles.selected
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleSelectPurpose(
                                                    purpose,
                                                )
                                            }
                                            aria-pressed={
                                                isSelected
                                            }
                                        >
                                            <span
                                                className={`${styles.icon} ${
                                                    styles[
                                                        `icon${index + 1}`
                                                    ] ||
                                                    ""
                                                }`}
                                                aria-hidden="true"
                                            >
                                                <i />
                                                <i />
                                                <i />
                                                <i />
                                            </span>

                                            <span
                                                className={
                                                    styles.purposeText
                                                }
                                            >
                                                <strong>
                                                    {
                                                        purpose.name
                                                    }
                                                </strong>

                                                <span>
                                                    {PURPOSE_DESCRIPTION_MAP[
                                                        purpose.name
                                                    ] ||
                                                        purpose.description ||
                                                        ""}
                                                </span>
                                            </span>
                                        </button>
                                    );
                                },
                            )}
                        </div>
                    )}

                <button
                    type="button"
                    className={
                        styles.nextButton
                    }
                    onClick={
                        handleNext
                    }
                    disabled={
                        !data.purposeId ||
                        isLoading ||
                        isSubmitting ||
                        Boolean(
                            errorMessage,
                        )
                    }
                >
                    {isSubmitting
                        ? "저장 중..."
                        : "다음"}
                </button>
            </section>
        </OnboardingLayout>
    );
};

export default PurposeSelectStep;
