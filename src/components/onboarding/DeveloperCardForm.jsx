    import styles from "./DeveloperCardForm.module.css";

    const DeveloperCardForm = ({ data, onOpenStackModal }) => {
    const techStacks = data.techStacks || [];

    return (
        <div className={styles.field}>
        <label className={`caption1 ${styles.label}`}>
            스킬
        </label>

        <button
            type="button"
            onClick={onOpenStackModal}
            className={styles.addButton}
        >
            + 추가하기
        </button>

        {techStacks.length > 0 && (
            <div className={styles.selectedTagArea}>
            {techStacks.map((stack) => (
                <span
                key={stack.id}
                className={`caption1 ${styles.tag}`}
                >
                {stack.name}
                </span>
            ))}
            </div>
        )}
        </div>
    );
    };

    export default DeveloperCardForm;