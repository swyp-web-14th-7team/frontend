    import { useState } from "react";

    import OnboardingLayout from "../common/OnboardingLayout";
    import CommonCardForm from "./CommonCardForm";
    import DeveloperCardForm from "./DeveloperCardForm";
    import GeneralCardForm from "./GeneralCardForm";
    import TagSelectModal from "./TagSelectModal";
    import StrengthTypeModal from "./StrengthTypeModal";

    import styles from "./CardBasicStep.module.css";

    const DEVELOPER_SECTIONS = [
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
        {
            id: "language-java",
            name: "Java",
            type: "language",
        },
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
        {
            id: "language-swift",
            name: "Swift",
            type: "language",
        },
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
    {
        id: "tools",
        title: "툴",
        options: [
        {
            id: "tool-git",
            name: "Git",
            type: "tool",
        },
        {
            id: "tool-github",
            name: "GitHub",
            type: "tool",
        },
        {
            id: "tool-jira",
            name: "Jira",
            type: "tool",
        },
        {
            id: "tool-slack",
            name: "Slack",
            type: "tool",
        },
        {
            id: "tool-notion",
            name: "Notion",
            type: "tool",
        },
        ],
    },
    ];

    const PLANNER_DESIGNER_SECTIONS = [
    {
        id: "interests",
        title: "관심 분야",
        options: [
        {
            id: "interest-ai",
            name: "AI",
            type: "interest",
        },
        {
            id: "interest-automation",
            name: "자동화 효율화",
            type: "interest",
        },
        {
            id: "interest-ecommerce",
            name: "이커머스",
            type: "interest",
        },
        {
            id: "interest-entertainment",
            name: "엔터테인먼트",
            type: "interest",
        },
        {
            id: "interest-reading",
            name: "독서",
            type: "interest",
        },
        {
            id: "interest-service-planning",
            name: "서비스 기획",
            type: "interest",
        },
        {
            id: "interest-user-research",
            name: "사용자 리서치",
            type: "interest",
        },
        {
            id: "interest-ui-design",
            name: "UI 디자인",
            type: "interest",
        },
        {
            id: "interest-ux-design",
            name: "UX 디자인",
            type: "interest",
        },
        {
            id: "interest-branding",
            name: "브랜딩",
            type: "interest",
        },
        ],
    },
    {
        id: "tools",
        title: "툴",
        options: [
        {
            id: "tool-figma",
            name: "Figma",
            type: "tool",
        },
        {
            id: "tool-photoshop",
            name: "Photoshop",
            type: "tool",
        },
        {
            id: "tool-illustrator",
            name: "Illustrator",
            type: "tool",
        },
        {
            id: "tool-notion",
            name: "Notion",
            type: "tool",
        },
        {
            id: "tool-jira",
            name: "Jira",
            type: "tool",
        },
        {
            id: "tool-miro",
            name: "Miro",
            type: "tool",
        },
        ],
    },
    ];

    const CardBasicStep = ({
    data,
    onChange,
    onNext,
    onBack,
    currentStep,
    totalSteps,
    }) => {
    const [modalType, setModalType] = useState(null);

    const handleChange = (key, value) => {
        onChange({
        [key]: value,
        });
    };

    const isDeveloper =
        data.job === "frontend" ||
        data.job === "backend";

    const isFormValid =
        (data.affiliation || "").trim() !== "" &&
        (data.introduction || "").trim() !== "" &&
        Boolean(data.strength) &&
        (isDeveloper
        ? (data.techStacks || []).length > 0
        : (data.interests || []).length > 0);

    return (
        <OnboardingLayout
        showBackButton={true}
        showProgress={true}
        onBack={onBack}
        currentStep={currentStep}
        totalSteps={totalSteps}
        >
        <section className={styles.container}>
            <div className={styles.textArea}>
            <h1 className={`headline1 ${styles.title}`}>
                카드에 들어갈 정보를
                <br className={styles.mobileBr} />
                알려주세요
            </h1>

            <p className={`caption1 ${styles.description}`}>
                나를 소개하기 위해 기본적인 정보를 작성해보세요
            </p>
            </div>

            <div className={styles.profileImageBox}>
            <div className={styles.profileCircle} />

            <button
                type="button"
                className={styles.editButton}
                aria-label="프로필 이미지 수정"
            >
                ✎
            </button>
            </div>

            <div className={styles.form}>
            <CommonCardForm
                data={data}
                handleChange={handleChange}
            />

            {isDeveloper ? (
                <DeveloperCardForm
                data={data}
                onOpenStackModal={() =>
                    setModalType("techStacks")
                }
                />
            ) : (
                <GeneralCardForm
                data={data}
                onOpenInterestModal={() =>
                    setModalType("interests")
                }
                />
            )}

            <div className={styles.field}>
                <label className={`caption1 ${styles.label}`}>
                저는 이런 사람이에요
                </label>

                {data.strength ? (
                <button
                    type="button"
                    className={styles.selectedStrength}
                    onClick={() => setModalType("strength")}
                >
                    <img
                    src={data.strength.icon}
                    alt=""
                    className={styles.strengthIcon}
                    />

                    <span className={styles.strengthText}>
                    <span
                        className={`caption1 ${styles.strengthTitle}`}
                    >
                        {data.strength.title}
                    </span>
                    </span>
                </button>
                ) : (
                <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => setModalType("strength")}
                >
                    + 선택하기
                </button>
                )}
            </div>

            <div className={styles.introductionField}>
                <textarea
                className={styles.textarea}
                value={data.introduction || ""}
                maxLength={250}
                onChange={(event) =>
                    handleChange(
                    "introduction",
                    event.target.value,
                    )
                }
                placeholder="성격, 역량 등을 작성해주세요"
                />

                <p className={styles.count}>
                {(data.introduction || "").length}/250
                </p>
            </div>
            </div>

            <button
            type="button"
            onClick={onNext}
            disabled={!isFormValid}
            className={`body1 ${
                isFormValid
                ? styles.nextButtonActive
                : styles.nextButton
            }`}
            >
            만들기
            </button>
        </section>

        {modalType === "techStacks" && (
            <TagSelectModal
            title="나의 스킬 및 툴"
            description="먼저 선택된 3개가 카드에 노출돼요"
            sections={DEVELOPER_SECTIONS}
            selectedItems={data.techStacks || []}
            maxCount={10}
            onClose={() => setModalType(null)}
            onConfirm={(selected) => {
                handleChange("techStacks", selected);
                setModalType(null);
            }}
            />
        )}

        {modalType === "interests" && (
            <TagSelectModal
            title="나의 관심 분야 및 툴"
            description="먼저 선택된 3개가 카드에 노출돼요"
            sections={PLANNER_DESIGNER_SECTIONS}
            selectedItems={data.interests || []}
            maxCount={10}
            onClose={() => setModalType(null)}
            onConfirm={(selected) => {
                handleChange("interests", selected);
                setModalType(null);
            }}
            />
        )}

        {modalType === "strength" && (
            <StrengthTypeModal
            selectedItem={data.strength}
            onClose={() => setModalType(null)}
            onConfirm={(selected) => {
                handleChange("strength", selected);
                setModalType(null);
            }}
            />
        )}
        </OnboardingLayout>
    );
    };

    export default CardBasicStep;