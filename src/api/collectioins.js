import {
    apiRequest,
} from "./apiClient";

const createPaginationParams = ({
    page = 1,
    limit = 100,
    sort = "createdAt",
    order = "desc",
} = {}) => {
    return new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort,
        order,
    });
};

/*
 * 보관함 생성
 */
export const createCollectionGroup =
    async (name) => {
        return apiRequest(
            "/collection-groups",
            {
                method: "POST",

                body: JSON.stringify({
                    name: name.trim(),
                }),
            },
        );
    };

/*
 * 내 보관함 목록 조회
 */
export const getCollectionGroups =
    async ({
        signal,
    } = {}) => {
        return apiRequest(
            "/collection-groups",
            {
                signal,
            },
        );
    };

/*
 * 특정 보관함에 들어 있는 카드 조회
 */
export const getCollectionGroupItems =
    async (
        groupId,
        {
            page = 1,
            limit = 100,
            sort = "createdAt",
            order = "desc",
            signal,
        } = {},
    ) => {
        const params =
            createPaginationParams({
                page,
                limit,
                sort,
                order,
            });

        return apiRequest(
            `/collection-groups/${groupId}/items?${params.toString()}`,
            {
                signal,
            },
        );
    };

/*
 * 보관함 이름 수정
 */
export const updateCollectionGroup =
    async (
        groupId,
        name,
    ) => {
        return apiRequest(
            `/collection-groups/${groupId}`,
            {
                method: "PATCH",

                body: JSON.stringify({
                    name: name.trim(),
                }),
            },
        );
    };

/*
 * 보관함 삭제
 * 내부 스크랩도 함께 삭제된다.
 */
export const deleteCollectionGroup =
    async (groupId) => {
        return apiRequest(
            `/collection-groups/${groupId}`,
            {
                method: "DELETE",
            },
        );
    };

/*
 * 카드를 보관함에 스크랩
 */
export const createCollection =
    async ({
        cardId,
        groupId,
    }) => {
        return apiRequest(
            "/collections",
            {
                method: "POST",

                body: JSON.stringify({
                    cardId,
                    groupId:
                        Number(groupId),
                }),
            },
        );
    };

/*
 * 스크랩을 다른 보관함으로 이동
 */
export const moveCollection =
    async (
        collectionId,
        groupId,
    ) => {
        return apiRequest(
            `/collections/${collectionId}`,
            {
                method: "PATCH",

                body: JSON.stringify({
                    groupId:
                        Number(groupId),
                }),
            },
        );
    };

/*
 * 보관함에서 카드 제거
 */
export const deleteCollection =
    async (
        collectionId,
    ) => {
        return apiRequest(
            `/collections/${collectionId}`,
            {
                method: "DELETE",
            },
        );
    };