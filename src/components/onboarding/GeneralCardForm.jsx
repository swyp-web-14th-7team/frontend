    import styles from "./GeneralCardForm.module.css";

    const GeneralCardForm = ({ data, onOpenInterestModal }) => {
    const interests = data.interests || [];

    return (
        <div className={styles.field}>
        <label className={`caption1 ${styles.label}`}>
            관심분야
        </label>

        <button
            type="button"
            onClick={onOpenInterestModal}
            className={styles.addButton}
        >
            + 추가하기
        </button>

        {interests.length > 0 && (
            <div className={styles.selectedTagArea}>
            {interests.map((interest) => (
                <span
                key={interest.id}
                className={`caption1 ${styles.tag}`}
                >
                {interest.name}
                </span>
            ))}
            </div>
        )}
        </div>
    );
    };

    export default GeneralCardForm;