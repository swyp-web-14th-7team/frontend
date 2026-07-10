import OnboardingLayout from "../common/OnboardingLayout";
import styles from "./WelcomeStep.module.css";

    const WelcomeStep = ({ onNext, currentStep, totalSteps }) => {
    return (
    <OnboardingLayout
    showBackButton={false}
    showProgress={false}
    currentStep={currentStep}
    totalSteps={totalSteps}
    >
        <section className={styles.container}>
            <div className={styles.textArea}>
            <h1 className={`title2 ${styles.title}`}>
                환영합니다 OO님!
                카드를 만들어볼까요?
            </h1>

            <p className={`body1 ${styles.description}`}>
                기본 카드를 만들어서 공유하고
                다른 사람의 카드를 구경할 수 있어요.
            </p>
            </div>

            <div className={styles.logoBox} />

            <button
            type="button"
            onClick={onNext}
            className={`body1 ${styles.nextButton}`}
            >
            다음
            </button>
        </section>
        </OnboardingLayout>
    );
    };

export default WelcomeStep;