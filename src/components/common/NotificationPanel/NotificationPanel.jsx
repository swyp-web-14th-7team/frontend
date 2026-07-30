import styles from "./NotificationPanel.module.css";

const formatDateLabel = (
    createdAt,
) => {
    const date = new Date(createdAt);
    const today = new Date();

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return "날짜 없음";
    }

    const isToday =
        date.getFullYear() ===
            today.getFullYear() &&
        date.getMonth() ===
            today.getMonth() &&
        date.getDate() ===
            today.getDate();

    if (isToday) {
        return "오늘";
    }

    return new Intl.DateTimeFormat(
        "ko-KR",
        {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        },
    ).format(date);
};

const getResultContent = (
    notification,
) => {
    const name =
        notification?.payload
            ?.counterpartName ||
        "상대방";

    if (
        notification?.type === 1
    ) {
        return {
            title: `${name}님이 교환 요청을 수락했어요`,
            description:
                "보관함에서 프로필을 확인해보세요",
        };
    }

    if (
        notification?.type === 2
    ) {
        return {
            title: `${name}님이 교환 요청을 거절했어요`,
            description:
                "내 요청 기록을 확인해보세요",
        };
    }

    return {
        title:
            "새로운 알림이 도착했어요",
        description:
            "알림 내용을 확인해보세요",
    };
};

const NotificationPanel = ({
    requests = [],
    notifications = [],
    errorMessage = "",
    onRequestClick,
    onNotificationClick,
    onClose,
}) => {
    const requestItems =
        requests.filter(
            (request) =>
                request.status ===
                "pending",
        ).map((request) => ({
            key: `request-${request.id}`,
            id: request.id,
            kind: "request",
            createdAt:
                request.createdAt,
            isRead:
                request.isRead,
            profileImage:
                request.sender
                    ?.profileImage,
            initial:
                request.sender
                    ?.name?.slice(
                        0,
                        1,
                    ) || "?",
            title: `${
                request.sender
                    ?.name ||
                "상대방"
            }님이 교환 요청을 보냈어요`,
            description:
                "프로필을 확인해보세요",
            source: request,
        }));

    const resultItems =
        notifications.map(
            (notification) => {
                const content =
                    getResultContent(
                        notification,
                    );

                return {
                    key: `notification-${notification.id}`,
                    id:
                        notification.id,
                    kind:
                        "notification",
                    createdAt:
                        notification.createdAt,
                    isRead:
                        Boolean(
                            notification.readAt,
                        ),
                    initial:
                        notification.payload
                            ?.counterpartName
                            ?.slice(
                                0,
                                1,
                            ) ||
                        "N",
                    title:
                        content.title,
                    description:
                        content.description,
                    source:
                        notification,
                };
            },
        );

    const items = [
        ...requestItems,
        ...resultItems,
    ].sort(
        (first, second) =>
            new Date(
                second.createdAt,
            ) -
            new Date(
                first.createdAt,
            ),
    );

    const groupedItems =
        items.reduce(
            (groups, item) => {
                const label =
                    formatDateLabel(
                        item.createdAt,
                    );

                if (!groups[label]) {
                    groups[label] = [];
                }

                groups[label].push(
                    item,
                );

                return groups;
            },
            {},
        );

    return (
        <>
            <button
                type="button"
                className={
                    styles.dismissLayer
                }
                onClick={onClose}
                aria-label="알림함 닫기"
            />

            <section
                className={styles.panel}
                aria-label="알림함"
            >
                {errorMessage && (
                    <div
                        className={
                            styles.error
                        }
                        role="alert"
                    >
                        {errorMessage}
                    </div>
                )}

                {items.length > 0 ? (
                    Object.entries(
                        groupedItems,
                    ).map(
                        ([
                            dateLabel,
                            dateItems,
                        ]) => (
                            <section
                                key={
                                    dateLabel
                                }
                                className={
                                    styles.group
                                }
                            >
                                <h2>
                                    {dateLabel}
                                </h2>

                                <div
                                    className={
                                        styles.list
                                    }
                                >
                                    {dateItems.map(
                                        (
                                            item,
                                        ) => (
                                            <button
                                                key={
                                                    item.key
                                                }
                                                type="button"
                                                className={`${styles.item} ${
                                                    !item.isRead
                                                        ? styles.unreadItem
                                                        : ""
                                                }`}
                                                    onClick={(event) => {
                                                        event.stopPropagation();

                                                        if (
                                                            item.kind ===
                                                            "request"
                                                        ) {
                                                            onRequestClick?.(
                                                                item.source,
                                                            );

                                                            return;
                                                        }

                                                        onNotificationClick?.(
                                                            item.source,
                                                        );
                                                    }}
                                            >
                                                {item.profileImage ? (
                                                    <img
                                                        src={
                                                            item.profileImage
                                                        }
                                                        alt=""
                                                        className={
                                                            styles.avatar
                                                        }
                                                    />
                                                ) : (
                                                    <span
                                                        className={
                                                            styles.avatarPlaceholder
                                                        }
                                                    >
                                                        {
                                                            item.initial
                                                        }
                                                    </span>
                                                )}

                                                <span
                                                    className={
                                                        styles.itemText
                                                    }
                                                >
                                                    <strong>
                                                        {
                                                            item.title
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            item.description
                                                        }
                                                    </span>
                                                </span>
                                            </button>
                                        ),
                                    )}
                                </div>
                            </section>
                        ),
                    )
                ) : !errorMessage ? (
                    <div
                        className={
                            styles.empty
                        }
                    >
                        새로운 알림이 없습니다.
                    </div>
                ) : null}
            </section>
        </>
    );
};

export default NotificationPanel;
