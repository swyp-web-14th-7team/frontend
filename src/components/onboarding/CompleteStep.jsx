import {
    useNavigate,
} from "react-router-dom";

import OnboardingLayout from "../common/OnboardingLayout";
import CompleteProfileCard from "../profile/CompleteProfileCard";

import {
    getProfileImageUrl,
} from "../../utils/profileMapper";

import avatarPlaceholderDefault from "../../assets/images/avatarPlaceholder_default.png";

import styles from "./CompleteStep.module.css";

const CompleteStep = ({
    data,
    currentStep,
    totalSteps,
}) => {
    const navigate =
        useNavigate();

    const createdProfile =
        data.createdProfile || {};

    const name =
        createdProfile.nickname ||
        data.nickname ||
        data.name ||
        "사용자";

    const profileImage =
        data.profileImagePreview ||
        getProfileImageUrl(
            createdProfile.profileImageUrl ||
            data.profileImageUrl ||
            data.profileImage,
        ) ||
        avatarPlaceholderDefault;

    const completedCardData = {
        ...data,

        affiliation:
            createdProfile.affiliation ||
            data.affiliation,

        introduction:
            createdProfile.description ||
            data.introduction,

        cardImageUrl:
            createdProfile.cardImageUrl ||
            data.cardImageUrl,
    };

    const handleViewMyCards =
        () => {
            navigate(
                "/profile",
            );
        };

    const handleExplore =
        () => {
            navigate(
                "/explore",
            );
        };

    return (
        <OnboardingLayout
            showBackButton={false}
            showProgress={true}
            currentStep={
                currentStep
            }
            totalSteps={
                totalSteps
            }
        >
            <section
                className={
                    styles.container
                }
            >
                <div
                    className={
                        styles.textArea
                    }
                >
                    <h1
                        className={`headline1 ${styles.title}`}
                    >
                        {name}님의 프로필
                        카드가 생성됐어요
                    </h1>

                    <p
                        className={`caption1 ${styles.description}`}
                    >
                        완성된 카드는 내 프로필에서
                        확인할 수 있어요
                        <br />
                        다른 사람의 카드도 둘러보고
                        연결해보세요!
                    </p>
                </div>

                <div
                    className={
                        styles.cardArea
                    }
                >
                    <CompleteProfileCard
                        data={
                            completedCardData
                        }
                        name={name}
                        profileImage={
                            profileImage
                        }
                    />
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        onClick={handleViewMyCards}
                        className={`body1 ${styles.nextButton}`}
                    >
                        내 카드 보기
                    </button>

                    <button
                        type="button"
                        onClick={handleExplore}
                        className={`body1 ${styles.exploreButton}`}
                    >
                        다른 사람 둘러보기
                    </button>
                </div>
            </section>
        </OnboardingLayout>
    );
};

export default CompleteStep;
