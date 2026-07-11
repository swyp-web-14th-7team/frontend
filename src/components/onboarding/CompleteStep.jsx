    import { useNavigate } from "react-router-dom";

    import OnboardingLayout from "../common/OnboardingLayout";
    import CompleteProfileCard from "../profile/CompleteProfileCard";

    import styles from "./CompleteStep.module.css";

    const CompleteStep = ({
    data,
    currentStep,
    totalSteps,
    }) => {
    const navigate = useNavigate();

    const handleViewProfile = () => {
        navigate("/explore");
    };

    return (
        <OnboardingLayout
        showBackButton={false}
        showProgress={true}
        currentStep={currentStep}
        totalSteps={totalSteps}
        >
        <section className={styles.container}>
            <div className={styles.textArea}>
            <h1 className={`headline1 ${styles.title}`}>
                OO님의 기본 카드가 생성됐어요
            </h1>

            <p className={`caption1 ${styles.description}`}>
                기본 카드는 전체보기 탭에 등록돼요
                <br />
                새로운 인맥을 찾고 프로필 카드를 교환해보세요!
            </p>
            </div>

            <div className={styles.cardArea}>
            <CompleteProfileCard
                data={data}
                name="홍길동"
                profileImage={data.profileImage}
            />
            </div>

            <button
            type="button"
            onClick={handleViewProfile}
            className={`body1 ${styles.nextButton}`}
            >
            보러가기
            </button>
        </section>
        </OnboardingLayout>
    );
    };

    export default CompleteStep;