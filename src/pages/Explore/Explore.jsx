    import ExploreSearch from "../../components/explore/ExploreSearch";
    import ExploreCardList from "../../components/explore/ExploreCardList";

    import styles from "./Explore.module.css";

    const Explore = () => {
    return (
        <main className={styles.main}>
        <section className={styles.hero}>
            <h1 className={styles.title}>
            나와 맞는 사람 찾기
            </h1>

            <ExploreSearch />
        </section>

        <ExploreCardList />
        </main>
    );
    };

    export default Explore;