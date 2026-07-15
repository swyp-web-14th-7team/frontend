    import { useMemo, useState } from "react";

    import styles from "./TagSelectModal.module.css";
    import searchIcon from "../../assets/icons/icon_search.svg";

    const TagSelectModal = ({
    title,
    description,
    sections = [],
    selectedItems = [],
    maxCount = 10,
    onClose,
    onConfirm,
    }) => {
    const [searchValue, setSearchValue] = useState("");

    const [temporarySelected, setTemporarySelected] =
        useState(selectedItems);

    const normalizedKeyword =
        searchValue.trim().toLowerCase();

    const filteredSections = useMemo(() => {
        return sections
        .map((section) => {
            const filteredOptions = normalizedKeyword
            ? section.options.filter((option) =>
                option.name
                    .toLowerCase()
                    .includes(normalizedKeyword),
                )
            : section.options;

            return {
            ...section,
            options: filteredOptions,
            };
        })
        .filter((section) => section.options.length > 0);
    }, [sections, normalizedKeyword]);

    const isSelected = (optionId) =>
        temporarySelected.some(
        (item) => item.id === optionId,
        );

    const handleToggle = (option) => {
        if (isSelected(option.id)) {
        setTemporarySelected((prev) =>
            prev.filter(
            (item) => item.id !== option.id,
            ),
        );

        return;
        }

        if (temporarySelected.length >= maxCount) {
        return;
        }

        setTemporarySelected((prev) => [
        ...prev,
        option,
        ]);
    };

    const handleReset = () => {
        setTemporarySelected([]);
    };

    const handleConfirm = () => {
        onConfirm(temporarySelected);
        onClose();
    };

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
        onClose();
        }
    };

    return (
        <div
        className={styles.overlay}
        onClick={handleOverlayClick}
        >
        <section
            className={styles.bottomSheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tag-select-title"
        >
            <div className={styles.content}>
            <div className={styles.header}>
                <h2
                id="tag-select-title"
                className={styles.title}
                >
                {title}
                </h2>

                <button
                type="button"
                onClick={onClose}
                className={styles.closeButton}
                aria-label="닫기"
                >
                ×
                </button>
            </div>

            {description && (
                <p className={styles.description}>
                {description}
                </p>
            )}

            <div className={styles.searchBox}>
                <input
                type="search"
                value={searchValue}
                onChange={(event) =>
                    setSearchValue(event.target.value)
                }
                placeholder="찾으시는 분야가 있나요?"
                className={styles.searchInput}
                aria-label="태그 검색"
                />

                <img
                src={searchIcon}
                alt=""
                className={styles.searchIcon}
                />
            </div>

            <div className={styles.sectionArea}>
                {filteredSections.length > 0 ? (
                filteredSections.map((section) => (
                    <div
                    key={section.id}
                    className={styles.tagSection}
                    >
                    <p className={styles.sectionTitle}>
                        {section.title}
                    </p>

                    <div className={styles.tagList}>
                        {section.options.map((option) => {
                        const selected = isSelected(
                            option.id,
                        );

                        const isDisabled =
                            temporarySelected.length >=
                            maxCount && !selected;

                        return (
                            <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                                handleToggle(option)
                            }
                            disabled={isDisabled}
                            className={`${
                                styles.tagButton
                            } ${
                                selected
                                ? styles.selectedTagButton
                                : ""
                            }`}
                            >
                            <span>{option.name}</span>

                            {selected && (
                                <span
                                className={
                                    styles.removeIcon
                                }
                                aria-hidden="true"
                                >
                                ×
                                </span>
                            )}
                            </button>
                        );
                        })}
                    </div>
                    </div>
                ))
                ) : (
                <p className={styles.emptyMessage}>
                    검색 결과가 없습니다.
                </p>
                )}
            </div>
            </div>

            <div className={styles.footer}>
            <div className={styles.selectedHeader}>
                <p className={styles.selectedLabel}>
                선택된 필터
                </p>

                <p className={styles.selectedCount}>
                {temporarySelected.length}/{maxCount}
                </p>
            </div>

            <div className={styles.selectedList}>
                {temporarySelected.length > 0 ? (
                temporarySelected.map((item) => (
                    <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                        handleToggle(item)
                    }
                    className={styles.selectedItem}
                    aria-label={`${item.name} 선택 해제`}
                    >
                    <span>{item.name}</span>
                    <span aria-hidden="true">×</span>
                    </button>
                ))
                ) : (
                <p className={styles.selectedEmpty}>
                    선택된 항목이 없습니다.
                </p>
                )}
            </div>

            <div className={styles.buttonArea}>
                <button
                type="button"
                className={styles.resetButton}
                onClick={handleReset}
                >
                초기화
                </button>

                <button
                type="button"
                onClick={handleConfirm}
                className={styles.confirmButton}
                >
                {temporarySelected.length > 0
                    ? `${temporarySelected.length}개의 태그 적용하기`
                    : "태그 적용하기"}
                </button>
            </div>
            </div>
        </section>
        </div>
    );
    };

    export default TagSelectModal;