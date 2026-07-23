    import {
    useState,
    } from "react";

    import {
    NavLink,
    } from "react-router-dom";

    import LoginModal from "../LoginModal/LoginModal";

    import {
    isLoggedIn,
    } from "../../../utils/auth";

    import styles from "./BottomNavigation.module.css";

    import mypageIcon from "../../../assets/icons/icon_mypage.svg";
    import exploreIcon from "../../../assets/icons/icon_explore.svg";
    import libraryIcon from "../../../assets/icons/icon_library.svg";

    const NAV_ITEMS = [
    {
        path: "/profile",
        label: "내 프로필",
        icon: mypageIcon,
        requiresLogin: true,
    },
    {
        path: "/explore",
        label: "탐색",
        icon: exploreIcon,
        requiresLogin: false,
    },
    {
        path: "/saved",
        label: "보관함",
        icon: libraryIcon,
        requiresLogin: true,
    },
    ];

    const BottomNavigation =
    () => {
        const [
        isLoginModalOpen,
        setIsLoginModalOpen,
        ] = useState(false);

        const isUserLoggedIn =
        isLoggedIn();

        /*
        * 비로그인 상태에서 보호 메뉴를 누르면
        * 페이지 이동 없이 로그인 모달만 연다.
        */
        const handleNavClick = (
        event,
        item,
        ) => {
        if (
            !item.requiresLogin ||
            isUserLoggedIn
        ) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        setIsLoginModalOpen(
            true,
        );
        };

        return (
        <>
            <nav
            className={
                styles.navigation
            }
            aria-label="모바일 주요 메뉴"
            >
            {NAV_ITEMS.map(
                (item) => (
                <NavLink
                    key={
                    item.path
                    }
                    to={item.path}
                    onClickCapture={(
                    event,
                    ) =>
                    handleNavClick(
                        event,
                        item,
                    )
                    }
                    aria-disabled={
                    item.requiresLogin &&
                    !isUserLoggedIn
                    }
                    className={({
                    isActive,
                    }) =>
                    `${
                        styles.navItem
                    } ${
                        isActive
                        ? styles.activeNavItem
                        : ""
                    }`
                    }
                >
                    <img
                    src={
                        item.icon
                    }
                    alt=""
                    className={
                        styles.navIcon
                    }
                    />

                    <span
                    className={
                        styles.navLabel
                    }
                    >
                    {item.label}
                    </span>
                </NavLink>
                ),
            )}

            <div
                className={
                styles.homeIndicator
                }
                aria-hidden="true"
            />
            </nav>

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
        </>
        );
    };

    export default BottomNavigation;