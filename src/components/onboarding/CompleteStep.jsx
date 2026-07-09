    import OnboardingLayout from "../common/OnboardingLayout";
    import styles from "./CompleteStep.module.css";

    const CompleteStep = ({ data, currentStep, totalSteps }) => {
    const isDeveloper = data.job === "frontend" || data.job === "backend";

    return (
        <OnboardingLayout
        showBackButton={false}
        currentStep={currentStep}
        totalSteps={totalSteps}
        >
        <section className={styles.container}>
            <div className={styles.textArea}>
            <h1 className={`headline1 ${styles.title}`}>
                OO님의 기본 카드가 생성됐어요
            </h1>
            <p className={`caption1 ${styles.description}`}>
                기본 카드는 전체보기 탭에 등록돼요. 새로운 인맥을 찾고 프로필 카드를 교환해보세요!
            </p>
            </div>

            <article className={styles.card}>
            <p className={`caption1 ${styles.job}`}>
                {isDeveloper ? "Frontend Developer" : "Planner"}
            </p>

            <div className={styles.profileRow}>
                <div className={styles.avatar}></div>

                <div>
                <strong className={`body1 ${styles.name}`}>홍길동</strong>
                <p className={`caption1 ${styles.affiliation}`}>
                    {data.affiliationType} · {data.affiliation}
                </p>
                </div>
            </div>

            <div className={styles.tagList}>
                {(isDeveloper ? data.techStacks : data.interests || [])
                .slice(0, 3)
                .map((item) => (
                    <span key={item.id} className={`caption1 ${styles.tag}`}>
                    {item.name}
                    </span>
                ))}
            </div>

            <p className={`caption1 ${styles.introduction}`}>
                {data.introduction || "한 줄 소개가 없습니다."}
            </p>

            {data.strength && (
                <div className={styles.strengthBox}>
                <img
                src={data.strength.icon}
                alt={data.strength.title}
                className={styles.strengthIcon}
                />
                <span className={`caption1 ${styles.strengthText}`}>
                    {data.strength.title}
                </span>
                </div>
            )}
            </article>

            <button type="button" className={`body1 ${styles.nextButton}`}>
            보러가기
            </button>
        </section>
        </OnboardingLayout>
    );
    };

    export default CompleteStep;