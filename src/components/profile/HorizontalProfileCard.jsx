    import styles from "./ProfileCard.module.css";

    const JOB_LABELS = {
    planner: "Planner",
    designer: "Designer",
    frontend: "Frontend Developer",
    backend: "Backend Developer",
    };

    const HorizontalProfileCard = ({
    data,
    name = "홍길동",
    profileImage,
    }) => {
    const isDeveloper =
        data.job === "frontend" || data.job === "backend";

    const tags = isDeveloper
        ? data.techStacks || []
        : data.interests || [];

    return (
        <article className={styles.horizontalCard}>
        <p className={styles.job}>
            {JOB_LABELS[data.job] || "직군 미선택"}
        </p>

        <div className={styles.horizontalMain}>
            <div className={styles.horizontalProfile}>
            {profileImage ? (
                <img
                src={profileImage}
                alt={`${name} 프로필`}
                className={styles.avatar}
                />
            ) : (
                <div className={styles.avatarPlaceholder} />
            )}

            <div className={styles.profileInfo}>
                <div className={styles.nameRow}>
                <strong className={styles.name}>{name}</strong>

                <span className={styles.affiliationInline}>
                    {[data.affiliationType, data.affiliation]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
                </div>

                {data.strength && (
                <div className={styles.strengthRow}>
                    {data.strength.icon ? (
                    <img
                        src={data.strength.icon}
                        alt=""
                        className={styles.strengthIcon}
                    />
                    ) : (
                    <span className={styles.strengthIconPlaceholder} />
                    )}

                    <span className={styles.strengthText}>
                    {data.strength.title}
                    </span>
                </div>
                )}
            </div>
            </div>

            <div className={styles.tagList}>
            {tags.slice(0, 4).map((tag) => (
                <span key={tag.id} className={styles.tag}>
                {tag.name}
                </span>
            ))}
            </div>
        </div>
        </article>
    );
    };

    export default HorizontalProfileCard;