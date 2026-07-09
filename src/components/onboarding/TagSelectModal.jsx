    import { useState } from "react";
    import styles from "./TagSelectModal.module.css";

    const TagSelectModal = ({
    title,
    description,
    options,
    selectedItems,
    maxCount = 10,
    onClose,
    onConfirm,
    }) => {
    const [keyword, setKeyword] = useState("");
    const [tempSelected, setTempSelected] = useState(selectedItems || []);

    const filteredOptions = options.filter((option) =>
        option.name.toLowerCase().includes(keyword.toLowerCase())
    );

    const isSelected = (item) =>
        tempSelected.some((selected) => selected.id === item.id);

    const handleToggle = (item) => {
        if (isSelected(item)) {
        setTempSelected((prev) =>
            prev.filter((selected) => selected.id !== item.id)
        );
        return;
        }

        if (tempSelected.length >= maxCount) return;

        setTempSelected((prev) => [...prev, item]);
    };

    const handleConfirm = () => {
        onConfirm(tempSelected);
        onClose();
    };

    return (
        <div className={styles.overlay}>
        <div className={styles.modal}>
            <button type="button" className={styles.closeButton} onClick={onClose}>
            ×
            </button>

            <h2 className={`body1 ${styles.title}`}>{title}</h2>
            <p className={`caption1 ${styles.description}`}>{description}</p>

            <input
            className={styles.searchInput}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="찾으시는 항목이 있나요?"
            />

            <div className={styles.optionList}>
            {filteredOptions.map((option) => {
                const selected = isSelected(option);

                return (
                <button
                    key={option.id}
                    type="button"
                    onClick={() => handleToggle(option)}
                    className={`${styles.tagButton} ${
                    selected ? styles.selected : ""
                    }`}
                >
                    {option.name}
                    {selected && <span className={styles.removeIcon}> ×</span>}
                </button>
                );
            })}
            </div>

            <div className={styles.divider} />

            <div className={styles.selectedHeader}>
            <span className="caption1">
                {tempSelected.length}/{maxCount}
            </span>
            </div>

            <div className={styles.selectedList}>
            {tempSelected.map((item) => (
                <button
                key={item.id}
                type="button"
                onClick={() => handleToggle(item)}
                className={styles.selectedTag}
                >
                {item.name} ×
                </button>
            ))}
            </div>

            <button
            type="button"
            className={`body1 ${styles.confirmButton}`}
            onClick={handleConfirm}
            >
            등록
            </button>
        </div>
        </div>
    );
    };

    export default TagSelectModal;