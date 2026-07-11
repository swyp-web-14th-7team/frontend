    import { useEffect } from "react";

    import OnboardingLayout from "../common/OnboardingLayout";
    import styles from "./LoadingStep.module.css";

    const LoadingStep = ({
    onComplete,
    currentStep,
    totalSteps,
    }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
        onComplete();
        }, 2000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <OnboardingLayout
        showBackButton={false}
        showProgress={true}
        currentStep={currentStep}
        totalSteps={totalSteps}
        >
        <section className={styles.container}>
            <div
            className={styles.loadingBox}
            role="status"
            aria-label="카드 생성 중"
            />

            <h1 className={`body1 ${styles.title}`}>
            생성 중
            </h1>

            <p className={`caption1 ${styles.description}`}>
            여러 개의 카드를 만들 수 있어요
            </p>
        </section>
        </OnboardingLayout>
    );
    };

    export default LoadingStep;