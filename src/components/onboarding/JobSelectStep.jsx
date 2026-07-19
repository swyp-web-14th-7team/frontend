import OnboardingLayout from "../common/OnboardingLayout";

import {
    JOB_OPTIONS,
} from "../../constants/profileOptions";

import styles from "./JobSelectStep.module.css";

const JobSelectStep = ({
    data,
    onChange,
    onNext,
    onBack,
    currentStep,
    totalSteps,
}) => {
    const selectedJob = data.job;

    const handleSelectJob = (
        jobId,
    ) => {
        onChange({
            job: jobId,
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

                <div
                    className={
                        styles.jobList
                    }
                >
                    {JOB_OPTIONS.map(
                        (job) => {
                            const isSelected =
                                selectedJob ===
                                job.id;

                            return (
                                <button
                                    key={
                                        job.id
                                    }
                                    type="button"
                                    onClick={() =>
                                        handleSelectJob(
                                            job.id,
                                        )
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

                <button
                    type="button"
                    onClick={onNext}
                    disabled={!selectedJob}
                    className={`body1 ${styles.nextButton}`}
                >
                    다음
                </button>
            </section>
        </OnboardingLayout>
    );
};

export default JobSelectStep;