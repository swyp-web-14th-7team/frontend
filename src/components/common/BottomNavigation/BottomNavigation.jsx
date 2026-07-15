    import { NavLink } from "react-router-dom";

    import styles from "./BottomNavigation.module.css";

    import mypageIcon from "../../../assets/icons/icon_mypage.svg";
    import exploreIcon from "../../../assets/icons/icon_explore.svg";
    import libraryIcon from "../../../assets/icons/icon_library.svg";

    const NAV_ITEMS = [
    {
        path: "/profile",
        label: "내 프로필",
        icon: mypageIcon,
    },
    {
        path: "/explore",
        label: "탐색",
        icon: exploreIcon,
    },
    {
        path: "/saved",
        label: "보관함",
        icon: libraryIcon,
    },
    ];

    const BottomNavigation = () => {
    return (
        <nav
        className={styles.navigation}
        aria-label="모바일 주요 메뉴"
        >
        {NAV_ITEMS.map((item) => (
            <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
                `${styles.navItem} ${
                isActive ? styles.activeNavItem : ""
                }`
            }
            >
            <img
                src={item.icon}
                alt=""
                className={styles.navIcon}
            />

            <span className={styles.navLabel}>
                {item.label}
            </span>
            </NavLink>
        ))}

        <div
            className={styles.homeIndicator}
            aria-hidden="true"
        />
        </nav>
    );
    };

    export default BottomNavigation;