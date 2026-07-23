import {
    useState,
} from "react";

import styles from "./StrengthTypeModal.module.css";

const getPersonalityImage = (
    imageUrl,
) => {
    if (!imageUrl) {
        return "";
    }

    return `${imageUrl.replace(
        /\/$/,
        "",
    )}/36.webp`;
};

const StrengthTypeModal = ({
    options = [],
    selectedItem,
    onClose,
    onConfirm,
}) => {
    const [tempSelected, setTempSelected] =
        useState(
            selectedItem || null,
        );

    const personalityOptions =
        options.map((option) => ({
            id: option.id,

            title: option.name,

            description:
                option.description,

            icon:
                getPersonalityImage(
                    option.imageUrl,
                ),
        }));

    const handleConfirm = () => {
        if (!tempSelected) {
            return;
        }

        onConfirm(tempSelected);
    };

    return (
        <div
            className={
                styles.overlay
            }
            onClick={onClose}
        >
            <section
                className={
                    styles.modal
                }
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                <div
                    className={
                        styles.content
                    }
                >
                    <div
                        className={
                            styles.header
                        }
                    >
                        <div>
                            <h2
                                className={`body1 ${styles.title}`}
                            >
                                나의 소통 타입
                            </h2>

                            <p
                                className={`caption1 ${styles.description}`}
                            >
                                어떤 타입에
                                가장 가까운지
                                선택하면 다른
                                사람들이 나를
                                파악하기 쉬워요.
                            </p>
                        </div>

                        <button
                            type="button"
                            className={
                                styles.closeButton
                            }
                            onClick={
                                onClose
                            }
                            aria-label="닫기"
                        >
                            ×
                        </button>
                    </div>

                    <div
                        className={
                            styles.optionGrid
                        }
                    >
                        {personalityOptions.map(
                            (
                                option,
                            ) => {
                                const isSelected =
                                    tempSelected?.id ===
                                    option.id;

                                return (
                                    <button
                                        key={
                                            option.id
                                        }
                                        type="button"
                                        onClick={() =>
                                            setTempSelected(
                                                option,
                                            )
                                        }
                                        aria-pressed={
                                            isSelected
                                        }
                                        className={`${styles.optionButton} ${
                                            isSelected
                                                ? styles.selected
                                                : ""
                                        }`}
                                    >
                                        {option.icon ? (
                                            <img
                                                src={
                                                    option.icon
                                                }
                                                alt=""
                                                className={
                                                    styles.icon
                                                }
                                            />
                                        ) : (
                                            <span
                                                className={
                                                    styles.icon
                                                }
                                                aria-hidden="true"
                                            />
                                        )}

                                        <span
                                            className={`caption1 ${styles.optionTitle}`}
                                        >
                                            {
                                                option.title
                                            }
                                        </span>
                                    </button>
                                );
                            },
                        )}
                    </div>

                    {tempSelected && (
                        <div
                            className={
                                styles.previewBox
                            }
                        >
                            {tempSelected.icon && (
                                <img
                                    src={
                                        tempSelected.icon
                                    }
                                    alt=""
                                    className={
                                        styles.previewIcon
                                    }
                                />
                            )}

                            <div
                                className={
                                    styles.previewText
                                }
                            >
                                <p
                                    className={`body1 ${styles.previewTitle}`}
                                >
                                    {
                                        tempSelected.title
                                    }
                                </p>

                                <p
                                    className={`caption1 ${styles.previewDescription}`}
                                >
                                    {
                                        tempSelected.description
                                    }
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div
                    className={
                        styles.footer
                    }
                >
                    <button
                        type="button"
                        className={
                            styles.confirmButton
                        }
                        onClick={
                            handleConfirm
                        }
                        disabled={
                            !tempSelected
                        }
                    >
                        등록
                    </button>
                </div>
            </section>
        </div>
    );
};

export default StrengthTypeModal;