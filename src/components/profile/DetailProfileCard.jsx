    import styles from "./ProfileCard.module.css";

    const JOB_LABELS = {
    planner: "Planner",
    designer: "Designer",
    frontend: "Frontend Developer",
    backend: "Backend Developer",
    };

    const DetailProfileCard = ({
    data,
    name = "홍길동",
    profileImage,
    representativeExperience,
    }) => {
    const isDeveloper =
        data.job === "frontend" || data.job === "backend";

    const tags = isDeveloper
        ? data.techStacks || []
        : data.interests || [];

    return (
        <article className={styles.detailCard}>
        <p className={styles.job}>
            {JOB_LABELS[data.job] || "직군 미선택"}
        </p>

        <div className={styles.detailProfileRow}>
            {profileImage ? (
            <img
                src={profileImage}
                alt={`${name} 프로필`}
                className={styles.detailAvatar}
            />
            ) : (
            <div className={styles.detailAvatarPlaceholder} />
            )}

            <div className={styles.profileInfo}>
            <strong className={styles.detailName}>{name}</strong>

            <p className={styles.affiliation}>
                {[data.affiliationType, data.affiliation]
                .filter(Boolean)
                .join(" · ")}
            </p>
            </div>
        </div>

        <div className={styles.tagList}>
            {tags.slice(0, 3).map((tag) => (
            <span key={tag.id} className={styles.tag}>
                {tag.name}
            </span>
            ))}
        </div>

        <div className={styles.experienceSection}>
            <p className={styles.sectionLabel}>대표 경험</p>

            <div className={styles.experienceBox}>
            <strong className={styles.experienceTitle}>
                {representativeExperience?.title || "Nodi"}
            </strong>

            <p className={styles.experienceDescription}>
                {representativeExperience?.description ||
                "프로젝트 경험에 대한 소개가 들어갑니다."}
            </p>
            </div>
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
        </article>
    );
    };

    export default DetailProfileCard;