    import { NavLink } from "react-router-dom";

    import styles from "./MobileExploreHeader.module.css";

    import logo from "../../assets/icons/Logo.svg";
    import bellIcon from "../../assets/icons/알림.svg";
    import scrapIcon from "../../assets/icons/icon_scrap.svg";
    import backIcon from "../../assets/icons/icon_back.svg";

    const MobileExploreHeader = ({
    isSearchOpen = false,
    onSearchClose,
    onLogoClick,
    }) => {
    const handleLogoClick = (event) => {
        event.preventDefault();
        onLogoClick?.();
    };

    return (
        <header className={styles.header}>
        {isSearchOpen ? (
            <button
            type="button"
            className={styles.backButton}
            onClick={onSearchClose}
            aria-label="검색 닫기"
            >
            <img
                src={backIcon}
                alt=""
                className={styles.backIcon}
            />
            </button>
        ) : (
            <>
            <NavLink
                to="/explore"
                className={styles.logoLink}
                aria-label="Nodi 탐색 초기화"
                onClick={handleLogoClick}
            >
                <img
                src={logo}
                alt="Nodi"
                className={styles.logo}
                />
            </NavLink>

            <nav
                className={styles.rightMenu}
                aria-label="모바일 보조 메뉴"
            >
                <button
                type="button"
                className={styles.iconButton}
                aria-label="알림"
                >
                <span
                    className={
                    styles.notificationDot
                    }
                    aria-hidden="true"
                />

                <img
                    src={bellIcon}
                    alt=""
                    className={styles.icon}
                />
                </button>

                <NavLink
                to="/scrap"
                className={styles.iconButton}
                aria-label="스크랩"
                >
                <img
                    src={scrapIcon}
                    alt=""
                    className={styles.icon}
                />
                </NavLink>
            </nav>
            </>
        )}
        </header>
    );
    };

    export default MobileExploreHeader;