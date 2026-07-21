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
    createDraftId,
    getOnboardingDraft,
    removeOnboardingDraft,
    saveOnboardingDraft,
} from "../../utils/onboardingDraft";

import CardBasicStep from "../../components/onboarding/CardBasicStep";
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

    const totalSteps = 5;

    /*
     * 직군, 소속 상태, 관심 분야,
     * 성향, 목적 목록을 불러온다.
     */
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

    /*
     * localStorage에 저장된
     * 임시저장 내용을 불러온다.
     */
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
                            2,
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

    /*
     * 목적, 직군, 기본 정보 작성 중
     * localStorage에 자동 저장한다.
     */
    useEffect(() => {
        if (
            !hasLoadedDraft ||
            step >= 3
        ) {
            return;
        }

        /*
         * 새 카드 목적 선택 전에는
         * 빈 임시저장을 생성하지 않는다.
         */
        if (
            isCardCreationFlow &&
            step === 0 &&
            !onboardingData.purposeId
        ) {
            return;
        }

        /*
         * 최초 가입 Welcome 화면에서는
         * 빈 임시저장을 생성하지 않는다.
         */
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

    /*
     * 개발자 임시저장을 불러왔을 때
     * 해당 직군 스킬 목록을 다시 조회한다.
     */
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

    /*
     * 직군 선택 후 다음
     *
     * 이 단계에서는 서버 카드를
     * 생성하지 않는다.
     */
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

                const isDeveloper =
                    selectedJob.id ===
                        "frontend" ||
                    selectedJob.id ===
                        "backend";

                let skillItems = [];

                if (isDeveloper) {
                    const skillResult =
                        await getSkills({
                            jobTypeId:
                                selectedJobTypeId,
                        });

                    skillItems =
                        getItems(
                            skillResult,
                        );

                    setLoadedSkillJobTypeId(
                        selectedJobTypeId,
                    );
                }

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

    /*
     * 최종 만들기
     *
     * 이때 처음 서버 카드를 생성하고
     * 입력 정보를 PATCH한다.
     */
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

            try {
                setIsSubmitting(true);
                setSubmitError("");

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
                };

                if (isDeveloper) {
                    profilePayload.skillIds =
                        onboardingData.techStacks.map(
                            (item) =>
                                Number(
                                    item.id,
                                ),
                        );
                } else {
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

                /*
                 * 최종 제출 시에만 POST
                 */
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

                /*
                 * 완료된 임시저장 삭제
                 */
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

    /*
     * 새 카드 생성 및 이어쓰기에서는
     * 목적 선택 화면부터 시작한다.
     *
     * 최초 가입 온보딩에서는
     * 기존 Welcome 화면을 유지한다.
     */
    const firstStep =
        isCardCreationFlow ? (
            <PurposeSelectStep
                key="purpose"
                data={onboardingData}
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
                currentStep={step}
                totalSteps={totalSteps}
            />
        ) : (
            <WelcomeStep
                key="welcome"
                onNext={
                    nextStep
                }
                currentStep={step}
                totalSteps={totalSteps}
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
                optionData
                    .affiliationStatuses
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
            onBack={
                prevStep
            }
            currentStep={step}
            totalSteps={totalSteps}
        />,

        <LoadingStep
            key="loading"
            onComplete={
                nextStep
            }
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

    return (
        <>
            {steps[step]}
        </>
    );
};

export default Onboarding;