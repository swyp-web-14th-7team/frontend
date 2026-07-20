import {
    apiRequest,
} from "./apiClient";



export const getPublicProfileCards =
    async ({
        page = 1,
        limit = 16,
        sort = "createdAt",
        order = "desc",
        purposeId,
        jobTypeId,
        affiliationStatusId,
        keywords,
        signal,
    } = {}) => {
        const params =
            new URLSearchParams({
                page: String(page),
                limit: String(limit),
                sort,
                order,
            });

        if (purposeId) {
            params.append(
                "purposeId",
                String(purposeId),
            );
        }

        if (jobTypeId) {
            params.append(
                "jobTypeId",
                String(jobTypeId),
            );
        }

        if (affiliationStatusId) {
            params.append(
                "affiliationStatusId",
                String(
                    affiliationStatusId,
                ),
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

export const getPublicProfileCard =
    async (
        profileId,
        { signal } = {},
    ) => {
        return apiRequest(
            `/public/profile-cards/${profileId}`,
            {
                signal,
            },
        );
    };

export const getMyProfileCards =
    async ({
        page = 1,
        limit = 10,
        sort = "createdAt",
        order = "desc",
        signal,
    } = {}) => {
        const params =
            new URLSearchParams({
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

export const getMyProfileCard =
    async (
        profileId,
        { signal } = {},
    ) => {
        return apiRequest(
            `/profile-cards/${profileId}`,
            {
                signal,
            },
        );
    };

export const createProfileCard =
    async ({
        jobTypeId,
        purposeId,
    }) => {
        const requestBody = {
            jobTypeId:
                Number(jobTypeId),
        };

        if (
            purposeId !== undefined &&
            purposeId !== null
        ) {
            requestBody.purposeId =
                Number(purposeId);
        }

        return apiRequest(
            "/profile-cards",
            {
                method: "POST",

                body: JSON.stringify(
                    requestBody,
                ),
            },
        );
    };

export const updateProfileCard =
    async (
        profileId,
        profileData,
    ) => {
        return apiRequest(
            `/profile-cards/${profileId}`,
            {
                method: "PATCH",

                body: JSON.stringify(
                    profileData,
                ),
            },
        );
    };

/*
 * 기본 카드는 삭제할 수 없다.
 * 기본 카드 삭제 시 백엔드에서 400을 반환한다.
 */
export const deleteProfileCard =
    async (profileId) => {
        return apiRequest(
            `/profile-cards/${profileId}`,
            {
                method: "DELETE",
            },
        );
    };