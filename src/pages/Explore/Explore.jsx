import {
    useEffect,
    useState,
} from "react";

import ExploreSearch from "../../components/explore/ExploreSearch";
import ExploreCardList from "../../components/explore/ExploreCardList";
import Pagination from "../../components/common/Pagination/Pagination";
import MobileExploreHeader from "../../components/explore/MobileExploreHeader";
import BottomNavigation from "../../components/common/BottomNavigation/BottomNavigation";
import LoginModal from "../../components/common/LoginModal/LoginModal";

import {
    getPublicProfileCards,
} from "../../api/profile";

import {
    getPurposes,
} from "../../api/options";

import {
    mapProfileCards,
} from "../../utils/profileMapper";

import {
    isLoggedIn,
} from "../../utils/auth";

import searchIcon from "../../assets/icons/icon_search.svg";

import styles from "./Explore.module.css";

const TABS = [
    "전체보기",
    "팀 빌딩",
    "커피챗",
    "교류/네트워킹",
];

/*
 * 프론트 탭 이름과 백엔드 목적 이름을
 * 비교하기 위해 공백과 구분 기호를 제거한다.
 *
 * 예:
 * 팀 빌딩 -> 팀빌딩
 * 교류/네트워킹 -> 교류네트워킹
 * 교류·네트워킹 -> 교류네트워킹
 */
const normalizePurposeName = (
    value = "",
) => {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(
            /[\s/·ㆍ_-]/g,
            "",
        );
};

const getItems = (
    result,
) => {
    if (Array.isArray(result)) {
        return result;
    }

    if (
        Array.isArray(
            result?.items,
        )
    ) {
        return result.items;
    }

    if (
        Array.isArray(
            result?.data?.items,
        )
    ) {
        return result.data.items;
    }

    return [];
};

const getSortParams = (
    sort,
) => {
    switch (sort) {
        case "오래된 등록순":
            return {
                sort: "createdAt",
                order: "asc",
            };

        case "가나다순":
            return {
                sort: "nickname",
                order: "asc",
            };

        case "최근 등록순":
        default:
            return {
                sort: "createdAt",
                order: "desc",
            };
    }
};

