    import styles from "./Header.module.css";

    import logo from "../../assets/images/nodi-logo-white.svg";
    import bookmarkIcon from "../../assets/icons/북마크.svg";
    import bellIcon from "../../assets/icons/알림.svg";
    import settingIcon from "../../assets/icons/설정.svg";

    const Header = () => {
    return (
        <header className={styles.header}>
        <img
            src={logo}
            alt="Nodi"
            className={styles.logo}
        />

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