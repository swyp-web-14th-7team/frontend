import {
    useMemo,
    useState,
} from "react";

import searchIcon from "../../assets/icons/icon_search.svg";

/*
 * 스킬 필터와 똑같은 디자인을 사용하기 위해
 * SkillFilterModal의 CSS를 그대로 공유합니다.
 */
import styles from "./SkillFilterModal.module.css";

const MAX_SELECTED_TAGS = 10;

const InterestFilterModal = ({
    options = [],
    selectedInterests = [],
    onClose,
    onApply,
}) => {
    const [keyword, setKeyword] =
        useState("");

    /*
     * selectedInterests에는 관심분야 ID가 들어옵니다.
     * 화면을 표시할 때 options에서 ID에 맞는 객체를 찾습니다.
     */
    const [
        tempSelectedInterests,
        setTempSelectedInterests,
    ] = useState(() => {
        return selectedInterests
            .map((selectedInterest) => {
                const selectedId =
                    typeof selectedInterest ===
                    "object"
                        ? selectedInterest.id
                        : selectedInterest;

                return options.find(
                    (option) =>
                        String(option.id) ===
                        String(selectedId),
                );
            })
            .filter(Boolean);
    });

    const normalizedKeyword =
        keyword.trim().toLowerCase();

    const filteredOptions = useMemo(() => {
        if (!normalizedKeyword) {
            return options;
        }

        return options.filter((option) =>
            option.name
                .toLowerCase()
                .includes(normalizedKeyword),
        );
    }, [
        normalizedKeyword,
        options,
    ]);

    const isSelected = (itemId) => {
        return tempSelectedInterests.some(
            (item) =>
                String(item.id) ===
                String(itemId),
        );
    };

    const handleItemClick = (item) => {
        if (isSelected(item.id)) {
            setTempSelectedInterests(
                (previousItems) =>
                    previousItems.filter(
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
            tempSelectedInterests.length >=
            MAX_SELECTED_TAGS
        ) {
            return;
        }

        setTempSelectedInterests(
            (previousItems) => [
                ...previousItems,
                item,
            ],
        );
    };

    const handleReset = () => {
        setTempSelectedInterests([]);
        setKeyword("");
    };

    const handleApply = () => {
        /*
         * Saved.jsx에서는 관심분야 ID 배열을 사용하므로
         * 선택된 객체를 다시 ID 배열로 변환해서 전달합니다.
         */
        const selectedIds =
            tempSelectedInterests.map(
                (item) => item.id,
            );

        onApply?.(selectedIds);
        onClose?.();
    };

    const handleOverlayClick = (
        event,
    ) => {
        if (
            event.target ===
            event.currentTarget
        ) {
            onClose?.();
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
                aria-labelledby="interest-filter-title"
            >
                <div
                    className={
                        styles.header
                    }
                >
                    <h2
                        id="interest-filter-title"
                        className={
                            styles.title
                        }
                    >
                        검색 필터
                    </h2>

                    <button
                        type="button"
                        className={
                            styles.closeButton
                        }
                        onClick={onClose}
                        aria-label="관심분야 필터 닫기"
                    >
                        ×
                    </button>
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
                        placeholder="찾으시는 분야가 있나요?"
                        className={
                            styles.searchInput
                        }
                        aria-label="관심분야 검색"
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
                        {filteredOptions.length >
                        0 ? (
                            <div
                                className={
                                    styles.optionSection
                                }
                            >
                                <p
                                    className={
                                        styles.sectionTitle
                                    }
                                >
                                    관심분야
                                </p>

                                <div
                                    className={
                                        styles.optionList
                                    }
                                >
                                    {filteredOptions.map(
                                        (
                                            item,
                                        ) => {
                                            const selected =
                                                isSelected(
                                                    item.id,
                                                );

                                            const selectionLimitReached =
                                                tempSelectedInterests.length >=
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
                                                    }`}
                                                    onClick={() =>
                                                        handleItemClick(
                                                            item,
                                                        )
                                                    }
                                                    disabled={
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
                        ) : (
                            <p
                                className={
                                    styles.emptyMessage
                                }
                            >
                                검색 결과가
                                없습니다.
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
                            {tempSelectedInterests.length >
                            0 ? (
                                tempSelectedInterests.map(
                                    (
                                        item,
                                    ) => (
                                        <button
                                            key={
                                                item.id
                                            }
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
                                                aria-hidden="true"
                                            >
                                                ×
                                            </span>
                                        </button>
                                    ),
                                )
                            ) : (
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
                            {tempSelectedInterests.length >
                            0
                                ? `${tempSelectedInterests.length}개의 태그 적용하기`
                                : "태그 적용하기"}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default InterestFilterModal;