    import {
    useEffect,
    } from "react";

    import OnboardingLayout from "../common/OnboardingLayout";

    import loadingAnimation from "../../assets/animations/loading.webm";

    import styles from "./LoadingStep.module.css";

    const LoadingStep = ({
    onComplete,
    currentStep,
    totalSteps,
    }) => {
    useEffect(() => {
        const timer = window.setTimeout(
        () => {
            onComplete();
        },
        2500,
        );

        return () => {
        window.clearTimeout(timer);
        };
    }, [onComplete]);

    return (
        <OnboardingLayout
        showBackButton={false}
        showProgress={true}
        currentStep={currentStep}
        totalSteps={totalSteps}
        >
        <section
            className={styles.container}
            role="status"
            aria-live="polite"
            aria-label="카드 생성 중"
        >
            <div
            className={
                styles.loadingBox
            }
            >
            <video
                className={
                styles.loadingVideo
                }
                src={
                loadingAnimation
                }
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
            />
            </div>

            <h1
            className={`body1 ${styles.title}`}
            >
            생성 중
            </h1>

            <p
            className={`caption1 ${styles.description}`}
            >
            여러 개의 카드를 만들 수 있어요
            </p>
        </section>
        </OnboardingLayout>
    );
    };

    export default LoadingStep;