const Explore = () => {
    const [
        activeTab,
        setActiveTab,
    ] = useState(
        "전체보기",
    );

    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);

    const [
        keyword,
        setKeyword,
    ] = useState("");

    const [
        affiliation,
        setAffiliation,
    ] = useState("");

    const [
        selectedTags,
        setSelectedTags,
    ] = useState([]);

    const [
        sort,
        setSort,
    ] = useState(
        "최근 등록순",
    );

    const [
        isMobileSearchOpen,
        setIsMobileSearchOpen,
    ] = useState(false);

    const [
        isLoginModalOpen,
        setIsLoginModalOpen,
    ] = useState(false);

    const [
        profiles,
        setProfiles,
    ] = useState([]);

    const [
        totalPages,
        setTotalPages,
    ] = useState(1);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    /*
     * 백엔드에서 조회한 목적 목록
     */
    const [
        purposes,
        setPurposes,
    ] = useState([]);

    const [
        isPurposeLoading,
        setIsPurposeLoading,
    ] = useState(true);

    const [
        purposeError,
        setPurposeError,
    ] = useState("");

    const isUserLoggedIn =
        isLoggedIn();

    const hasSearchKeyword =
        keyword.trim().length >
        0;

    const isRestrictedTab =
        !isUserLoggedIn &&
        activeTab !==
            "전체보기";

    /*
     * 선택한 탭 이름과 같은
     * 백엔드 목적 데이터를 찾는다.
     */
    const selectedPurpose =
        activeTab ===
        "전체보기"
            ? null
            : purposes.find(
                  (
                      purpose,
                  ) =>
                      normalizePurposeName(
                          purpose?.name,
                      ) ===
                      normalizePurposeName(
                          activeTab,
                      ),
              );

    const selectedPurposeId =
        selectedPurpose?.id ??
        null;

    /*
     * 목적 목록 조회
     */
    useEffect(() => {
        const controller =
            new AbortController();

        const fetchPurposes =
            async () => {
                try {
                    setIsPurposeLoading(
                        true,
                    );

                    setPurposeError(
                        "",
                    );

                    const result =
                        await getPurposes({
                            page: 1,
                            limit: 100,
                            sort: "name",
                            order: "asc",

                            signal:
                                controller
                                    .signal,
                        });

                    const items =
                        getItems(
                            result,
                        );

                    setPurposes(
                        items,
                    );
                } catch (error) {
                    if (
                        error.name ===
                        "AbortError"
                    ) {
                        return;
                    }

                    console.error(
                        "목적 목록 조회 실패:",
                        error,
                    );

                    setPurposes(
                        [],
                    );

                    setPurposeError(
                        "목적 목록을 불러오지 못했습니다.",
                    );
                } finally {
                    if (
                        !controller
                            .signal
                            .aborted
                    ) {
                        setIsPurposeLoading(
                            false,
                        );
                    }
                }
            };

        fetchPurposes();

        return () => {
            controller.abort();
        };
    }, []);

    /*
     * 공개 프로필 카드 목록 조회
     */
    useEffect(() => {
        const controller =
            new AbortController();

        const fetchProfiles =
            async () => {
                /*
                 * 목적 목록 조회가 완료된 뒤
                 * 프로필을 조회한다.
                 */
                if (
                    isPurposeLoading
                ) {
                    return;
                }

                /*
                 * 전체보기가 아닌데 목적 데이터를
                 * 찾지 못했다면 전체 카드가 표시되지
                 * 않도록 API 호출을 중단한다.
                 */
                if (
                    activeTab !==
                        "전체보기" &&
                    !selectedPurposeId
                ) {
                    setProfiles(
                        [],
                    );

                    setTotalPages(
                        1,
                    );

                    setIsLoading(
                        false,
                    );

                    setErrorMessage(
                        purposeError ||
                            `${activeTab} 목적 데이터가 등록되어 있지 않습니다.`,
                    );

                    return;
                }

                try {
                    setIsLoading(
                        true,
                    );

                    setErrorMessage(
                        "",
                    );

                    const sortParams =
                        getSortParams(
                            sort,
                        );

                    const data =
                        await getPublicProfileCards(
                            {
                                page:
                                    currentPage,

                                limit: 16,

                                sort:
                                    sortParams.sort,

                                order:
                                    sortParams.order,

                                /*
                                 * 전체보기에서는
                                 * purposeId를 보내지 않는다.
                                 */
                                purposeId:
                                    activeTab ===
                                    "전체보기"
                                        ? undefined
                                        : selectedPurposeId,

                                keywords:
                                    keyword,

                                signal:
                                    controller
                                        .signal,
                            },
                        );

                    const items =
                        data?.items ||
                        [];

                    setProfiles(
                        mapProfileCards(
                            items,
                        ),
                    );

                    const total =
                        data?.metadata
                            ?.total ||
                        0;

                    const limit =
                        data?.metadata
                            ?.limit ||
                        16;

                    setTotalPages(
                        Math.max(
                            1,

                            Math.ceil(
                                total /
                                    limit,
                            ),
                        ),
                    );
                } catch (error) {
                    if (
                        error.name ===
                        "AbortError"
                    ) {
                        return;
                    }

                    console.error(
                        "프로필 목록 조회 실패:",
                        error,
                    );

                    setProfiles(
                        [],
                    );

                    setTotalPages(
                        1,
                    );

                    setErrorMessage(
                        "프로필을 불러오지 못했습니다.",
                    );
                } finally {
                    if (
                        !controller
                            .signal
                            .aborted
                    ) {
                        setIsLoading(
                            false,
                        );
                    }
                }
            };

        const timer =
            setTimeout(
                fetchProfiles,
                300,
            );

        return () => {
            clearTimeout(
                timer,
            );

            controller.abort();
        };
    }, [
        activeTab,
        currentPage,
        keyword,
        sort,
        selectedPurposeId,
        isPurposeLoading,
        purposeError,
    ]);

    const handleTabClick = (
        tab,
    ) => {
        setActiveTab(
            tab,
        );

        setCurrentPage(
            1,
        );

        setErrorMessage(
            "",
        );
    };

    const handlePageChange = (
        page,
    ) => {
        setCurrentPage(
            page,
        );

        window.scrollTo({
            top: 0,
            behavior:
                "smooth",
        });
    };

    const handleStartClick =
        () => {
            setIsLoginModalOpen(
                true,
            );
        };

    const handleLoginModalClose =
        () => {
            setIsLoginModalOpen(
                false,
            );
        };

    const handleMobileSearchOpen =
        () => {
            setActiveTab(
                "전체보기",
            );

            setCurrentPage(
                1,
            );

            setKeyword("");

            setIsMobileSearchOpen(
                true,
            );
        };

    const handleMobileSearchClose =
        () => {
            setIsMobileSearchOpen(
                false,
            );

            setKeyword("");

            setCurrentPage(
                1,
            );
        };

    const handleMobileLogoClick =
        () => {
            setActiveTab(
                "전체보기",
            );

            setCurrentPage(
                1,
            );

            setKeyword("");
            setAffiliation("");
            setSelectedTags([]);

            setSort(
                "최근 등록순",
            );

            setIsMobileSearchOpen(
                false,
            );

            setIsLoginModalOpen(
                false,
            );

            setErrorMessage(
                "",
            );

            window.scrollTo({
                top: 0,
                behavior:
                    "auto",
            });
        };

    return (
        <>
            <div
                className={
                    styles.mobileOnly
                }
            >
                <MobileExploreHeader
                    isSearchOpen={
                        isMobileSearchOpen
                    }
                    onSearchClose={
                        handleMobileSearchClose
                    }
                    onLogoClick={
                        handleMobileLogoClick
                    }
                />
            </div>

            <main
                className={
                    styles.main
                }
            >
                <section
                    className={
                        styles.hero
                    }
                >
                    <h1
                        className={
                            styles.title
                        }
                    >
                        나와 맞는 사람
                        찾기
                    </h1>

                    <div
                        className={
                            styles.mobileOnly
                        }
                    >
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
                                    onClick={
                                        handleMobileSearchOpen
                                    }
                                    aria-label="검색창 열기"
                                >
                                    <img
                                        src={
                                            searchIcon
                                        }
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
                        keyword={
                            keyword
                        }
                        affiliation={
                            affiliation
                        }
                        selectedTags={
                            selectedTags
                        }
                        sort={
                            sort
                        }
                        isMobileSearchOpen={
                            isMobileSearchOpen
                        }
                        onKeywordChange={(
                            value,
                        ) => {
                            setKeyword(
                                value,
                            );

                            setCurrentPage(
                                1,
                            );
                        }}
                        onAffiliationChange={(
                            value,
                        ) => {
                            setAffiliation(
                                value,
                            );

                            setCurrentPage(
                                1,
                            );
                        }}
                        onTagsChange={(
                            value,
                        ) => {
                            setSelectedTags(
                                value,
                            );

                            setCurrentPage(
                                1,
                            );
                        }}
                        onSortChange={(
                            value,
                        ) => {
                            setSort(
                                value,
                            );

                            setCurrentPage(
                                1,
                            );
                        }}
                    />
                </section>

                {(!isMobileSearchOpen ||
                    hasSearchKeyword) && (
                    <section
                        className={
                            styles.exploreSection
                        }
                    >
                        {!isMobileSearchOpen && (
                            <div
                                className={
                                    styles.tabList
                                }
                                role="tablist"
                                aria-label="탐색 카테고리"
                            >
                                {TABS.map(
                                    (
                                        tab,
                                    ) => {
                                        const isActive =
                                            activeTab ===
                                            tab;

                                        return (
                                            <button
                                                key={
                                                    tab
                                                }
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
                                                {
                                                    tab
                                                }
                                            </button>
                                        );
                                    },
                                )}
                            </div>
                        )}

                        <div
                            className={
                                styles.cardArea
                            }
                        >
                            <ExploreCardList
                                profiles={
                                    profiles
                                }
                                activeTab={
                                    activeTab
                                }
                                keyword={
                                    keyword
                                }
                                isUserLoggedIn={
                                    isUserLoggedIn
                                }
                                isLoading={
                                    isLoading ||
                                    isPurposeLoading
                                }
                                errorMessage={
                                    errorMessage
                                }
                            />

                            {!isRestrictedTab &&
                                !isMobileSearchOpen &&
                                !isLoading &&
                                !isPurposeLoading &&
                                !errorMessage && (
                                    <Pagination
                                        currentPage={
                                            currentPage
                                        }
                                        totalPages={
                                            totalPages
                                        }
                                        onChange={
                                            handlePageChange
                                        }
                                    />
                                )}

                            {isRestrictedTab &&
                                !isMobileSearchOpen &&
                                !isLoading &&
                                !isPurposeLoading && (
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
                                                로그인하고
                                                더 편리하게
                                                <br />
                                                프로필을
                                                탐색하세요
                                            </h2>

                                            <p
                                                className={
                                                    styles.loginGuideDescription
                                                }
                                            >
                                                나를
                                                소개하는
                                                가장 쉬운
                                                방법,
                                                <br />
                                                Nodi와 함께
                                                새로운
                                                연결을
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
                <div
                    className={
                        styles.mobileOnly
                    }
                >
                    <BottomNavigation />
                </div>
            )}

            <LoginModal
                isOpen={
                    isLoginModalOpen
                }
                onClose={
                    handleLoginModalClose
                }
            />
        </>
    );
};

export default Explore;