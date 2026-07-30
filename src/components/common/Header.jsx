    import { useState } from "react";

    import { NavLink, useLocation, useNavigate } from "react-router-dom";

    import LoginModal from "./LoginModal/LoginModal";
    import NotificationPanel from "./NotificationPanel/NotificationPanel";
    import ReceivedExchangeModal from "../exchange/ReceivedExchangeModal";

    import {
    acceptConnectionRequest,
    rejectConnectionRequest,
    } from "../../api/connectionRequests";

    import { getDefaultProfileCard } from "../../api/profile";

    import useNotifications from "../../hooks/useNotifications";

    import { isLoggedIn } from "../../utils/auth";

    import styles from "./Header.module.css";

    import logo from "../../assets/icons/Logo.svg";

    import exploreNavIcon from "../../assets/icons/icon_explore.svg";
    import libraryNavIcon from "../../assets/icons/icon_library.svg";
    import mypageNavIcon from "../../assets/icons/icon_mypage.svg";

    import scrapIcon from "../../assets/icons/icon_scrap.svg";
    import scrapActiveIcon from "../../assets/icons/icon_scrap_active.svg";
    import bellIcon from "../../assets/icons/알림.svg";
    import settingIcon from "../../assets/icons/설정.svg";

    const Header = ({ showNav = false }) => {
    const navigate = useNavigate();

    const location = useLocation();

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const [selectedRequest, setSelectedRequest] = useState(null);

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const isUserLoggedIn = isLoggedIn();

    const {
        receivedRequests:
        exchangeRequests,
        notifications,
        errorMessage:
        exchangeError,
        hasUnreadNotification,
        markNotificationAsRead,
        markReceivedRequestAsRead,
        removeReceivedRequest,
    } = useNotifications();

    const isExploreActive =
        location.pathname === "/explore" ||
        location.pathname.startsWith("/profile-carousel/") ||
        location.pathname.startsWith("/profile/");

    const isScrapActive = location.pathname === "/scrap";

    const handleLogoClick = () => {
        navigate("/explore");
    };

    const handleLoginClick = () => {
        setIsLoginModalOpen(true);
    };

    /*
    * 비로그인 상태에서 보호 메뉴를 누르면
    * 라우터 이동을 완전히 막고 로그인 모달만 연다.
    */
    const handleProtectedLinkClick = (event) => {
        if (isUserLoggedIn) {
        return;
        }

        event.preventDefault();
        event.stopPropagation();

        setIsLoginModalOpen(true);
    };

    const handleMyProfileClick = async (event) => {
        if (!isUserLoggedIn) {
        return;
        }

        event.preventDefault();

        try {
        const defaultProfile = await getDefaultProfileCard();

        const defaultProfileId =
            defaultProfile?.id ??
            defaultProfile?.profileCardId ??
            defaultProfile?.profileCard?.id ??
            null;

        if (!defaultProfileId) {
            navigate("/onboarding");

            return;
        }

        navigate("/profile");
        } catch (error) {
        if (error?.status === 404) {
            navigate("/onboarding");

            return;
        }

        console.error("기본 카드 확인 실패:", error);

        /*
        * 일시적인 API 오류로 프로필 접근이
        * 완전히 막히는 것을 방지합니다.
        */
        navigate("/profile");
        }
    };

    const handleNotificationToggle = () => {
        setIsNotificationOpen((previous) => !previous);
    };

    const handleResultNotificationClick = (notification) => {
        void markNotificationAsRead(
        notification.id,
        ).catch((error) => {
        console.error("알림 읽음 처리 실패:", error);
        });

        setIsNotificationOpen(false);

        if (notification.type === 1) {
        const connectionId =
            notification.payload
            ?.connectionId;

        navigate(
            connectionId
            ? `/saved/${encodeURIComponent(connectionId)}`
            : "/saved",
        );

        return;
        }

        if (notification.type === 2) {
        navigate("/settings/requests");

        return;
        }

        if (notification.type === 3) {
        const requestId =
            notification.payload?.requestId;

        const request =
            exchangeRequests.find(
            (item) =>
                String(item.id) ===
                String(requestId),
            );

        if (request) {
            markReceivedRequestAsRead(
            request.id,
            );

            setSelectedRequest({
            ...request,
            isRead: true,
            });

            return;
        }

        navigate("/settings/requests");

        return;
        }

        navigate("/settings");
    };

    const handleRejectRequest = async (requestId) => {
        try {
        await rejectConnectionRequest(requestId);

        removeReceivedRequest(
            requestId,
        );

        setSelectedRequest(null);

        window.alert("카드 교환 요청을 거절했습니다.");
        } catch (error) {
        console.error("교환 요청 거절 실패:", error);

        window.alert(error.message || "교환 요청을 거절하지 못했습니다.");
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
        await acceptConnectionRequest(requestId);

        removeReceivedRequest(
            requestId,
        );

        setSelectedRequest(null);

        window.alert("카드 교환이 완료되었습니다.");
        } catch (error) {
        console.error("교환 요청 수락 실패:", error);

        window.alert(error.message || "교환 요청을 수락하지 못했습니다.");
        }
    };

    return (
        <>
        <header className={styles.header}>
            <button
            type="button"
            className={styles.logoButton}
            onClick={handleLogoClick}
            aria-label="Nodi 홈으로 이동"
            >
            <img src={logo} alt="Nodi" className={styles.logo} />
            </button>

            {showNav && (
            <nav className={styles.nav}>
                <NavLink
                to="/profile"
                end
                onClick={handleMyProfileClick}
                onClickCapture={handleProtectedLinkClick}
                aria-disabled={!isUserLoggedIn}
                className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.activeNav : ""}`
                }
                >
                <img src={mypageNavIcon} alt="" className={styles.navIcon} />

                <span>내 프로필</span>
                </NavLink>

                <NavLink
                to="/explore"
                className={() =>
                    `${styles.navItem} ${isExploreActive ? styles.activeNav : ""}`
                }
                >
                <img src={exploreNavIcon} alt="" className={styles.navIcon} />

                <span>탐색</span>
                </NavLink>

                <NavLink
                to="/saved"
                onClickCapture={handleProtectedLinkClick}
                aria-disabled={!isUserLoggedIn}
                className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.activeNav : ""}`
                }
                >
                <img src={libraryNavIcon} alt="" className={styles.navIcon} />

                <span>보관함</span>
                </NavLink>
            </nav>
            )}

            {isUserLoggedIn ? (
            <nav className={styles.rightMenu}>
                <NavLink
                to="/scrap"
                className={styles.iconButton}
                aria-label="스크랩"
                >
                <img
                    src={isScrapActive ? scrapActiveIcon : scrapIcon}
                    alt=""
                    className={styles.icon}
                />
                </NavLink>

                <div className={styles.notificationWrapper}>
                <button
                    type="button"
                    className={styles.iconButton}
                    onClick={handleNotificationToggle}
                    aria-label="알림"
                    aria-expanded={isNotificationOpen}
                >
                    {hasUnreadNotification && (
                    <span className={styles.notificationDot} />
                    )}

                    <img src={bellIcon} alt="" className={styles.icon} />
                </button>

                {isNotificationOpen && (
                    <NotificationPanel
                    notifications={notifications}
                    errorMessage={exchangeError}
                    onNotificationClick={handleResultNotificationClick}
                    onClose={() => setIsNotificationOpen(false)}
                    />
                )}
                </div>

                <button
                type="button"
                className={styles.iconButton}
                onClick={() => navigate("/settings")}
                aria-label="설정"
                >
                <img src={settingIcon} alt="" className={styles.icon} />
                </button>
            </nav>
            ) : (
            <button
                type="button"
                className={styles.loginButton}
                onClick={handleLoginClick}
            >
                로그인하기
            </button>
            )}
        </header>

        <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
        />

        {isUserLoggedIn && selectedRequest && (
            <ReceivedExchangeModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onReject={handleRejectRequest}
            onAccept={handleAcceptRequest}
            />
        )}
        </>
    );
    };

    export default Header;
