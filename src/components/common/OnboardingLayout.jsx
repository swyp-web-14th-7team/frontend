    import Header from "./Header";
    import ProgressBar from "./ProgressBar";

    import styles from "./OnboardingLayout.module.css";

    const OnboardingLayout = ({
    children,
    showBackButton,
    showProgress = true,
    onBack,
    currentStep,
    totalSteps,
    }) => {
    return (
        <div className={styles.page}>
        <div className={styles.inner}>

            <Header />

            <div className={styles.header}>
            {showBackButton ? (
                <button
                type="button"
                onClick={onBack}
                className={styles.backButton}
                >
                &lt;
                </button>
            ) : (
                <div className={styles.backPlaceholder} />
            )}

            {showProgress && (
                <ProgressBar
                currentStep={currentStep}
                totalSteps={totalSteps}
                />
            )}
            </div>

            <main className={styles.content}>
            {children}
            </main>

        </div>
        </div>
    );
    };

    export default OnboardingLayout; 