import styles from "./ProgressBar.module.css";

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

return (
    <div className={styles.progressBar}>
    <div
        className={styles.progressFill}
        style={{ width: `${progress}%` }}
    />
    </div>
);
};

export default ProgressBar;