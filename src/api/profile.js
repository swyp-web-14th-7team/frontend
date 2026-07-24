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
        skillIds,
        affiliationStatusId,
        keywords,
        signal,
    } = {}) => {
        const params =
        new URLSearchParams({
            page:
            String(page),

            limit:
            String(limit),

            sort,

            order,
        });

        if (
        purposeId !==
            undefined &&
        purposeId !== null &&
        purposeId !== ""
        ) {
        params.append(
            "purposeId",
            String(purposeId),
        );
        }

        /*
        * 필요한 다른 화면에서는
        * 직군 필터를 사용할 수 있기 때문에
        * API 함수 자체의 직군 옵션은 유지한다.
        *
        * 탐색 화면에서는 jobTypeId를
        * 전달하지 않으므로 적용되지 않는다.
        */
        if (
        jobTypeId !==
            undefined &&
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
        affiliationStatusId !==
            ""
        ) {
        params.append(
            "affiliationStatusId",
            String(
            affiliationStatusId,
            ),
        );
        }

        /*
        * 여러 스킬을 다음과 같이 전달한다.
        *
        * skillIds=1&skillIds=2&skillIds=3
        */
        if (
        Array.isArray(
            skillIds,
        ) &&
        skillIds.length > 0
        ) {
        skillIds.forEach(
            (skillId) => {
            if (
                skillId !==
                undefined &&
                skillId !==
                null &&
                skillId !== ""
            ) {
                params.append(
                "skillIds",
                String(
                    skillId,
                ),
                );
            }
            },
        );
        }

        if (
        keywords?.trim()
        ) {
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
        {
        signal,
        } = {},
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
            page:
            String(page),

            limit:
            String(limit),

            sort,

            order,
        });

        return apiRequest(
        `/profile-cards?${params.toString()}`,
        {
            signal,

            /*
            * 목적 변경 후 이전 카드 정보가
            * 캐시에서 조회되는 것을 방지한다.
            */
            cache:
            "no-store",
        },
        );
    };

    export const getMyProfileCard =
    async (
        profileId,
        {
        signal,
        } = {},
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

            cache:
            "no-store",
        },
        );
    };

    export const getDefaultProfileCard =
    async ({
        signal,
    } = {}) => {
        return apiRequest(
        "/profile-cards/default",
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
        jobTypeId ===
            undefined ||
        jobTypeId === null ||
        jobTypeId === ""
        ) {
        throw new Error(
            "직군을 선택해주세요.",
        );
        }

        const requestBody = {
        jobTypeId:
            Number(
            jobTypeId,
            ),
        };

        if (
        purposeId !==
            undefined &&
        purposeId !== null &&
        purposeId !== ""
        ) {
        requestBody.purposeId =
            Number(
            purposeId,
            );
        }

        return apiRequest(
        "/profile-cards",
        {
            method:
            "POST",

            body:
            JSON.stringify(
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
            method:
            "PATCH",

            body:
            JSON.stringify(
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
    async (
        profileId,
    ) => {
        if (!profileId) {
        throw new Error(
            "삭제할 프로필 카드 ID가 필요합니다.",
        );
        }

        return apiRequest(
        `/profile-cards/${profileId}`,
        {
            method:
            "DELETE",
        },
        );
    };