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
        navigate("/mypage");
    };

    return (
        <OnboardingLayout
        showBackButton={false}
        showProgress={false}
        currentStep={currentStep}
        totalSteps={totalSteps}
        >
        <section className={styles.container}>
            <div className={styles.textArea}>
            <h1 className={`headline1 ${styles.title}`}>
                OO님의 기본 카드가 생성됐어요
            </h1>

            <p className={`caption1 ${styles.description}`}>
                기본 카드는 프로필과 팀원 목록에서 사용할 수 있어요
            </p>
            </div>

            <CompleteProfileCard
            data={data}
            name="홍길동"
            profileImage={data.profileImage}
            />

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