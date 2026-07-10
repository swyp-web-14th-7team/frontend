    import styles from "./DeveloperCardForm.module.css";

    const DeveloperCardForm = ({ data, onOpenStackModal }) => {
    return (
        <>
        <div className={styles.field}>
            <label className={`caption1 ${styles.label}`}>스킬</label>

            <button type="button" onClick={onOpenStackModal} className={styles.addButton}>
            + 추가하기
            </button>
            
        </div>


        <div className={styles.selectedTagArea}>
            {(data.techStacks || []).map((stack) => (
            <span key={stack} className={`caption1 ${styles.tag}`}>
                {stack.name}
            </span>
            ))}
        </div>
        </>

        
    );
    };

    export default DeveloperCardForm;