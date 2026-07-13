    import styles from "../profile/ProfileCard.module.css";

    const JOB_LABELS = {
    planner: "Planner",
    designer: "Designer",
    frontend: "Frontend Developer",
    backend: "Backend Developer",
    };

    const ExploreCard = ({
    profile,
    onClick,
    }) => {
    const isDeveloper =
        profile.job === "frontend" ||
        profile.job === "backend";

    const tags = isDeveloper
        ? profile.techStacks || []
        : profile.interests || [];

    return (
        <button
        type="button"
        className={styles.cardButton}
        onClick={() => onClick?.(profile.id)}
        >
        <article className={styles.completeCard}>
            <p className={styles.job}>
            {JOB_LABELS[profile.job] || "직군 미선택"}
            </p>

            <div className={styles.completeProfileRow}>
            {profile.profileImage ? (
                <img
                src={profile.profileImage}
                alt={`${profile.name} 프로필`}
                className={styles.completeAvatar}
                />
            ) : (
                <div
                className={styles.completeAvatarPlaceholder}
                />
            )}

            <div className={styles.profileInfo}>
                <strong className={styles.completeName}>
                {profile.name}
                </strong>

                <p className={styles.affiliation}>
                {[
                    profile.affiliationType,
                    profile.affiliation,
                ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
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

            <div className={styles.introductionBox}>
            <p className={styles.introductionLabel}>
                대표 경험
            </p>

            <p className={styles.introductionText}>
                {profile.representativeExperience ||
                "대표 경험이 없습니다."}
            </p>
            </div>

            {profile.strength && (
            <div className={styles.completeStrengthBox}>
                {profile.strength.icon ? (
                <img
                    src={profile.strength.icon}
                    alt=""
                    className={styles.strengthIcon}
                />
                ) : (
                <span
                    className={styles.strengthIconPlaceholder}
                />
                )}

                <div className={styles.strengthInfo}>
                <span className={styles.strengthText}>
                    {profile.strength.title}
                </span>

                {profile.strength.description && (
                    <span
                    className={styles.strengthDescription}
                    >
                    {profile.strength.description}
                    </span>
                )}
                </div>
            </div>
            )}
        </article>
        </button>
    );
    };

    export default ExploreCard;