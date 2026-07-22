import { apiRequest } from "./apiClient";

const createPaginationParams = ({
    cardId,
    page = 1,
    limit = 100,
    sort = "createdAt",
    order = "desc",
}) => {
    return new URLSearchParams({
        cardId: String(cardId),
        page: String(page),
        limit: String(limit),
        sort,
        order,
    });
};

/*
 * 카드 교환 요청 보내기
 * POST /connection-requests
 */
export const createConnectionRequest = async ({
    requesterCardId,
    receiverCardId,
    message = "",
}) => {
    const requestBody = {
        requesterCardId,
        receiverCardId,
    };

    /*
     * 메시지는 선택 항목이므로
     * 값이 있을 때만 전송한다.
     */
    if (message.trim()) {
        requestBody.message =
            message.trim();
    }

    return apiRequest(
        "/connection-requests",
        {
            method: "POST",
            body: JSON.stringify(
                requestBody,
            ),
        },
    );
};

/*
 * 받은 교환 요청 조회
 * GET /connection-requests/received
 *
 * cardId는 요청을 받은
 * 내 프로필 카드 ID이다.
 */
export const getReceivedConnectionRequests =
    async ({
        cardId,
        page = 1,
        limit = 100,
        sort = "createdAt",
        order = "desc",
        signal,
    }) => {
        if (!cardId) {
            throw new Error(
                "받은 요청을 조회할 카드 ID가 필요합니다.",
            );
        }

        const params =
            createPaginationParams({
                cardId,
                page,
                limit,
                sort,
                order,
            });

        return apiRequest(
            `/connection-requests/received?${params.toString()}`,
            {
                signal,
            },
        );
    };

/*
 * 보낸 교환 요청 조회
 * GET /connection-requests/sent
 *
 * cardId는 요청을 보낸
 * 내 프로필 카드 ID이다.
 */
export const getSentConnectionRequests =
    async ({
        cardId,
        page = 1,
        limit = 100,
        sort = "createdAt",
        order = "desc",
        signal,
    }) => {
        if (!cardId) {
            throw new Error(
                "보낸 요청을 조회할 카드 ID가 필요합니다.",
            );
        }

        const params =
            createPaginationParams({
                cardId,
                page,
                limit,
                sort,
                order,
            });

        return apiRequest(
            `/connection-requests/sent?${params.toString()}`,
            {
                signal,
            },
        );
    };

/*
 * 받은 교환 요청 수락
 * PATCH /connection-requests/{requestId}/accept
 *
 * 수락하면 백엔드에서 양쪽 사용자의
 * 보관함 데이터가 자동으로 생성된다.
 */
export const acceptConnectionRequest =
    async (requestId) => {
        if (!requestId) {
            throw new Error(
                "수락할 교환 요청 ID가 필요합니다.",
            );
        }

        return apiRequest(
            `/connection-requests/${requestId}/accept`,
            {
                method: "PATCH",
            },
        );
    };

/*
 * 받은 교환 요청 거절
 * PATCH /connection-requests/{requestId}/reject
 */
export const rejectConnectionRequest =
    async (requestId) => {
        if (!requestId) {
            throw new Error(
                "거절할 교환 요청 ID가 필요합니다.",
            );
        }

        return apiRequest(
            `/connection-requests/${requestId}/reject`,
            {
                method: "PATCH",
            },
        );
    };

/*
 * 내가 보낸 대기 중인 요청 취소
 * DELETE /connection-requests/{requestId}
 */
export const cancelConnectionRequest =
    async (requestId) => {
        if (!requestId) {
            throw new Error(
                "취소할 교환 요청 ID가 필요합니다.",
            );
        }

        return apiRequest(
            `/connection-requests/${requestId}`,
            {
                method: "DELETE",
            },
        );
    };