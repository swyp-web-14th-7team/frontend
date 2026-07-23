    import {
    useEffect,
    useMemo,
    useState,
    } from "react";

    import {
    getJobTypes,
    getSkills,
    } from "../../api/options";

    import styles from "./SkillFilterModal.module.css";

    import searchIcon from "../../assets/icons/icon_search.svg";

    const MAX_SELECTED_TAGS = 10;

    const getItems = (response) =>
    response?.items ||
    response?.data?.items ||
    response?.data ||
    [];

    const createFilterSections = (
    skills,
    ) => {
    const sectionMap = new Map();

    skills.forEach((skill) => {
        const title =
        skill.category?.name || "스킬";

        if (!sectionMap.has(title)) {
        sectionMap.set(title, []);
        }

        sectionMap
        .get(title)
        .push(skill);
    });

    return Array.from(
        sectionMap.entries(),
    ).map(
        (
        [title, options],
        index,
        ) => ({
        id: `skill-section-${index}`,
        title,
        options,
        }),
    );
    };

    const SkillFilterModal = ({
    selectedJobType = null,
    selectedSkills = [],
    onClose,
    onApply,
    }) => {
    const [
        keyword,
        setKeyword,
    ] = useState("");

    const [
        jobTypes,
        setJobTypes,
    ] = useState([]);

    const [
        allSkills,
        setAllSkills,
    ] = useState([]);

    const [
        allowedSkillIds,
        setAllowedSkillIds,
    ] = useState(null);

    const [
        tempJobType,
        setTempJobType,
    ] = useState(
        selectedJobType,
    );

    const [
        tempSelectedSkills,
        setTempSelectedSkills,
    ] = useState(
        selectedSkills,
    );

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    /*
    * 직군 목록과 전체 스킬 목록 조회
    */
    useEffect(() => {
        const controller =
        new AbortController();

        const loadInitialOptions =
        async () => {
            try {
            setIsLoading(true);
            setErrorMessage("");

            const [
                jobTypeResponse,
                skillResponse,
            ] = await Promise.all([
                getJobTypes({
                signal:
                    controller.signal,
                }),

                getSkills({
                signal:
                    controller.signal,
                }),
            ]);

            setJobTypes(
                getItems(
                jobTypeResponse,
                ),
            );

            setAllSkills(
                getItems(
                skillResponse,
                ),
            );
            } catch (error) {
            if (
                error.name !==
                "AbortError"
            ) {
                setErrorMessage(
                "필터 목록을 불러오지 못했습니다.",
                );
            }
            } finally {
            if (
                !controller.signal
                .aborted
            ) {
                setIsLoading(
                false,
                );
            }
            }
        };

        loadInitialOptions();

        return () => {
        controller.abort();
        };
    }, []);

    /*
    * 선택한 직군에 해당하는 스킬 조회
    *
    * 직군 선택이 없으면 allowedSkillIds를 null로
    * 변경하여 전체 스킬을 활성화한다.
    */
    useEffect(() => {
        if (!tempJobType?.id) {
        Promise.resolve().then(
            () => {
            setAllowedSkillIds(
                null,
            );
            },
        );

        return undefined;
        }

        const controller =
        new AbortController();

        getSkills({
        jobTypeId:
            tempJobType.id,

        signal:
            controller.signal,
        })
        .then((response) => {
            const allowedSkills =
            getItems(response);

            const nextAllowedIds =
            new Set(
                allowedSkills.map(
                (skill) =>
                    String(
                    skill.id,
                    ),
                ),
            );

            setAllowedSkillIds(
            nextAllowedIds,
            );

            /*
            * 직군 변경 후 해당 직군에서 사용할 수 없는
            * 기존 선택 스킬은 자동으로 해제한다.
            */
            setTempSelectedSkills(
            (currentSkills) =>
                currentSkills.filter(
                (skill) =>
                    nextAllowedIds.has(
                    String(
                        skill.id,
                    ),
                    ),
                ),
            );
        })
        .catch((error) => {
            if (
            error.name !==
            "AbortError"
            ) {
            setErrorMessage(
                "직군별 스킬을 불러오지 못했습니다.",
            );
            }
        });

        return () => {
        controller.abort();
        };
    }, [tempJobType]);

    const normalizedKeyword =
        keyword
        .trim()
        .toLowerCase();

    /*
    * 스킬을 카테고리별로 묶고 검색어로 필터링
    */
    const filteredSections =
        useMemo(() => {
        return createFilterSections(
            allSkills,
        )
            .map((section) => ({
            ...section,

            options:
                normalizedKeyword
                ? section.options.filter(
                    (item) =>
                        item.name
                        .toLowerCase()
                        .includes(
                            normalizedKeyword,
                        ),
                    )
                : section.options,
            }))
            .filter(
            (section) =>
                section.options.length >
                0,
            );
        }, [
        allSkills,
        normalizedKeyword,
        ]);

    /*
    * allowedSkillIds가 null이면
    * 직군 선택이 없는 상태이므로 모든 스킬 허용
    */
    const isAllowed = (
        itemId,
    ) => {
        return (
        allowedSkillIds ===
            null ||
        allowedSkillIds.has(
            String(itemId),
        )
        );
    };

    const isSelected = (
        itemId,
    ) => {
        return tempSelectedSkills.some(
        (item) =>
            String(item.id) ===
            String(itemId),
        );
    };

    /*
    * 같은 직군을 다시 누르면 선택 해제
    *
    * 선택 해제 후에는 전체 스킬이 활성화된다.
    */
    const handleJobClick = (
        jobType,
    ) => {
        setErrorMessage("");

        setTempJobType(
        (currentJobType) =>
            String(
            currentJobType?.id,
            ) ===
            String(jobType.id)
            ? null
            : jobType,
        );
    };

    const handleItemClick = (
        item,
    ) => {
        if (!isAllowed(item.id)) {
        return;
        }

        if (isSelected(item.id)) {
        setTempSelectedSkills(
            (currentSkills) =>
            currentSkills.filter(
                (selectedItem) =>
                String(
                    selectedItem.id,
                ) !==
                String(item.id),
            ),
        );

        return;
        }

        if (
        tempSelectedSkills.length >=
        MAX_SELECTED_TAGS
        ) {
        return;
        }

        setTempSelectedSkills(
        (currentSkills) => [
            ...currentSkills,
            item,
        ],
        );
    };

    const handleReset = () => {
        setKeyword("");
        setTempJobType(null);
        setTempSelectedSkills([]);
        setAllowedSkillIds(null);
        setErrorMessage("");
    };

    const handleApply = () => {
        onApply({
        jobType:
            tempJobType,

        skills:
            tempSelectedSkills,
        });

        onClose();
    };

    const handleOverlayClick = (
        event,
    ) => {
        if (
        event.target ===
        event.currentTarget
        ) {
        onClose();
        }
    };

    return (
        <div
        className={styles.overlay}
        onClick={
            handleOverlayClick
        }
        >
        <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="skill-filter-title"
        >
            <div
            className={
                styles.header
            }
            >
            <h2
                id="skill-filter-title"
                className={
                styles.title
                }
            >
                직군·스킬
            </h2>

            <button
                type="button"
                className={
                styles.closeButton
                }
                onClick={onClose}
                aria-label="직군·스킬 필터 닫기"
            >
                ×
            </button>
            </div>

            <div
            className={
                styles.jobArea
            }
            >
            <div
                className={
                styles.jobTitleRow
                }
            >
                <p
                className={
                    styles.sectionTitle
                }
                >
                직군
                </p>
            </div>

            <div
                className={
                styles.optionList
                }
            >
                {jobTypes.map(
                (jobType) => {
                    const selected =
                    String(
                        tempJobType?.id,
                    ) ===
                    String(
                        jobType.id,
                    );

                    return (
                    <button
                        key={
                        jobType.id
                        }
                        type="button"
                        className={`${
                        styles.itemButton
                        } ${
                        selected
                            ? styles.selectedItem
                            : ""
                        }`}
                        onClick={() =>
                        handleJobClick(
                            jobType,
                        )
                        }
                        aria-pressed={
                        selected
                        }
                    >
                        {
                        jobType.name
                        }
                    </button>
                    );
                },
                )}
            </div>
            </div>

            <div
            className={
                styles.searchBox
            }
            >
            <input
                type="search"
                value={keyword}
                onChange={(event) =>
                setKeyword(
                    event.target
                    .value,
                )
                }
                placeholder="찾으시는 스킬이 있나요?"
                className={
                styles.searchInput
                }
                aria-label="스킬 검색"
            />

            <img
                src={searchIcon}
                alt=""
                className={
                styles.searchIcon
                }
            />
            </div>

            <div
            className={
                styles.scrollArea
            }
            >
            <div
                className={
                styles.optionArea
                }
            >
                {isLoading ? (
                <p
                    className={
                    styles.emptyMessage
                    }
                >
                    필터를 불러오는
                    중입니다.
                </p>
                ) : errorMessage ? (
                <p
                    className={
                    styles.emptyMessage
                    }
                >
                    {errorMessage}
                </p>
                ) : filteredSections.length >
                0 ? (
                filteredSections.map(
                    (section) => {
                    const hasAllowedOption =
                        section.options.some(
                        (item) =>
                            isAllowed(
                            item.id,
                            ),
                        );

                    return (
                        <div
                        key={
                            section.id
                        }
                        className={`${
                            styles.optionSection
                        } ${
                            !hasAllowedOption
                            ? styles.disabledSection
                            : ""
                        }`}
                        >
                        <p
                            className={
                            styles.sectionTitle
                            }
                        >
                            {
                            section.title
                            }
                        </p>

                        <div
                            className={
                            styles.optionList
                            }
                        >
                            {section.options.map(
                            (
                                item,
                            ) => {
                                const selected =
                                isSelected(
                                    item.id,
                                );

                                const allowed =
                                isAllowed(
                                    item.id,
                                );

                                const selectionLimitReached =
                                tempSelectedSkills.length >=
                                    MAX_SELECTED_TAGS &&
                                !selected;

                                return (
                                <button
                                    key={
                                    item.id
                                    }
                                    type="button"
                                    className={`${
                                    styles.itemButton
                                    } ${
                                    selected
                                        ? styles.selectedItem
                                        : ""
                                    } ${
                                    !allowed
                                        ? styles.disabledItem
                                        : ""
                                    }`}
                                    onClick={() =>
                                    handleItemClick(
                                        item,
                                    )
                                    }
                                    disabled={
                                    !allowed ||
                                    selectionLimitReached
                                    }
                                    aria-pressed={
                                    selected
                                    }
                                >
                                    <span>
                                    {
                                        item.name
                                    }
                                    </span>

                                    {selected && (
                                    <span
                                        className={
                                        styles.itemRemoveIcon
                                        }
                                        aria-hidden="true"
                                    >
                                        ×
                                    </span>
                                    )}
                                </button>
                                );
                            },
                            )}
                        </div>
                        </div>
                    );
                    },
                )
                ) : (
                <p
                    className={
                    styles.emptyMessage
                    }
                >
                    검색 결과가 없습니다.
                </p>
                )}
            </div>
            </div>

            <div
            className={
                styles.bottomArea
            }
            >
            <div
                className={
                styles.selectedArea
                }
            >
                <p
                className={
                    styles.selectedLabel
                }
                >
                선택된 필터
                </p>

                <div
                className={
                    styles.selectedList
                }
                >
                {tempJobType && (
                    <button
                    type="button"
                    className={
                        styles.selectedTag
                    }
                    onClick={() =>
                        setTempJobType(
                        null,
                        )
                    }
                    aria-label={`${tempJobType.name} 선택 해제`}
                    >
                    <span>
                        {
                        tempJobType.name
                        }
                    </span>

                    <span
                        className={
                        styles.removeIcon
                        }
                    >
                        ×
                    </span>
                    </button>
                )}

                {tempSelectedSkills.map(
                    (item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={
                        styles.selectedTag
                        }
                        onClick={() =>
                        handleItemClick(
                            item,
                        )
                        }
                        aria-label={`${item.name} 선택 해제`}
                    >
                        <span>
                        {
                            item.name
                        }
                        </span>

                        <span
                        className={
                            styles.removeIcon
                        }
                        >
                        ×
                        </span>
                    </button>
                    ),
                )}

                {!tempJobType &&
                    tempSelectedSkills.length ===
                    0 && (
                    <p
                        className={
                        styles.selectedEmpty
                        }
                    >
                        선택된 필터가
                        없습니다.
                    </p>
                    )}
                </div>
            </div>

            <div
                className={
                styles.footer
                }
            >
                <button
                type="button"
                className={
                    styles.resetButton
                }
                onClick={
                    handleReset
                }
                >
                초기화
                </button>

                <button
                type="button"
                className={
                    styles.applyButton
                }
                onClick={
                    handleApply
                }
                >
                적용하기
                </button>
            </div>
            </div>
        </section>
        </div>
    );
    };

    export default SkillFilterModal;