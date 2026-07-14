    import { useMemo, useState } from "react";

    import styles from "./SkillFilterModal.module.css";

    import searchIcon from "../../assets/icons/icon_search.svg";

    const SKILL_OPTIONS = [
    { id: "skill-1", name: "JavaScript", type: "skill" },
    { id: "skill-2", name: "TypeScript", type: "skill" },
    { id: "skill-3", name: "React", type: "skill" },
    { id: "skill-4", name: "Next.js", type: "skill" },
    { id: "skill-5", name: "Java", type: "skill" },
    { id: "skill-6", name: "Spring", type: "skill" },
    { id: "skill-7", name: "Python", type: "skill" },
    { id: "skill-8", name: "Kotlin", type: "skill" },
    { id: "skill-9", name: "Swift", type: "skill" },
    { id: "skill-10", name: "데이터 분석", type: "skill" },
    { id: "skill-11", name: "사용자 리서치", type: "skill" },
    { id: "skill-12", name: "서비스 기획", type: "skill" },
    { id: "skill-13", name: "UI 디자인", type: "skill" },
    { id: "skill-14", name: "UX 디자인", type: "skill" },
    ];

    const TOOL_OPTIONS = [
    { id: "tool-1", name: "Figma", type: "tool" },
    { id: "tool-2", name: "Notion", type: "tool" },
    { id: "tool-3", name: "Jira", type: "tool" },
    { id: "tool-4", name: "Slack", type: "tool" },
    { id: "tool-5", name: "Git", type: "tool" },
    { id: "tool-6", name: "GitHub", type: "tool" },
    { id: "tool-7", name: "Adobe XD", type: "tool" },
    { id: "tool-8", name: "Photoshop", type: "tool" },
    { id: "tool-9", name: "Illustrator", type: "tool" },
    { id: "tool-10", name: "GA4", type: "tool" },
    { id: "tool-11", name: "Amplitude", type: "tool" },
    { id: "tool-12", name: "Miro", type: "tool" },
    ];

    const SkillFilterModal = ({
    selectedSkills = [],
    onClose,
    onApply,
    }) => {
    const [keyword, setKeyword] = useState("");
    const [tempSelectedSkills, setTempSelectedSkills] =
        useState(selectedSkills);

    const normalizedKeyword = keyword.trim().toLowerCase();

    const filteredSkills = useMemo(() => {
        if (!normalizedKeyword) {
        return SKILL_OPTIONS;
        }

        return SKILL_OPTIONS.filter((item) =>
        item.name.toLowerCase().includes(normalizedKeyword),
        );
    }, [normalizedKeyword]);

    const filteredTools = useMemo(() => {
        if (!normalizedKeyword) {
        return TOOL_OPTIONS;
        }

        return TOOL_OPTIONS.filter((item) =>
        item.name.toLowerCase().includes(normalizedKeyword),
        );
    }, [normalizedKeyword]);

    const isSelected = (itemId) =>
        tempSelectedSkills.some((item) => item.id === itemId);

    const handleItemClick = (item) => {
        if (isSelected(item.id)) {
        setTempSelectedSkills((prev) =>
            prev.filter((selectedItem) => selectedItem.id !== item.id),
        );

        return;
        }

        setTempSelectedSkills((prev) => [...prev, item]);
    };

    const handleReset = () => {
        setTempSelectedSkills([]);
    };

    const handleApply = () => {
        onApply(tempSelectedSkills);
        onClose();
    };

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
        onClose();
        }
    };

    const renderOptions = (options) => {
        if (options.length === 0) {
        return (
            <p className={styles.emptyMessage}>
            검색 결과가 없습니다.
            </p>
        );
        }

        return options.map((item) => {
        const selected = isSelected(item.id);

        return (
            <button
            key={item.id}
            type="button"
            className={`${styles.itemButton} ${
                selected ? styles.selectedItem : ""
            }`}
            onClick={() => handleItemClick(item)}
            >
            {item.name}
            </button>
        );
        });
    };

    return (
        <div
        className={styles.overlay}
        onClick={handleOverlayClick}
        >
        <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="skill-filter-title"
        >
            <div className={styles.header}>
            <h2
                id="skill-filter-title"
                className={styles.title}
            >
                검색 필터
            </h2>

            <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label="검색 필터 닫기"
            >
                ×
            </button>
            </div>

            <div className={styles.searchBox}>
            <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="스킬이나 툴을 검색해보세요."
                className={styles.searchInput}
            />

            <img
                src={searchIcon}
                alt=""
                className={styles.searchIcon}
            />
            </div>

            <div className={styles.optionArea}>
            <div className={styles.optionSection}>
                <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>스킬</span>
                <span className={styles.sectionLine} />
                </div>

                <div className={styles.optionList}>
                {renderOptions(filteredSkills)}
                </div>
            </div>

            <div className={styles.optionSection}>
                <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>툴</span>
                <span className={styles.sectionLine} />
                </div>

                <div className={styles.optionList}>
                {renderOptions(filteredTools)}
                </div>
            </div>
            </div>

            <div className={styles.selectedArea}>
            <p className={styles.selectedLabel}>
                선택된 항목
            </p>

            <div className={styles.selectedList}>
                {tempSelectedSkills.length > 0 ? (
                tempSelectedSkills.map((item) => (
                    <button
                    key={item.id}
                    type="button"
                    className={styles.selectedTag}
                    onClick={() => handleItemClick(item)}
                    aria-label={`${item.name} 선택 해제`}
                    >
                    <span>{item.name}</span>
                    <span className={styles.removeIcon}>×</span>
                    </button>
                ))
                ) : (
                <p className={styles.selectedEmpty}>
                    선택된 항목이 없습니다.
                </p>
                )}
            </div>
            </div>

            <div className={styles.footer}>
            <button
                type="button"
                className={styles.resetButton}
                onClick={handleReset}
            >
                초기화
            </button>

            <button
            type="button"
            className={styles.applyButton}
            onClick={handleApply}
            >
            {tempSelectedSkills.length > 0
                ? `${tempSelectedSkills.length}개의 태그 적용하기`
                : "태그 적용하기"}
            </button>
            </div>
        </section>
        </div>
    );
    };

    export default SkillFilterModal;