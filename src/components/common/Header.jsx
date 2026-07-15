    import { NavLink, useNavigate } from "react-router-dom";

    import styles from "./Header.module.css";

    import logo from "../../assets/images/nodi-logo-white.svg";

    import exploreNavIcon from "../../assets/icons/icon_explore.svg";
    import libraryNavIcon from "../../assets/icons/icon_library.svg";
    import mypageNavIcon from "../../assets/icons/icon_mypage.svg";

    import scrapIcon from "../../assets/icons/icon_scrap.svg";
    import bellIcon from "../../assets/icons/알림.svg";
    import settingIcon from "../../assets/icons/설정.svg";

    const Header = ({ showNav = false }) => {
    const navigate = useNavigate();

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
            className={({ isActive }) =>
                `${styles.navItem} ${
                isActive ? styles.activeNav : ""
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