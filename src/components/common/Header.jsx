import {
    useState,
} from "react";

import {
    NavLink,
    useLocation,
    useNavigate,
} from "react-router-dom";

import LoginModal from "./LoginModal/LoginModal";
import NotificationPanel from "./NotificationPanel/NotificationPanel";
import ReceivedExchangeModal from "../exchange/ReceivedExchangeModal";

import {
    isLoggedIn,
} from "../../utils/auth";

import exchangeRequestMocks from "../../mocks/exchangeRequests";

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
    const navigate =
        useNavigate();

    const location =
        useLocation();

    const [
        exchangeRequests,
        setExchangeRequests,
    ] = useState(
        exchangeRequestMocks,
    );

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

    const isExploreActive =
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

    const handleRejectRequest = (
        requestId,
    ) => {
        setExchangeRequests(
            (
                currentRequests,
            ) =>
                currentRequests.map(
                    (request) =>
                        request.id ===
                        requestId
                            ? {
                                  ...request,
                                  status:
                                      "rejected",
                                  isRead: true,
                              }
                            : request,
                ),
        );

        setSelectedRequest(
            null,
        );

        window.alert(
            "카드 교환 요청을 거절했습니다.",
        );
    };

    const handleAcceptRequest = (
        exchangeData,
    ) => {
        setExchangeRequests(
            (
                currentRequests,
            ) =>
                currentRequests.map(
                    (request) =>
                        request.id ===
                        exchangeData.requestId
                            ? {
                                  ...request,
                                  status:
                                      "accepted",
                                  isRead: true,

                                  responseCardId:
                                      exchangeData.responseCardId,
                              }
                            : request,
                ),
        );

        setSelectedRequest(
            null,
        );

        console.log(
            "카드 교환 완료:",
            exchangeData,
        );

        window.alert(
            "카드 교환이 완료되었습니다.",
        );
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
    );
};

export default Header;