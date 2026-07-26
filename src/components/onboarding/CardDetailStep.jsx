    import {
    useMemo,
    useState,
    } from "react";

    import OnboardingLayout from "../common/OnboardingLayout";
    import TagSelectModal from "./TagSelectModal";

    import styles from "../../pages/ProfileDetailEdit/ProfileDetailEdit.module.css";

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

    const createEmptyExperience = (
    isRepresentative = false,
    ) => ({
    title: "",
    description: "",
    relatedUrl: "",
    isRepresentative,
    });

    const createSkillSections = (
    skills = [],
    ) => {
    const sectionMap = new Map();

    skills.forEach((skill) => {
        const categoryName =
        skill?.category?.name ||
        "툴";

        if (
        !sectionMap.has(categoryName)
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
            optionType: "skill",
        });
    });

    return Array.from(
        sectionMap.entries(),
    ).map(
        (
        [categoryName, options],
        index,
        ) => ({
        id: `skill-category-${index}`,
        title: categoryName,
        options,
        }),
    );
    };

    const createInterestSections = (
    interests = [],
    ) => {
    return [
        {
        id: "interests",
        title: "관심 분야",

        options: interests.map(
            (interest) => ({
            id: interest.id,
            name: interest.name,
            type: "interest",
            optionType: "interest",
            }),
        ),
        },
    ];
    };

    const CardDetailStep = ({
    data,
    skills = [],
    interests = [],
    onChange,
    onNext,
    onBack,
    currentStep,
    totalSteps,
    }) => {
    const [
        isTagModalOpen,
        setIsTagModalOpen,
    ] = useState(false);

    const isDeveloper =
        data.job === "frontend" ||
        data.job === "backend";

    const selectedItems =
        isDeveloper
        ? data.interests || []
        : data.techStacks || [];

    const sectionTitle =
        isDeveloper
        ? "관심분야"
        : "스킬";

    const sectionDescription =
        isDeveloper
        ? "관심 있는 분야를 보여주세요"
        : "나의 사용 툴과 역량을 어필해보세요";

    const tagSections = useMemo(
        () =>
        isDeveloper
            ? createInterestSections(
                interests,
            )
            : createSkillSections(
                skills,
            ),
        [
        interests,
        isDeveloper,
        skills,
        ],
    );

    const links =
        Array.isArray(data.links) &&
        data.links.length > 0
        ? data.links
        : [createEmptyLink()];

    const experiences =
        Array.isArray(
        data.experiences,
        ) &&
        data.experiences.length > 0
        ? data.experiences
        : [
            createEmptyExperience(
                true,
            ),
            ];

    const updateSelectedItems = (
        nextItems,
    ) => {
        if (isDeveloper) {
        onChange({
            interests: nextItems,
        });

        return;
        }

        onChange({
        techStacks: nextItems,
        });
    };

    const removeSelectedItem = (
        itemId,
    ) => {
        updateSelectedItems(
        selectedItems.filter(
            (item) =>
            String(item.id) !==
            String(itemId),
        ),
        );
    };

    const updateLinks = (
        nextLinks,
    ) => {
        onChange({
        links: nextLinks,
        });
    };

    const handleLinkChange = (
        index,
        key,
        value,
    ) => {
        updateLinks(
        links.map(
            (link, linkIndex) =>
            linkIndex === index
                ? {
                    ...link,
                    [key]: value,
                }
                : link,
        ),
        );
    };

    const addLink = () => {
        if (links.length >= 4) {
        return;
        }

        updateLinks([
        ...links,
        createEmptyLink(),
        ]);
    };

    const removeLink = (index) => {
        const nextLinks =
        links.filter(
            (_, linkIndex) =>
            linkIndex !== index,
        );

        updateLinks(
        nextLinks.length > 0
            ? nextLinks
            : [createEmptyLink()],
        );
    };

    const updateExperiences = (
        nextExperiences,
    ) => {
        onChange({
        experiences:
            nextExperiences,
        });
    };

    const handleExperienceChange = (
        index,
        key,
        value,
    ) => {
        updateExperiences(
        experiences.map(
            (
            experience,
            experienceIndex,
            ) =>
            experienceIndex === index
                ? {
                    ...experience,
                    [key]: value,
                }
                : experience,
        ),
        );
    };

    const setRepresentativeExperience =
        (index) => {
        updateExperiences(
            experiences.map(
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

        updateExperiences([
        ...experiences,
        createEmptyExperience(),
        ]);
    };

    const removeExperience = (
        index,
    ) => {
        const nextExperiences =
        experiences.filter(
            (
            _,
            experienceIndex,
            ) =>
            experienceIndex !== index,
        );

        if (
        nextExperiences.length === 0
        ) {
        updateExperiences([
            createEmptyExperience(
            true,
            ),
        ]);

        return;
        }

        const hasRepresentative =
        nextExperiences.some(
            (experience) =>
            experience
                .isRepresentative,
        );

        if (hasRepresentative) {
        updateExperiences(
            nextExperiences,
        );

        return;
        }

        updateExperiences(
        nextExperiences.map(
            (
            experience,
            experienceIndex,
            ) => ({
            ...experience,

            isRepresentative:
                experienceIndex === 0,
            }),
        ),
        );
    };

    return (
        <OnboardingLayout
        showBackButton
        showProgress
        onBack={onBack}
        currentStep={currentStep}
        totalSteps={totalSteps}
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
            {data.profileImagePreview ||
            data.profileImageUrl ? (
                <img
                src={
                    data.profileImagePreview ||
                    data.profileImageUrl
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
                aria-hidden="true"
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
                    {sectionTitle}
                </p>

                <p
                    className={
                    styles.sectionHelp
                    }
                >
                    {sectionDescription}
                </p>
                </div>

                <span
                className={
                    styles.count
                }
                >
                {selectedItems.length}
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
                    (item) => (
                    <button
                        key={`${item.optionType || item.type}-${item.id}`}
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
                        {item.name}

                        <span
                        aria-hidden="true"
                        >
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
                setIsTagModalOpen(
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
                    포트폴리오, Github,
                    이메일 등
                </p>
                </div>

                <span
                className={
                    styles.count
                }
                >
                {
                    links.filter(
                    (link) =>
                        (
                        link.value ||
                        ""
                        ).trim(),
                    ).length
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
                (link, index) => (
                    <div
                    key={`link-${index}`}
                    className={
                        styles.linkRow
                    }
                    >
                    <select
                        className={
                        styles.select
                        }
                        value={link.type}
                        onChange={(
                        event,
                        ) =>
                        handleLinkChange(
                            index,
                            "type",
                            Number(
                            event.target
                                .value,
                            ),
                        )
                        }
                    >
                        {LINK_TYPES.map(
                        (linkType) => (
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
                        link.value || ""
                        }
                        onChange={(
                        event,
                        ) =>
                        handleLinkChange(
                            index,
                            "value",
                            event.target
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
                        removeLink(index)
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
                onClick={addLink}
                disabled={
                links.length >= 4
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
                {experiences.length}
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
                    key={`experience-${index}`}
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
                            name="newCardRepresentativeExperience"
                            checked={
                            Boolean(
                                experience
                                .isRepresentative,
                            )
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
                            (
                            experience
                                .title ||
                            ""
                            ).length
                        }
                        /20
                        </span>
                    </label>

                    <input
                        className={
                        styles.input
                        }
                        value={
                        experience.title ||
                        ""
                        }
                        maxLength={20}
                        onChange={(
                        event,
                        ) =>
                        handleExperienceChange(
                            index,
                            "title",
                            event.target
                            .value,
                        )
                        }
                        placeholder="프로젝트명, 대외활동 등을 입력해보세요"
                    />

                    <label
                        className={
                        styles.inputLabel
                        }
                    >
                        설명

                        <span>
                        {
                            (
                            experience
                                .description ||
                            ""
                            ).length
                        }
                        /250
                        </span>
                    </label>

                    <textarea
                        className={
                        styles.textarea
                        }
                        value={
                        experience
                            .description ||
                        ""
                        }
                        maxLength={250}
                        onChange={(
                        event,
                        ) =>
                        handleExperienceChange(
                            index,
                            "description",
                            event.target
                            .value,
                        )
                        }
                        placeholder="텍스트를 입력하세요"
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
                        experience
                            .relatedUrl ||
                        ""
                        }
                        onChange={(
                        event,
                        ) =>
                        handleExperienceChange(
                            index,
                            "relatedUrl",
                            event.target
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
                experiences.length >= 5
                }
            >
                + 추가하기
            </button>
            </section>

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
                onClick={onNext}
            >
                건너뛰기
            </button>

            <button
                type="button"
                className={
                styles.submitButton
                }
                onClick={onNext}
            >
                등록
            </button>
            </div>
        </section>

        {isTagModalOpen && (
            <TagSelectModal
            title={
                isDeveloper
                ? "나의 관심 분야"
                : "나의 스킬"
            }
            description="먼저 선택된 3개가 카드에 노출돼요"
            sections={tagSections}
            selectedItems={
                selectedItems
            }
            maxCount={10}
            onClose={() =>
                setIsTagModalOpen(
                false,
                )
            }
            onConfirm={(
                nextSelectedItems,
            ) => {
                updateSelectedItems(
                nextSelectedItems,
                );

                setIsTagModalOpen(
                false,
                );
            }}
            />
        )}
        </OnboardingLayout>
    );
    };

    export default CardDetailStep;