    import styles from "./CommonCardForm.module.css";

    const CommonCardForm = ({ data, handleChange }) => {
    return (
        <div className={styles.field}>
        <label className={`caption1 ${styles.label}`}>현 소속</label>

        <div className={styles.affiliationRow}>
            <select
            className={styles.select}
            value={data.affiliationType}
            onChange={(e) => handleChange("affiliationType", e.target.value)}
            >
            <option value="직장인">직장인</option>
            <option value="재학생">재학생</option>
            <option value="휴학생">휴학생</option>
            <option value="취준생">취준생</option>
            </select>

            <input
            className={styles.input}
            value={data.affiliation}
            onChange={(e) => handleChange("affiliation", e.target.value)}
            placeholder="텍스트를 입력하세요"
            />
        </div>
        </div>
    );
    };

    export default CommonCardForm;