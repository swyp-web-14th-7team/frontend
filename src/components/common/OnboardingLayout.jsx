    import Header from "./Header";
    import styles from "./OnboardingLayout.module.css";

    const OnboardingLayout = ({
    children,
    showBackButton = true,
    showProgress = true,
    onBack,
    currentStep = 1,
    totalSteps = 1,
    }) => {
    const progressPercent =
        totalSteps > 0
        ? Math.min(((currentStep + 1) / totalSteps) * 100, 100)
        : 0;

    return (
        <main className={styles.page}>
        <div className={styles.desktopHeader}>
            <Header />
        </div>

        <div className={styles.inner}>
            {(showBackButton || showProgress) && (
            <header
                className={`${styles.header} ${
                !showBackButton && showProgress
                    ? styles.headerWithoutBack
                    : ""
                }`}
            >
                {showBackButton && (
                <button
                    type="button"
                    onClick={onBack}
                    className={styles.backButton}
                    aria-label="이전 단계로 이동"
                >
                    ‹
                </button>
                )}

                {showProgress && (
                <div
                    className={styles.progressTrack}
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={Math.round(progressPercent)}
                >
                    <div
                    className={styles.progressValue}
                    style={{
                        width: `${progressPercent}%`,
                    }}
                    />
                </div>
                )}
            </header>
            )}

            <div className={styles.content}>
            {children}
            </div>
        </div>
        </main>
    );
    };

    export default OnboardingLayout;