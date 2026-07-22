import { apiRequest } from "./apiClient";

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
 * 새 스크랩 서랍 생성
 * POST /collection-groups
 */
export const createCollectionGroup = async (
    name,
) => {
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
 * 로그인한 사용자의 스크랩 서랍 목록 조회
 * GET /collection-groups
 */
export const getCollectionGroups = async ({
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
 * 특정 서랍에 저장된 카드 목록 조회
 * GET /collection-groups/{groupId}/items
 */
export const getCollectionGroupItems = async (
    groupId,
    {
        page = 1,
        limit = 100,
        sort = "createdAt",
        order = "desc",
        signal,
    } = {},
) => {
    const params = createPaginationParams({
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
 * 스크랩 서랍 이름 수정
 * PATCH /collection-groups/{groupId}
 */
export const updateCollectionGroup = async (
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
 * 스크랩 서랍 삭제
 * DELETE /collection-groups/{groupId}
 *
 * 서랍에 들어 있는 스크랩도 함께 삭제된다.
 */
export const deleteCollectionGroup = async (
    groupId,
) => {
    return apiRequest(
        `/collection-groups/${groupId}`,
        {
            method: "DELETE",
        },
    );
};

/*
 * 특정 카드를 서랍에 스크랩
 * POST /collections
 */
export const createCollection = async ({
    cardId,
    groupId,
}) => {
    return apiRequest(
        "/collections",
        {
            method: "POST",
            body: JSON.stringify({
                cardId,
                groupId: Number(groupId),
            }),
        },
    );
};

/*
 * 저장된 스크랩을 다른 서랍으로 이동
 * PATCH /collections/{collectionId}
 *
 * collectionId는 cardId와 다른 값이다.
 */
export const moveCollection = async (
    collectionId,
    groupId,
) => {
    return apiRequest(
        `/collections/${collectionId}`,
        {
            method: "PATCH",
            body: JSON.stringify({
                groupId: Number(groupId),
            }),
        },
    );
};

/*
 * 서랍에서 특정 스크랩 제거
 * DELETE /collections/{collectionId}
 *
 * collectionId는 카드의 id가 아니라
 * 스크랩 생성 결과의 id이다.
 */
export const deleteCollection = async (
    collectionId,
) => {
    return apiRequest(
        `/collections/${collectionId}`,
        {
            method: "DELETE",
        },
    );
};