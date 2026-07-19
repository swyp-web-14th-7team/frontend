import styles from "./NotificationPanel.module.css";

const formatDateLabel = (
    createdAt,
) => {
    const date = new Date(createdAt);
    const today = new Date();

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

const NotificationPanel = ({
    requests = [],
    onRequestClick,
    onClose,
}) => {
    const pendingRequests =
        requests.filter(
            (request) =>
                request.status ===
                "pending",
        );

    const groupedRequests =
        pendingRequests.reduce(
            (groups, request) => {
                const label =
                    formatDateLabel(
                        request.createdAt,
                    );

                if (!groups[label]) {
                    groups[label] = [];
                }

                groups[label].push(request);

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
                {pendingRequests.length >
                0 ? (
                    Object.entries(
                        groupedRequests,
                    ).map(
                        ([
                            dateLabel,
                            dateRequests,
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
                                    {dateRequests.map(
                                        (
                                            request,
                                        ) => (
                                            <button
                                                key={
                                                    request.id
                                                }
                                                type="button"
                                                className={`${styles.item} ${
                                                    !request.isRead
                                                        ? styles.unreadItem
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    onRequestClick?.(
                                                        request,
                                                    )
                                                }
                                            >
                                                {request
                                                    .sender
                                                    .profileImage ? (
                                                    <img
                                                        src={
                                                            request
                                                                .sender
                                                                .profileImage
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
                                                    />
                                                )}

                                                <span
                                                    className={
                                                        styles.itemText
                                                    }
                                                >
                                                    <strong>
                                                        {
                                                            request
                                                                .sender
                                                                .name
                                                        }
                                                        님이
                                                        교환
                                                        요청을
                                                        보냈어요
                                                    </strong>

                                                    <span>
                                                        프로필을
                                                        확인해보세요
                                                    </span>
                                                </span>
                                            </button>
                                        ),
                                    )}
                                </div>
                            </section>
                        ),
                    )
                ) : (
                    <div
                        className={
                            styles.empty
                        }
                    >
                        새로운 알림이 없습니다.
                    </div>
                )}
            </section>
        </>
    );
};

export default NotificationPanel;