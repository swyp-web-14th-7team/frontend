    import { NavLink } from "react-router-dom";

    import styles from "./Header.module.css";

    import logo from "../../assets/images/nodi-logo-white.svg";
    import bookmarkIcon from "../../assets/icons/북마크.svg";
    import bellIcon from "../../assets/icons/알림.svg";
    import settingIcon from "../../assets/icons/설정.svg";

    const Header = ({ showNav = false }) => {
    return (
        <header className={styles.header}>
        <NavLink to="/explore" className={styles.logoLink}>
            <img
            src={logo}
            alt="Nodi"
            className={styles.logo}
            />
        </NavLink>

        {showNav && (
            <nav className={styles.nav}>
            <NavLink
                to="/explore"
                className={({ isActive }) =>
                `${styles.navItem} ${
                    isActive ? styles.activeNav : ""
                }`
                }
            >
                탐색
            </NavLink>

            <NavLink
                to="/profile"
                className={({ isActive }) =>
                `${styles.navItem} ${
                    isActive ? styles.activeNav : ""
                }`
                }
            >
                내 프로필
            </NavLink>

            <NavLink
                to="/saved"
                className={({ isActive }) =>
                `${styles.navItem} ${
                    isActive ? styles.activeNav : ""
                }`
                }
            >
                보관함
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
                src={bookmarkIcon}
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