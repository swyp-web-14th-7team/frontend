import ProgressBar from "./ProgressBar";
import styles from "./OnboardingLayout.module.css";

const OnboardingLayout = ({title, description, children, buttonText, onButtonClick, showBackButton = true, onBack, currentStep, totalSteps,}) => {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                {showBackButton ? (<button type="button" onClick={onBack} className={styles.backButton}>
                    ←  
                </button>):(
                    <div className={styles.backPlaceholder} />
                    )}
                    <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
            </div>

            <main className={styles.content}>
                <h1 className={styles.title}>{title}</h1>
                {description && <p className={styles.description}>{description}</p>}
                
                <div className={styles.body}>{children}</div>
            </main>

            {buttonText && (
                <button type="button" onClick={onButtonClick} className={styles.nextButton}>
                    {buttonText}
                </button>
            )}
        </div>
    );
};

export default OnboardingLayout;