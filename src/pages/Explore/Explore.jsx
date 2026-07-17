import { useState } from "react";

import ExploreSearch from "../../components/explore/ExploreSearch";
import ExploreCardList from "../../components/explore/ExploreCardList";
import Pagination from "../../components/common/Pagination/Pagination";
import MobileExploreHeader from "../../components/explore/MobileExploreHeader";
import BottomNavigation from "../../components/common/BottomNavigation/BottomNavigation";
import LoginModal from "../../components/common/LoginModal/LoginModal";

import { isLoggedIn } from "../../utils/auth";

import styles from "./Explore.module.css";

import searchIcon from "../../assets/icons/icon_search.svg";

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

    const [
        isMobileSearchOpen,
        setIsMobileSearchOpen,
    ] = useState(false);

    const [
        isLoginModalOpen,
        setIsLoginModalOpen,
    ] = useState(false);

    /*
     * 현재 로그인 여부
     */
    const isUserLoggedIn = isLoggedIn();

    /*
     * 로그인하지 않은 사용자가
     * 전체보기 이외의 탭을 보고 있는지 확인
     */
    const isRestrictedTab =
        !isUserLoggedIn &&
        activeTab !== "전체보기";

    /* =========================
       탭 변경
    ========================= */

    const handleTabClick = (tab) => {
        /*
         * 로그인하지 않아도
         * 모든 탭을 눌러볼 수 있다.
         */
        setActiveTab(tab);
        setCurrentPage(1);
    };

    /* =========================
       페이지 변경
    ========================= */

    const handlePageChange = (page) => {
        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /* =========================
       로그인 모달 열기
    ========================= */

    const handleStartClick = () => {
        setIsLoginModalOpen(true);
    };

    /* =========================
       로그인 모달 닫기
    ========================= */

    const handleLoginModalClose = () => {
        setIsLoginModalOpen(false);
    };

    /* =========================
       모바일 검색 닫기
    ========================= */

    const handleMobileSearchClose = () => {
        setIsMobileSearchOpen(false);
        setKeyword("");
    };

    return (
        <>
            {/* 모바일 전용 헤더 */}

            <div className={styles.mobileOnly}>
                <MobileExploreHeader
                    isSearchOpen={isMobileSearchOpen}
                    onSearchClose={
                        handleMobileSearchClose
                    }
                />
            </div>

            <main className={styles.main}>
                {/* 검색 및 제목 영역 */}

                <section className={styles.hero}>
                    <h1 className={styles.title}>
                        나와 맞는 사람 찾기
                    </h1>

                    <div className={styles.mobileOnly}>
                        {!isMobileSearchOpen && (
                            <div
                                className={
                                    styles.mobileTitleRow
                                }
                            >
                                <h1
                                    className={
                                        styles.mobileTitle
                                    }
                                >
                                    둘러보기
                                </h1>

                                <button
                                    type="button"
                                    className={
                                        styles.mobileSearchButton
                                    }
                                    onClick={() =>
                                        setIsMobileSearchOpen(
                                            true,
                                        )
                                    }
                                    aria-label="검색창 열기"
                                >
                                    <img
                                        src={searchIcon}
                                        alt=""
                                        className={
                                            styles.mobileSearchIcon
                                        }
                                    />
                                </button>
                            </div>
                        )}
                    </div>

                    <ExploreSearch
                        keyword={keyword}
                        affiliation={affiliation}
                        selectedTags={selectedTags}
                        sort={sort}
                        isMobileSearchOpen={
                            isMobileSearchOpen
                        }
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

                {!isMobileSearchOpen && (
                    <section
                        className={
                            styles.exploreSection
                        }
                    >
                        {/* 탐색 탭 */}

                        <div
                            className={styles.tabList}
                            role="tablist"
                            aria-label="탐색 카테고리"
                        >
                            {TABS.map((tab) => {
                                const isActive =
                                    activeTab === tab;

                                return (
                                    <button
                                        key={tab}
                                        type="button"
                                        role="tab"
                                        aria-selected={
                                            isActive
                                        }
                                        className={`${
                                            styles.tabButton
                                        } ${
                                            isActive
                                                ? styles.activeTab
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleTabClick(
                                                tab,
                                            )
                                        }
                                    >
                                        {tab}
                                    </button>
                                );
                            })}
                        </div>

                        {/* 프로필 카드 영역 */}

                        <div
                            className={styles.cardArea}
                        >
                            <ExploreCardList
                                currentPage={
                                    currentPage
                                }
                                activeTab={activeTab}
                                keyword={keyword}
                                affiliation={
                                    affiliation
                                }
                                selectedTags={
                                    selectedTags
                                }
                                sort={sort}
                                isUserLoggedIn={
                                    isUserLoggedIn
                                }
                            />

                            {/*
                             * 전체보기 또는 로그인 상태에서는
                             * 페이지네이션을 표시한다.
                             */}

                            {!isRestrictedTab && (
                                <Pagination
                                    currentPage={
                                        currentPage
                                    }
                                    totalPages={9}
                                    onChange={
                                        handlePageChange
                                    }
                                />
                            )}

                            {/*
                             * 로그인하지 않은 사용자가
                             * 전체보기 이외의 탭을 보는 경우
                             * 로그인 유도 영역을 표시한다.
                             */}

                            {isRestrictedTab && (
                                <>
                                    <div
                                        className={
                                            styles.maskGradient
                                        }
                                        aria-hidden="true"
                                    />

                                    <div
                                        className={
                                            styles.loginGuide
                                        }
                                    >
                                        <h2
                                            className={
                                                styles.loginGuideTitle
                                            }
                                        >
                                            로그인하고 더
                                            편리하게
                                            <br />
                                            프로필을
                                            탐색하세요
                                        </h2>

                                        <p
                                            className={
                                                styles.loginGuideDescription
                                            }
                                        >
                                            나를 소개하는
                                            가장 쉬운 방법,
                                            <br />
                                            Nodi와 함께
                                            새로운 연결을
                                            시작해요.
                                        </p>

                                        <button
                                            type="button"
                                            className={
                                                styles.startButton
                                            }
                                            onClick={
                                                handleStartClick
                                            }
                                        >
                                            시작하기
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>
                )}
            </main>

            {!isMobileSearchOpen && (
                <div className={styles.mobileOnly}>
                    <BottomNavigation />
                </div>
            )}

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={
                    handleLoginModalClose
                }
            />
        </>
    );
};

export default Explore;