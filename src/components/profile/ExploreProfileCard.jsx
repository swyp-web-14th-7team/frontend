    import styles from "./ProfileCard.module.css";

    const JOB_LABELS = {
    planner: "Planner",
    designer: "Designer",
    frontend: "Frontend Developer",
    backend: "Backend Developer",
    };

    const ExploreProfileCard = ({ profile, onClick }) => {
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
        aria-label={`${profile.name} 프로필 상세 보기`}
        >
        <article className={styles.exploreCard}>
            <p className={styles.exploreJob}>
            {JOB_LABELS[profile.job] || "직군 미선택"}
            </p>

            <div className={styles.exploreCardContent}>
            <div className={styles.exploreProfileRow}>
                {profile.profileImage ? (
                <img
                    src={profile.profileImage}
                    alt={`${profile.name} 프로필`}
                    className={styles.exploreAvatar}
                />
                ) : (
                <div
                    className={styles.exploreAvatarPlaceholder}
                    aria-hidden="true"
                />
                )}

                <div className={styles.exploreProfileInfo}>
                <strong className={styles.exploreName}>
                    {profile.name}
                </strong>

                <p className={styles.exploreAffiliation}>
                    {[
                    profile.affiliationType,
                    profile.affiliation,
                    ]
                    .filter(Boolean)
                    .join(" | ")}
                </p>
                </div>
            </div>

            <div className={styles.exploreTagList}>
                {tags.slice(0, 3).map((tag) => (
                <span
                    key={tag.id}
                    className={styles.exploreTag}
                >
                    {tag.name}
                </span>
                ))}
            </div>

            <div className={styles.exploreExperienceBox}>
                <p className={styles.exploreExperienceTitle}>
                {profile.representativeExperience ||
                    "대표 경험이 없습니다."}
                </p>

                <p className={styles.exploreExperienceDescription}>
                {profile.representativeExperienceDescription ||
                    "프로젝트에서 맡은 역할과 주요 경험을 소개합니다."}
                </p>
            </div>

            {profile.strength && (
                <div className={styles.exploreStrengthBox}>
                {profile.strength.icon ? (
                    <img
                    src={profile.strength.icon}
                    alt=""
                    className={styles.exploreStrengthIcon}
                    />
                ) : (
                    <span
                    className={styles.exploreStrengthPlaceholder}
                    aria-hidden="true"
                    />
                )}

                <span className={styles.exploreStrengthText}>
                    {profile.strength.title}
                </span>
                </div>
            )}
            </div>
        </article>
        </button>
    );
    };

    export default ExploreProfileCard;