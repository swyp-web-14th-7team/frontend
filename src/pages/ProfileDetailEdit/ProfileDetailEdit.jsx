import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getInterests,
    getJobTypes,
    getSkills,
} from "../../api/options";

import {
    getMyProfileCard,
    updateProfileCard,
} from "../../api/profile";

import OnboardingLayout from "../../components/common/OnboardingLayout";
import TagSelectModal from "../../components/onboarding/TagSelectModal";

import styles from "./ProfileDetailEdit.module.css";

const DEVELOPER_JOBS = [
    "frontend",
    "backend",
];

const JOB_NAME_MAP = {
    frontend: "frontend",
    backend: "backend",
    planner: "planner",
    designer: "designer",

    Frontend: "frontend",
    Backend: "backend",
    Planner: "planner",
    Designer: "designer",

    "Frontend Developer":
        "frontend",

    "Backend Developer":
        "backend",

    "프론트엔드 개발자":
        "frontend",

    "프론트 개발자":
        "frontend",

    "백엔드 개발자":
        "backend",

    기획자: "planner",
    디자이너: "designer",
};

const LINK_TYPES = [
    {
        type: 0,
        label: "Email",
    },
    {
        type: 1,
        label: "Instagram",
    },
    {
        type: 2,
        label: "GitHub",
    },
    {
        type: 3,
        label: "LinkedIn",
    },
    {
        type: 4,
        label: "Behance",
    },
    {
        type: 5,
        label: "Notion",
    },
    {
        type: 6,
        label: "Website",
    },
];

const createEmptyLink = () => ({
    type: 6,
    value: "",
});

const createEmptyExperience =
    (
        isRepresentative = false,
    ) => ({
        title: "",
        description: "",
        relatedUrl: "",
        isRepresentative,
    });

