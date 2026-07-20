const JOB_NAME_MAP = {
    PM: "planner",
    기획자: "planner",
    Planner: "planner",

    디자이너: "designer",
    Designer: "designer",

    "프론트 개발자":
        "frontend",

    "프론트엔드 개발자":
        "frontend",

    "Frontend Developer":
        "frontend",

    Frontend: "frontend",

    "백엔드 개발자":
        "backend",

    "Backend Developer":
        "backend",

    Backend: "backend",
};

const LINK_TYPE_MAP = {
    0: {
        type: "email",
        label: "Email",
    },

    1: {
        type: "instagram",
        label: "Instagram",
    },

    2: {
        type: "github",
        label: "GitHub",
    },

    3: {
        type: "linkedin",
        label: "LinkedIn",
    },

    4: {
        type: "behance",
        label: "Behance",
    },

    5: {
        type: "notion",
        label: "Notion",
    },

    6: {
        type: "website",
        label: "Website",
    },
};

const normalizeTag = (
    tag,
    index,
) => {
    if (
        typeof tag === "string"
    ) {
        return {
            id: `tag-${index}-${tag}`,
            name: tag,
        };
    }

    return {
        id:
            tag?.id ??
            `tag-${index}-${tag?.name}`,

        name: tag?.name || "",
    };
};

const normalizeTags = (
    tags = [],
) => {
    if (
        !Array.isArray(tags)
    ) {
        return [];
    }

    return tags
        .map(normalizeTag)
        .filter(
            (tag) => tag.name,
        );
};

const normalizeLink = (
    link,
    index,
) => {
    const numericType =
        Number(link?.type);

    const linkInfo =
        LINK_TYPE_MAP[
            numericType
        ] || {
            type: "website",
            label: "Website",
        };

    let url =
        link?.value ||
        link?.url ||
        "";

    if (
        linkInfo.type ===
            "email" &&
        url &&
        !url.startsWith(
            "mailto:",
        )
    ) {
        url = `mailto:${url}`;
    }

    return {
        id:
            link?.id ??
            `link-${index}`,

        type: linkInfo.type,

        label:
            link?.label ||
            linkInfo.label,

        url,
    };
};

const normalizeLinks = (
    links = [],
) => {
    if (
        !Array.isArray(links)
    ) {
        return [];
    }

    return links
        .map(normalizeLink)
        .filter(
            (link) => link.url,
        );
};

const normalizeExperience = (
    experience,
    index,
) => {
    return {
        id:
            experience?.id ??
            `experience-${index}`,

        title:
            experience?.title ||
            "프로젝트 경험",

        summary:
            experience?.summary ||
            experience
                ?.description ||
            "",

        description:
            experience
                ?.description ||
            "",

        url:
            experience
                ?.relatedUrl ||
            experience?.url ||
            "",

        linkLabel:
            experience
                ?.linkLabel ||
            "관련 링크 보기",

        sortOrder:
            experience?.sortOrder ??
            index,

        isRepresentative:
            index === 0,
    };
};

const normalizeExperiences = (
    experiences = [],
) => {
    if (
        !Array.isArray(
            experiences,
        )
    ) {
        return [];
    }

    return [...experiences]
        .sort(
            (
                first,
                second,
            ) =>
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
            normalizeExperience,
        );
};

const getJobName = (
    profile,
) => {
    return (
        profile.jobType?.name ||
        profile.job?.name ||
        profile.jobTypeName ||
        ""
    );
};

const getPurposeNames = (
    profile,
) => {
    if (
        Array.isArray(
            profile.purposes,
        )
    ) {
        return profile.purposes
            .map(
                (purpose) =>
                    purpose?.name ||
                    purpose,
            )
            .filter(Boolean);
    }

    if (
        profile.purpose?.name
    ) {
        return [
            profile.purpose.name,
        ];
    }

    return [];
};

const getPersonalityIcon = (
    imageUrl,
) => {
    if (!imageUrl) {
        return "";
    }

    if (
        imageUrl.endsWith(
            ".webp",
        )
    ) {
        return imageUrl;
    }

    return `${imageUrl.replace(
        /\/$/,
        "",
    )}/36.webp`;
};

export const mapProfileCard = (
    profile = {},
) => {
    const jobName =
        getJobName(profile);

    const normalizedJob =
        JOB_NAME_MAP[jobName] ||
        (
            typeof profile.job ===
            "string"
                ? profile.job
                : ""
        );

    const experiences =
        normalizeExperiences(
            profile.experiences,
        );

    const representativeExperience =
        experiences[0] || null;

    return {
        id: profile.id,

        userId:
            profile.userId || "",

        name:
            profile.nickname ||
            profile.name ||
            "이름 없음",

        job: normalizedJob,

        profileImage:
            profile.profileImageUrl ||
            profile.profileImageUri ||
            "",

        cardImage:
            profile.cardImageUrl ||
            profile.cardImageUri ||
            "",

        affiliation:
            profile.affiliation ||
            "",

        affiliationType:
            profile
                .affiliationStatus
                ?.name ||
            profile.affiliationType ||
            "",

        introduction:
            profile.description ||
            "",

        description:
            profile.description ||
            "",

        techStacks:
            normalizeTags(
                profile.skills,
            ),

        interests:
            normalizeTags(
                profile.interests,
            ),

        tools: [],

        purposes:
            getPurposeNames(
                profile,
            ),

        strength:
            profile.personality
                ? {
                      id:
                          profile
                              .personality
                              .id,

                      title:
                          profile
                              .personality
                              .name,

                      description:
                          profile
                              .personality
                              .description,

                      icon:
                          getPersonalityIcon(
                              profile
                                  .personality
                                  .imageUrl,
                          ),
                  }
                : null,

        links:
            normalizeLinks(
                profile.links,
            ),

        experiences,

        representativeExperience:
            representativeExperience
                ?.title || "",

        representativeExperienceDescription:
            representativeExperience
                ?.description ||
            "",

        createdAt:
            profile.createdAt
                ?.isoString ||
            profile.createdAt ||
            "",

        updatedAt:
            profile.updatedAt
                ?.isoString ||
            profile.updatedAt ||
            "",

        isActive:
            Boolean(
                profile.isActive,
            ),

        isDefault:
            Boolean(
                profile.isDefault,
            ),
    };
};

export const mapProfileCards = (
    profiles = [],
) => {
    if (
        !Array.isArray(profiles)
    ) {
        return [];
    }

    return profiles.map(
        mapProfileCard,
    );
};