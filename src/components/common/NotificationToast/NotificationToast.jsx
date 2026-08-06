import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import ReceivedExchangeModal from "../../exchange/ReceivedExchangeModal";

import {
    acceptConnectionRequest,
    rejectConnectionRequest,
} from "../../../api/connectionRequests";

import useNotifications from "../../../hooks/useNotifications";

import styles from "./NotificationToast.module.css";

const getToastContent = (
    notification,
) => {
    const name =
        notification?.payload
            ?.counterpartName ||
        "상대방";

    if (
        notification?.type === 1
    ) {
        const connectionId =
            notification?.payload
                ?.connectionId;

        return {
            title:
                "연결 요청이 수락되었습니다",
            message: `${name}님과 연결되었습니다.`,
            path:
                connectionId
                    ? `/saved/${encodeURIComponent(connectionId)}`
                    : "/saved",
            type: "accepted",
        };
    }

    if (
        notification?.type === 2
    ) {
        return {
            title:
                "연결 요청이 거절되었습니다",
            message: `${name}님이 연결 요청을 거절했습니다.`,
            path: "/settings/requests",
            type: "rejected",
        };
    }

    if (
        notification?.type === 3
    ) {
        return {
            title:
                "새로운 연결 요청이 도착했습니다",
            message: `${name}님이 연결 요청을 보냈습니다.`,
            /*
             * 알림함과 동일하게 교환 요청 모달을 띄웁니다.
             * 목록에서 요청을 찾지 못했을 때만 이 경로로 이동합니다.
             */
            path: "/settings/requests",
            type: "requested",
        };
    }

    return {
        title:
            "새로운 알림이 도착했습니다",
        message:
            "알림함에서 내용을 확인해주세요.",
        path: "/settings",
        type: "default",
    };
};

const NotificationToast = () => {
    const navigate =
        useNavigate();

    const [
        selectedRequest,
        setSelectedRequest,
    ] = useState(null);

    const {
        toastNotification,
        dismissToast,
        markNotificationAsRead,
        receivedRequests,
        markReceivedRequestAsRead,
        removeReceivedRequest,
    } = useNotifications();

    useEffect(() => {
        if (!toastNotification) {
            return undefined;
        }

        const timeoutId =
            window.setTimeout(
                dismissToast,
                5000,
            );

        return () => {
            window.clearTimeout(
                timeoutId,
            );
        };
    }, [
        toastNotification,
        dismissToast,
    ]);

    /*
     * 모달은 토스트가 사라진 뒤에도 남아 있어야 하므로
     * toastNotification이 없다고 해서 컴포넌트를 비우지 않습니다.
     */
    const content =
        toastNotification
            ? getToastContent(
                  toastNotification,
              )
            : null;

    /*
     * 알림함(NotificationPanel)과 동작을 맞춥니다.
     * 새 교환 요청은 화면을 이동하지 않고
     * 모달에서 바로 수락/거절할 수 있게 합니다.
     */
    const handleClick = () => {
        if (!toastNotification) {
            return;
        }

        void markNotificationAsRead(
            toastNotification.id,
        ).catch((error) => {
            console.error(
                "알림 읽음 처리 실패:",
                error,
            );
        });

        dismissToast();

        if (
            toastNotification.type ===
            3
        ) {
            const requestId =
                toastNotification
                    .payload
                    ?.requestId;

            const request =
                receivedRequests.find(
                    (item) =>
                        String(
                            item.id,
                        ) ===
                        String(
                            requestId,
                        ),
                );

            if (request) {
                markReceivedRequestAsRead(
                    request.id,
                );

                setSelectedRequest({
                    ...request,
                    isRead: true,
                });

                return;
            }
        }

        navigate(content.path);
    };

    const handleRejectRequest =
        async (requestId) => {
            try {
                await rejectConnectionRequest(
                    requestId,
                );

                removeReceivedRequest(
                    requestId,
                );

                setSelectedRequest(
                    null,
                );

                window.alert(
                    "카드 교환 요청을 거절했습니다.",
                );
            } catch (error) {
                console.error(
                    "교환 요청 거절 실패:",
                    error,
                );

                window.alert(
                    error.message ||
                        "교환 요청을 거절하지 못했습니다.",
                );
            }
        };

    const handleAcceptRequest =
        async (requestId) => {
            try {
                await acceptConnectionRequest(
                    requestId,
                );

                removeReceivedRequest(
                    requestId,
                );

                setSelectedRequest(
                    null,
                );

                window.alert(
                    "카드 교환이 완료되었습니다.",
                );
            } catch (error) {
                console.error(
                    "교환 요청 수락 실패:",
                    error,
                );

                window.alert(
                    error.message ||
                        "교환 요청을 수락하지 못했습니다.",
                );
            }
        };

    return (
        <>
            {content && (
                <aside
                    className={`${styles.toast} ${
                        styles[
                            content.type
                        ]
                    }`}
                    aria-live="polite"
                >
                    <button
                        type="button"
                        className={
                            styles.content
                        }
                        onClick={
                            handleClick
                        }
                    >
                        <strong>
                            {
                                content.title
                            }
                        </strong>

                        <span>
                            {
                                content.message
                            }
                        </span>
                    </button>

                    <button
                        type="button"
                        className={
                            styles.closeButton
                        }
                        onClick={
                            dismissToast
                        }
                        aria-label="알림 닫기"
                    >
                        ×
                    </button>
                </aside>
            )}

            {selectedRequest && (
                <ReceivedExchangeModal
                    request={
                        selectedRequest
                    }
                    onClose={() =>
                        setSelectedRequest(
                            null,
                        )
                    }
                    onReject={
                        handleRejectRequest
                    }
                    onAccept={
                        handleAcceptRequest
                    }
                />
            )}
        </>
    );
};

export default NotificationToast;
