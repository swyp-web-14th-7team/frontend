<<<<<<< HEAD
    import {
<<<<<<< Updated upstream
=======
    useCallback,
    useEffect,
    useState,
    } from "react";

    import {
>>>>>>> Stashed changes
    NavLink,
    useNavigate,
<<<<<<< Updated upstream
=======
import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    NavLink,
>>>>>>> origin/develop
    useLocation,
    useNavigate,
} from "react-router-dom";

import LoginModal from "./LoginModal/LoginModal";
import NotificationPanel from "./NotificationPanel/NotificationPanel";
import ReceivedExchangeModal from "../exchange/ReceivedExchangeModal";

import {
    acceptConnectionRequest,
    getReceivedConnectionRequests,
    rejectConnectionRequest,
} from "../../api/connectionRequests";
import {
    getMyProfileCards,
} from "../../api/profile";

import {
    mapProfileCard,
} from "../../utils/profileMapper";

import {
    isLoggedIn,
} from "../../utils/auth";

<<<<<<< HEAD
    const Header = ({ showNav = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
=======
    } from "react-router-dom";

    import LoginModal from "./LoginModal/LoginModal";
    import NotificationPanel from "./NotificationPanel/NotificationPanel";
    import ReceivedExchangeModal from "../exchange/ReceivedExchangeModal";

    import {
    acceptConnectionRequest,
    getReceivedConnectionRequests,
    rejectConnectionRequest,
    } from "../../api/connectionRequests";

    import {
    getMyProfileCards,
    } from "../../api/profile";

    import {
    mapProfileCard,
    } from "../../utils/profileMapper";

    import {
    isLoggedIn,
    } from "../../utils/auth";

    import styles from "./Header.module.css";

    import logo from "../../assets/icons/Logo.svg";

    import exploreNavIcon from "../../assets/icons/icon_explore.svg";
    import libraryNavIcon from "../../assets/icons/icon_library.svg";
    import mypageNavIcon from "../../assets/icons/icon_mypage.svg";

    import scrapIcon from "../../assets/icons/icon_scrap.svg";
    import scrapActiveIcon from "../../assets/icons/icon_scrap_active.svg";
    import bellIcon from "../../assets/icons/알림.svg";
    import settingIcon from "../../assets/icons/설정.svg";

    const Header = ({
    showNav = false,
    }) => {
=======
import styles from "./Header.module.css";

import logo from "../../assets/icons/Logo.svg";

import exploreNavIcon from "../../assets/icons/icon_explore.svg";
import libraryNavIcon from "../../assets/icons/icon_library.svg";
import mypageNavIcon from "../../assets/icons/icon_mypage.svg";

import scrapIcon from "../../assets/icons/icon_scrap.svg";
import scrapActiveIcon from "../../assets/icons/icon_scrap_active.svg";
import bellIcon from "../../assets/icons/알림.svg";
import settingIcon from "../../assets/icons/설정.svg";

const Header = ({
    showNav = false,
}) => {
>>>>>>> origin/develop
    const navigate =
        useNavigate();

    const location =
        useLocation();

    const [
        exchangeRequests,
        setExchangeRequests,
    ] = useState([]);

<<<<<<< HEAD
    const [
        exchangeError,
        setExchangeError,
    ] = useState("");
=======
    const [exchangeError, setExchangeError] =
        useState("");
>>>>>>> origin/develop

    const [
        isNotificationOpen,
        setIsNotificationOpen,
    ] = useState(false);

    const [
        selectedRequest,
        setSelectedRequest,
    ] = useState(null);

    const [
        isLoginModalOpen,
        setIsLoginModalOpen,
    ] = useState(false);

    const isUserLoggedIn =
        isLoggedIn();

<<<<<<< HEAD
    const loadReceivedRequests =
        useCallback(
        async (signal) => {
            if (!isLoggedIn()) {
            setExchangeRequests(
                [],
            );

            return;
            }

            try {
            const cardData =
                await getMyProfileCards(
                {
                    page: 1,
                    limit: 100,
                    sort: "createdAt",
                    order: "desc",
                    signal,
                },
                );

            const myCards =
                cardData?.items ||
                [];

            const requestResponses =
                await Promise.all(
                myCards.map(
                    (card) =>
                    getReceivedConnectionRequests(
                        {
                        cardId:
                            card.id,

=======
    const loadReceivedRequests = useCallback(
        async (signal) => {
            if (!isLoggedIn()) {
                setExchangeRequests([]);
                return;
            }

            try {
                const cardData =
                    await getMyProfileCards({
>>>>>>> origin/develop
                        page: 1,
                        limit: 100,
                        sort: "createdAt",
                        order: "desc",
                        signal,
<<<<<<< HEAD
                        },
                    ),
                ),
                );

            const requestMap =
                new Map();

            requestResponses.forEach(
                (response) => {
                const items =
                    response?.items ||
                    [];

                items.forEach(
                    (item) => {
                    const receivedCard =
                        mapProfileCard(
                        item.card ||
                            {},
                        );

                    requestMap.set(
                        item.id,
                        {
                        id: item.id,

                        status:
                            item.status ===
                            0
                            ? "pending"
                            : item.status ===
                                1
                                ? "accepted"
                                : item.status ===
                                    2
                                ? "rejected"
                                : "cancelled",

                        isRead: false,

                        createdAt:
                            item
                            .createdAt
                            ?.isoString ||
                            item.createdAt,

                        sender: {
                            id:
                            receivedCard.id,

                            name:
                            receivedCard.name,

                            profileImage:
                            receivedCard.profileImage,
                        },

                        receivedCard,

                        message:
                            item.message ||
                            "전달된 메시지가 없습니다.",
                        },
                    );
                    },
                );
                },
            );

            const requests =
                Array.from(
                requestMap.values(),
                ).sort(
                (
                    first,
                    second,
                ) =>
                    new Date(
                    second.createdAt,
                    ) -
                    new Date(
                    first.createdAt,
                    ),
                );

            setExchangeRequests(
                requests,
            );

            setExchangeError(
                "",
            );
            } catch (error) {
            if (
                error?.name !==
                "AbortError"
            ) {
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
        const controller =
        new AbortController();

        const fetchRequests =
        async () => {
            await loadReceivedRequests(
            controller.signal,
=======
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

                requestResponses.forEach(
                    (response) => {
                        const items =
                            response?.items || [];

                        items.forEach((item) => {
                            const receivedCard =
                                mapProfileCard(
                                    item.card || {},
                                );

                            requestMap.set(
                                item.id,
                                {
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
                                        item.createdAt
                                            ?.isoString ||
                                        item.createdAt,
                                    sender: {
                                        id:
                                            receivedCard.id,
                                        name:
                                            receivedCard.name,
                                        profileImage:
                                            receivedCard.profileImage,
                                    },
                                    receivedCard,
                                    message:
                                        item.message ||
                                        "전달된 메시지가 없습니다.",
                                },
                            );
                        });
                    },
                );

                const requests = Array.from(
                    requestMap.values(),
                ).sort(
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
        const controller =
            new AbortController();

        const fetchRequests = async () => {
            await loadReceivedRequests(
                controller.signal,
>>>>>>> origin/develop
            );
        };

        fetchRequests();

        return () => {
<<<<<<< HEAD
        controller.abort();
        };
    }, [loadReceivedRequests]);
>>>>>>> Stashed changes
=======
            controller.abort();
        };
    }, [loadReceivedRequests]);
>>>>>>> origin/develop

    const isExploreActive =
<<<<<<< HEAD
<<<<<<< Updated upstream
        location.pathname === "/explore" ||
        location.pathname.startsWith("/profile-carousel/");
=======
        location.pathname ===
            "/explore" ||
        location.pathname.startsWith(
            "/profile-carousel/",
        ) ||
        location.pathname.startsWith(
            "/profile/",
        );
>>>>>>> origin/develop

    const isScrapActive =
        location.pathname ===
        "/scrap";

    const hasUnreadNotification =
        exchangeRequests.some(
            (request) =>
                request.status ===
                    "pending" &&
                !request.isRead,
        );

    const handleLogoClick =
        () => {
            navigate(
                "/explore",
            );
        };

    const handleLoginClick =
        () => {
            setIsLoginModalOpen(
                true,
            );
        };

    const handleNotificationToggle =
        () => {
            setIsNotificationOpen(
                (previous) =>
                    !previous,
            );
        };

    const handleRequestClick = (
        request,
    ) => {
        setExchangeRequests(
            (
                currentRequests,
            ) =>
                currentRequests.map(
                    (item) =>
                        item.id ===
                        request.id
                            ? {
                                  ...item,
                                  isRead: true,
                              }
                            : item,
                ),
        );

        setSelectedRequest({
            ...request,
            isRead: true,
        });

        setIsNotificationOpen(
            false,
        );
    };

    const handleRejectRequest = async (
        requestId,
    ) => {
        try {
            await rejectConnectionRequest(
                requestId,
            );

            setExchangeRequests(
                (currentRequests) =>
                    currentRequests.filter(
                        (request) =>
                            request.id !==
                            requestId,
                    ),
            );
            setSelectedRequest(null);
            window.alert(
                "카드 교환 요청을 거절했습니다.",
            );
        } catch (error) {
            console.error(
                "교환 요청 거절 실패:",
                error,
            );
            window.alert(
                error.message ||
                    "교환 요청을 거절하지 못했습니다.",
            );
        }
    };

    const handleAcceptRequest = async (
        requestId,
    ) => {
        try {
            await acceptConnectionRequest(
                requestId,
            );

            setExchangeRequests(
                (currentRequests) =>
                    currentRequests.filter(
                        (request) =>
                            request.id !==
                            requestId,
                    ),
            );
            setSelectedRequest(null);
            window.alert(
                "카드 교환이 완료되었습니다.",
            );
        } catch (error) {
            console.error(
                "교환 요청 수락 실패:",
                error,
            );
            window.alert(
                error.message ||
                    "교환 요청을 수락하지 못했습니다.",
            );
        }
    };

    return (
        <>
            <header
                className={
                    styles.header
                }
            >
                <button
                    type="button"
                    className={
                        styles.logoButton
                    }
                    onClick={
                        handleLogoClick
                    }
                    aria-label="Nodi 홈으로 이동"
                >
                    <img
                        src={logo}
                        alt="Nodi"
                        className={
                            styles.logo
                        }
                    />
                </button>

                {showNav && (
                    <nav
                        className={
                            styles.nav
                        }
                    >
                        <NavLink
                            to="/profile"
                            end
                            className={({
                                isActive,
                            }) =>
                                `${styles.navItem} ${
                                    isActive
                                        ? styles.activeNav
                                        : ""
                                }`
                            }
                        >
                            <img
                                src={
                                    mypageNavIcon
                                }
                                alt=""
                                className={
                                    styles.navIcon
                                }
                            />

                            <span>
                                내 프로필
                            </span>
                        </NavLink>

                        <NavLink
                            to="/explore"
                            className={() =>
                                `${styles.navItem} ${
                                    isExploreActive
                                        ? styles.activeNav
                                        : ""
                                }`
                            }
                        >
                            <img
                                src={
                                    exploreNavIcon
                                }
                                alt=""
                                className={
                                    styles.navIcon
                                }
                            />

                            <span>
                                탐색
                            </span>
                        </NavLink>

                        <NavLink
                            to="/saved"
                            className={({
                                isActive,
                            }) =>
                                `${styles.navItem} ${
                                    isActive
                                        ? styles.activeNav
                                        : ""
                                }`
                            }
                        >
                            <img
                                src={
                                    libraryNavIcon
                                }
                                alt=""
                                className={
                                    styles.navIcon
                                }
                            />

                            <span>
                                보관함
                            </span>
                        </NavLink>
                    </nav>
                )}

                {isUserLoggedIn ? (
                    <nav
                        className={
                            styles.rightMenu
                        }
                    >
                        <NavLink
                            to="/scrap"
                            className={
                                styles.iconButton
                            }
                            aria-label="스크랩"
                        >
                            <img
                                src={
                                    isScrapActive
                                        ? scrapActiveIcon
                                        : scrapIcon
                                }
                                alt=""
                                className={
                                    styles.icon
                                }
                            />
                        </NavLink>

                        <div
                            className={
                                styles.notificationWrapper
                            }
                        >
                            <button
                                type="button"
                                className={
                                    styles.iconButton
                                }
                                onClick={
                                    handleNotificationToggle
                                }
                                aria-label="알림"
                                aria-expanded={
                                    isNotificationOpen
                                }
                            >
                                {hasUnreadNotification && (
                                    <span
                                        className={
                                            styles.notificationDot
                                        }
                                    />
                                )}

                                <img
                                    src={
                                        bellIcon
                                    }
                                    alt=""
                                    className={
                                        styles.icon
                                    }
                                />
                            </button>

                            {isNotificationOpen && (
                                <NotificationPanel
                                    requests={
                                        exchangeRequests
                                    }
                                    errorMessage={
                                        exchangeError
                                    }
                                    onRequestClick={
                                        handleRequestClick
                                    }
                                    onClose={() =>
                                        setIsNotificationOpen(
                                            false,
                                        )
                                    }
                                />
                            )}
                        </div>

                        <button
                            type="button"
                            className={
                                styles.iconButton
                            }
                            onClick={() =>
                                navigate(
                                    "/settings",
                                )
                            }
                            aria-label="설정"
                        >
                            <img
                                src={
                                    settingIcon
                                }
                                alt=""
                                className={
                                    styles.icon
                                }
                            />
                        </button>
                    </nav>
                ) : (
                    <button
                        type="button"
                        className={
                            styles.loginButton
                        }
                        onClick={
                            handleLoginClick
                        }
                    >
                        로그인하기
                    </button>
                )}
            </header>

            <LoginModal
                isOpen={
                    isLoginModalOpen
                }
                onClose={() =>
                    setIsLoginModalOpen(
                        false,
                    )
                }
            />

<<<<<<< HEAD
            <button
            type="button"
            className={styles.iconButton}
            aria-label="알림"
            >
            <img
                src={bellIcon}
                alt=""
                className={styles.icon}
            />
            </button>

            <button
            type="button"
            className={styles.iconButton}
            aria-label="설정"
            >
            <img
                src={settingIcon}
                alt=""
                className={styles.icon}
            />
            </button>
        </nav>
        </header>
=======
        location.pathname ===
        "/explore" ||
        location.pathname.startsWith(
        "/profile-carousel/",
        ) ||
        location.pathname.startsWith(
        "/profile/",
        );

    const isScrapActive =
        location.pathname ===
        "/scrap";

    const hasUnreadNotification =
        exchangeRequests.some(
        (request) =>
            request.status ===
            "pending" &&
            !request.isRead,
        );

    const handleLogoClick =
        () => {
        navigate("/explore");
        };

    const handleLoginClick =
        () => {
        setIsLoginModalOpen(
            true,
        );
        };

    /*
    * 비로그인 상태에서 보호 메뉴를 누르면
    * 라우터 이동을 완전히 막고 로그인 모달만 연다.
    */
    const handleProtectedLinkClick =
        (event) => {
        if (isUserLoggedIn) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        setIsLoginModalOpen(
            true,
        );
        };

    const handleNotificationToggle =
        () => {
        setIsNotificationOpen(
            (previous) =>
            !previous,
        );
        };

    const handleRequestClick = (
        request,
    ) => {
        setExchangeRequests(
        (currentRequests) =>
            currentRequests.map(
            (item) =>
                item.id ===
                request.id
                ? {
                    ...item,
                    isRead: true,
                    }
                : item,
            ),
        );

        setSelectedRequest({
        ...request,
        isRead: true,
        });

        setIsNotificationOpen(
        false,
        );
    };

    const handleRejectRequest =
        async (requestId) => {
        try {
            await rejectConnectionRequest(
            requestId,
            );

            setExchangeRequests(
            (currentRequests) =>
                currentRequests.filter(
                (request) =>
                    request.id !==
                    requestId,
                ),
            );

            setSelectedRequest(null);

            window.alert(
            "카드 교환 요청을 거절했습니다.",
            );
        } catch (error) {
            console.error(
            "교환 요청 거절 실패:",
            error,
            );

            window.alert(
            error.message ||
                "교환 요청을 거절하지 못했습니다.",
            );
        }
        };

    const handleAcceptRequest =
        async (requestId) => {
        try {
            await acceptConnectionRequest(
            requestId,
            );

            setExchangeRequests(
            (currentRequests) =>
                currentRequests.filter(
                (request) =>
                    request.id !==
                    requestId,
                ),
            );

            setSelectedRequest(null);

            window.alert(
            "카드 교환이 완료되었습니다.",
            );
        } catch (error) {
            console.error(
            "교환 요청 수락 실패:",
            error,
            );

            window.alert(
            error.message ||
                "교환 요청을 수락하지 못했습니다.",
            );
        }
        };

    return (
        <>
        <header
            className={
            styles.header
            }
        >
            <button
            type="button"
            className={
                styles.logoButton
            }
            onClick={
                handleLogoClick
            }
            aria-label="Nodi 홈으로 이동"
            >
            <img
                src={logo}
                alt="Nodi"
                className={
                styles.logo
                }
            />
            </button>

            {showNav && (
            <nav
                className={
                styles.nav
                }
            >
                <NavLink
                to="/profile"
                end
                onClickCapture={
                    handleProtectedLinkClick
                }
                aria-disabled={
                    !isUserLoggedIn
                }
                className={({
                    isActive,
                }) =>
                    `${
                    styles.navItem
                    } ${
                    isActive
                        ? styles.activeNav
                        : ""
                    }`
                }
                >
                <img
                    src={
                    mypageNavIcon
                    }
                    alt=""
                    className={
                    styles.navIcon
                    }
                />

                <span>
                    내 프로필
                </span>
                </NavLink>

                <NavLink
                to="/explore"
                className={() =>
                    `${
                    styles.navItem
                    } ${
                    isExploreActive
                        ? styles.activeNav
                        : ""
                    }`
                }
                >
                <img
                    src={
                    exploreNavIcon
                    }
                    alt=""
                    className={
                    styles.navIcon
                    }
                />

                <span>탐색</span>
                </NavLink>

                <NavLink
                to="/saved"
                onClickCapture={
                    handleProtectedLinkClick
                }
                aria-disabled={
                    !isUserLoggedIn
                }
                className={({
                    isActive,
                }) =>
                    `${
                    styles.navItem
                    } ${
                    isActive
                        ? styles.activeNav
                        : ""
                    }`
                }
                >
                <img
                    src={
                    libraryNavIcon
                    }
                    alt=""
                    className={
                    styles.navIcon
                    }
                />

                <span>보관함</span>
                </NavLink>
            </nav>
            )}

            {isUserLoggedIn ? (
            <nav
                className={
                styles.rightMenu
                }
            >
                <NavLink
                to="/scrap"
                className={
                    styles.iconButton
                }
                aria-label="스크랩"
                >
                <img
                    src={
                    isScrapActive
                        ? scrapActiveIcon
                        : scrapIcon
                    }
                    alt=""
                    className={
                    styles.icon
                    }
                />
                </NavLink>

                <div
                className={
                    styles.notificationWrapper
                }
                >
                <button
                    type="button"
                    className={
                    styles.iconButton
                    }
                    onClick={
                    handleNotificationToggle
                    }
                    aria-label="알림"
                    aria-expanded={
                    isNotificationOpen
                    }
                >
                    {hasUnreadNotification && (
                    <span
                        className={
                        styles.notificationDot
                        }
                    />
                    )}

                    <img
                    src={bellIcon}
                    alt=""
                    className={
                        styles.icon
                    }
                    />
                </button>

                {isNotificationOpen && (
                    <NotificationPanel
                    requests={
                        exchangeRequests
                    }
                    errorMessage={
                        exchangeError
                    }
                    onRequestClick={
                        handleRequestClick
                    }
                    onClose={() =>
                        setIsNotificationOpen(
                        false,
                        )
                    }
                    />
                )}
                </div>

                <button
                type="button"
                className={
                    styles.iconButton
                }
                onClick={() =>
                    navigate(
                    "/settings",
                    )
                }
                aria-label="설정"
                >
                <img
                    src={settingIcon}
                    alt=""
                    className={
                    styles.icon
                    }
                />
                </button>
            </nav>
            ) : (
            <button
                type="button"
                className={
                styles.loginButton
                }
                onClick={
                handleLoginClick
                }
            >
                로그인하기
            </button>
            )}
        </header>

        <LoginModal
            isOpen={
            isLoginModalOpen
            }
            onClose={() =>
            setIsLoginModalOpen(
                false,
            )
            }
        />

        {isUserLoggedIn &&
            selectedRequest && (
            <ReceivedExchangeModal
                request={
                selectedRequest
                }
                onClose={() =>
                setSelectedRequest(
                    null,
                )
                }
                onReject={
                handleRejectRequest
                }
                onAccept={
                handleAcceptRequest
                }
            />
            )}
        </>
>>>>>>> Stashed changes
=======
            {isUserLoggedIn &&
                selectedRequest && (
                    <ReceivedExchangeModal
                        request={
                            selectedRequest
                        }
                        onClose={() =>
                            setSelectedRequest(
                                null,
                            )
                        }
                        onReject={
                            handleRejectRequest
                        }
                        onAccept={
                            handleAcceptRequest
                        }
                    />
                )}
        </>
>>>>>>> origin/develop
    );
};

export default Header;
