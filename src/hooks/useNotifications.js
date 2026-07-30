import {
    useContext,
} from "react";

import NotificationContext from "../contexts/notificationContext";

const useNotifications = () => {
    const context =
        useContext(
            NotificationContext,
        );

    if (!context) {
        throw new Error(
            "useNotifications는 NotificationProvider 안에서 사용해야 합니다.",
        );
    }

    return context;
};

export default useNotifications;