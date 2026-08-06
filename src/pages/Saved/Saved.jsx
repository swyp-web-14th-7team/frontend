import {
    useEffect,
    useMemo,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
    getConnections,
} from "../../api/connections";

import {
    getInterests,
} from "../../api/options";

import ExploreProfileCard from "../../components/profile/ExploreProfileCard";
import SkillFilterModal from "../../components/explore/SkillFilterModal";
import InterestFilterModal from "../../components/explore/InterestFilterModal";

import {
    mapProfileCard,
} from "../../utils/profileMapper";

import dropdownIcon from "../../assets/icons/icon_dropdown.svg";
import sortIcon from "../../assets/icons/icon_sort.svg";

import styles from "./Saved.module.css";

const JOB_FILTERS = [
    {
        id: "designer",
        label: "디자이너",
    },
    {
        id: "frontend",
        label: "프론트엔드",
    },
    {
        id: "backend",
        label: "백엔드",
    },
    {
        id: "planner",
        label: "기획자",
    },
];

const AFFILIATION_OPTIONS = [
    {
        id: "all",
        label: "현 소속",
    },
    {
        id: "student",
        label: "재학생",
    },
    {
        id: "job-seeker",
        label: "취준생",
    },
    {
        id: "employee",
        label: "직장인",
    },
    {
        id: "freelancer",
        label: "프리랜서",
    },
];

const SORT_OPTIONS = [
    {
        id: "recent",
        label: "최근 등록순",
    },
    {
        id: "old",
        label: "오래된순",
    },
];

const normalizeTag = (tag) => {
    if (typeof tag === "string") {
        return tag;
    }

    return tag?.name || tag?.label || "";
};

const normalizeValue = (value) =>
    String(value || "")
        .trim()
        .toLowerCase();

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

const getSelectedId = (item) => {
    if (
        typeof item === "string" ||
        typeof item === "number"
    ) {
        return item;
    }

    return item?.id;
};

const getFilterSummary = ({
    selectedItems,
    emptyLabel,
    options = [],
}) => {
    if (selectedItems.length === 0) {
        return emptyLabel;
    }

    const firstItem = selectedItems[0];

    const matchedOption = options.find(
        (option) =>
            String(option.id) ===
            String(
                getSelectedId(firstItem),
            ),
    );

    const firstName =
        matchedOption?.name ||
        matchedOption?.label ||
        normalizeTag(firstItem) ||
        emptyLabel;

    if (selectedItems.length === 1) {
        return firstName;
    }

    return `${firstName} 외 ${
        selectedItems.length - 1
    }`;
};

