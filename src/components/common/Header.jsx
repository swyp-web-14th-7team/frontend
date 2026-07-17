    import {
    NavLink,
    useNavigate,
    useLocation,
    } from "react-router-dom";

    import styles from "./Header.module.css";

    import logo from "../../assets/icons/Logo.svg";

    import exploreNavIcon from "../../assets/icons/icon_explore.svg";
    import libraryNavIcon from "../../assets/icons/icon_library.svg";
    import mypageNavIcon from "../../assets/icons/icon_mypage.svg";

    import scrapIcon from "../../assets/icons/icon_scrap.svg";
    import bellIcon from "../../assets/icons/알림.svg";
    import settingIcon from "../../assets/icons/설정.svg";

    const Header = ({ showNav = false }) => {
    const navigate = useNavigate();
    const location = useLocation();

    /*
    * 탐색 페이지와
    * 프로필 캐러셀 상세페이지 모두
    * 탐색 메뉴 활성화
    */
    const isExploreActive =
        location.pathname === "/explore" ||
        location.pathname.startsWith("/profile-carousel/");

    const handleLogoClick = () => {
        navigate("/explore");
        window.location.reload();
    };

    return (
        <header className={styles.header}>
        <button
            type="button"
            className={styles.logoButton}
            onClick={handleLogoClick}
            aria-label="Nodi 홈으로 이동"
        >
            <img
            src={logo}
            alt="Nodi"
            className={styles.logo}
            />
        </button>

        {showNav && (
            <nav className={styles.nav}>
            <NavLink
                to="/profile"
                className={({ isActive }) =>
                `${styles.navItem} ${
                    isActive ? styles.activeNav : ""
                }`
                }
            >
                <img
                src={mypageNavIcon}
                alt=""
                className={styles.navIcon}
                />
                <span>내 프로필</span>
            </NavLink>

            <NavLink
                to="/explore"
                className={() =>
                `${styles.navItem} ${
                    isExploreActive ? styles.activeNav : ""
                }`
                }
            >
                <img
                src={exploreNavIcon}
                alt=""
                className={styles.navIcon}
                />
                <span>탐색</span>
            </NavLink>

            <NavLink
                to="/saved"
                className={({ isActive }) =>
                `${styles.navItem} ${
                    isActive ? styles.activeNav : ""
                }`
                }
            >
                <img
                src={libraryNavIcon}
                alt=""
                className={styles.navIcon}
                />
                <span>보관함</span>
            </NavLink>
            </nav>
        )}

        <nav className={styles.rightMenu}>
            <button
            type="button"
            className={styles.iconButton}
            aria-label="찜"
            >
            <img
                src={scrapIcon}
                alt=""
                className={styles.icon}
            />
            </button>

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
    );
    };

    export default Header;