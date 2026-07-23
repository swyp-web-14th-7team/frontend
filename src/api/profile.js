    import { apiRequest } from "./apiClient";

    export const getPublicProfileCards = async ({
    page = 1,
    limit = 16,
    sort = "createdAt",
    order = "desc",
    purposeId,
    jobTypeId,
    skillIds,
    affiliationStatusId,
    keywords,
    signal,
    } = {}) => {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort,
        order,
    });

    if (
        purposeId !== undefined &&
        purposeId !== null &&
        purposeId !== ""
    ) {
        params.append(
        "purposeId",
        String(purposeId),
        );
    }

    if (
        jobTypeId !== undefined &&
        jobTypeId !== null &&
        jobTypeId !== ""
    ) {
        params.append(
        "jobTypeId",
        String(jobTypeId),
        );
    }

    if (
        affiliationStatusId !== undefined &&
        affiliationStatusId !== null &&
        affiliationStatusId !== ""
    ) {
        params.append(
        "affiliationStatusId",
        String(affiliationStatusId),
        );
    }

    if (
        Array.isArray(skillIds) &&
        skillIds.length > 0
    ) {
        params.append(
        "skillIds",
        skillIds.join(","),
        );
    }

    if (keywords?.trim()) {
        params.append(
        "keywords",
        keywords.trim(),
        );
    }

    return apiRequest(
        `/public/profile-cards?${params.toString()}`,
        {
        signal,
        },
    );
    };

    export const getPublicProfileCard = async (
    profileId,
    { signal } = {},
    ) => {
    if (!profileId) {
        throw new Error(
        "프로필 카드 ID가 필요합니다.",
        );
    }

    return apiRequest(
        `/public/profile-cards/${profileId}`,
        {
        signal,
        },
    );
    };

    export const getMyProfileCards = async ({
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "desc",
    signal,
    } = {}) => {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort,
        order,
    });

    return apiRequest(
        `/profile-cards?${params.toString()}`,
        {
        signal,
        },
    );
    };

    export const getMyProfileCard = async (
    profileId,
    { signal } = {},
    ) => {
    if (!profileId) {
        throw new Error(
        "프로필 카드 ID가 필요합니다.",
        );
    }

    return apiRequest(
        `/profile-cards/${profileId}`,
        {
        signal,
        },
    );
    };

    /*
    * 온보딩 직군 선택 직후 기본 프로필 카드를 생성합니다.
    * 이 단계에서는 직군과 목적만 전달합니다.
    */
    export const createBasicProfileCard = async ({
    jobTypeId,
    purposeId,
    }) => {
    if (
        jobTypeId === undefined ||
        jobTypeId === null ||
        jobTypeId === ""
    ) {
        throw new Error(
        "직군을 선택해주세요.",
        );
    }

    const requestBody = {
        jobTypeId: Number(jobTypeId),
    };

    if (
        purposeId !== undefined &&
        purposeId !== null &&
        purposeId !== ""
    ) {
        requestBody.purposeId =
        Number(purposeId);
    }

    return apiRequest("/profile-cards", {
        method: "POST",
        body: JSON.stringify(requestBody),
    });
    };

    export const createProfileCard = async (
    profileData,
    ) => {
    return apiRequest("/profile-cards", {
        method: "POST",
        body: JSON.stringify(profileData),
    });
    };

    export const updateProfileCard = async (
    profileId,
    profileData,
    ) => {
    if (!profileId) {
        throw new Error(
        "프로필 카드 ID가 필요합니다.",
        );
    }

    return apiRequest(
        `/profile-cards/${profileId}`,
        {
        method: "PATCH",
        body: JSON.stringify(profileData),
        },
    );
    };

    export const deleteProfileCard = async (
    profileId,
    ) => {
    if (!profileId) {
        throw new Error(
        "프로필 카드 ID가 필요합니다.",
        );
    }

    return apiRequest(
        `/profile-cards/${profileId}`,
        {
        method: "DELETE",
        },
    );
    };

    export const activateProfileCard = async (
    profileId,
    ) => {
    if (!profileId) {
        throw new Error(
        "프로필 카드 ID가 필요합니다.",
        );
    }

    return apiRequest(
        `/profile-cards/${profileId}/activate`,
        {
        method: "PATCH",
        },
    );
    };

    export const deactivateProfileCard = async (
    profileId,
    ) => {
    if (!profileId) {
        throw new Error(
        "프로필 카드 ID가 필요합니다.",
        );
    }

    return apiRequest(
        `/profile-cards/${profileId}/deactivate`,
        {
        method: "PATCH",
        },
    );
    };

    export const setDefaultProfileCard = async (
    profileId,
    ) => {
    if (!profileId) {
        throw new Error(
        "프로필 카드 ID가 필요합니다.",
        );
    }

    return apiRequest(
        `/profile-cards/${profileId}/default`,
        {
        method: "PATCH",
        },
    );
    };