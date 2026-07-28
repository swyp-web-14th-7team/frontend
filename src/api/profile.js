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

    if (purposeId !== undefined && purposeId !== null && purposeId !== "") {
        params.append("purposeId", String(purposeId));
    }

    if (jobTypeId !== undefined && jobTypeId !== null && jobTypeId !== "") {
        params.append("jobTypeId", String(jobTypeId));
    }

    if (
        affiliationStatusId !== undefined &&
        affiliationStatusId !== null &&
        affiliationStatusId !== ""
    ) {
        params.append("affiliationStatusId", String(affiliationStatusId));
    }

    if (Array.isArray(skillIds) && skillIds.length > 0) {
        skillIds.forEach((skillId) => {
        if (skillId !== undefined && skillId !== null && skillId !== "") {
            params.append("skillIds", String(skillId));
        }
        });
    }

    if (keywords?.trim()) {
        params.append("keywords", keywords.trim());
    }

    return apiRequest(`/public/profile-cards?${params.toString()}`, {
        signal,
    });
    };

    export const getPublicProfileCard = async (profileId, { signal } = {}) => {
    if (!profileId) {
        throw new Error("프로필 카드 ID가 필요합니다.");
    }

    return apiRequest(`/public/profile-cards/${profileId}`, {
        signal,
    });
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

    return apiRequest(`/profile-cards?${params.toString()}`, {
        signal,
        cache: "no-store",
    });
    };

    export const getMyProfileCard = async (profileId, { signal } = {}) => {
    if (!profileId) {
        throw new Error("프로필 카드 ID가 필요합니다.");
    }

    return apiRequest(`/profile-cards/${profileId}`, {
        signal,
        cache: "no-store",
    });
    };

    export const getDefaultProfileCard = async ({ signal } = {}) => {
    return apiRequest("/profile-cards/default", {
        signal,
        cache: "no-store",
    });
    };

    /*
    * 기본 카드의 닉네임과 링크를 수정합니다.
    * 전달하지 않은 값은 기존 값이 유지됩니다.
    * links를 전달하면 기존 링크 전체를 새 목록으로 교체합니다.
    */
    export const updateDefaultProfileCard = async (profileData = {}) => {
    const requestBody = {};

    if (Object.prototype.hasOwnProperty.call(profileData, "nickname")) {
        const nickname = String(profileData.nickname ?? "").trim();

        if (!nickname) {
        throw new Error("닉네임을 입력해주세요.");
        }

        requestBody.nickname = nickname;
    }

    if (Object.prototype.hasOwnProperty.call(profileData, "links")) {
        requestBody.links = Array.isArray(profileData.links)
        ? profileData.links
            .filter((link) => String(link?.value ?? "").trim())
            .map((link) => ({
                type: Number(link.type),
                value: String(link.value).trim(),
            }))
        : [];
    }

    return apiRequest("/profile-cards/default", {
        method: "PATCH",
        body: JSON.stringify(requestBody),
    });
    };

    export const createProfileCard = async ({ jobTypeId, purposeId }) => {
    if (jobTypeId === undefined || jobTypeId === null || jobTypeId === "") {
        throw new Error("직군을 선택해주세요.");
    }

    const requestBody = {
        jobTypeId: Number(jobTypeId),
    };

    if (purposeId !== undefined && purposeId !== null && purposeId !== "") {
        requestBody.purposeId = Number(purposeId);
    }

    return apiRequest("/profile-cards", {
        method: "POST",
        body: JSON.stringify(requestBody),
    });
    };

    export const updateProfileCard = async (profileId, profileData) => {
    if (!profileId) {
        throw new Error("수정할 프로필 카드 ID가 필요합니다.");
    }

    return apiRequest(`/profile-cards/${profileId}`, {
        method: "PATCH",
        body: JSON.stringify(profileData),
    });
    };

    export const deleteProfileCard = async (profileId) => {
    if (!profileId) {
        throw new Error("삭제할 프로필 카드 ID가 필요합니다.");
    }

    return apiRequest(`/profile-cards/${profileId}`, {
        method: "DELETE",
    });
    };