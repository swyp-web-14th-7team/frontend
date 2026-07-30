import {
    useEffect,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

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

    const {
        toastNotification,
        dismissToast,
        markNotificationAsRead,
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

    if (!toastNotification) {
        return null;
    }

    const content =
        getToastContent(
            toastNotification,
        );

    const handleClick = () => {
        void markNotificationAsRead(
            toastNotification.id,
        ).catch((error) => {
            console.error(
                "알림 읽음 처리 실패:",
                error,
            );
        });

        dismissToast();
        navigate(content.path);
    };

    return (
        <aside
            className={`${styles.toast} ${
                styles[content.type]
            }`}
            aria-live="polite"
        >
            <button
                type="button"
                className={
                    styles.content
                }
                onClick={handleClick}
            >
                <strong>
                    {content.title}
                </strong>

                <span>
                    {content.message}
                </span>
            </button>

            <button
                type="button"
                className={
                    styles.closeButton
                }
                onClick={dismissToast}
                aria-label="알림 닫기"
            >
                ×
            </button>
        </aside>
    );
};

export default NotificationToast;
