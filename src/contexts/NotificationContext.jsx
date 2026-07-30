import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    fetchEventSource,
} from "@microsoft/fetch-event-source";

import {
    refreshAccessToken,
} from "../api/auth";

import {
    getNotifications,
    readNotification,
} from "../api/notifications";

import {
    getReceivedConnectionRequests,
} from "../api/connectionRequests";

import {
    getMyProfileCards,
} from "../api/profile";

import {
    getAccessToken,
    removeAccessToken,
    saveAccessToken,
} from "../utils/auth";

import {
    mapProfileCard,
} from "../utils/profileMapper";

import NotificationContext from "./notificationContext";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL;

class AuthenticationExpiredError extends Error {}

class FatalStreamError extends Error {}

const getItems = (result) => {
    if (Array.isArray(result)) {
        return result;
    }

    if (Array.isArray(result?.items)) {
        return result.items;
    }

    if (Array.isArray(result?.data?.items)) {
        return result.data.items;
    }

    return [];
};

const normalizeDate = (value) => {
    if (!value) {
        return null;
    }

    if (
        typeof value === "object"
    ) {
        return (
            value.isoString ??
            value.timestamp ??
            null
        );
    }

    return value;
};

const unwrapNotification = (
    rawNotification,
) => {
    let notification =
        rawNotification;

    for (
        let index = 0;
        index < 2 &&
        typeof notification ===
            "string";
        index += 1
    ) {
        try {
            notification =
                JSON.parse(
                    notification,
                );
        } catch {
            break;
        }
    }

    return notification;
};

const normalizeNotification = (
    rawNotification,
) => {
    const notification =
        unwrapNotification(
            rawNotification,
        );

    if (
        !notification ||
        typeof notification !==
            "object"
    ) {
        return null;
    }

    const rawPayload =
        notification.payload ?? {};

    const payload =
        rawPayload?.payload ??
        rawPayload;

    return {
        ...notification,
        type:
            Number(
                notification.type,
            ),
        payload,
        readAt:
            normalizeDate(
                notification.readAt,
            ),
        createdAt:
            normalizeDate(
                notification.createdAt,
            ) ??
            new Date().toISOString(),
    };
};

const mapReceivedRequest = (
    item,
) => {
    const receivedCard =
        mapProfileCard(
            item.card || {},
        );

    return {
        id: item.id,
        status:
            item.status === 0
                ? "pending"
                : item.status === 1
                  ? "accepted"
                  : item.status === 2
                    ? "rejected"
                    : "cancelled",
        isRead: false,
        createdAt:
            normalizeDate(
                item.createdAt,
            ),
        sender: {
            id: receivedCard.id,
            name:
                receivedCard.name,
            profileImage:
                receivedCard.profileImage,
        },
        receivedCard,
        message:
            item.message ||
            "전달된 메시지가 없습니다.",
    };
};

