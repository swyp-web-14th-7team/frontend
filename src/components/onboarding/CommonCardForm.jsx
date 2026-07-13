    import Dropdown from "../common/Dropdown/Dropdown";
    import styles from "./CommonCardForm.module.css";

    const affiliationOptions = [
    "직장인",
    "재학생",
    "휴학생",
    "취준생",
    ];

    const CommonCardForm = ({ data, handleChange }) => {
    return (
        <div className={styles.field}>
        <label className={`caption1 ${styles.label}`}>
            현 소속
        </label>

        <div className={styles.affiliationRow}>
            <div className={styles.dropdownWrapper}>
            <Dropdown
                value={data.affiliationType}
                options={affiliationOptions}
                onChange={(value) =>
                handleChange("affiliationType", value)
                }
            />
            </div>

            <input
            className={styles.input}
            value={data.affiliation}
            maxLength={20}
            onChange={(event) =>
                handleChange("affiliation", event.target.value)
            }
            placeholder="텍스트를 입력하세요"
            />

            <p className={styles.count}>
            {(data.affiliation || "").length}/20
            </p>
        </div>
        </div>
    );
    };

    export default CommonCardForm;