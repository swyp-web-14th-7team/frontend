import { useState } from "react";

import  CardBasicStep  from "../../components/onboarding/CardBasicStep";
import  CompleteStep  from "../../components/onboarding/CompleteStep";
import  InterestStep from "../../components/onboarding/InterestStep";
import  JobSelectStep  from "../../components/onboarding/JobSelectStep";
import  StrengthStep  from "../../components/onboarding/StrengthStep";
import LoadingStep from "../../components/onboarding/LoadingStep";
import  WelcomeStep  from "../../components/onboarding/WelcomeStep";

const Onboarding = () => {
    const [step, setStep] = useState(0);

    const [onboardingData, setOnboardingData] = useState({
        job: "",
        affiliationType: "직장인",
        affiliation: "",
        interests: [],
        strengths: [],
    });

    const nextStep = () => {
        setStep((prev) => prev + 1);
    };

    const prevStep = () => {
        setStep((prev) => prev - 1);
    };

    const updateOnboardingData = (newData) => {
        setOnboardingData((prev) => ({
            ...prev,
            ...newData,
        }));
    }
    const totalSteps = 7;
    
    const steps = [
        <WelcomeStep onNext={nextStep} currentStep={step} totalSteps={totalSteps} />,
        <JobSelectStep data={onboardingData} onChange={updateOnboardingData} onNext={nextStep} />,
        <CardBasicStep data={onboardingData} onChange={updateOnboardingData} onNext={nextStep} />,
        <InterestStep data={onboardingData} onChange={updateOnboardingData} onNext={nextStep} />,
        <StrengthStep data={onboardingData} onChange={updateOnboardingData} onNext={nextStep} />,
        <LoadingStep onComplete={nextStep} />,
        <CompleteStep data={onboardingData} />,
    ];

    return (
        <div>
            {step > 0 && step < steps.length - 1 && (
                <button type="button" onClick={prevStep}> 뒤로 </button>
            )}

            <div>
                {step + 1} / {steps.length}
            </div>

            {steps[step]}
        </div>
    );
};

export default Onboarding;