    import { apiRequest } from "./apiClient";

    const createNotificationParams = ({
        page = 1,
        limit = 20,
        sort = "createdAt",
        order = "desc",
        isRead,
    } = {}) => {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            sort,
            order,
        });

        if (typeof isRead === "boolean") {
            params.set("isRead", String(isRead));
        }

        return params;
    };

    /*
    * GET /notifications
    */
    export const getNotifications = async ({
        page = 1,
        limit = 20,
        sort = "createdAt",
        order = "desc",
        isRead,
        signal,
    } = {}) => {
        const params = createNotificationParams({
            page,
            limit,
            sort,
            order,
            isRead,
        });

        return apiRequest(
            `/notifications?${params.toString()}`,
            {
                signal,
            },
        );
    };

    /*
    * PATCH /notifications/{notificationId}/read
    */
    export const readNotification = async (
        notificationId,
    ) => {
        if (!notificationId) {
            throw new Error(
                "�쎌쓬 泥섎━�� �뚮┝ ID媛� �꾩슂�⑸땲��.",
            );
        }

        return apiRequest(
            `/notifications/${notificationId}/read`,
            {
                method: "PATCH",
            },
        );
    };