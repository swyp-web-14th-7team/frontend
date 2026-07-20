import {
    useEffect,
    useState,
} from "react";

import CardBasicStep from "../../components/onboarding/CardBasicStep";
import CompleteStep from "../../components/onboarding/CompleteStep";
import JobSelectStep from "../../components/onboarding/JobSelectStep";
import LoadingStep from "../../components/onboarding/LoadingStep";
import WelcomeStep from "../../components/onboarding/WelcomeStep";

import {
    createProfileCard,
    updateProfileCard,
} from "../../api/profile";

import {
    getAffiliationStatuses,
    getInterests,
    getJobTypes,
    getPersonalities,
    getSkills,
} from "../../api/options";

const JOB_UI_MAP = {
    PM: {
        id: "planner",
        name: "Planner",
        label: "기획자",
    },

    디자이너: {
        id: "designer",
        name: "Designer",
        label: "디자이너",
    },

    "프론트 개발자": {
        id: "frontend",
        name:
            "Frontend Developer",
        label:
            "프론트엔드 개발자",
    },

    "백엔드 개발자": {
        id: "backend",
        name:
            "Backend Developer",
        label:
            "백엔드 개발자",
    },
};

const getItems = (data) => {
    return Array.isArray(
        data?.items,
    )
        ? data.items
        : [];
};

