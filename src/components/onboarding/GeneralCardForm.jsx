    import styles from "./GeneralCardForm.module.css";

    const GeneralCardForm = ({ data, onOpenInterestModal }) => {
    return (
        <>
        <div className={styles.field}>
            <label className={`caption1 ${styles.label}`}>관심분야</label>

            <button
            type="button"
            onClick={onOpenInterestModal}
            className={styles.addButton}
            >
            + 추가하기
            </button>
        </div>

        <div className={styles.selectedTagArea}>
            {(data.interests || []).map((interest) => (
            <span key={interest.id} className={`caption1 ${styles.tag}`}>
                {interest.name}
            </span>
            ))}
        </div>
        </>
    );
    };

    export default GeneralCardForm;