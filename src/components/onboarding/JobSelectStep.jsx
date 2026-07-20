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
    const selectedJob =
        data.job;

    const handleSelectJob = (
        job,
    ) => {
        /*
         * 이미 기본 카드가 만들어졌다면
         * 다른 직군으로 변경하지 않는다.
         */
        if (
            data.profileCardId &&
            selectedJob !== job.id
        ) {
            return;
        }

        onChange({
            job: job.id,

            jobTypeId:
                job.jobTypeId,

            techStacks: [],

            interests: [],

            strength: null,
        });
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
                            style={{
                                color:
                                    "#e5484d",

                                textAlign:
                                    "center",
                            }}
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
                                styles.jobList
                            }
                        >
                            {jobOptions.map(
                                (job) => {
                                    const isSelected =
                                        selectedJob ===
                                        job.id;

                                    const isDisabled =
                                        Boolean(
                                            data.profileCardId,
                                        ) &&
                                        !isSelected;

                                    return (
                                        <button
                                            key={
                                                job.id
                                            }
                                            type="button"
                                            onClick={() =>
                                                handleSelectJob(
                                                    job,
                                                )
                                            }
                                            disabled={
                                                isDisabled ||
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
                                                        job.name
                                                    }
                                                </strong>

                                                <span className="caption1">
                                                    {
                                                        job.label
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
                    onClick={onNext}
                    disabled={
                        !selectedJob ||
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