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
            affiliationStatusId !==
                undefined &&
            affiliationStatusId !==
                null &&
            affiliationStatusId !== ""
        ) {
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
 * 실제 카드는 온보딩 마지막
 * '만들기' 버튼을 눌렀을 때만 생성한다.
 *
 * 닉네임과 연락처는 백엔드가
 * 기본 카드에서 복사한다.
 *
 * 프론트에서는 사용자가 선택한
 * 직군과 목적만 전달한다.
 */
export const createProfileCard =
    async ({
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
            jobTypeId:
                Number(jobTypeId),
        };

        if (
            purposeId !== undefined &&
            purposeId !== null &&
            purposeId !== ""
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
        if (!profileId) {
            throw new Error(
                "수정할 프로필 카드 ID가 필요합니다.",
            );
        }

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
 * 기본 카드 삭제 시 백엔드에서
 * 오류를 반환할 수 있다.
 */
export const deleteProfileCard =
    async (profileId) => {
        if (!profileId) {
            throw new Error(
                "삭제할 프로필 카드 ID가 필요합니다.",
            );
        }

        return apiRequest(
            `/profile-cards/${profileId}`,
            {
                method: "DELETE",
            },
        );
    };