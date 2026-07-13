    import ExploreProfileCard from "../profile/ExploreProfileCard";

    import profiles from "../../mocks/profiles";

    import styles from "./ExploreCardList.module.css";

    const ExploreCardList = () => {
    const handleCardClick = (id) => {
        console.log("클릭한 프로필 ID:", id);

        // 로그인 전이면 로그인 모달 열기
        // 로그인 후라면 상세 프로필로 이동
    };

    return (
        <section className={styles.cardGrid}>
        {profiles.map((profile) => (
            <ExploreProfileCard
            key={profile.id}
            profile={profile}
            onClick={handleCardClick}
            />
        ))}
        </section>
    );
    };

    export default ExploreCardList;