const Saved = () => {
    const navigate = useNavigate();

    const [savedProfiles, setSavedProfiles] =
        useState([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState("");

    const [cmsInterests, setCmsInterests] =
        useState([]);

    useEffect(() => {
        const controller =
            new AbortController();

        const fetchConnections = async () => {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const data =
                    await getConnections({
                        page: 1,
                        limit: 100,
                        sort: "createdAt",
                        order: "desc",
                        signal:
                            controller.signal,
                    });

                if (controller.signal.aborted) {
                    return;
                }

                const connections =
                    data?.items || [];

                const profiles =
                    connections.map(
                        (connection) => ({
                            ...mapProfileCard(
                                connection.card || {},
                            ),
                            connectionId:
                                connection.id,
                            connectionMessage:
                                connection.message ||
                                "",
                            connectedAt:
                                connection.connectedAt
                                    ?.isoString ||
                                connection.connectedAt ||
                                "",
                            createdAt:
                                connection.connectedAt
                                    ?.isoString ||
                                connection.connectedAt ||
                                "",
                        }),
                    );

                setSavedProfiles(profiles);
            } catch (error) {
                if (
                    error?.name ===
                    "AbortError"
                ) {
                    return;
                }

                console.error(
                    "보관함 조회 실패:",
                    error,
                );

                setErrorMessage(
                    error.message ||
                        "보관함을 불러오지 못했습니다.",
                );
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchConnections();

        return () => {
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const controller =
            new AbortController();

        const fetchInterests = async () => {
            try {
                const data = await getInterests({
                    page: 1,
                    limit: 100,
                    sort: "name",
                    order: "asc",
                    signal: controller.signal,
                });

                if (controller.signal.aborted) {
                    return;
                }

                setCmsInterests(getItems(data));
            } catch (error) {
                if (error?.name === "AbortError") {
                    return;
                }

                console.error(
                    "관심분야 목록 조회 실패:",
                    error,
                );

                setCmsInterests([]);
            }
        };

        void fetchInterests();

        return () => {
            controller.abort();
        };
    }, []);

    const [selectedJobs, setSelectedJobs] =
        useState([]);

    const [
        selectedAffiliation,
        setSelectedAffiliation,
    ] = useState("all");

    const [selectedSkills, setSelectedSkills] =
        useState([]);

    const [
        selectedInterests,
        setSelectedInterests,
    ] = useState([]);

    const [sortType, setSortType] =
        useState("recent");

    const [
        isSkillModalOpen,
        setIsSkillModalOpen,
    ] = useState(false);

    const [
        isInterestModalOpen,
        setIsInterestModalOpen,
    ] = useState(false);

    const interestOptions = useMemo(() => {
        const optionMap = new Map();
        const optionNames = new Set();

        const addOption = (interest) => {
            const name = normalizeTag(interest);

            if (!name) {
                return;
            }

            const id =
                typeof interest === "string"
                    ? interest
                    : interest.id ?? name;

            const idKey = String(id);
            const nameKey = normalizeValue(name);

            if (
                optionMap.has(idKey) ||
                optionNames.has(nameKey)
            ) {
                return;
            }

            optionMap.set(idKey, {
                id,
                name,
            });

            optionNames.add(nameKey);
        };

        cmsInterests.forEach(addOption);

        savedProfiles.forEach((profile) => {
            const profileInterests =
                profile.interests || [];

            profileInterests.forEach(addOption);
        });

        return Array.from(
            optionMap.values(),
        );
    }, [cmsInterests, savedProfiles]);

    const skillSummary = useMemo(
        () =>
            getFilterSummary({
                selectedItems:
                    selectedSkills,
                emptyLabel: "스킬",
            }),
        [selectedSkills],
    );

    const interestSummary = useMemo(
        () =>
            getFilterSummary({
                selectedItems:
                    selectedInterests,
                emptyLabel: "관심분야",
                options: interestOptions,
            }),
        [
            interestOptions,
            selectedInterests,
        ],
    );

    const filteredProfiles = useMemo(() => {
        const filtered =
            savedProfiles.filter(
                (profile) => {
                    const matchesJob =
                        selectedJobs.length ===
                            0 ||
                        selectedJobs.includes(
                            profile.job,
                        );

                    const affiliationOption =
                        AFFILIATION_OPTIONS.find(
                            (option) =>
                                option.id ===
                                selectedAffiliation,
                        );

                    const profileAffiliations =
                        [
                            profile.affiliationType,
                            profile.affiliation,
                        ]
                            .filter(Boolean)
                            .map(
                                normalizeValue,
                            );

                    const matchesAffiliation =
                        selectedAffiliation ===
                            "all" ||
                        profileAffiliations.some(
                            (value) =>
                                value ===
                                    normalizeValue(
                                        selectedAffiliation,
                                    ) ||
                                value.includes(
                                    normalizeValue(
                                        affiliationOption?.label,
                                    ),
                                ),
                        );

                    const profileSkills = (
                        profile.techStacks || []
                    ).map((skill) =>
                        normalizeValue(
                            normalizeTag(skill),
                        ),
                    );

                    const matchesSkills =
                        selectedSkills.length ===
                            0 ||
                        selectedSkills.every(
                            (
                                selectedSkill,
                            ) =>
                                profileSkills.includes(
                                    normalizeValue(
                                        normalizeTag(
                                            selectedSkill,
                                        ),
                                    ),
                                ),
                        );

                    const profileInterests = (
                        profile.interests || []
                    ).map((interest) =>
                        normalizeValue(
                            normalizeTag(
                                interest,
                            ),
                        ),
                    );

                    const profileInterestIds = (
                        profile.interests || []
                    )
                        .map(getSelectedId)
                        .filter(
                            (id) =>
                                id !== undefined &&
                                id !== null,
                        )
                        .map(String);

                    const matchesInterests =
                        selectedInterests.length ===
                            0 ||
                        selectedInterests.every(
                            (
                                selectedInterest,
                            ) => {
                                const selectedId =
                                    getSelectedId(
                                        selectedInterest,
                                    );

                                if (
                                    selectedId !== undefined &&
                                    selectedId !== null &&
                                    profileInterestIds.includes(
                                        String(selectedId),
                                    )
                                ) {
                                    return true;
                                }

                                const option =
                                    interestOptions.find(
                                        (
                                            interest,
                                        ) =>
                                            String(
                                                interest.id,
                                            ) ===
                                            String(
                                                selectedId,
                                            ),
                                    );

                                return profileInterests.includes(
                                    normalizeValue(
                                        option?.name ||
                                            normalizeTag(
                                                selectedInterest,
                                            ),
                                    ),
                                );
                            },
                        );

                    return (
                        matchesJob &&
                        matchesAffiliation &&
                        matchesSkills &&
                        matchesInterests
                    );
                },
            );

        return [...filtered].sort(
            (first, second) => {
                const firstTime =
                    new Date(
                        first.createdAt || 0,
                    ).getTime() || 0;

                const secondTime =
                    new Date(
                        second.createdAt || 0,
                    ).getTime() || 0;

                if (sortType === "old") {
                    return (
                        firstTime -
                            secondTime ||
                        Number(first.id) -
                            Number(second.id)
                    );
                }

                return (
                    secondTime -
                        firstTime ||
                    Number(second.id) -
                        Number(first.id)
                );
            },
        );
    }, [
        interestOptions,
        savedProfiles,
        selectedAffiliation,
        selectedInterests,
        selectedJobs,
        selectedSkills,
        sortType,
    ]);

    const handleJobClick = (jobId) => {
        setSelectedJobs(
            (previousJobs) => {
                if (
                    previousJobs.includes(
                        jobId,
                    )
                ) {
                    return previousJobs.filter(
                        (id) => id !== jobId,
                    );
                }

                return [
                    ...previousJobs,
                    jobId,
                ];
            },
        );
    };

    const handleSkillApply = (
        skills,
    ) => {
        setSelectedSkills(skills);
        setIsSkillModalOpen(false);
    };

    const handleInterestApply = (
        interests,
    ) => {
        setSelectedInterests(interests);
        setIsInterestModalOpen(false);
    };

    const handleProfileClick = (
    profileId,
) => {
    const clickedProfile =
        savedProfiles.find(
            (profile) =>
                String(profile.id) ===
                String(profileId),
        );

    if (
        !clickedProfile?.connectionId
    ) {
        console.error(
            "보관함 연결 ID가 없습니다.",
        );
        return;
    }

    navigate(
        `/saved/${clickedProfile.connectionId}`,
    );
};

    return (
        <main className={styles.page}>
            <section
                className={styles.container}
            >
                <h1 className={styles.title}>
                    주고받은 카드
                </h1>

                {isLoading && (
                    <div className={styles.statusMessage}>
                        보관함을 불러오는 중입니다.
                    </div>
                )}

                {errorMessage && (
                    <div
                        className={styles.errorMessage}
                        role="alert"
                    >
                        {errorMessage}
                    </div>
                )}

                <div
                    className={
                        styles.filterArea
                    }
                >
                    <div
                        className={
                            styles.filterLeft
                        }
                    >
                        <img
                            src={sortIcon}
                            alt=""
                            className={
                                styles.filterSymbol
                            }
                            aria-hidden="true"
                        />

                        <div
                            className={
                                styles.jobFilters
                            }
                            aria-label="직군 필터"
                        >
                            {JOB_FILTERS.map(
                                (job) => {
                                    const isSelected =
                                        selectedJobs.includes(
                                            job.id,
                                        );

                                    return (
                                        <button
                                            key={
                                                job.id
                                            }
                                            type="button"
                                            className={`${
                                                styles.filterButton
                                            } ${
                                                isSelected
                                                    ? styles.selectedFilter
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleJobClick(
                                                    job.id,
                                                )
                                            }
                                            aria-pressed={
                                                isSelected
                                            }
                                        >
                                            {
                                                job.label
                                            }
                                        </button>
                                    );
                                },
                            )}
                        </div>

                        <span
                            className={
                                styles.divider
                            }
                            aria-hidden="true"
                        />

                        <label
                            className={
                                styles.selectWrapper
                            }
                        >
                            <select
                                value={
                                    selectedAffiliation
                                }
                                onChange={(
                                    event,
                                ) =>
                                    setSelectedAffiliation(
                                        event.target
                                            .value,
                                    )
                                }
                                aria-label="현 소속"
                            >
                                {AFFILIATION_OPTIONS.map(
                                    (
                                        option,
                                    ) => (
                                        <option
                                            key={
                                                option.id
                                            }
                                            value={
                                                option.id
                                            }
                                        >
                                            {
                                                option.label
                                            }
                                        </option>
                                    ),
                                )}
                            </select>

                            <img
                                src={dropdownIcon}
                                alt=""
                                className={
                                    styles.selectArrow
                                }
                            />
                        </label>

                        <button
                            type="button"
                            className={`${
                                styles.dropdownButton
                            } ${
                                selectedSkills.length >
                                0
                                    ? styles.appliedDropdown
                                    : ""
                            }`}
                            onClick={() =>
                                setIsSkillModalOpen(
                                    true,
                                )
                            }
                        >
                            <span
                                className={
                                    styles.filterSummary
                                }
                            >
                                {skillSummary}
                            </span>

                            {selectedSkills.length ===
                                0 && (
                                <img
                                    src={dropdownIcon}
                                    alt=""
                                    className={
                                        styles.dropdownIcon
                                    }
                                />
                            )}
                        </button>

                        <button
                            type="button"
                            className={`${
                                styles.dropdownButton
                            } ${
                                selectedInterests.length >
                                0
                                    ? styles.appliedDropdown
                                    : ""
                            }`}
                            onClick={() =>
                                setIsInterestModalOpen(
                                    true,
                                )
                            }
                        >
                            <span
                                className={
                                    styles.filterSummary
                                }
                            >
                                {interestSummary}
                            </span>

                            {selectedInterests.length ===
                                0 && (
                                <img
                                    src={dropdownIcon}
                                    alt=""
                                    className={
                                        styles.dropdownIcon
                                    }
                                />
                            )}
                        </button>
                    </div>

                    <label
                        className={
                            styles.sortWrapper
                        }
                    >
                        <select
                            value={sortType}
                            onChange={(event) =>
                                setSortType(
                                    event.target
                                        .value,
                                )
                            }
                            aria-label="카드 정렬"
                        >
                            {SORT_OPTIONS.map(
                                (option) => (
                                    <option
                                        key={
                                            option.id
                                        }
                                        value={
                                            option.id
                                        }
                                    >
                                        {
                                            option.label
                                        }
                                    </option>
                                ),
                            )}
                        </select>

                        <img
                            src={dropdownIcon}
                            alt=""
                            className={
                                styles.selectArrow
                            }
                        />
                    </label>
                </div>

                <div
                    className={
                        styles.resultHeader
                    }
                >
                    <span>
                        총{" "}
                        {
                            filteredProfiles.length
                        }
                        장
                    </span>
                </div>

                {!isLoading &&
                !errorMessage &&
                filteredProfiles.length >
                0 ? (
                    <div
                        className={
                            styles.cardGrid
                        }
                    >
                        {filteredProfiles.map(
                            (profile) => (
                                <ExploreProfileCard
                                    key={
                                        profile.id
                                    }
                                    profile={
                                        profile
                                    }
                                    onClick={
                                        handleProfileClick
                                    }
                                />
                            ),
                        )}
                    </div>
                ) : !isLoading &&
                  !errorMessage ? (
                    <div
                        className={
                            styles.emptyResult
                        }
                    >
                        <strong>
                            {savedProfiles.length ===
                            0
                                ? "아직 주고받은 카드가 없어요"
                                : "조건에 맞는 카드가 없어요"}
                        </strong>

                        <p>
                            {savedProfiles.length ===
                            0
                                ? "탐색에서 마음이 가는 사람에게 카드를 건네보세요"
                                : "다른 필터를 선택해보세요"}
                        </p>
                    </div>
                ) : null}
            </section>

            {isSkillModalOpen && (
                <SkillFilterModal
                    selectedSkills={
                        selectedSkills
                    }
                    onApply={
                        handleSkillApply
                    }
                    onClose={() =>
                        setIsSkillModalOpen(
                            false,
                        )
                    }
                />
            )}

            {isInterestModalOpen && (
                <InterestFilterModal
                    options={
                        interestOptions
                    }
                    selectedInterests={
                        selectedInterests
                    }
                    onApply={
                        handleInterestApply
                    }
                    onClose={() =>
                        setIsInterestModalOpen(
                            false,
                        )
                    }
                />
            )}
        </main>
    );
};

export default Saved;
