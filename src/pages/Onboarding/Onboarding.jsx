    import { useState } from "react";

    import CardBasicStep from "../../components/onboarding/CardBasicStep";
    import CompleteStep from "../../components/onboarding/CompleteStep";
    import JobSelectStep from "../../components/onboarding/JobSelectStep";
    import LoadingStep from "../../components/onboarding/LoadingStep";
    import WelcomeStep from "../../components/onboarding/WelcomeStep";

    const Onboarding = () => {
    const [step, setStep] = useState(0);

    const [onboardingData, setOnboardingData] = useState({
        job: "",
        affiliationType: "직장인",
        affiliation: "",
        introduction: "",
        interests: [],
        techStacks: [],
        strength: null,
    });

    const totalSteps = 5;

    const nextStep = () => {
        setStep((prev) => Math.min(prev + 1, totalSteps - 1));
    };

    const prevStep = () => {
        setStep((prev) => Math.max(prev - 1, 0));
    };

    const updateOnboardingData = (newData) => {
        setOnboardingData((prev) => ({
        ...prev,
        ...newData,
        }));
    };

    const steps = [
        <WelcomeStep
        onNext={nextStep}
        currentStep={step}
        totalSteps={totalSteps}
        />,

        <JobSelectStep
        data={onboardingData}
        onChange={updateOnboardingData}
        onNext={nextStep}
        onBack={prevStep}
        currentStep={step}
        totalSteps={totalSteps}
        />,

        <CardBasicStep
        data={onboardingData}
        onChange={updateOnboardingData}
        onNext={nextStep}
        onBack={prevStep}
        currentStep={step}
        totalSteps={totalSteps}
        />,

        <LoadingStep
        onComplete={nextStep}
        currentStep={step}
        totalSteps={totalSteps}
        />,

        <CompleteStep
        data={onboardingData}
        currentStep={step}
        totalSteps={totalSteps}
        />,
    ];

    return <>{steps[step]}</>;
    };

    export default Onboarding;