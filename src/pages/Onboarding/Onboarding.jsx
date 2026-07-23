import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import {
    createProfileCard,
    updateProfileCard,
} from "../../api/profile";

import {
    getAffiliationStatuses,
    getInterests,
    getJobTypes,
    getPersonalities,
    getPurposes,
    getSkills,
} from "../../api/options";

import {
    getCardBackgroundImages,
} from "../../api/cardBackground";

import {
    createDraftId,
    getOnboardingDraft,
    removeOnboardingDraft,
    saveOnboardingDraft,
} from "../../utils/onboardingDraft";

import CardBasicStep from "../../components/onboarding/CardBasicStep";
import CardPreviewStep from "../../components/onboarding/CardPreviewStep";
import CompleteStep from "../../components/onboarding/CompleteStep";
import JobSelectStep from "../../components/onboarding/JobSelectStep";
import LoadingStep from "../../components/onboarding/LoadingStep";
import PurposeSelectStep from "../../components/onboarding/PurposeSelectStep";
import WelcomeStep from "../../components/onboarding/WelcomeStep";

const JOB_UI_MAP = {
    PM: {
        id: "planner",
        name: "Planner",
        label: "기획자",
    },

    기획자: {
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

    "프론트엔드 개발자": {
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

const getItems = (
    response,
) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (
        Array.isArray(
            response?.items,
        )
    ) {
        return response.items;
    }

    return [];
};

const INITIAL_ONBOARDING_DATA = {
    purposeId: null,
    purposeName: "",

    job: "",
    jobTypeId: null,
    jobLabel: "",

    affiliationType: "",
    affiliationStatusId: null,
    affiliation: "",

    introduction: "",

    interests: [],
    techStacks: [],

    strength: null,

    profileImageUrl: "",
    profileImagePreview: "",

    cardBackgroundImageId:
        null,
    cardImageUrl: "",

    profileCardId: null,
    createdProfile: null,
};

const Onboarding = () => {
    const navigate =
        useNavigate();

    const [
        searchParams,
    ] = useSearchParams();

    const mode =
        searchParams.get(
            "mode",
        );

    const queryDraftId =
        searchParams.get(
            "draftId",
        );

    const isCardCreationFlow =
        mode === "create" ||
        mode === "resume";

    const [draftId] =
        useState(
            () =>
                queryDraftId ||
                createDraftId(),
        );

    const [
        step,
        setStep,
    ] = useState(0);

    const [
        onboardingData,
        setOnboardingData,
    ] = useState(
        INITIAL_ONBOARDING_DATA,
    );

    const [
        optionData,
        setOptionData,
    ] = useState({
        jobOptions: [],
        affiliationStatuses:
            [],
        skills: [],
        interests: [],
        personalities: [],
        purposes: [],
    });

    const [
        cardBackgrounds,
        setCardBackgrounds,
    ] = useState([]);

    const [
        isBackgroundLoading,
        setIsBackgroundLoading,
    ] = useState(false);

    const [
        backgroundError,
        setBackgroundError,
    ] = useState("");

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

    const [
        hasLoadedDraft,
        setHasLoadedDraft,
    ] = useState(false);

    const [
        loadedSkillJobTypeId,
        setLoadedSkillJobTypeId,
    ] = useState(null);

    const totalSteps = 6;

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
                        jobTypeResult,
                        affiliationResult,
                        interestResult,
                        personalityResult,
                        purposeResult,
                    ] =
                        await Promise.all(
                            [
                                getJobTypes({
                                    signal:
                                        controller
                                            .signal,
                                }),

                                getAffiliationStatuses(
                                    {
                                        signal:
                                            controller
                                                .signal,
                                    },
                                ),

                                getInterests({
                                    signal:
                                        controller
                                            .signal,
                                }),

                                getPersonalities(
                                    {
                                        signal:
                                            controller
                                                .signal,
                                    },
                                ),

                                getPurposes({
                                    signal:
                                        controller
                                            .signal,
                                }),
                            ],
                        );

                    const jobOptions =
                        getItems(
                            jobTypeResult,
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
                                    affiliationResult,
                                ),

                            interests:
                                getItems(
                                    interestResult,
                                ),

                            personalities:
                                getItems(
                                    personalityResult,
                                ),

                            purposes:
                                getItems(
                                    purposeResult,
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
                        error.message ||
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

    useEffect(() => {
        if (
            isOptionLoading ||
            hasLoadedDraft
        ) {
            return undefined;
        }

        let isMounted = true;

        const loadSavedDraft =
            async () => {
                await Promise.resolve();

                if (!isMounted) {
                    return;
                }

                const savedDraft =
                    getOnboardingDraft(
                        draftId,
                    );

                if (savedDraft) {
                    setOnboardingData(
                        (
                            previousData,
                        ) => ({
                            ...previousData,
                            ...savedDraft.data,

                            profileCardId:
                                null,

                            createdProfile:
                                null,
                        }),
                    );

                    const savedStep =
                        Number.isInteger(
                            savedDraft.step,
                        )
                            ? savedDraft.step
                            : 0;

                    setStep(
                        Math.min(
                            Math.max(
                                savedStep,
                                0,
                            ),
                            3,
                        ),
                    );
                }

                setHasLoadedDraft(
                    true,
                );
            };

        loadSavedDraft();

        return () => {
            isMounted = false;
        };
    }, [
        draftId,
        isOptionLoading,
        hasLoadedDraft,
    ]);

    useEffect(() => {
        if (
            !hasLoadedDraft ||
            step >= 4
        ) {
            return;
        }

        if (
            isCardCreationFlow &&
            step === 0 &&
            !onboardingData.purposeId
        ) {
            return;
        }

        if (
            !isCardCreationFlow &&
            step === 0
        ) {
            return;
        }

        saveOnboardingDraft({
            id: draftId,
            step,
            data: onboardingData,
        });
    }, [
        draftId,
        step,
        onboardingData,
        hasLoadedDraft,
        isCardCreationFlow,
    ]);

    useEffect(() => {
        const isDeveloper =
            onboardingData.job ===
                "frontend" ||
            onboardingData.job ===
                "backend";

        const alreadyLoaded =
            String(
                loadedSkillJobTypeId,
            ) ===
            String(
                onboardingData
                    .jobTypeId,
            );

        if (
            !hasLoadedDraft ||
            !isDeveloper ||
            !onboardingData
                .jobTypeId ||
            alreadyLoaded
        ) {
            return undefined;
        }

        const controller =
            new AbortController();

        const loadSkills =
            async () => {
                try {
                    const skillResult =
                        await getSkills({
                            jobTypeId:
                                onboardingData
                                    .jobTypeId,

                            signal:
                                controller
                                    .signal,
                        });

                    setOptionData(
                        (
                            previousData,
                        ) => ({
                            ...previousData,

                            skills:
                                getItems(
                                    skillResult,
                                ),
                        }),
                    );

                    setLoadedSkillJobTypeId(
                        onboardingData
                            .jobTypeId,
                    );
                } catch (error) {
                    if (
                        error.name !==
                        "AbortError"
                    ) {
                        setOptionError(
                            error.message ||
                                "스킬을 불러오지 못했습니다.",
                        );
                    }
                }
            };

        loadSkills();

        return () => {
            controller.abort();
        };
    }, [
        hasLoadedDraft,
        onboardingData.job,
        onboardingData.jobTypeId,
        loadedSkillJobTypeId,
    ]);

    useEffect(() => {
        if (step !== 3) {
            return undefined;
        }

        const controller =
            new AbortController();

        const fetchBackgrounds =
            async () => {
                try {
                    setIsBackgroundLoading(
                        true,
                    );

                    setBackgroundError(
                        "",
                    );

                    const result =
                        await getCardBackgroundImages(
                            {
                                page: 1,
                                limit: 10,
                                sort:
                                    "createdAt",
                                order: "desc",
                                signal:
                                    controller
                                        .signal,
                            },
                        );

                    const items =
                        getItems(
                            result,
                        );

                    setCardBackgrounds(
                        items,
                    );

                    if (
                        items.length ===
                        0
                    ) {
                        setBackgroundError(
                            "등록된 카드 배경이 없습니다.",
                        );

                        return;
                    }

                    setOnboardingData(
                        (
                            previousData,
                        ) => {
                            if (
                                previousData.cardImageUrl
                            ) {
                                return previousData;
                            }

                            return {
                                ...previousData,

                                cardBackgroundImageId:
                                    items[0]
                                        .id,

                                cardImageUrl:
                                    items[0]
                                        .imageUrl,
                            };
                        },
                    );
                } catch (error) {
                    if (
                        error.name ===
                        "AbortError"
                    ) {
                        return;
                    }

                    console.error(
                        "카드 배경 조회 실패:",
                        error,
                    );

                    setBackgroundError(
                        error.message ||
                            "카드 배경을 불러오지 못했습니다.",
                    );
                } finally {
                    if (
                        !controller
                            .signal
                            .aborted
                    ) {
                        setIsBackgroundLoading(
                            false,
                        );
                    }
                }
            };

        fetchBackgrounds();

        return () => {
            controller.abort();
        };
    }, [step]);

    const nextStep = () => {
        setStep(
            (previousStep) =>
                Math.min(
                    previousStep + 1,
                    totalSteps - 1,
                ),
        );
    };

    const prevStep = () => {
        setStep(
            (previousStep) =>
                Math.max(
                    previousStep - 1,
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

    const handleSelectBackground = (
        background,
    ) => {
        updateOnboardingData({
            cardBackgroundImageId:
                background.id,

            cardImageUrl:
                background.imageUrl,
        });

        setBackgroundError("");
    };

    const handleJobNext =
        async (
            selectedJobOption,
        ) => {
            const selectedJob =
                selectedJobOption ||
                optionData.jobOptions.find(
                    (jobOption) =>
                        jobOption.id ===
                        onboardingData.job,
                );

            const selectedJobTypeId =
                selectedJob?.jobTypeId;

            if (!selectedJobTypeId) {
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

                const skillResult =
                    await getSkills({
                        jobTypeId:
                            selectedJobTypeId,
                    });

                const skillItems =
                    getItems(
                        skillResult,
                    );

                setLoadedSkillJobTypeId(
                    selectedJobTypeId,
                );

                setOptionData(
                    (
                        previousData,
                    ) => ({
                        ...previousData,

                        skills:
                            skillItems,
                    }),
                );

                updateOnboardingData({
                    job:
                        selectedJob.id,

                    jobTypeId:
                        selectedJobTypeId,

                    jobLabel:
                        selectedJob.label,

                    techStacks: [],
                    interests: [],
                    strength: null,

                    cardBackgroundImageId:
                        null,

                    cardImageUrl: "",

                    profileCardId: null,
                    createdProfile: null,
                });

                nextStep();
            } catch (error) {
                console.error(
                    "직군 정보 조회 실패:",
                    error,
                );

                setBasicCardError(
                    error.message ||
                        "직군 정보를 불러오지 못했습니다.",
                );
            } finally {
                setIsCreatingBasicCard(
                    false,
                );
            }
        };

    const handleBasicNext =
        () => {
            setSubmitError("");
            nextStep();
        };

    const handleUpdateProfile =
        async () => {
            if (
                isCardCreationFlow &&
                !onboardingData.purposeId
            ) {
                setSubmitError(
                    "카드 목적을 선택해주세요.",
                );

                return;
            }

            if (
                !onboardingData
                    .jobTypeId
            ) {
                setSubmitError(
                    "선택한 직군을 확인하지 못했습니다.",
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
                    "성향을 선택해주세요.",
                );

                return;
            }

            if (
                !onboardingData.cardImageUrl
            ) {
                setBackgroundError(
                    "카드 배경을 선택해주세요.",
                );

                return;
            }

            try {
                setIsSubmitting(true);
                setSubmitError("");
                setBackgroundError("");

                const isDeveloper =
                    onboardingData.job ===
                        "frontend" ||
                    onboardingData.job ===
                        "backend";

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

                    cardImageUrl:
                        onboardingData
                            .cardImageUrl,
                };

                if (isDeveloper) {
                    profilePayload.skillIds =
                        onboardingData.techStacks.map(
                            (item) =>
                                Number(
                                    item.id,
                                ),
                        );

                    profilePayload.interestIds =
                        [];
                } else {
                    profilePayload.skillIds =
                        onboardingData.techStacks.map(
                            (item) =>
                                Number(
                                    item.id,
                                ),
                        );

                    profilePayload.interestIds =
                        onboardingData.interests.map(
                            (item) =>
                                Number(
                                    item.id,
                                ),
                        );
                }

                if (
                    onboardingData
                        .profileImageUrl
                ) {
                    profilePayload.profileImageUrl =
                        onboardingData
                            .profileImageUrl;
                }

                const createdCard =
                    await createProfileCard({
                        jobTypeId:
                            onboardingData
                                .jobTypeId,

                        purposeId:
                            onboardingData
                                .purposeId,
                    });

                if (!createdCard?.id) {
                    throw new Error(
                        "생성된 프로필 카드 ID를 받지 못했습니다.",
                    );
                }

                const updatedCard =
                    await updateProfileCard(
                        createdCard.id,
                        profilePayload,
                    );

                removeOnboardingDraft(
                    draftId,
                );

                updateOnboardingData({
                    profileCardId:
                        createdCard.id,

                    createdProfile:
                        updatedCard,
                });

                nextStep();
            } catch (error) {
                console.error(
                    "프로필 카드 생성 실패:",
                    error,
                );

                setBackgroundError(
                    error.message ||
                        "프로필 카드 생성에 실패했습니다.",
                );
            } finally {
                setIsSubmitting(
                    false,
                );
            }
        };

    const firstStep =
        isCardCreationFlow ? (
            <PurposeSelectStep
                key="purpose"
                data={
                    onboardingData
                }
                purposeOptions={
                    optionData.purposes
                }
                isLoading={
                    isOptionLoading
                }
                errorMessage={
                    optionError
                }
                onChange={
                    updateOnboardingData
                }
                onNext={
                    nextStep
                }
                onBack={() =>
                    navigate(
                        "/profile",
                    )
                }
                currentStep={
                    step
                }
                totalSteps={
                    totalSteps
                }
            />
        ) : (
            <WelcomeStep
                key="welcome"
                onNext={
                    nextStep
                }
                currentStep={
                    step
                }
                totalSteps={
                    totalSteps
                }
            />
        );

    const steps = [
        firstStep,

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
            onBack={
                prevStep
            }
            currentStep={
                step
            }
            totalSteps={
                totalSteps
            }
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
                optionData
                    .affiliationStatuses
            }
            isSubmitting={
                false
            }
            submitError={
                submitError
            }
            onChange={
                updateOnboardingData
            }
            onSubmit={
                handleBasicNext
            }
            onBack={
                prevStep
            }
            currentStep={
                step
            }
            totalSteps={
                totalSteps
            }
        />,

        <CardPreviewStep
            key="preview"
            data={onboardingData}
            backgrounds={
                cardBackgrounds
            }
            isLoading={
                isBackgroundLoading
            }
            isSubmitting={
                isSubmitting
            }
            errorMessage={
                backgroundError
            }
            onSelect={
                handleSelectBackground
            }
            onSubmit={
                handleUpdateProfile
            }
            onBack={
                prevStep
            }
            currentStep={
                step
            }
            totalSteps={
                totalSteps
            }
        />,

        <LoadingStep
            key="loading"
            onComplete={
                nextStep
            }
            currentStep={
                step
            }
            totalSteps={
                totalSteps
            }
        />,

        <CompleteStep
            key="complete"
            data={onboardingData}
            currentStep={
                step
            }
            totalSteps={
                totalSteps
            }
        />,
    ];

    return (
        <>
            {steps[step]}
        </>
    );
};

export default Onboarding;