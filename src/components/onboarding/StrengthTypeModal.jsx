    import { useState } from "react";

    import coordinatorIcon from "../../assets/images/조율가.svg";
    import ideaIcon from "../../assets/images/아이디어뱅크.svg";
    import executeIcon from "../../assets/images/실행력.svg";
    import decisionIcon from "../../assets/images/결정가.svg";
    import organizeIcon from "../../assets/images/정리구조화.svg";
    import etcIcon from "../../assets/images/무언가.svg";
    import styles from "./StrengthTypeModal.module.css";

    const strengthOptions = [
    {
        id: 1,
        title: "조율가",
        description: "팀의 균형을 맞추고 의견을 조율해요",
        icon: coordinatorIcon,
    },
    {
        id: 2,
        title: "아이디어 뱅크",
        description: "새로운 아이디어를 자주 제안해요",
        icon: ideaIcon,
    },
    {
        id: 3,
        title: "실행력 MAX",
        description: "무엇이든 빠르게 만들고 보는 실행가예요",
        icon: executeIcon,
    },
    {
        id: 4,
        title: "결정가",
        description: "빠르게 판단하고 방향을 정해요",
        icon: decisionIcon,
    },
    {
        id: 5,
        title: "정리 구조화",
        description: "복잡한 내용을 보기 좋게 정리해요",
        icon: organizeIcon,
    },
    {
        id: 6,
        title: "무언가",
        description: "추후 수정",
        icon: etcIcon,
    },
    ];

    const StrengthTypeModal = ({
    selectedItem,
    onClose,
    onConfirm,
    }) => {
    const [tempSelected, setTempSelected] = useState(selectedItem || null);

    const handleConfirm = () => {
        if (!tempSelected) return;
        onConfirm(tempSelected);
    };

    return (
        <div className={styles.overlay}>
        <div className={styles.modal}>
            <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            >
            ×
            </button>

            <h2 className={`body1 ${styles.title}`}>나의 소통 타입</h2>
            <p className={`caption1 ${styles.description}`}>
            어떤 타입에 가장 가까운지 선택하면 다른 사람들이 OO님을 파악하기 쉬울 거예요
            </p>

            <div className={styles.optionGrid}>
            {strengthOptions.map((option) => {
                const isSelected = tempSelected?.id === option.id;

                return (
                <button
                    key={option.id}
                    type="button"
                    onClick={() => setTempSelected(option)}
                    className={`${styles.optionButton} ${
                    isSelected ? styles.selected : ""
                    }`}
                >
                    <img
                    src={option.icon}
                    alt={option.title}
                    className={styles.icon}
                    />
                    <span className={`caption1 ${styles.optionTitle}`}>
                    {option.title}
                    </span>
                </button>
                );
            })}
            </div>

            {tempSelected && (
            <div className={styles.previewBox}>
                <span className={styles.previewIcon}></span>

                <div>
                <p className={`body1 ${styles.previewTitle}`}>
                    {tempSelected.title}
                </p>
                <p className={`caption1 ${styles.previewDescription}`}>
                    {tempSelected.description}
                </p>
                </div>
            </div>
            )}

            <button
            type="button"
            className={`body1 ${styles.confirmButton}`}
            onClick={handleConfirm}
            disabled={!tempSelected}
            >
            등록
            </button>
        </div>
        </div>
    );
    };

    export default StrengthTypeModal;