export const NotificationProvider = ({
    children,
}) => {
    const [
        accessToken,
        setAccessToken,
    ] = useState(
        getAccessToken,
    );

    const [
        notifications,
        setNotifications,
    ] = useState([]);

    const [
        receivedRequests,
        setReceivedRequests,
    ] = useState([]);

    const [
        notificationError,
        setNotificationError,
    ] = useState("");

    const [
        receivedRequestError,
        setReceivedRequestError,
    ] = useState("");

    const [
        toastNotification,
        setToastNotification,
    ] = useState(null);

    const isRefreshingToken =
        useRef(false);

    useEffect(() => {
        const syncAccessToken =
            () => {
                const nextAccessToken =
                    getAccessToken();

                setAccessToken(
                    nextAccessToken,
                );

                if (
                    !nextAccessToken
                ) {
                    setNotifications(
                        [],
                    );
                    setReceivedRequests(
                        [],
                    );
                    setNotificationError(
                        "",
                    );
                    setReceivedRequestError(
                        "",
                    );
                    setToastNotification(
                        null,
                    );
                }
            };

        window.addEventListener(
            "auth:changed",
            syncAccessToken,
        );

        window.addEventListener(
            "auth:expired",
            syncAccessToken,
        );

        window.addEventListener(
            "storage",
            syncAccessToken,
        );

        return () => {
            window.removeEventListener(
                "auth:changed",
                syncAccessToken,
            );

            window.removeEventListener(
                "auth:expired",
                syncAccessToken,
            );

            window.removeEventListener(
                "storage",
                syncAccessToken,
            );
        };
    }, []);

    const refreshNotifications =
        useCallback(
            async (signal) => {
                if (
                    !getAccessToken()
                ) {
                    setNotifications([]);
                    setNotificationError("");

                    return;
                }

                try {
                    const result =
                        await getNotifications({
                            page: 1,
                            limit: 20,
                            sort: "createdAt",
                            order: "desc",
                            signal,
                        });

                    if (signal?.aborted) {
                        return;
                    }

                    const nextNotifications =
                        getItems(result)
                            .map(
                                normalizeNotification,
                            )
                            .filter(Boolean);

                    setNotifications(
                        nextNotifications,
                    );

                    setNotificationError(
                        "",
                    );
                } catch (error) {
                    if (
                        error?.name ===
                        "AbortError"
                    ) {
                        return;
                    }

                    console.error(
                        "알림 목록 조회 실패:",
                        error,
                    );

                    setNotificationError(
                        error.message ||
                            "알림을 불러오지 못했습니다.",
                    );
                }
            },
            [],
        );

    const refreshReceivedRequests =
        useCallback(
            async (signal) => {
                if (
                    !getAccessToken()
                ) {
                    setReceivedRequests(
                        [],
                    );
                    setReceivedRequestError(
                        "",
                    );

                    return;
                }

                try {
                    const cardData =
                        await getMyProfileCards({
                            page: 1,
                            limit: 100,
                            sort: "createdAt",
                            order: "desc",
                            signal,
                        });

                    const myCards =
                        getItems(
                            cardData,
                        );

                    const responses =
                        await Promise.all(
                            myCards.map(
                                (card) =>
                                    getReceivedConnectionRequests(
                                        {
                                            cardId:
                                                card.id,
                                            page: 1,
                                            limit: 100,
                                            sort: "createdAt",
                                            order: "desc",
                                            signal,
                                        },
                                    ),
                            ),
                        );

                    if (signal?.aborted) {
                        return;
                    }

                    const requestMap =
                        new Map();

                    responses.forEach(
                        (response) => {
                            getItems(
                                response,
                            ).forEach(
                                (
                                    item,
                                ) => {
                                    requestMap.set(
                                        item.id,
                                        mapReceivedRequest(
                                            item,
                                        ),
                                    );
                                },
                            );
                        },
                    );

                    const requests =
                        Array.from(
                            requestMap.values(),
                        ).sort(
                            (
                                first,
                                second,
                            ) =>
                                new Date(
                                    second.createdAt,
                                ) -
                                new Date(
                                    first.createdAt,
                                ),
                        );

                    setReceivedRequests(
                        (
                            currentRequests,
                        ) => {
                            const readIds =
                                new Set(
                                    currentRequests
                                        .filter(
                                            (
                                                request,
                                            ) =>
                                                request.isRead,
                                        )
                                        .map(
                                            (
                                                request,
                                            ) =>
                                                request.id,
                                        ),
                                );

                            return requests.map(
                                (
                                    request,
                                ) => ({
                                    ...request,
                                    isRead:
                                        readIds.has(
                                            request.id,
                                        ),
                                }),
                            );
                        },
                    );

                    setReceivedRequestError(
                        "",
                    );
                } catch (error) {
                    if (
                        error?.name ===
                        "AbortError"
                    ) {
                        return;
                    }

                    console.error(
                        "받은 교환 요청 조회 실패:",
                        error,
                    );

                    setReceivedRequestError(
                        error.message ||
                            "받은 요청을 불러오지 못했습니다.",
                    );
                }
            },
            [],
        );

    useEffect(() => {
        if (!accessToken) {
            return undefined;
        }

        const controller =
            new AbortController();

        const timeoutId =
            window.setTimeout(
                () => {
                    void refreshNotifications(
                        controller.signal,
                    );

                    void refreshReceivedRequests(
                        controller.signal,
                    );
                },
                0,
            );

        return () => {
            window.clearTimeout(
                timeoutId,
            );

            controller.abort();
        };
    }, [
        accessToken,
        refreshNotifications,
        refreshReceivedRequests,
    ]);

    useEffect(() => {
        if (
            !accessToken ||
            !API_BASE_URL
        ) {
            return undefined;
        }

        const controller =
            new AbortController();

        const streamUrl =
            `${API_BASE_URL.replace(/\/+$/, "")}/notifications/stream`;

        const renewAccessToken =
            async () => {
                if (
                    isRefreshingToken.current
                ) {
                    return;
                }

                isRefreshingToken.current =
                    true;

                try {
                    const result =
                        await refreshAccessToken();

                    if (
                        !result?.accessToken
                    ) {
                        throw new Error(
                            "새 access token을 받지 못했습니다.",
                        );
                    }

                    saveAccessToken(
                        result.accessToken,
                    );
                } catch (error) {
                    console.error(
                        "알림 연결 토큰 재발급 실패:",
                        error,
                    );

                    removeAccessToken();

                    window.dispatchEvent(
                        new CustomEvent(
                            "auth:expired",
                        ),
                    );
                } finally {
                    isRefreshingToken.current =
                        false;
                }
            };

        void fetchEventSource(
            streamUrl,
            {
                signal:
                    controller.signal,
                credentials:
                    "include",
                cache: "no-store",
                openWhenHidden: true,
                headers: {
                    Accept:
                        "text/event-stream",
                    Authorization:
                        `Bearer ${accessToken}`,
                },
                async onopen(
                    response,
                ) {
                    const contentType =
                        response.headers.get(
                            "content-type",
                        ) || "";

                    if (
                        response.ok &&
                        contentType.includes(
                            "text/event-stream",
                        )
                    ) {
                        setNotificationError(
                            "",
                        );

                        void refreshNotifications(
                            controller.signal,
                        );

                        void refreshReceivedRequests(
                            controller.signal,
                        );

                        return;
                    }

                    if (
                        response.status ===
                        401
                    ) {
                        throw new AuthenticationExpiredError(
                            "알림 연결 인증이 만료되었습니다.",
                        );
                    }

                    if (
                        response.status >=
                            400 &&
                        response.status <
                            500
                    ) {
                        throw new FatalStreamError(
                            `알림 연결에 실패했습니다. (${response.status})`,
                        );
                    }

                    throw new Error(
                        `알림 연결에 실패했습니다. (${response.status})`,
                    );
                },
                onmessage(event) {
                    if (
                        event.event !==
                        "notification"
                    ) {
                        return;
                    }

                    const notification =
                        normalizeNotification(
                            event.data,
                        );

                    if (
                        !notification?.id
                    ) {
                        return;
                    }

                    setNotifications(
                        (
                            currentNotifications,
                        ) => [
                            notification,
                            ...currentNotifications.filter(
                                (
                                    item,
                                ) =>
                                    item.id !==
                                    notification.id,
                            ),
                        ],
                    );

                    setToastNotification(
                        notification,
                    );

                    if (
                        notification.type ===
                        3
                    ) {
                        void refreshReceivedRequests(
                            controller.signal,
                        );
                    }
                },
                onerror(error) {
                    if (
                        error instanceof
                        AuthenticationExpiredError
                    ) {
                        void renewAccessToken();

                        throw error;
                    }

                    if (
                        error instanceof
                        FatalStreamError
                    ) {
                        setNotificationError(
                            error.message,
                        );

                        throw error;
                    }

                    setNotificationError(
                        "실시간 알림 연결을 다시 시도하고 있습니다.",
                    );

                    return 3000;
                },
            },
        ).catch((error) => {
            if (
                controller.signal
                    .aborted ||
                error instanceof
                    AuthenticationExpiredError
            ) {
                return;
            }

            console.error(
                "실시간 알림 연결 실패:",
                error,
            );
        });

        return () => {
            controller.abort();
        };
    }, [
        accessToken,
        refreshNotifications,
        refreshReceivedRequests,
    ]);

    const markNotificationAsRead =
        useCallback(
            async (
                notificationId,
            ) => {
                let previousReadAt =
                    null;

                setNotifications(
                    (
                        currentNotifications,
                    ) =>
                        currentNotifications.map(
                            (
                                notification,
                            ) => {
                                if (
                                    notification.id !==
                                    notificationId
                                ) {
                                    return notification;
                                }

                                previousReadAt =
                                    notification.readAt;

                                return {
                                    ...notification,
                                    readAt:
                                        notification.readAt ??
                                        new Date().toISOString(),
                                };
                            },
                        ),
                );

                try {
                    await readNotification(
                        notificationId,
                    );
                } catch (error) {
                    setNotifications(
                        (
                            currentNotifications,
                        ) =>
                            currentNotifications.map(
                                (
                                    notification,
                                ) =>
                                    notification.id ===
                                    notificationId
                                        ? {
                                              ...notification,
                                              readAt:
                                                  previousReadAt,
                                          }
                                        : notification,
                            ),
                    );

                    throw error;
                }
            },
            [],
        );

    const markReceivedRequestAsRead =
        useCallback(
            (requestId) => {
                setReceivedRequests(
                    (
                        currentRequests,
                    ) =>
                        currentRequests.map(
                            (request) =>
                                request.id ===
                                requestId
                                    ? {
                                          ...request,
                                          isRead:
                                              true,
                                      }
                                    : request,
                        ),
                );
            },
            [],
        );

    const removeReceivedRequest =
        useCallback(
            (requestId) => {
                setReceivedRequests(
                    (
                        currentRequests,
                    ) =>
                        currentRequests.filter(
                            (request) =>
                                request.id !==
                                requestId,
                        ),
                );
            },
            [],
        );

    const unreadCount =
        useMemo(() => {
            return notifications.filter(
                (notification) =>
                    !notification.readAt,
            ).length;
        }, [notifications]);

    const value =
        useMemo(
            () => ({
                notifications,
                receivedRequests,
                errorMessage:
                    receivedRequestError ||
                    notificationError,
                unreadCount,
                hasUnreadNotification:
                    unreadCount > 0,
                toastNotification,
                dismissToast: () =>
                    setToastNotification(
                        null,
                    ),
                markNotificationAsRead,
                markReceivedRequestAsRead,
                removeReceivedRequest,
                refreshNotifications,
                refreshReceivedRequests,
            }),
            [
                notifications,
                receivedRequests,
                receivedRequestError,
                notificationError,
                unreadCount,
                toastNotification,
                markNotificationAsRead,
                markReceivedRequestAsRead,
                removeReceivedRequest,
                refreshNotifications,
                refreshReceivedRequests,
            ],
        );

    return (
        <NotificationContext.Provider
            value={value}
        >
            {children}
        </NotificationContext.Provider>
    );
};
