    import { useMemo, useState } from "react";

    import styles from "./SkillFilterModal.module.css";

    import searchIcon from "../../assets/icons/icon_search.svg";

    const FILTER_SECTIONS = [
    {
        id: "tools",
        title: "툴",
        options: [
        { id: "tool-figma", name: "Figma", type: "tool" },
        { id: "tool-photoshop", name: "Photoshop", type: "tool" },
        { id: "tool-hixfield", name: "Hixfield", type: "tool" },
        { id: "tool-indesign", name: "Indesign", type: "tool" },
        { id: "tool-illustrator", name: "Illustrator", type: "tool" },
        { id: "tool-protopie", name: "Protopie", type: "tool" },
        { id: "tool-framer", name: "Framer", type: "tool" },
        { id: "tool-maze", name: "MazeUT", type: "tool" },
        { id: "tool-after-effects", name: "After effects", type: "tool" },
        { id: "tool-notion", name: "Notion", type: "tool" },
        { id: "tool-kling", name: "KlingAI", type: "tool" },
        { id: "tool-midjourney", name: "Midjourney", type: "tool" },
        { id: "tool-adobe-xd", name: "Adobe XD", type: "tool" },
        { id: "tool-premiere", name: "Premiere Pro", type: "tool" },
        ],
    },

    {
        id: "languages",
        title: "개발 언어",
        options: [
        {
            id: "language-javascript",
            name: "JavaScript",
            type: "language",
        },
        {
            id: "language-typescript",
            name: "TypeScript",
            type: "language",
        },
        { id: "language-java", name: "Java", type: "language" },
        {
            id: "language-kotlin",
            name: "Kotlin",
            type: "language",
        },
        {
            id: "language-python",
            name: "Python",
            type: "language",
        },
        { id: "language-go", name: "Go", type: "language" },
        { id: "language-csharp", name: "C#", type: "language" },
        { id: "language-ruby", name: "Ruby", type: "language" },
        { id: "language-dart", name: "Dart", type: "language" },
        { id: "language-r", name: "R", type: "language" },
        { id: "language-rust", name: "Rust", type: "language" },
        { id: "language-swift", name: "Swift", type: "language" },
        {
            id: "language-objective-c",
            name: "Objective-C",
            type: "language",
        },
        { id: "language-cpp", name: "C++", type: "language" },
        { id: "language-c", name: "C", type: "language" },
        ],
    },

    {
        id: "frameworks",
        title: "프레임워크",
        options: [
        {
            id: "framework-react",
            name: "React",
            type: "framework",
        },
        {
            id: "framework-next",
            name: "Next.js",
            type: "framework",
        },
        {
            id: "framework-vue",
            name: "Vue",
            type: "framework",
        },
        {
            id: "framework-nuxt",
            name: "Nuxt.js",
            type: "framework",
        },
        {
            id: "framework-angular",
            name: "Angular",
            type: "framework",
        },
        {
            id: "framework-svelte",
            name: "Svelte",
            type: "framework",
        },
        {
            id: "framework-remix",
            name: "Remix",
            type: "framework",
        },
        {
            id: "framework-astro",
            name: "Astro",
            type: "framework",
        },
        {
            id: "framework-spring",
            name: "Spring",
            type: "framework",
        },
        {
            id: "framework-django",
            name: "Django",
            type: "framework",
        },
        ],
    },
    ];

    const MAX_SELECTED_TAGS = 10;

    const SkillFilterModal = ({
    selectedSkills = [],
    onClose,
    onApply,
    }) => {
    const [keyword, setKeyword] = useState("");

    const [tempSelectedSkills, setTempSelectedSkills] =
        useState(selectedSkills);

    const normalizedKeyword =
        keyword.trim().toLowerCase();

    const filteredSections = useMemo(() => {
        return FILTER_SECTIONS.map((section) => {
        const filteredOptions = normalizedKeyword
            ? section.options.filter((item) =>
                item.name
                .toLowerCase()
                .includes(normalizedKeyword),
            )
            : section.options;

        return {
            ...section,
            options: filteredOptions,
        };
        }).filter((section) => section.options.length > 0);
    }, [normalizedKeyword]);

    const isSelected = (itemId) =>
        tempSelectedSkills.some(
        (item) => item.id === itemId,
        );

    const handleItemClick = (item) => {
        if (isSelected(item.id)) {
        setTempSelectedSkills((prev) =>
            prev.filter(
            (selectedItem) =>
                selectedItem.id !== item.id,
            ),
        );

        return;
        }

        if (
        tempSelectedSkills.length >= MAX_SELECTED_TAGS
        ) {
        return;
        }

        setTempSelectedSkills((prev) => [
        ...prev,
        item,
        ]);
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
                onChange={(event) =>
                setKeyword(event.target.value)
                }
                placeholder="찾으시는 스킬이 있나요?"
                className={styles.searchInput}
                aria-label="스킬 및 툴 검색"
            />

            <img
                src={searchIcon}
                alt=""
                className={styles.searchIcon}
            />
            </div>

            <div className={styles.scrollArea}>
            <div className={styles.optionArea}>
                {filteredSections.length > 0 ? (
                filteredSections.map((section) => (
                    <div
                    key={section.id}
                    className={styles.optionSection}
                    >
                    <p className={styles.sectionTitle}>
                        {section.title}
                    </p>

                    <div className={styles.optionList}>
                        {section.options.map((item) => {
                        const selected = isSelected(
                            item.id,
                        );

                        const selectionLimitReached =
                            tempSelectedSkills.length >=
                            MAX_SELECTED_TAGS &&
                            !selected;

                        return (
                            <button
                            key={item.id}
                            type="button"
                            className={`${
                                styles.itemButton
                            } ${
                                selected
                                ? styles.selectedItem
                                : ""
                            }`}
                            onClick={() =>
                                handleItemClick(item)
                            }
                            disabled={
                                selectionLimitReached
                            }
                            >
                            <span>{item.name}</span>

                            {selected && (
                                <span
                                className={
                                    styles.itemRemoveIcon
                                }
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

            <div className={styles.bottomArea}>
            <div className={styles.selectedArea}>
                <p className={styles.selectedLabel}>
                선택된 필터
                </p>

                <div className={styles.selectedList}>
                {tempSelectedSkills.length > 0 ? (
                    tempSelectedSkills.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={styles.selectedTag}
                        onClick={() =>
                        handleItemClick(item)
                        }
                        aria-label={`${item.name} 선택 해제`}
                    >
                        <span>{item.name}</span>

                        <span
                        className={styles.removeIcon}
                        >
                        ×
                        </span>
                    </button>
                    ))
                ) : (
                    <p className={styles.selectedEmpty}>
                    선택된 필터가 없습니다.
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
            </div>
        </section>
        </div>
    );
    };

    export default SkillFilterModal;