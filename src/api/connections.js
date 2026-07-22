import { apiRequest } from "./apiClient";

/*
 * 교환이 성립된 카드 목록 조회
 * GET /connections
 */
export const getConnections = async ({
    page = 1,
    limit = 100,
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
        `/connections?${params.toString()}`,
        {
            signal,
        },
    );
};

/*
 * 보관함 카드 단건 조회
 * GET /connections/{connectionId}
 */
export const getConnection = async (
    connectionId,
    { signal } = {},
) => {
    if (!connectionId) {
        throw new Error(
            "조회할 연결 ID가 필요합니다.",
        );
    }

    return apiRequest(
        `/connections/${connectionId}`,
        {
            signal,
        },
    );
};

/*
 * 내 보관함에서 카드 제거
 * DELETE /connections/{connectionId}
 *
 * 상대방의 보관함에서는 삭제되지 않는다.
 */
export const deleteConnection = async (
    connectionId,
) => {
    if (!connectionId) {
        throw new Error(
            "삭제할 연결 ID가 필요합니다.",
        );
    }

    return apiRequest(
        `/connections/${connectionId}`,
        {
            method: "DELETE",
        },
    );
};