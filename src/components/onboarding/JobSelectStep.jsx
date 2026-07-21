import OnboardingLayout from "../common/OnboardingLayout";

import styles from "./JobSelectStep.module.css";

const JobSelectStep = ({
    data,
    jobOptions = [],
    isLoading = false,
    isCreating = false,
    errorMessage = "",
    onChange,
    onNext,
    onBack,
    currentStep,
    totalSteps,
}) => {
    const selectedJobOption =
        jobOptions.find(
            (jobOption) =>
                jobOption.id ===
                data.job,
        ) || null;

    const handleSelectJob = (
        jobOption,
    ) => {
        if (isCreating) {
            return;
        }

        onChange({
            job: jobOption.id,
            jobTypeId:
                jobOption.jobTypeId,
            techStacks: [],
            interests: [],
            strength: null,
        });
    };

    const handleNext = () => {
        if (
            !selectedJobOption ||
            isLoading ||
            isCreating ||
            errorMessage
        ) {
            return;
        }

        onNext(
            selectedJobOption,
        );
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
                        styles.textArea
                    }
                >
                    <h1
                        className={`headline1 ${styles.title}`}
                    >
                        직군을 선택해주세요
                    </h1>

                    <p
                        className={`body2 ${styles.description}`}
                    >
                        현재 속해계시거나,
                        희망하시는 직군을
                        골라주세요.
                    </p>
                </div>

                {isLoading && (
                    <p>
                        직군을 불러오는
                        중입니다.
                    </p>
                )}

                {!isLoading &&
                    errorMessage && (
                        <p
                            className={
                                styles.errorMessage
                            }
                        >
                            {errorMessage}
                        </p>
                    )}

                {!isLoading &&
                    !errorMessage && (
                        <div
                            className={
                                styles.jobList
                            }
                        >
                            {jobOptions.map(
                                (
                                    jobOption,
                                ) => {
                                    const isSelected =
                                        data.job ===
                                        jobOption.id;

                                    return (
                                        <button
                                            key={
                                                jobOption.jobTypeId
                                            }
                                            type="button"
                                            onClick={() =>
                                                handleSelectJob(
                                                    jobOption,
                                                )
                                            }
                                            disabled={
                                                isCreating
                                            }
                                            aria-pressed={
                                                isSelected
                                            }
                                            className={`${styles.jobItem} ${
                                                isSelected
                                                    ? styles.selected
                                                    : ""
                                            }`}
                                        >
                                            <span
                                                className={
                                                    styles.iconBox
                                                }
                                            />

                                            <span
                                                className={
                                                    styles.jobText
                                                }
                                            >
                                                <strong className="body1">
                                                    {
                                                        jobOption.name
                                                    }
                                                </strong>

                                                <span className="caption1">
                                                    {
                                                        jobOption.label
                                                    }
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
                    onClick={handleNext}
                    disabled={
                        !selectedJobOption ||
                        isLoading ||
                        isCreating ||
                        Boolean(
                            errorMessage,
                        )
                    }
                    className={`body1 ${styles.nextButton}`}
                >
                    {isCreating
                        ? "생성 중..."
                        : "다음"}
                </button>
            </section>
        </OnboardingLayout>
    );
};

export default JobSelectStep;