const extractItems = (
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

const normalizeJobName = (
    jobName,
) => {
    return (
        JOB_NAME_MAP[jobName] ||
        jobName
    );
};

const getJobName = (
    profile,
) => {
    if (
        typeof profile?.job ===
        "string"
    ) {
        return profile.job;
    }

    return (
        profile?.jobType?.name ||
        profile?.job?.name ||
        profile?.jobTypeName ||
        ""
    );
};

const normalizeJob = (
    profile,
) => {
    return normalizeJobName(
        getJobName(profile),
    );
};

const findJobTypeId = (
    profile,
    jobTypes,
) => {
    const directJobTypeId =
        profile?.jobType?.id ||
        profile?.jobTypeId ||
        profile?.job?.id;

    if (directJobTypeId) {
        return directJobTypeId;
    }

    const normalizedProfileJob =
        normalizeJob(profile);

    const selectedJobType =
        jobTypes.find(
            (jobType) => {
                const normalizedOptionJob =
                    normalizeJobName(
                        jobType?.name ||
                            jobType?.label ||
                            "",
                    );

                return (
                    normalizedOptionJob ===
                    normalizedProfileJob
                );
            },
        );

    return (
        selectedJobType?.id ||
        null
    );
};

const normalizeItems = (
    items,
) => {
    if (!Array.isArray(items)) {
        return [];
    }

    return items
        .map((item) => {
            if (
                typeof item ===
                "string"
            ) {
                return {
                    id: item,
                    name: item,

                    type: "tag",

                    optionType:
                        "tag",
                };
            }

            return {
                id: item?.id,

                name:
                    item?.name ||
                    "",

                type:
                    item?.type ||
                    "tag",

                optionType:
                    item?.optionType ||
                    "tag",
            };
        })
        .filter(
            (item) =>
                item.id !==
                    undefined &&
                item.name,
        );
};

const normalizeLinks = (
    links,
) => {
    if (
        !Array.isArray(links) ||
        links.length === 0
    ) {
        return [
            createEmptyLink(),
        ];
    }

    return links.map((link) => ({
        id: link?.id,

        type: Number(
            link?.type ?? 6,
        ),

        value:
            link?.value ||
            link?.url ||
            "",
    }));
};

const normalizeExperiences = (
    experiences,
) => {
    if (
        !Array.isArray(
            experiences,
        ) ||
        experiences.length === 0
    ) {
        return [
            createEmptyExperience(
                true,
            ),
        ];
    }

    return [...experiences]
        .sort(
            (first, second) =>
                (
                    first?.sortOrder ??
                    0
                ) -
                (
                    second?.sortOrder ??
                    0
                ),
        )
        .map(
            (
                experience,
                index,
            ) => ({
                id:
                    experience?.id,

                title:
                    experience
                        ?.title ||
                    "",

                description:
                    experience
                        ?.description ||
                    experience
                        ?.summary ||
                    "",

                relatedUrl:
                    experience
                        ?.relatedUrl ||
                    experience?.url ||
                    "",

                isRepresentative:
                    experience
                        ?.isRepresentative ??
                    index === 0,
            }),
        );
};

const createSkillSections = (
    skills,
) => {
    const sectionMap =
        new Map();

    skills.forEach((skill) => {
        const categoryName =
            skill?.category
                ?.name ||
            "툴";

        if (
            !sectionMap.has(
                categoryName,
            )
        ) {
            sectionMap.set(
                categoryName,
                [],
            );
        }

        sectionMap
            .get(categoryName)
            .push({
                id: skill.id,

                name: skill.name,

                type: "skill",

                optionType:
                    "skill",
            });
    });

    return Array.from(
        sectionMap.entries(),
    ).map(
        (
            [
                categoryName,
                options,
            ],
            index,
        ) => ({
            id:
                `skill-category-${index}`,

            title:
                categoryName,

            options,
        }),
    );
};

const createInterestSections = (
    interests,
) => {
    return [
        {
            id: "interests",

            title:
                "관심 분야",

            options:
                interests.map(
                    (interest) => ({
                        id:
                            interest.id,

                        name:
                            interest.name,

                        type:
                            "interest",

                        optionType:
                            "interest",
                    }),
                ),
        },
    ];
};

const ProfileDetailEdit = () => {
    const navigate =
        useNavigate();

    const {
        profileId,
    } = useParams();

    const [
        profile,
        setProfile,
    ] = useState(null);

    const [
        selectableItems,
        setSelectableItems,
    ] = useState([]);

    const [
        selectedItems,
        setSelectedItems,
    ] = useState([]);

    const [
        links,
        setLinks,
    ] = useState([
        createEmptyLink(),
    ]);

    const [
        experiences,
        setExperiences,
    ] = useState([
        createEmptyExperience(
            true,
        ),
    ]);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        isSaving,
        setIsSaving,
    ] = useState(false);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    const [
        isItemModalOpen,
        setIsItemModalOpen,
    ] = useState(false);

    const job =
        useMemo(
            () =>
                normalizeJob(
                    profile,
                ),
            [profile],
        );

    const isDeveloper =
        DEVELOPER_JOBS.includes(
            job,
        );

    /*
     * 개발자는 온보딩에서 스킬을 선택했으므로
     * 세부 프로필에서는 관심 분야를 선택한다.
     *
     * 기획자와 디자이너는 온보딩에서
     * 관심 분야를 선택했으므로
     * 세부 프로필에서는 스킬을 선택한다.
     */
    const sectionTitle =
        isDeveloper
            ? "관심분야"
            : "스킬";

    const sectionDescription =
        isDeveloper
            ? "관심 있는 분야를 보여주세요"
            : "나의 사용 툴과 역량을 어필해보세요";

    const tagSections =
        useMemo(() => {
            if (isDeveloper) {
                return createInterestSections(
                    selectableItems,
                );
            }

            return createSkillSections(
                selectableItems,
            );
        }, [
            isDeveloper,
            selectableItems,
        ]);

    useEffect(() => {
        const controller =
            new AbortController();

        const loadProfile =
            async () => {
                setIsLoading(true);
                setErrorMessage("");

                try {
                    const [
                        profileData,
                        jobTypeResponse,
                    ] =
                        await Promise.all(
                            [
                                getMyProfileCard(
                                    profileId,
                                    {
                                        signal:
                                            controller
                                                .signal,
                                    },
                                ),

                                getJobTypes({
                                    signal:
                                        controller
                                            .signal,
                                }),
                            ],
                        );

                    const jobTypes =
                        extractItems(
                            jobTypeResponse,
                        );

                    const normalizedJob =
                        normalizeJob(
                            profileData,
                        );

                    const developer =
                        DEVELOPER_JOBS.includes(
                            normalizedJob,
                        );

                    const jobTypeId =
                        findJobTypeId(
                            profileData,
                            jobTypes,
                        );

                    let optionResponse;

                    if (developer) {
                        optionResponse =
                            await getInterests(
                                {
                                    signal:
                                        controller
                                            .signal,
                                },
                            );
                    } else {
                        if (!jobTypeId) {
                            throw new Error(
                                "기획자 또는 디자이너의 직군 ID를 확인하지 못했습니다.",
                            );
                        }

                        optionResponse =
                            await getSkills(
                                {
                                    jobTypeId:
                                        Number(
                                            jobTypeId,
                                        ),

                                    signal:
                                        controller
                                            .signal,
                                },
                            );
                    }

                    setProfile(
                        profileData,
                    );

                    setSelectableItems(
                        extractItems(
                            optionResponse,
                        ),
                    );

                    setSelectedItems(
                        normalizeItems(
                            developer
                                ? profileData
                                      ?.interests
                                : profileData
                                      ?.skills,
                        ),
                    );

                    setLinks(
                        normalizeLinks(
                            profileData
                                ?.links,
                        ),
                    );

                    setExperiences(
                        normalizeExperiences(
                            profileData
                                ?.experiences,
                        ),
                    );
                } catch (error) {
                    if (
                        error.name ===
                        "AbortError"
                    ) {
                        return;
                    }

                    setErrorMessage(
                        error.message ||
                            "세부 프로필 정보를 불러오지 못했습니다.",
                    );
                } finally {
                    if (
                        !controller
                            .signal
                            .aborted
                    ) {
                        setIsLoading(
                            false,
                        );
                    }
                }
            };

        loadProfile();

        return () => {
            controller.abort();
        };
    }, [profileId]);

    const handleBack = () => {
        navigate(
            `/my-profile/${profileId}`,
        );
    };

    const removeSelectedItem = (
        itemId,
    ) => {
        setSelectedItems(
            (currentItems) =>
                currentItems.filter(
                    (item) =>
                        String(
                            item.id,
                        ) !==
                        String(
                            itemId,
                        ),
                ),
        );
    };

    const handleLinkChange = (
        index,
        key,
        value,
    ) => {
        setLinks((currentLinks) =>
            currentLinks.map(
                (
                    link,
                    linkIndex,
                ) =>
                    linkIndex === index
                        ? {
                              ...link,

                              [key]:
                                  value,
                          }
                        : link,
            ),
        );
    };

    const addLink = () => {
        if (links.length >= 4) {
            return;
        }

        setLinks(
            (currentLinks) => [
                ...currentLinks,

                createEmptyLink(),
            ],
        );
    };

    const removeLink = (
        index,
    ) => {
        setLinks(
            (currentLinks) => {
                const nextLinks =
                    currentLinks.filter(
                        (
                            _,
                            linkIndex,
                        ) =>
                            linkIndex !==
                            index,
                    );

                return nextLinks.length >
                    0
                    ? nextLinks
                    : [
                          createEmptyLink(),
                      ];
            },
        );
    };

    const handleExperienceChange = (
        index,
        key,
        value,
    ) => {
        setExperiences(
            (
                currentExperiences,
            ) =>
                currentExperiences.map(
                    (
                        experience,
                        experienceIndex,
                    ) =>
                        experienceIndex ===
                        index
                            ? {
                                  ...experience,

                                  [key]:
                                      value,
                              }
                            : experience,
                ),
        );
    };

    const setRepresentativeExperience =
        (index) => {
            setExperiences(
                (
                    currentExperiences,
                ) =>
                    currentExperiences.map(
                        (
                            experience,
                            experienceIndex,
                        ) => ({
                            ...experience,

                            isRepresentative:
                                experienceIndex ===
                                index,
                        }),
                    ),
            );
        };

    const addExperience = () => {
        if (
            experiences.length >= 5
        ) {
            return;
        }

        setExperiences(
            (
                currentExperiences,
            ) => [
                ...currentExperiences,

                createEmptyExperience(),
            ],
        );
    };

    const removeExperience = (
        index,
    ) => {
        setExperiences(
            (
                currentExperiences,
            ) => {
                const nextExperiences =
                    currentExperiences.filter(
                        (
                            _,
                            experienceIndex,
                        ) =>
                            experienceIndex !==
                            index,
                    );

                if (
                    nextExperiences.length ===
                    0
                ) {
                    return [
                        createEmptyExperience(
                            true,
                        ),
                    ];
                }

                const hasRepresentative =
                    nextExperiences.some(
                        (
                            experience,
                        ) =>
                            experience.isRepresentative,
                    );

                if (
                    !hasRepresentative
                ) {
                    return nextExperiences.map(
                        (
                            experience,
                            experienceIndex,
                        ) => ({
                            ...experience,

                            isRepresentative:
                                experienceIndex ===
                                0,
                        }),
                    );
                }

                return nextExperiences;
            },
        );
    };

    const createRequestBody =
        () => {
            const requestBody = {
                links: links
                    .filter((link) =>
                        link.value.trim(),
                    )
                    .map((link) => ({
                        type: Number(
                            link.type,
                        ),

                        value:
                            link.value.trim(),
                    })),

                experiences:
                    experiences
                        .filter(
                            (
                                experience,
                            ) =>
                                experience.title.trim() ||
                                experience.description.trim() ||
                                experience.relatedUrl.trim(),
                        )
                        .map(
                            (
                                experience,
                                index,
                            ) => ({
                                title:
                                    experience.title.trim(),

                                description:
                                    experience.description.trim(),

                                relatedUrl:
                                    experience.relatedUrl.trim(),

                                sortOrder:
                                    index,

                                isRepresentative:
                                    Boolean(
                                        experience.isRepresentative,
                                    ),
                            }),
                        ),
            };

            if (isDeveloper) {
                requestBody.interestIds =
                    selectedItems.map(
                        (item) =>
                            Number(
                                item.id,
                            ),
                    );
            } else {
                requestBody.skillIds =
                    selectedItems.map(
                        (item) =>
                            Number(
                                item.id,
                            ),
                    );
            }

            return requestBody;
        };

    const handleSave =
        async () => {
            setIsSaving(true);
            setErrorMessage("");

            try {
                await updateProfileCard(
                    profileId,
                    createRequestBody(),
                );

                navigate(
                    `/my-profile/${profileId}`,
                    {
                        replace: true,
                    },
                );
            } catch (error) {
                setErrorMessage(
                    error.message ||
                        "세부 프로필을 저장하지 못했습니다.",
                );
            } finally {
                setIsSaving(false);
            }
        };

    if (isLoading) {
        return (
            <OnboardingLayout
                showBackButton={true}
                showProgress={true}
                onBack={handleBack}
                currentStep={2}
                totalSteps={5}
            >
                <p
                    className={
                        styles.statusMessage
                    }
                >
                    세부 프로필을
                    불러오는 중입니다.
                </p>
            </OnboardingLayout>
        );
    }

    if (
        errorMessage &&
        !profile
    ) {
        return (
            <OnboardingLayout
                showBackButton={true}
                showProgress={true}
                onBack={handleBack}
                currentStep={2}
                totalSteps={5}
            >
                <div
                    className={
                        styles.errorArea
                    }
                >
                    <p
                        className={
                            styles.errorMessage
                        }
                    >
                        {errorMessage}
                    </p>

                    <button
                        type="button"
                        className={
                            styles.backButton
                        }
                        onClick={
                            handleBack
                        }
                    >
                        돌아가기
                    </button>
                </div>
            </OnboardingLayout>
        );
    }

    return (
        <OnboardingLayout
            showBackButton={true}
            showProgress={true}
            onBack={handleBack}
            currentStep={2}
            totalSteps={5}
        >
            <section
                className={
                    styles.container
                }
            >
                <div
                    className={
                        styles.titleArea
                    }
                >
                    <h1
                        className={`headline1 ${styles.title}`}
                    >
                        더 자세한 설명을
                        덧붙여보세요
                    </h1>

                    <p
                        className={`body2 ${styles.description}`}
                    >
                        카드의 세부 프로필에
                        등록되는 정보예요
                    </p>
                </div>

                <div
                    className={
                        styles.profileImage
                    }
                >
                    {profile
                        ?.profileImageUrl ? (
                        <img
                            src={
                                profile.profileImageUrl
                            }
                            alt="프로필"
                        />
                    ) : (
                        <span
                            className={
                                styles.profilePlaceholder
                            }
                        />
                    )}

                    <span
                        className={
                            styles.editBadge
                        }
                    >
                        ✎
                    </span>
                </div>

                <section
                    className={
                        styles.formSection
                    }
                >
                    <div
                        className={
                            styles.sectionHeading
                        }
                    >
                        <div>
                            <p
                                className={
                                    styles.sectionLabel
                                }
                            >
                                {
                                    sectionTitle
                                }
                            </p>

                            <p
                                className={
                                    styles.sectionHelp
                                }
                            >
                                {
                                    sectionDescription
                                }
                            </p>
                        </div>

                        <span
                            className={
                                styles.count
                            }
                        >
                            {
                                selectedItems.length
                            }
                            /10
                        </span>
                    </div>

                    {selectedItems.length >
                        0 && (
                        <div
                            className={
                                styles.selectedList
                            }
                        >
                            {selectedItems.map(
                                (
                                    item,
                                ) => (
                                    <button
                                        key={
                                            item.id
                                        }
                                        type="button"
                                        className={
                                            styles.selectedChip
                                        }
                                        onClick={() =>
                                            removeSelectedItem(
                                                item.id,
                                            )
                                        }
                                    >
                                        {
                                            item.name
                                        }

                                        <span>
                                            ×
                                        </span>
                                    </button>
                                ),
                            )}
                        </div>
                    )}

                    <button
                        type="button"
                        className={
                            styles.addButton
                        }
                        onClick={() =>
                            setIsItemModalOpen(
                                true,
                            )
                        }
                    >
                        + 추가하기
                    </button>
                </section>

                <section
                    className={
                        styles.formSection
                    }
                >
                    <div
                        className={
                            styles.sectionHeading
                        }
                    >
                        <div>
                            <p
                                className={
                                    styles.sectionLabel
                                }
                            >
                                링크
                            </p>

                            <p
                                className={
                                    styles.sectionHelp
                                }
                            >
                                포트폴리오,
                                Github, 이메일 등
                            </p>
                        </div>

                        <span
                            className={
                                styles.count
                            }
                        >
                            {
                                links.filter(
                                    (
                                        link,
                                    ) =>
                                        link.value.trim(),
                                )
                                    .length
                            }
                            /4
                        </span>
                    </div>

                    <div
                        className={
                            styles.linkList
                        }
                    >
                        {links.map(
                            (
                                link,
                                index,
                            ) => (
                                <div
                                    key={`${link.id || "link"}-${index}`}
                                    className={
                                        styles.linkRow
                                    }
                                >
                                    <select
                                        className={
                                            styles.select
                                        }
                                        value={
                                            link.type
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            handleLinkChange(
                                                index,
                                                "type",
                                                Number(
                                                    event
                                                        .target
                                                        .value,
                                                ),
                                            )
                                        }
                                    >
                                        {LINK_TYPES.map(
                                            (
                                                linkType,
                                            ) => (
                                                <option
                                                    key={
                                                        linkType.type
                                                    }
                                                    value={
                                                        linkType.type
                                                    }
                                                >
                                                    {
                                                        linkType.label
                                                    }
                                                </option>
                                            ),
                                        )}
                                    </select>

                                    <input
                                        className={
                                            styles.input
                                        }
                                        value={
                                            link.value
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            handleLinkChange(
                                                index,
                                                "value",
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        placeholder="URL 또는 이메일을 입력하세요"
                                    />

                                    <button
                                        type="button"
                                        className={
                                            styles.removeButton
                                        }
                                        onClick={() =>
                                            removeLink(
                                                index,
                                            )
                                        }
                                        aria-label="링크 삭제"
                                    >
                                        ×
                                    </button>
                                </div>
                            ),
                        )}
                    </div>

                    <button
                        type="button"
                        className={
                            styles.addButton
                        }
                        onClick={
                            addLink
                        }
                        disabled={
                            links.length >=
                            4
                        }
                    >
                        + 추가하기
                    </button>
                </section>

                <section
                    className={
                        styles.formSection
                    }
                >
                    <div
                        className={
                            styles.sectionHeading
                        }
                    >
                        <div>
                            <p
                                className={
                                    styles.sectionLabel
                                }
                            >
                                경험
                            </p>

                            <p
                                className={
                                    styles.sectionHelp
                                }
                            >
                                내가 쌓아온 활동을
                                보여주세요
                            </p>
                        </div>

                        <span
                            className={
                                styles.count
                            }
                        >
                            {
                                experiences.length
                            }
                            /5
                        </span>
                    </div>

                    <div
                        className={
                            styles.experienceList
                        }
                    >
                        {experiences.map(
                            (
                                experience,
                                index,
                            ) => (
                                <article
                                    key={`${experience.id || "experience"}-${index}`}
                                    className={
                                        styles.experienceCard
                                    }
                                >
                                    <div
                                        className={
                                            styles.experienceTop
                                        }
                                    >
                                        <label
                                            className={
                                                styles.representativeLabel
                                            }
                                        >
                                            <input
                                                type="radio"
                                                name="representativeExperience"
                                                checked={
                                                    experience.isRepresentative
                                                }
                                                onChange={() =>
                                                    setRepresentativeExperience(
                                                        index,
                                                    )
                                                }
                                            />

                                            대표
                                        </label>

                                        <button
                                            type="button"
                                            className={
                                                styles.removeExperienceButton
                                            }
                                            onClick={() =>
                                                removeExperience(
                                                    index,
                                                )
                                            }
                                        >
                                            삭제
                                        </button>
                                    </div>

                                    <label
                                        className={
                                            styles.inputLabel
                                        }
                                    >
                                        제목

                                        <span>
                                            {
                                                experience
                                                    .title
                                                    .length
                                            }
                                            /20
                                        </span>
                                    </label>

                                    <input
                                        className={
                                            styles.input
                                        }
                                        value={
                                            experience.title
                                        }
                                        maxLength={
                                            20
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            handleExperienceChange(
                                                index,
                                                "title",
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        placeholder="프로젝트명, 대외활동 등을 입력하세요"
                                    />

                                    <label
                                        className={
                                            styles.inputLabel
                                        }
                                    >
                                        설명

                                        <span>
                                            {
                                                experience
                                                    .description
                                                    .length
                                            }
                                            /250
                                        </span>
                                    </label>

                                    <textarea
                                        className={
                                            styles.textarea
                                        }
                                        value={
                                            experience.description
                                        }
                                        maxLength={
                                            250
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            handleExperienceChange(
                                                index,
                                                "description",
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        placeholder="활동에 대한 설명을 입력하세요"
                                    />

                                    <label
                                        className={
                                            styles.inputLabel
                                        }
                                    >
                                        관련 링크
                                    </label>

                                    <input
                                        className={
                                            styles.input
                                        }
                                        value={
                                            experience.relatedUrl
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            handleExperienceChange(
                                                index,
                                                "relatedUrl",
                                                event
                                                    .target
                                                    .value,
                                            )
                                        }
                                        placeholder="URL"
                                    />
                                </article>
                            ),
                        )}
                    </div>

                    <button
                        type="button"
                        className={
                            styles.addButton
                        }
                        onClick={
                            addExperience
                        }
                        disabled={
                            experiences.length >=
                            5
                        }
                    >
                        + 추가하기
                    </button>
                </section>

                {errorMessage && (
                    <p
                        className={
                            styles.errorMessage
                        }
                    >
                        {errorMessage}
                    </p>
                )}

                <div
                    className={
                        styles.bottomButtons
                    }
                >
                    <button
                        type="button"
                        className={
                            styles.skipButton
                        }
                        onClick={
                            handleBack
                        }
                        disabled={
                            isSaving
                        }
                    >
                        건너뛰기
                    </button>

                    <button
                        type="button"
                        className={
                            styles.submitButton
                        }
                        onClick={
                            handleSave
                        }
                        disabled={
                            isSaving
                        }
                    >
                        {isSaving
                            ? "저장 중..."
                            : "변경사항 저장"}
                    </button>
                </div>
            </section>

            {isItemModalOpen && (
                <TagSelectModal
                    title={
                        isDeveloper
                            ? "나의 관심 분야"
                            : "나의 스킬"
                    }
                    description="먼저 선택된 3개가 카드에 노출돼요"
                    sections={
                        tagSections
                    }
                    selectedItems={
                        selectedItems
                    }
                    maxCount={10}
                    onClose={() =>
                        setIsItemModalOpen(
                            false,
                        )
                    }
                    onConfirm={(
                        selected,
                    ) => {
                        setSelectedItems(
                            selected,
                        );

                        setIsItemModalOpen(
                            false,
                        );
                    }}
                />
            )}
        </OnboardingLayout>
    );
};

export default ProfileDetailEdit;