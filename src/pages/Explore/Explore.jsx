    import { useState } from "react";

    import ExploreSearch from "../../components/explore/ExploreSearch";
    import ExploreCardList from "../../components/explore/ExploreCardList";
    import Pagination from "../../components/common/Pagination/Pagination";

    import styles from "./Explore.module.css";

    const TABS = [
    "전체보기",
    "팀 빌딩",
    "커피챗",
    "교류/네트워킹",
    ];

    const Explore = () => {
    const [activeTab, setActiveTab] =
        useState("전체보기");

    const [currentPage, setCurrentPage] =
        useState(1);

    const [keyword, setKeyword] =
        useState("");

    const [affiliation, setAffiliation] =
        useState("");

    const [selectedTags, setSelectedTags] =
        useState([]);

    const [sort, setSort] =
        useState("최근 등록순");

    // 로그인 기능 연결 전 임시값
    const isLoggedIn = false;

    const isRestrictedTab =
        !isLoggedIn && activeTab !== "전체보기";

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);

        window.scrollTo({
        top: 0,
        behavior: "smooth",
        });
    };

    const handleStartClick = () => {
        console.log("로그인 모달 열기");
    };

    return (
        <main className={styles.main}>
        <section className={styles.hero}>
            <h1 className={styles.title}>
            나와 맞는 사람 찾기
            </h1>

            <ExploreSearch
            keyword={keyword}
            affiliation={affiliation}
            selectedTags={selectedTags}
            sort={sort}
            onKeywordChange={(value) => {
                setKeyword(value);
                setCurrentPage(1);
            }}
            onAffiliationChange={(value) => {
                setAffiliation(value);
                setCurrentPage(1);
            }}
            onTagsChange={(value) => {
                setSelectedTags(value);
                setCurrentPage(1);
            }}
            onSortChange={(value) => {
                setSort(value);
                setCurrentPage(1);
            }}
            />
        </section>

        <section className={styles.exploreSection}>
            <div
            className={styles.tabList}
            role="tablist"
            aria-label="탐색 카테고리"
            >
            {TABS.map((tab) => {
                const isActive = activeTab === tab;

                return (
                <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.tabButton} ${
                    isActive ? styles.activeTab : ""
                    }`}
                    onClick={() => handleTabClick(tab)}
                >
                    {tab}
                </button>
                );
            })}
            </div>

            <div className={styles.cardArea}>
            <ExploreCardList
                currentPage={currentPage}
                keyword={keyword}
                affiliation={affiliation}
                selectedTags={selectedTags}
                sort={sort}
            />

            {!isRestrictedTab && (
                <Pagination
                currentPage={currentPage}
                totalPages={9}
                onChange={handlePageChange}
                />
            )}

            {isRestrictedTab && (
                <>
                <div
                    className={styles.maskGradient}
                    aria-hidden="true"
                />

                <div className={styles.loginGuide}>
                    <h2 className={styles.loginGuideTitle}>
                    로그인하고 더 편리하게
                    <br />
                    프로필을 탐색하세요
                    </h2>

                    <p
                    className={
                        styles.loginGuideDescription
                    }
                    >
                    나를 소개하는 가장 쉬운 방법,
                    <br />
                    Nodi와 함께 새로운 연결을 시작해요.
                    </p>

                    <button
                    type="button"
                    className={styles.startButton}
                    onClick={handleStartClick}
                    >
                    시작하기
                    </button>
                </div>
                </>
            )}
            </div>
        </section>
        </main>
    );
    };

    export default Explore;