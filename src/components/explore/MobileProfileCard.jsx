    import styles from "./MobileProfileCard.module.css";

    const JOB_LABELS = {
    planner: "Planner",
    designer: "Designer",
    frontend: "Frontend Developer",
    backend: "Backend Developer",
    };

    const MobileProfileCard = ({ profile, onClick }) => {
    const isDeveloper =
        profile.job === "frontend" ||
        profile.job === "backend";

    const tags = isDeveloper
        ? profile.techStacks || []
        : profile.interests || [];

    return (
        <button
        type="button"
        className={styles.card}
        onClick={() => onClick?.(profile.id)}
        aria-label={`${profile.name} 프로필 상세 보기`}
        >
        <p className={styles.job}>
            {JOB_LABELS[profile.job] || "직군 미선택"}
        </p>

        <div className={styles.profileRow}>
            {profile.profileImage ? (
            <img
                src={profile.profileImage}
                alt={`${profile.name} 프로필`}
                className={styles.avatar}
            />
            ) : (
            <div
                className={styles.avatarPlaceholder}
                aria-hidden="true"
            />
            )}

            <div className={styles.profileInfo}>
            <div className={styles.nameRow}>
                <strong className={styles.name}>
                {profile.name}
                </strong>

                <span className={styles.affiliation}>
                {[
                    profile.affiliationType,
                    profile.affiliation,
                ]
                    .filter(Boolean)
                    .join(" | ")}
                </span>
            </div>

            {profile.strength && (
                <div className={styles.strengthRow}>
                {profile.strength.icon ? (
                    <img
                    src={profile.strength.icon}
                    alt=""
                    className={styles.strengthIcon}
                    />
                ) : (
                    <span
                    className={styles.strengthIconPlaceholder}
                    aria-hidden="true"
                    />
                )}

                <span className={styles.strengthText}>
                    {profile.strength.title}
                </span>
                </div>
            )}
            </div>
        </div>

        <div className={styles.tagList}>
            {tags.slice(0, 3).map((tag) => (
            <span
                key={tag.id}
                className={styles.tag}
            >
                {tag.name}
            </span>
            ))}
        </div>
        </button>
    );
    };

    export default MobileProfileCard;