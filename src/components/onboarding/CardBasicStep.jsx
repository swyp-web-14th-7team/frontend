import OnboardingLayout from "../common/OnboardingLayout";
import styles from "./CardBasicStep.module.css";

const CardBasicStep = ({data, onChange, onNext, onBack, currentStep, totalSteps,}) => {
    const handleChange = (key, value) => {
        onChange({
            [key]: value,
        });
    };

    return <div>
        <OnboardingLayout
            showBackButton={true}
            onBack={onBack}
            currentStep={currentStep}
            totalSteps={totalSteps}>

                <section className={styles.container}>
                    <div className={styles.textArea}>
                        <h1 className={`heading ${styles.title}`}>
                            카드에 들어갈 정보를 알려주세요
                        </h1>
                        <p className={`body2 ${styles.dexcription}`}>
                            나를 소개하기 위해 기본적인 정보를 작성해보세요</p>
                    </div>

                    <div className={styles.profileImageBox}>
                        <div className={styles.profileCircle}/>
                        <button type="button" className={styles.editButton}>
                            </button>
                        </div>

                        <div className={styles.form}>
                            <div className={styles.field}>
                                <label className={`caption1 ${styles.label}`}>현 소속</label>

                                <div className={styles.affiliationRow}>
                                    <select
                                    className={styles.select}
                                    value={data.affiliationType}
                                    onChange={(e) => 
                                        handleChange("affiliationType", e.target.value)
                                    }
                                    >
                                        <option value="직장인">직장인</option>
                                        <option value="학생">학생</option>
                                        <option value="프리랜서">프리랜서</option>
                                        <option value="없음"></option>
                                    </select>

                                    <input
                                    className={styles.input}
                                    value={data.affiiation}
                                    onChange={(e) => handleChange("affiliation", e.target.value)}
                                    placeholder="텍스트를 입력하세요"/>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label className={`caption1 ${styles.label}`}>관심분야</label>

                                <button type="button" className={styles.addButton}>
                                    +추가하기
                                </button>
                            </div>

                            <div className={styles.field}>
                                <label className={`caption1 ${styles.label}`}>한 줄 소개</label>

                                <input 
                                className={styles.input}
                                value={data.introduction || ""}
                                onChange={(e) => handleChange("introduction", e.target.value)}
                                placeholder="성격, 역량 등을 작성해주세요"/>
                            </div>
                        </div>

                        <button 
                        type="button"
                        onClick={onNext}
                        className={`body1 ${styles.nextButton}`}>
                        만들기
                        </button>
                </section>
            </OnboardingLayout>
    </div>;
};

export default CardBasicStep;