const Onboarding = () => {
    const [step, setStep] =
        useState(0);

    const [
        onboardingData,
        setOnboardingData,
    ] = useState({
        job: "",
        jobTypeId: null,

        affiliationType: "",
        affiliationStatusId: null,
        affiliation: "",

        introduction: "",

        interests: [],
        techStacks: [],

        strength: null,

        profileCardId: null,
        createdProfile: null,
    });

    const [
        optionData,
        setOptionData,
    ] = useState({
        jobOptions: [],
        affiliationStatuses: [],
        skills: [],
        interests: [],
        personalities: [],
    });

    const [
        isOptionLoading,
        setIsOptionLoading,
    ] = useState(true);

    const [
        optionError,
        setOptionError,
    ] = useState("");

    const [
        isCreatingBasicCard,
        setIsCreatingBasicCard,
    ] = useState(false);

    const [
        basicCardError,
        setBasicCardError,
    ] = useState("");

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    const [
        submitError,
        setSubmitError,
    ] = useState("");

    const totalSteps = 5;

    useEffect(() => {
        const controller =
            new AbortController();

        const fetchOptions =
            async () => {
                try {
                    setIsOptionLoading(
                        true,
                    );

                    setOptionError("");

                    const [
                        jobTypeData,
                        affiliationData,
                        interestData,
                        personalityData,
                    ] = await Promise.all([
                        getJobTypes({
                            signal:
                                controller.signal,
                        }),

                        getAffiliationStatuses({
                            signal:
                                controller.signal,
                        }),

                        getInterests({
                            signal:
                                controller.signal,
                        }),

                        getPersonalities({
                            signal:
                                controller.signal,
                        }),
                    ]);

                    const jobOptions =
                        getItems(
                            jobTypeData,
                        )
                            .map(
                                (
                                    jobType,
                                ) => {
                                    const uiJob =
                                        JOB_UI_MAP[
                                            jobType
                                                .name
                                        ];

                                    if (
                                        !uiJob
                                    ) {
                                        return null;
                                    }

                                    return {
                                        ...uiJob,

                                        jobTypeId:
                                            jobType.id,

                                        apiName:
                                            jobType.name,
                                    };
                                },
                            )
                            .filter(
                                Boolean,
                            );

                    setOptionData(
                        (
                            previousData,
                        ) => ({
                            ...previousData,

                            jobOptions,

                            affiliationStatuses:
                                getItems(
                                    affiliationData,
                                ),

                            interests:
                                getItems(
                                    interestData,
                                ),

                            personalities:
                                getItems(
                                    personalityData,
                                ),
                        }),
                    );
                } catch (error) {
                    if (
                        error.name ===
                        "AbortError"
                    ) {
                        return;
                    }

                    console.error(
                        "온보딩 옵션 조회 실패:",
                        error,
                    );

                    setOptionError(
                        "선택 항목을 불러오지 못했습니다.",
                    );
                } finally {
                    if (
                        !controller
                            .signal
                            .aborted
                    ) {
                        setIsOptionLoading(
                            false,
                        );
                    }
                }
            };

        fetchOptions();

        return () => {
            controller.abort();
        };
    }, []);

    const nextStep = () => {
        setStep(
            (previousStep) =>
                Math.min(
                    previousStep +
                        1,

                    totalSteps - 1,
                ),
        );
    };

    const prevStep = () => {
        setStep(
            (previousStep) =>
                Math.max(
                    previousStep -
                        1,

                    0,
                ),
        );
    };

    const updateOnboardingData = (
        newData,
    ) => {
        setOnboardingData(
            (previousData) => ({
                ...previousData,
                ...newData,
            }),
        );
    };

    /*
     * 직군 선택 후 다음 버튼
     *
     * 1. 기본 카드 생성
     * 2. 선택 직군의 스킬 조회
     * 3. 다음 온보딩 단계로 이동
     */
    const handleJobNext =
        async () => {
            if (
                !onboardingData.jobTypeId
            ) {
                setBasicCardError(
                    "직군을 선택해주세요.",
                );

                return;
            }

            try {
                setIsCreatingBasicCard(
                    true,
                );

                setBasicCardError("");

                let profileCardId =
                    onboardingData.profileCardId;

                const requests = [
                    getSkills({
                        jobTypeId:
                            onboardingData
                                .jobTypeId,
                    }),
                ];

                if (!profileCardId) {
                    requests.push(
                        createProfileCard({
                            jobTypeId:
                                onboardingData
                                    .jobTypeId,
                        }),
                    );
                }

                const results =
                    await Promise.all(
                        requests,
                    );

                const skillData =
                    results[0];

                if (!profileCardId) {
                    const createdCard =
                        results[1];

                    profileCardId =
                        createdCard?.id;

                    if (
                        !profileCardId
                    ) {
                        throw new Error(
                            "생성된 프로필 카드 ID를 받지 못했습니다.",
                        );
                    }
                }

                setOptionData(
                    (
                        previousData,
                    ) => ({
                        ...previousData,

                        skills:
                            getItems(
                                skillData,
                            ),
                    }),
                );

                updateOnboardingData({
                    profileCardId,
                });

                nextStep();
            } catch (error) {
                console.error(
                    "기본 카드 생성 실패:",
                    error,
                );

                setBasicCardError(
                    error.message ||
                        "기본 카드 생성에 실패했습니다.",
                );
            } finally {
                setIsCreatingBasicCard(
                    false,
                );
            }
        };

    /*
     * 마지막 만들기 버튼
     *
     * 이미 생성된 기본 카드를 수정한다.
     */
    const handleUpdateProfile =
        async () => {
            if (
                !onboardingData.profileCardId
            ) {
                setSubmitError(
                    "생성된 프로필 카드를 찾을 수 없습니다.",
                );

                return;
            }

            if (
                !onboardingData
                    .affiliationStatusId
            ) {
                setSubmitError(
                    "현재 상태를 선택해주세요.",
                );

                return;
            }

            if (
                !onboardingData.strength
                    ?.id
            ) {
                setSubmitError(
                    "소통 타입을 선택해주세요.",
                );

                return;
            }

            try {
                setIsSubmitting(true);
                setSubmitError("");

                const isDeveloper =
                    onboardingData.job ===
                        "frontend" ||
                    onboardingData.job ===
                        "backend";

                const selectedItems =
                    isDeveloper
                        ? onboardingData.techStacks
                        : onboardingData.interests;

                const skillIds =
                    selectedItems
                        .filter(
                            (item) =>
                                item.optionType ===
                                "skill",
                        )
                        .map((item) =>
                            Number(
                                item.id,
                            ),
                        );

                const interestIds =
                    selectedItems
                        .filter(
                            (item) =>
                                item.optionType ===
                                "interest",
                        )
                        .map((item) =>
                            Number(
                                item.id,
                            ),
                        );

                    const profilePayload = {
                    affiliationStatusId:
                        Number(
                            onboardingData
                                .affiliationStatusId,
                        ),

                    affiliation:
                        onboardingData
                            .affiliation
                            .trim(),

                    interestIds,

                    skillIds,

                    personalityId:
                        Number(
                            onboardingData
                                .strength
                                .id,
                        ),

                    description:
                        onboardingData
                            .introduction
                            .trim(),
                };

                if (
                    onboardingData.profileImageUrl
                ) {
                    profilePayload.profileImageUrl =
                        onboardingData.profileImageUrl;
                }

                const updatedCard =
                    await updateProfileCard(
                        onboardingData.profileCardId,
                        profilePayload,
                    );

                updateOnboardingData({
                    createdProfile:
                        updatedCard,
                });

                nextStep();
            } catch (error) {
                console.error(
                    "프로필 카드 수정 실패:",
                    error,
                );

                setSubmitError(
                    error.message ||
                        "프로필 카드 생성에 실패했습니다.",
                );
            } finally {
                setIsSubmitting(
                    false,
                );
            }
        };

    const steps = [
        <WelcomeStep
            key="welcome"
            onNext={nextStep}
            currentStep={step}
            totalSteps={totalSteps}
        />,

        <JobSelectStep
            key="job"
            data={onboardingData}
            jobOptions={
                optionData.jobOptions
            }
            isLoading={
                isOptionLoading
            }
            isCreating={
                isCreatingBasicCard
            }
            errorMessage={
                optionError ||
                basicCardError
            }
            onChange={
                updateOnboardingData
            }
            onNext={
                handleJobNext
            }
            onBack={prevStep}
            currentStep={step}
            totalSteps={totalSteps}
        />,

        <CardBasicStep
            key="basic"
            data={onboardingData}
            skills={
                optionData.skills
            }
            interests={
                optionData.interests
            }
            personalities={
                optionData.personalities
            }
            affiliationStatuses={
                optionData.affiliationStatuses
            }
            isSubmitting={
                isSubmitting
            }
            submitError={
                submitError
            }
            onChange={
                updateOnboardingData
            }
            onSubmit={
                handleUpdateProfile
            }
            onBack={prevStep}
            currentStep={step}
            totalSteps={totalSteps}
        />,

        <LoadingStep
            key="loading"
            onComplete={nextStep}
            currentStep={step}
            totalSteps={totalSteps}
        />,

        <CompleteStep
            key="complete"
            data={onboardingData}
            currentStep={step}
            totalSteps={totalSteps}
        />,
    ];

    return <>{steps[step]}</>;
};

export default Onboarding;