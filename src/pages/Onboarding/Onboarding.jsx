    import { useEffect, useState } from "react";

    import { useNavigate, useSearchParams } from "react-router-dom";

    import {
    createProfileCard,
    getDefaultProfileCard,
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

    import { getCardBackgroundImages } from "../../api/cardBackground";

    import {
    createDraftId,
    getOnboardingDraft,
    removeOnboardingDraft,
    saveOnboardingDraft,
    } from "../../utils/onboardingDraft";

    import CardBasicStep from "../../components/onboarding/CardBasicStep";
    import CardDetailStep from "../../components/onboarding/CardDetailStep";
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
        name: "Frontend Developer",
        label: "프론트엔드 개발자",
    },

    "프론트엔드 개발자": {
        id: "frontend",
        name: "Frontend Developer",
        label: "프론트엔드 개발자",
    },

    "백엔드 개발자": {
        id: "backend",
        name: "Backend Developer",
        label: "백엔드 개발자",
    },
    };

    const createEmptyLink = () => ({
    type: 6,
    value: "",
    });

    const createEmptyExperience = (isRepresentative = false) => ({
    title: "",
    description: "",
    relatedUrl: "",
    isRepresentative,
    });

    /*
    * 프로필 이미지 API는 이미지의 기본 경로를 반환하고,
    * 실제 표시용 이미지는 크기별 파일 경로를 사용합니다.
    *
    * 이미 완성된 이미지 파일 URL을 받은 경우에는
    * 같은 경로를 그대로 사용합니다.
    */
    const getProfileImagePreviewUrl = (imageUrl) => {
    const normalizedUrl = (imageUrl || "").trim();

    if (!normalizedUrl) {
        return "";
    }

    const isImageFileUrl = /\.(?:avif|gif|jpe?g|png|webp)(?:\?.*)?$/i.test(
        normalizedUrl,
    );

    if (isImageFileUrl) {
        return normalizedUrl;
    }

    return `${normalizedUrl.replace(/\/+$/, "")}/72.webp`;
    };

    const getItems = (response) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.items)) {
        return response.items;
    }

    if (Array.isArray(response?.data?.items)) {
        return response.data.items;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
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

    links: [createEmptyLink()],

    experiences: [createEmptyExperience(true)],

    cardBackgroundImageId: null,
    cardImageUrl: "",

    profileCardId: null,
    createdProfile: null,
    };

    const normalizeLinks = (links) => {
    if (!Array.isArray(links) || links.length === 0) {
        return [createEmptyLink()];
    }

    return links.map((link) => ({
        id: link?.id,

        type: Number(link?.type ?? 6),

        value: link?.value ?? link?.url ?? "",
    }));
    };

    const normalizeExperiences = (experiences) => {
    if (!Array.isArray(experiences) || experiences.length === 0) {
        return [createEmptyExperience(true)];
    }

    return [...experiences]
        .sort((first, second) => (first?.sortOrder ?? 0) - (second?.sortOrder ?? 0))
        .map((experience, index) => ({
        id: experience?.id,

        title: experience?.title ?? "",

        description: experience?.description ?? experience?.summary ?? "",

        relatedUrl: experience?.relatedUrl ?? experience?.url ?? "",

        isRepresentative: experience?.isRepresentative ?? index === 0,
        }));
    };

    const getDefaultCardData = (profileCard) => {
    if (!profileCard) {
        return {};
    }

    const nickname = profileCard.nickname || profileCard.name || "";

    const profileImageUrl = profileCard.profileImageUrl || "";

    const profileImagePreview = getProfileImagePreviewUrl(profileImageUrl);

    return {
        name: nickname,
        nickname,

        profileImage: profileImageUrl,

        profileImageUrl,

        profileImagePreview,

        links: normalizeLinks(profileCard.links),

        experiences: normalizeExperiences(profileCard.experiences),
    };
    };

    /*
    * 새 카드 생성에서는 기본 카드의 ID나 상세 내용을 재사용하면 안 됩니다.
    * 디자인 미리보기에 필요한 닉네임과 프로필 이미지만 이어받습니다.
    */
    const getDefaultCardIdentityData = (profileCard) => {
    if (!profileCard) {
        return {};
    }

    const defaultCardData = getDefaultCardData(profileCard);

    return {
        name: defaultCardData.name || "",

        nickname: defaultCardData.nickname || "",

        profileImage: defaultCardData.profileImage || "",

        profileImageUrl: defaultCardData.profileImageUrl || "",

        profileImagePreview: defaultCardData.profileImagePreview || "",
    };
    };

    const Onboarding = () => {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const mode = searchParams.get("mode");

    const queryDraftId = searchParams.get("draftId");

    const isCardCreationFlow = mode === "create" || mode === "resume";

    /*
    * 최초 온보딩: 6단계
    * 새 카드 만들기: 7단계
    */
    const totalSteps = isCardCreationFlow ? 7 : 6;

    /*
    * 최초 온보딩에서는 미리보기가 3번,
    * 새 카드 생성에서는 상세 정보가 추가되어 4번입니다.
    */
    const previewStepIndex = isCardCreationFlow ? 4 : 3;

    const loadingStepIndex = previewStepIndex + 1;

    const [draftId] = useState(() => queryDraftId || createDraftId());

    const [step, setStep] = useState(0);

    const [onboardingData, setOnboardingData] = useState(INITIAL_ONBOARDING_DATA);

    const [optionData, setOptionData] = useState({
        jobOptions: [],
        affiliationStatuses: [],
        skills: [],
        interests: [],
        personalities: [],
        purposes: [],
    });

    const [cardBackgrounds, setCardBackgrounds] = useState([]);

    const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);

    const [backgroundError, setBackgroundError] = useState("");

    const [isOptionLoading, setIsOptionLoading] = useState(true);

    const [optionError, setOptionError] = useState("");

    const [isCreatingBasicCard, setIsCreatingBasicCard] = useState(false);

    const [basicCardError, setBasicCardError] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [submitError, setSubmitError] = useState("");

    const [hasLoadedDraft, setHasLoadedDraft] = useState(false);

    const [loadedSkillJobTypeId, setLoadedSkillJobTypeId] = useState(null);

    /*
    * 직군, 소속 상태, 관심 분야,
    * 성향, 카드 목적 조회
    */
    useEffect(() => {
        const controller = new AbortController();

        const fetchOptions = async () => {
        try {
            setIsOptionLoading(true);
            setOptionError("");

            const [
            jobTypeResult,
            affiliationResult,
            interestResult,
            personalityResult,
            purposeResult,
            ] = await Promise.all([
            getJobTypes({
                signal: controller.signal,
            }),

            getAffiliationStatuses({
                signal: controller.signal,
            }),

            getInterests({
                signal: controller.signal,
            }),

            getPersonalities({
                signal: controller.signal,
            }),

            getPurposes({
                signal: controller.signal,
            }),
            ]);

            const jobOptions = getItems(jobTypeResult)
            .map((jobType) => {
                const uiJob = JOB_UI_MAP[jobType.name];

                if (!uiJob) {
                return null;
                }

                return {
                ...uiJob,

                jobTypeId: jobType.id,

                apiName: jobType.name,
                };
            })
            .filter(Boolean);

            setOptionData((previousData) => ({
            ...previousData,

            jobOptions,

            affiliationStatuses: getItems(affiliationResult),

            interests: getItems(interestResult),

            personalities: getItems(personalityResult),

            purposes: getItems(purposeResult),
            }));
        } catch (error) {
            if (error?.name === "AbortError") {
            return;
            }

            console.error("온보딩 옵션 조회 실패:", error);

            setOptionError(error?.message || "선택 항목을 불러오지 못했습니다.");
        } finally {
            if (!controller.signal.aborted) {
            setIsOptionLoading(false);
            }
        }
        };

        fetchOptions();

        return () => {
        controller.abort();
        };
    }, []);

    /*
    * 임시 저장 데이터 불러오기
    */
    useEffect(() => {
        if (isOptionLoading || hasLoadedDraft) {
        return undefined;
        }

        let isMounted = true;

        const loadSavedDraft = async () => {
        await Promise.resolve();

        if (!isMounted) {
            return;
        }

        const savedDraft = getOnboardingDraft(draftId);

        if (savedDraft) {
            setOnboardingData((previousData) => ({
            ...previousData,
            ...savedDraft.data,

            links: normalizeLinks(savedDraft.data?.links),

            experiences: normalizeExperiences(savedDraft.data?.experiences),

            /*
            * 임시 저장한 카드 ID는
            * 새 생성에서 재사용하지 않습니다.
            */
            profileCardId: null,
            createdProfile: null,
            }));

            const savedStep = Number.isInteger(savedDraft.step)
            ? savedDraft.step
            : 0;

            setStep(Math.min(Math.max(savedStep, 0), previewStepIndex));
        }

        setHasLoadedDraft(true);
        };

        loadSavedDraft();

        return () => {
        isMounted = false;
        };
    }, [draftId, hasLoadedDraft, isOptionLoading, previewStepIndex]);

    /*
    * 수정 전 저장된 새 카드 임시 데이터에는 닉네임이 없을 수 있습니다.
    * 기본 카드에서 공통 프로필 정보만 보충해 미리보기의 "이름 없음"을 방지합니다.
    */
    useEffect(() => {
        if (
        !isCardCreationFlow ||
        !hasLoadedDraft ||
        onboardingData.name ||
        onboardingData.nickname
        ) {
        return undefined;
        }

        let isMounted = true;

        const loadDefaultCardIdentity = async () => {
        try {
            const defaultProfileCard = await getDefaultProfileCard();
            const identityData = getDefaultCardIdentityData(defaultProfileCard);

            if (!isMounted) {
            return;
            }

            setOnboardingData((previousData) => ({
            ...previousData,
            name: previousData.name || identityData.name || "",
            nickname: previousData.nickname || identityData.nickname || "",
            profileImage:
                previousData.profileImage || identityData.profileImage || "",
            profileImageUrl:
                previousData.profileImageUrl || identityData.profileImageUrl || "",
            profileImagePreview:
                previousData.profileImagePreview ||
                identityData.profileImagePreview ||
                "",
            }));
        } catch (error) {
            if (error?.status !== 404) {
            console.error("기본 카드 정보 조회 실패:", error);
            }
        }
        };

        loadDefaultCardIdentity();

        return () => {
        isMounted = false;
        };
    }, [
        hasLoadedDraft,
        isCardCreationFlow,
        onboardingData.name,
        onboardingData.nickname,
    ]);

    /*
    * 로딩 화면 이전까지 입력값 임시 저장
    */
    useEffect(() => {
        if (!hasLoadedDraft || step >= loadingStepIndex) {
        return;
        }

        if (isCardCreationFlow && step === 0 && !onboardingData.purposeId) {
        return;
        }

        if (!isCardCreationFlow && step === 0) {
        return;
        }

        saveOnboardingDraft({
        id: draftId,
        step,
        data: onboardingData,
        });
    }, [
        draftId,
        hasLoadedDraft,
        isCardCreationFlow,
        loadingStepIndex,
        onboardingData,
        step,
    ]);

    /*
    * 임시 저장으로 돌아온 경우에도
    * 선택한 직군의 스킬을 다시 불러옵니다.
    *
    * 상세 단계에서 기획자·디자이너도
    * 스킬을 선택하므로 모든 직군에 적용합니다.
    */
    useEffect(() => {
        const jobTypeId = onboardingData.jobTypeId;

        const alreadyLoaded = String(loadedSkillJobTypeId) === String(jobTypeId);

        if (!hasLoadedDraft || !jobTypeId || alreadyLoaded) {
        return undefined;
        }

        const controller = new AbortController();

        const loadSkills = async () => {
        try {
            const skillResult = await getSkills({
            jobTypeId,

            signal: controller.signal,
            });

            setOptionData((previousData) => ({
            ...previousData,

            skills: getItems(skillResult),
            }));

            setLoadedSkillJobTypeId(jobTypeId);
        } catch (error) {
            if (error?.name !== "AbortError") {
            setOptionError(error?.message || "스킬을 불러오지 못했습니다.");
            }
        }
        };

        loadSkills();

        return () => {
        controller.abort();
        };
    }, [hasLoadedDraft, loadedSkillJobTypeId, onboardingData.jobTypeId]);

    /*
    * 카드 미리보기 단계에서 배경 이미지 조회
    */
    useEffect(() => {
        if (step !== previewStepIndex) {
        return undefined;
        }

        const controller = new AbortController();

        const fetchBackgrounds = async () => {
        try {
            setIsBackgroundLoading(true);

            setBackgroundError("");

            const result = await getCardBackgroundImages({
            page: 1,
            limit: 10,
            sort: "createdAt",
            order: "desc",

            signal: controller.signal,
            });

            const items = getItems(result);

            setCardBackgrounds(items);

            if (items.length === 0) {
            setBackgroundError("등록된 카드 배경이 없습니다.");

            return;
            }

            setOnboardingData((previousData) => {
            if (previousData.cardImageUrl) {
                return previousData;
            }

            return {
                ...previousData,

                cardBackgroundImageId: items[0].id,

                cardImageUrl: items[0].imageUrl,
            };
            });
        } catch (error) {
            if (error?.name === "AbortError") {
            return;
            }

            console.error("카드 배경 조회 실패:", error);

            setBackgroundError(
            error?.message || "카드 배경을 불러오지 못했습니다.",
            );
        } finally {
            if (!controller.signal.aborted) {
            setIsBackgroundLoading(false);
            }
        }
        };

        fetchBackgrounds();

        return () => {
        controller.abort();
        };
    }, [previewStepIndex, step]);

    const nextStep = () => {
        setStep((previousStep) => Math.min(previousStep + 1, totalSteps - 1));
    };

    const prevStep = () => {
        setStep((previousStep) => Math.max(previousStep - 1, 0));
    };

    const updateOnboardingData = (newData) => {
        setOnboardingData((previousData) => ({
        ...previousData,
        ...newData,
        }));
    };

    const handleSelectBackground = (background) => {
        updateOnboardingData({
        cardBackgroundImageId: background.id,

        cardImageUrl: background.imageUrl,
        });

        setBackgroundError("");
    };

    const handleJobNext = async (selectedJobOption) => {
        const selectedJob =
        selectedJobOption ||
        optionData.jobOptions.find(
            (jobOption) => jobOption.id === onboardingData.job,
        );

        const selectedJobTypeId = selectedJob?.jobTypeId;

        if (!selectedJobTypeId) {
        setBasicCardError("직군을 선택해주세요.");

        return;
        }

        try {
        setIsCreatingBasicCard(true);
        setBasicCardError("");

        const skillResult = await getSkills({
            jobTypeId: selectedJobTypeId,
        });

        const skillItems = getItems(skillResult);

        setLoadedSkillJobTypeId(selectedJobTypeId);

        setOptionData((previousData) => ({
            ...previousData,

            skills: skillItems,
        }));

        let basicProfileCard = null;

        /*
        * 새 카드 만들기에서도 기본 카드를 조회해
        * 닉네임과 프로필 이미지만 미리보기에 사용합니다.
        *
        * 기본 카드가 없는 최초 온보딩에서만
        * 여기서 기본 카드를 생성합니다.
        */
        try {
            basicProfileCard = await getDefaultProfileCard();
        } catch (error) {
            if (error?.status !== 404) {
            throw error;
            }

            if (!isCardCreationFlow) {
            basicProfileCard = await createProfileCard({
                jobTypeId: selectedJobTypeId,
            });
            }
        }

        const inheritedCardData = isCardCreationFlow
            ? getDefaultCardIdentityData(basicProfileCard)
            : getDefaultCardData(basicProfileCard);

        updateOnboardingData({
            job: selectedJob.id,

            jobTypeId: selectedJobTypeId,

            jobLabel: selectedJob.label,

            techStacks: [],
            interests: [],
            strength: null,

            links: [createEmptyLink()],

            experiences: [createEmptyExperience(true)],

            cardBackgroundImageId: null,

            cardImageUrl: "",

            profileCardId: isCardCreationFlow ? null : basicProfileCard?.id || null,

            createdProfile: isCardCreationFlow ? null : basicProfileCard,

            ...inheritedCardData,
        });

        nextStep();
        } catch (error) {
        console.error("직군 정보 조회 실패:", error);

        setBasicCardError(error?.message || "직군 정보를 불러오지 못했습니다.");
        } finally {
        setIsCreatingBasicCard(false);
        }
    };

    const handleBasicNext = () => {
        setSubmitError("");
        nextStep();
    };

    const handleUpdateProfile = async () => {
        if (isCardCreationFlow && !onboardingData.purposeId) {
        setSubmitError("카드 목적을 선택해주세요.");

        return;
        }

        if (!onboardingData.jobTypeId) {
        setSubmitError("선택한 직군을 확인하지 못했습니다.");

        return;
        }

        if (!onboardingData.affiliationStatusId) {
        setSubmitError("현재 상태를 선택해주세요.");

        return;
        }

        if (!onboardingData.strength?.id) {
        setSubmitError("성향을 선택해주세요.");

        return;
        }

        if (!onboardingData.cardImageUrl) {
        setBackgroundError("카드 배경을 선택해주세요.");

        return;
        }

        try {
        setIsSubmitting(true);
        setSubmitError("");
        setBackgroundError("");

        const affiliation = (onboardingData.affiliation || "").trim();

    const profilePayload = {
    affiliationStatusId: Number(onboardingData.affiliationStatusId),
    personalityId: Number(onboardingData.strength.id),
    description: (onboardingData.introduction || "").trim(),
    cardImageUrl: onboardingData.cardImageUrl,

    skillIds: (onboardingData.techStacks || []).map((item) =>
        Number(item.id),
    ),

    interestIds: (onboardingData.interests || []).map((item) =>
        Number(item.id),
    ),
    };

    // 현 소속을 입력한 경우에만 전송
    if (affiliation) {
    profilePayload.affiliation = affiliation;
    }

        /*
        * 상세 정보 단계는 새 카드 생성에서만
        * 사용하므로 새 카드일 때만 전달합니다.
        */
        if (isCardCreationFlow) {
            profilePayload.links = (onboardingData.links || [])
            .filter((link) => (link.value || "").trim())
            .map((link) => ({
                type: Number(link.type),

                value: (link.value || "").trim(),
            }));

            profilePayload.experiences = (onboardingData.experiences || [])
            .filter(
                (experience) =>
                (experience.title || "").trim() ||
                (experience.description || "").trim() ||
                (experience.relatedUrl || "").trim(),
            )
            .map((experience, index) => ({
                title: (experience.title || "").trim(),

                description: (experience.description || "").trim(),

                relatedUrl: (experience.relatedUrl || "").trim(),

                sortOrder: index,

                isRepresentative: Boolean(experience.isRepresentative),
            }));
        }

        if (onboardingData.profileImageUrl) {
            profilePayload.profileImageUrl = onboardingData.profileImageUrl;
        }

        let profileCardId = onboardingData.profileCardId;

        let createdCard = onboardingData.createdProfile;

        if (!profileCardId) {
            const createPayload = {
            jobTypeId: onboardingData.jobTypeId,
            };

            if (onboardingData.purposeId) {
            createPayload.purposeId = onboardingData.purposeId;
            }

            createdCard = await createProfileCard(createPayload);

            profileCardId = createdCard?.id;
        }

        if (!profileCardId) {
            throw new Error("생성된 프로필 카드 ID를 받지 못했습니다.");
        }

        const updatedCard = await updateProfileCard(profileCardId, {
            ...profilePayload,
            isActive: true,
        });

        removeOnboardingDraft(draftId);

        updateOnboardingData({
            profileCardId,

            createdProfile: updatedCard,
        });

        nextStep();
        } catch (error) {
        console.error("프로필 카드 생성 실패:", error);

        setBackgroundError(error?.message || "프로필 카드 생성에 실패했습니다.");
        } finally {
        setIsSubmitting(false);
        }
    };

    const firstStep = isCardCreationFlow ? (
        <PurposeSelectStep
        key="purpose"
        data={onboardingData}
        purposeOptions={optionData.purposes}
        isLoading={isOptionLoading}
        errorMessage={optionError}
        onChange={updateOnboardingData}
        onNext={nextStep}
        onBack={() => navigate("/profile")}
        currentStep={step}
        totalSteps={totalSteps}
        />
    ) : (
        <WelcomeStep
        key="welcome"
        onNext={nextStep}
        currentStep={step}
        totalSteps={totalSteps}
        />
    );

    const jobStep = (
        <JobSelectStep
        key="job"
        data={onboardingData}
        jobOptions={optionData.jobOptions}
        isLoading={isOptionLoading}
        isCreating={isCreatingBasicCard}
        errorMessage={optionError || basicCardError}
        onChange={updateOnboardingData}
        onNext={handleJobNext}
        onBack={prevStep}
        currentStep={step}
        totalSteps={totalSteps}
        />
    );

    const basicStep = (
        <CardBasicStep
        key="basic"
        data={onboardingData}
        skills={optionData.skills}
        interests={optionData.interests}
        personalities={optionData.personalities}
        affiliationStatuses={optionData.affiliationStatuses}
        isSubmitting={false}
        submitError={submitError}
        onChange={updateOnboardingData}
        onSubmit={handleBasicNext}
        onBack={prevStep}
        currentStep={step}
        totalSteps={totalSteps}
        />
    );

    const detailStep = (
        <CardDetailStep
        key="detail"
        data={onboardingData}
        skills={optionData.skills}
        interests={optionData.interests}
        onChange={updateOnboardingData}
        onNext={nextStep}
        onBack={prevStep}
        currentStep={step}
        totalSteps={totalSteps}
        />
    );

    const previewStep = (
        <CardPreviewStep
        key="preview"
        data={onboardingData}
        backgrounds={cardBackgrounds}
        isLoading={isBackgroundLoading}
        isSubmitting={isSubmitting}
        errorMessage={backgroundError}
        onSelect={handleSelectBackground}
        onSubmit={handleUpdateProfile}
        onBack={prevStep}
        currentStep={step}
        totalSteps={totalSteps}
        />
    );

    const loadingStep = (
        <LoadingStep
        key="loading"
        onComplete={nextStep}
        currentStep={step}
        totalSteps={totalSteps}
        />
    );

    const completeStep = (
        <CompleteStep
        key="complete"
        data={onboardingData}
        currentStep={step}
        totalSteps={totalSteps}
        />
    );

    /*
    * 새 카드 만들기에서만
    * 기본 정보 다음에 상세 정보 단계를 추가합니다.
    */
    const steps = isCardCreationFlow
        ? [
            firstStep,
            jobStep,
            basicStep,
            detailStep,
            previewStep,
            loadingStep,
            completeStep,
        ]
        : [firstStep, jobStep, basicStep, previewStep, loadingStep, completeStep];

    return <>{steps[step]}</>;
    };

    export default Onboarding;
