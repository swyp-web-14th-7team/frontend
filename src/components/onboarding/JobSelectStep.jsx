    import OnboardingLayout from "../common/OnboardingLayout";
    import styles from "./JobSelectStep.module.css";

    const jobs = [
    {
        id: "planner",
        name: "Planner",
        label: "기획자",
    },
    {
        id: "designer",
        name: "Designer",
        label: "디자이너",
    },
    {
        id: "frontend",
        name: "Frontend Developer",
        label: "프론트엔드 개발자",
    },
    {
        id: "backend",
        name: "Backend Developer",
        label: "백엔드 개발자",
    },
    ];

    const JobSelectStep = ({
    data,
    onChange,
    onNext,
    onBack,
    currentStep,
    totalSteps,
    }) => {
    const selectedJob = data.job;

    const handleSelectJob = (jobId) => {
        onChange({
        job: jobId,
        });
    };

    return (
        <OnboardingLayout
        showBackButton={true}
        onBack={onBack}
        currentStep={currentStep}
        totalSteps={totalSteps}
        >
        <section className={styles.container}>
            <div className={styles.textArea}>
            <h1 className={`headline1 ${styles.title}`}>
                직군을 선택해주세요
            </h1>

            <p className={`body2 ${styles.description}`}>
                현재 속해계시거나, 희망하시는 직군을 골라주세요.
            </p>
            </div>

            <div className={styles.jobList}>
            {jobs.map((job) => {
                const isSelected = selectedJob === job.id;

                return (
                <button
                    key={job.id}
                    type="button"
                    onClick={() => handleSelectJob(job.id)}
                    className={`${styles.jobItem} ${
                    isSelected ? styles.selected : ""
                    }`}
                >
                    <span className={styles.iconBox}></span>

                    <span className={styles.jobText}>
                    <strong className="body1">{job.name}</strong>
                    <span className="caption1">{job.label}</span>
                    </span>
                </button>
                );
            })}
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