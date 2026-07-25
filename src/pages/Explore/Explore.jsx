    import {
    useCallback,
    useEffect,
    useState,
    } from "react";

    import ExploreSearch from "../../components/explore/ExploreSearch";
    import ExploreCardList from "../../components/explore/ExploreCardList";
    import Pagination from "../../components/common/Pagination/Pagination";
    import MobileExploreHeader from "../../components/explore/MobileExploreHeader";
    import BottomNavigation from "../../components/common/BottomNavigation/BottomNavigation";
    import LoginModal from "../../components/common/LoginModal/LoginModal";
    import NotificationPanel from "../../components/common/NotificationPanel/NotificationPanel";
    import ReceivedExchangeModal from "../../components/exchange/ReceivedExchangeModal";

    import {
    getMyProfileCards,
    getPublicProfileCards,
    } from "../../api/profile";

    import {
    acceptConnectionRequest,
    getReceivedConnectionRequests,
    rejectConnectionRequest,
    } from "../../api/connectionRequests";

    import {
    getAffiliationStatuses,
    getPurposes,
    } from "../../api/options";

    import {
    mapProfileCard,
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

    const normalizeAffiliationName = (
    value = "",
    ) => {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(
        /\s/g,
        "",
        );
    };

    const getItems = (
    result,
    ) => {
    if (
        Array.isArray(result)
    ) {
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
            sort:
            "createdAt",
            order:
            "asc",
        };

        case "가나다순":
        return {
            sort:
            "nickname",
            order:
            "asc",
        };

        case "최근 등록순":
        default:
        return {
            sort:
            "createdAt",
            order:
            "desc",
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
        selectedJobType,
        setSelectedJobType,
    ] = useState(null);

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
        exchangeRequests,
        setExchangeRequests,
    ] = useState([]);

    const [
        exchangeError,
        setExchangeError,
    ] = useState("");

    const [
        isNotificationOpen,
        setIsNotificationOpen,
    ] = useState(false);

    const [
        selectedRequest,
        setSelectedRequest,
    ] = useState(null);

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

    const [
        affiliationStatuses,
        setAffiliationStatuses,
    ] = useState([]);

    const [
        isAffiliationLoading,
        setIsAffiliationLoading,
    ] = useState(true);

    const isUserLoggedIn =
        isLoggedIn();

    const hasUnreadNotification =
        exchangeRequests.some(
        (request) =>
            request.status === "pending" &&
            !request.isRead,
        );

    const loadReceivedRequests =
        useCallback(
        async (signal) => {
            if (!isLoggedIn()) {
            setExchangeRequests([]);
            setExchangeError("");
            return;
            }

            try {
            const cardData =
                await getMyProfileCards({
                page: 1,
                limit: 100,
                sort: "createdAt",
                order: "desc",
                signal,
                });

            const myCards =
                cardData?.items || [];

            const requestResponses =
                await Promise.all(
                myCards.map((card) =>
                    getReceivedConnectionRequests({
                    cardId: card.id,
                    page: 1,
                    limit: 100,
                    sort: "createdAt",
                    order: "desc",
                    signal,
                    }),
                ),
                );

            const requestMap = new Map();

            requestResponses.forEach((response) => {
                const items = response?.items || [];

                items.forEach((item) => {
                const receivedCard =
                    mapProfileCard(item.card || {});

                requestMap.set(item.id, {
                    id: item.id,
                    status:
                    item.status === 0
                        ? "pending"
                        : item.status === 1
                        ? "accepted"
                        : item.status === 2
                            ? "rejected"
                            : "cancelled",
                    isRead: false,
                    createdAt:
                    item.createdAt?.isoString ||
                    item.createdAt,
                    sender: {
                    id: receivedCard.id,
                    name: receivedCard.name,
                    profileImage:
                        receivedCard.profileImage,
                    },
                    receivedCard,
                    message:
                    item.message ||
                    "전달된 메시지가 없습니다.",
                });
                });
            });

            const requests =
                Array.from(requestMap.values()).sort(
                (first, second) =>
                    new Date(second.createdAt) -
                    new Date(first.createdAt),
                );

            setExchangeRequests(requests);
            setExchangeError("");
            } catch (error) {
            if (error?.name !== "AbortError") {
                console.error(
                "받은 교환 요청 조회 실패:",
                error,
                );

                setExchangeError(
                error.message ||
                    "교환 요청을 불러오지 못했습니다.",
                );
            }
            }
        },
        [],
        );

    useEffect(() => {
        const controller = new AbortController();

        loadReceivedRequests(controller.signal);

        return () => {
        controller.abort();
        };
    }, [loadReceivedRequests]);

    const hasSearchKeyword =
        keyword.trim().length >
        0;

    const isRestrictedTab =
        !isUserLoggedIn &&
        activeTab !==
        "전체보기";

    const selectedPurpose =
        activeTab ===
        "전체보기"
        ? null
        : purposes.find(
            (purpose) =>
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

    const selectedAffiliationStatus =
        !affiliation ||
        affiliation === "모두"
        ? null
        : affiliationStatuses.find(
            (status) =>
                normalizeAffiliationName(
                status?.name,
                ) ===
                normalizeAffiliationName(
                affiliation,
                ),
            );

    const selectedAffiliationStatusId =
        selectedAffiliationStatus
        ?.id ?? null;

    const affiliationOptions = [
        "모두",

        ...affiliationStatuses
        .map(
            (status) =>
            status?.name,
        )
        .filter(Boolean),
    ];

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
                await getPurposes(
                {
                    page: 1,
                    limit: 100,
                    sort: "name",
                    order: "asc",

                    signal:
                    controller.signal,
                },
                );

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
    * 현 소속 목록 조회
    */
    useEffect(() => {
        const controller =
        new AbortController();

        const fetchAffiliationStatuses =
        async () => {
            try {
            setIsAffiliationLoading(
                true,
            );

            const result =
                await getAffiliationStatuses(
                {
                    page: 1,
                    limit: 100,
                    sort: "name",
                    order: "asc",

                    signal:
                    controller.signal,
                },
                );

            setAffiliationStatuses(
                getItems(
                result,
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
                "현 소속 목록 조회 실패:",
                error,
            );

            setAffiliationStatuses(
                [],
            );
            } finally {
            if (
                !controller
                .signal
                .aborted
            ) {
                setIsAffiliationLoading(
                false,
                );
            }
            }
        };

        fetchAffiliationStatuses();

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
            if (
            isPurposeLoading ||
            isAffiliationLoading
            ) {
            return;
            }

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

                    purposeId:
                    activeTab ===
                    "전체보기"
                        ? undefined
                        : selectedPurposeId,

                    /*
                    * 선택한 현 소속 ID를
                    * 탐색 API에 전달한다.
                    */
                    affiliationStatusId:
                    !affiliation ||
                    affiliation ===
                        "모두"
                        ? undefined
                        : selectedAffiliationStatusId,

                    /*
                    * 직군은 보내지 않고
                    * 선택한 스킬만 전달한다.
                    */
                    skillIds:
                    selectedTags.map(
                        (tag) =>
                        tag.id,
                    ),

                    keywords:
                    keyword,

                    signal:
                    controller.signal,
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
        isAffiliationLoading,
        purposeError,
        affiliation,
        selectedAffiliationStatusId,
        selectedTags,
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

        setKeyword(
            "",
        );

        setIsMobileSearchOpen(
            true,
        );
        };

    const handleMobileSearchClose =
        () => {
        setIsMobileSearchOpen(
            false,
        );

        setKeyword(
            "",
        );

        setCurrentPage(
            1,
        );
        };

    const handleNotificationToggle = () => {
        if (!isUserLoggedIn) {
        setIsLoginModalOpen(true);
        return;
        }

        setIsNotificationOpen((previous) => !previous);
    };

    const handleRequestClick = (request) => {
        setSelectedRequest({
            ...request,
            id: request?.id ?? Date.now(),
        });

        setIsNotificationOpen(false);
    };


    const handleRejectRequest = async (requestId) => {
        try {
        await rejectConnectionRequest(requestId);

        setExchangeRequests((currentRequests) =>
            currentRequests.filter(
            (request) => request.id !== requestId,
            ),
        );

        setSelectedRequest(null);
        window.alert("카드 교환 요청을 거절했습니다.");
        } catch (error) {
        console.error("교환 요청 거절 실패:", error);
        window.alert(
            error.message ||
            "교환 요청을 거절하지 못했습니다.",
        );
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
        await acceptConnectionRequest(requestId);

        setExchangeRequests((currentRequests) =>
            currentRequests.filter(
            (request) => request.id !== requestId,
            ),
        );

        setSelectedRequest(null);
        window.alert("카드 교환이 완료되었습니다.");
        } catch (error) {
        console.error("교환 요청 수락 실패:", error);
        window.alert(
            error.message ||
            "교환 요청을 수락하지 못했습니다.",
        );
        }
    };

    const handleMobileLogoClick = () => {
        setActiveTab("전체보기");
        setCurrentPage(1);
        setKeyword("");
        setAffiliation("");
        setSelectedJobType(null);
        setSelectedTags([]);

        setSort("최근 등록순");

        setIsMobileSearchOpen(false);
        setIsLoginModalOpen(false);
        setErrorMessage("");

        window.scrollTo({
        top: 0,
        behavior: "auto",
        });
    };

    return (
        <>
        <div className={styles.mobileOnly}>
            <MobileExploreHeader
            isSearchOpen={isMobileSearchOpen}
            onSearchClose={handleMobileSearchClose}
            onLogoClick={handleMobileLogoClick}
            onNotificationClick={handleNotificationToggle}
            isNotificationOpen={isNotificationOpen}
            hasUnreadNotification={hasUnreadNotification}
            notificationPanel={
                <NotificationPanel
                requests={exchangeRequests}
                errorMessage={exchangeError}
                onRequestClick={handleRequestClick}
                onClose={() =>
                    setIsNotificationOpen(false)
                }
                />
            }
            />
        </div>

        <main className={styles.main}>
            <section className={styles.hero}>
            <h1 className={styles.title}>
                나와 맞는 사람 찾기
            </h1>

            <div className={styles.mobileOnly}>
                {!isMobileSearchOpen && (
                <div className={styles.mobileTitleRow}>
                    <h1 className={styles.mobileTitle}>
                    둘러보기
                    </h1>

                    <button
                    type="button"
                    className={styles.mobileSearchButton}
                    onClick={handleMobileSearchOpen}
                    aria-label="검색창 열기"
                    >
                    <img
                        src={searchIcon}
                        alt=""
                        className={styles.mobileSearchIcon}
                    />
                    </button>
                </div>
                )}
            </div>

            <ExploreSearch
                keyword={keyword}
                affiliation={affiliation}
                affiliationOptions={affiliationOptions}
                selectedTags={selectedTags}
                selectedJobType={selectedJobType}
                sort={sort}
                isMobileSearchOpen={isMobileSearchOpen}
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
                onJobTypeChange={(value) => {
                /*
                * 직군은 관련 스킬 목록을
                * 좁히는 용도로만 저장한다.
                */
                setSelectedJobType(value);
                }}
                onSortChange={(value) => {
                setSort(value);
                setCurrentPage(1);
                }}
            />
            </section>

            {(!isMobileSearchOpen || hasSearchKeyword) && (
            <section className={styles.exploreSection}>
                {!isMobileSearchOpen && (
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
                        aria-selected={isActive}
                        className={`${styles.tabButton} ${
                            isActive
                            ? styles.activeTab
                            : ""
                        }`}
                        onClick={() =>
                            handleTabClick(tab)
                        }
                        >
                        {tab}
                        </button>
                    );
                    })}
                </div>
                )}

                <div
                className={`${styles.cardArea} ${
                    isRestrictedTab
                    ? styles.restrictedCardArea
                    : ""
                }`}
                >
                <ExploreCardList
                    profiles={profiles}
                    activeTab={activeTab}
                    keyword={keyword}
                    isUserLoggedIn={isUserLoggedIn}
                    isLoading={
                    isLoading ||
                    isPurposeLoading ||
                    isAffiliationLoading
                    }
                    errorMessage={errorMessage}
                />

                {!isRestrictedTab &&
                    !isMobileSearchOpen &&
                    !isLoading &&
                    !isPurposeLoading &&
                    !isAffiliationLoading &&
                    !errorMessage && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onChange={handlePageChange}
                    />
                    )}

                {isRestrictedTab &&
                    !isMobileSearchOpen &&
                    !isLoading &&
                    !isPurposeLoading &&
                    !isAffiliationLoading && (
                    <>
                        <div
                        className={styles.maskGradient}
                        aria-hidden="true"
                        />

                        <div className={styles.loginGuide}>
                        <h2
                            className={
                            styles.loginGuideTitle
                            }
                        >
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
                            Nodi와 함께 새로운 연결을
                            시작해요.
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
            )}
        </main>

        {!isMobileSearchOpen && (
            <div className={styles.mobileOnly}>
            <BottomNavigation />
            </div>
        )}

        <LoginModal
            isOpen={isLoginModalOpen}
            onClose={handleLoginModalClose}
        />

        {selectedRequest && (
    <ReceivedExchangeModal
        key={selectedRequest.id}
        request={selectedRequest}
        onClose={() =>
            setSelectedRequest(null)
        }
        onReject={handleRejectRequest}
        onAccept={handleAcceptRequest}
    />
)}
        </>
    );
    };

    export default Explore;