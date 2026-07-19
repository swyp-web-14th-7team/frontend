import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ExploreProfileCard from "../../components/profile/ExploreProfileCard";
import SkillFilterModal from "../../components/explore/SkillFilterModal";
import InterestFilterModal from "../../components/explore/InterestFilterModal";

import profiles from "../../mocks/profiles";

import dropdownIcon from "../../assets/icons/icon_dropdown.svg";
import sortIcon from "../../assets/icons/icon_sort.svg";

import styles from "./Saved.module.css";

const JOB_FILTERS = [
    {
        id: "planner",
        label: "기획자",
    },
    {
        id: "designer",
        label: "디자이너",
    },
    {
        id: "frontend",
        label: "프론트엔드 개발자",
    },
    {
        id: "backend",
        label: "백엔드 개발자",
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

const INTEREST_OPTIONS = [
    {
        id: "interest-service-planning",
        name: "서비스 기획",
    },
    {
        id: "interest-ai",
        name: "AI",
    },
    {
        id: "interest-ux",
        name: "UX",
    },
    {
        id: "interest-branding",
        name: "브랜딩",
    },
    {
        id: "interest-ui-design",
        name: "UI 디자인",
    },
    {
        id: "interest-user-research",
        name: "사용자 리서치",
    },
    {
        id: "interest-commerce",
        name: "이커머스",
    },
    {
        id: "interest-data",
        name: "데이터 분석",
    },
    {
        id: "interest-automation",
        name: "자동화 효율화",
    },
    {
        id: "interest-ux-design",
        name: "UX 디자인",
    },
    {
        id: "interest-mobile",
        name: "모바일 앱",
    },
    {
        id: "interest-content",
        name: "콘텐츠",
    },
    {
        id: "interest-community",
        name: "커뮤니티",
    },
    {
        id: "interest-car",
        name: "자동차",
    },
    {
        id: "interest-entertainment",
        name: "엔터테인먼트",
    },
    {
        id: "interest-reading",
        name: "독서",
    },
    {
        id: "interest-utility",
        name: "유틸리티",
    },
    {
        id: "interest-used-market",
        name: "중고거래",
    },
    {
        id: "interest-o2o",
        name: "O2O",
    },
    {
        id: "interest-consulting",
        name: "컨설팅",
    },
    {
        id: "interest-b2b",
        name: "B2B",
    },
    {
        id: "interest-beauty",
        name: "뷰티",
    },
    {
        id: "interest-small-business",
        name: "소상공인",
    },
    {
        id: "interest-esg",
        name: "ESG",
    },
    {
        id: "interest-messenger",
        name: "메신저",
    },
    {
        id: "interest-senior",
        name: "시니어",
    },
    {
        id: "interest-universal-design",
        name: "유니버설 디자인",
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

const Saved = ({ cards }) => {
    const navigate = useNavigate();

    const savedProfiles = useMemo(() => {
        if (Array.isArray(cards)) {
            return cards;
        }

        return profiles.slice(0, 12);
    }, [cards]);

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

        INTEREST_OPTIONS.forEach((option) => {
            optionMap.set(
                normalizeValue(option.name),
                option,
            );
        });

        savedProfiles.forEach((profile) => {
            const profileInterests =
                profile.interests || [];

            profileInterests.forEach(
                (interest) => {
                    const name =
                        normalizeTag(interest);

                    if (!name) {
                        return;
                    }

                    const id =
                        typeof interest ===
                        "string"
                            ? interest
                            : interest.id ||
                              name;

                    const key =
                        normalizeValue(name);

                    if (!optionMap.has(key)) {
                        optionMap.set(key, {
                            id,
                            name,
                        });
                    }
                },
            );
        });

        return Array.from(
            optionMap.values(),
        );
    }, [savedProfiles]);

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
        navigate(
            `/profile/${profileId}`,
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

                {filteredProfiles.length >
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
                ) : (
                    <div
                        className={
                            styles.emptyResult
                        }
                    >
                        <strong>
                            조건에 맞는 카드가
                            없습니다.
                        </strong>

                        <p>
                            다른 필터를
                            선택해보세요.
                        </p>
                    </div>
                )}
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