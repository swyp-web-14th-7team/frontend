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

                    <div className={styles.rightMenu}>
                        <button
                            type="button"
                            className={styles.iconButton}
                            aria-label="알림"
                        >
                            <span
                                className={
                                    styles.notificationDot
                                }
                            />

                            <img
                                src={bellIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </button>

                        <NavLink
                            to="/saved"
                            className={styles.iconButton}
                            aria-label="보관함"
                        >
                            <img
                                src={scrapIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </NavLink>
                    </div>
                </>
            )}
        </header>
    );
};

export default MobileExploreHeader;