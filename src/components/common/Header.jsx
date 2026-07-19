import {
    NavLink,
    useLocation,
    useNavigate,
} from "react-router-dom";

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

    /*
     * 탐색 메뉴가 활성화되는 화면
     *
     * /explore
     * /profile-carousel/:profileId
     * /profile/:profileId
     *
     * /profile만 있는 경우는 내 프로필 화면이므로
     * 탐색 메뉴에 포함하지 않는다.
     */
    const isExploreActive =
        location.pathname === "/explore" ||
        location.pathname.startsWith(
            "/profile-carousel/",
        ) ||
        location.pathname.startsWith(
            "/profile/",
        );

    const isScrapActive =
        location.pathname === "/scrap";

    const handleLogoClick = () => {
        navigate("/explore");
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
                <nav
                    className={styles.nav}
                    aria-label="주요 메뉴"
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
                            src={mypageNavIcon}
                            alt=""
                            className={
                                styles.navIcon
                            }
                        />

                        <span>내 프로필</span>
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
                            src={exploreNavIcon}
                            alt=""
                            className={
                                styles.navIcon
                            }
                        />

                        <span>탐색</span>
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
                            src={libraryNavIcon}
                            alt=""
                            className={
                                styles.navIcon
                            }
                        />

                        <span>보관함</span>
                    </NavLink>
                </nav>
            )}

            <nav
                className={styles.rightMenu}
                aria-label="사용자 메뉴"
            >
                <NavLink
                    to="/scrap"
                    className={styles.iconButton}
                    aria-label="스크랩"
                >
                    <img
                        src={
                            isScrapActive
                                ? scrapActiveIcon
                                : scrapIcon
                        }
                        alt=""
                        className={styles.icon}
                    />
                </NavLink>

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