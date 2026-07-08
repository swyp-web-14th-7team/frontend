import ProgressBar from "./ProgressBar";
import styles from "./OnboardingLayout.module.css";

import logo from "../../assets/images/nodi-logo-white.svg";


const OnboardingLayout = ({
    children,
    showBackButton = true,
    onBack,
    currentStep,
    totalSteps,
}) => {
    return (
    <div className={styles.page}>
        <div className={styles.inner}>

        <div className={styles.logoContainer}>
        <img
        src={logo}
        alt="Nodi"
        className={styles.logo}
        />
        </div>
        
        <div className={styles.divider} />


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

            <ProgressBar
            currentStep={currentStep}
            totalSteps={totalSteps}
            />
        </div>

        <main className={styles.content}>
            {children}
        </main>

        </div>
    </div>
    );
};

export default OnboardingLayout;