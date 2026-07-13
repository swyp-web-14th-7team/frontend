    import { useMemo, useState } from "react";
    import styles from "./TagSelectModal.module.css";
    import searchIcon from "../../assets/icons/icon_search.svg";

    const TagSelectModal = ({
    title,
    description,
    options,
    selectedItems,
    maxCount,
    onClose,
    onConfirm,
    }) => {
    const [searchValue, setSearchValue] = useState("");
    const [temporarySelected, setTemporarySelected] = useState(
        selectedItems || []
    );

    const filteredOptions = useMemo(() => {
        const keyword = searchValue.trim().toLowerCase();

        if (!keyword) {
        return options;
        }

        return options.filter((option) =>
        option.name.toLowerCase().includes(keyword)
        );
    }, [options, searchValue]);

    const isSelected = (optionId) =>
        temporarySelected.some((item) => item.id === optionId);

    const handleToggle = (option) => {
        if (isSelected(option.id)) {
        setTemporarySelected((prev) =>
            prev.filter((item) => item.id !== option.id)
        );
        return;
        }

        if (temporarySelected.length >= maxCount) {
        return;
        }

        setTemporarySelected((prev) => [...prev, option]);
    };

    const handleConfirm = () => {
        onConfirm(temporarySelected);
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
        <section
            className={styles.bottomSheet}
            onClick={(event) => event.stopPropagation()}
        >
            <div className={styles.content}>
            <div className={styles.header}>
                <h2 className={styles.title}>{title}</h2>

                <button
                type="button"
                onClick={onClose}
                className={styles.closeButton}
                aria-label="닫기"
                >
                ×
                </button>
            </div>

            <p className={styles.description}>{description}</p>

            <div className={styles.searchBox}>
                <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="찾으시는 분야가 있나요?"
                className={styles.searchInput}
                />

                <img
                src={searchIcon}
                alt=""
                className={styles.searchIcon}
                />
            </div>

            <div className={styles.tagList}>
                {filteredOptions.map((option) => {
                const selected = isSelected(option.id);

                return (
                    <button
                    key={option.id}
                    type="button"
                    onClick={() => handleToggle(option)}
                    className={`${styles.tagButton} ${
                        selected ? styles.selectedTagButton : ""
                    }`}
                    >
                    {option.name}
                    {selected && <span className={styles.removeIcon}>×</span>}
                    </button>
                );
                })}
            </div>
            </div>

            <div className={styles.footer}>
            <p className={styles.selectedCount}>
                {temporarySelected.length}/{maxCount}
            </p>

            <div className={styles.selectedList}>
                {temporarySelected.map((item) => (
                <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggle(item)}
                    className={styles.selectedItem}
                >
                    {item.name}
                    <span>×</span>
                </button>
                ))}
            </div>

            <button
            type="button"
            onClick={handleConfirm}
            disabled={temporarySelected.length === 0}
            className={`${styles.confirmButton} ${
                temporarySelected.length > 0
                ? styles.confirmButtonActive
                : ""
            }`}
            >
            등록
            </button>
            </div>
        </section>
        </div>
    );
    };

    export default TagSelectModal;