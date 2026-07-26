import {
    Outlet,
    useLocation,
} from "react-router-dom";

import Header from "../components/common/Header";
import BottomNavigation from "../components/common/BottomNavigation/BottomNavigation";

import styles from "./MainLayout.module.css";

const MainLayout = () => {
    const location = useLocation();

    const isExplorePage =
        location.pathname === "/explore";

    const isProfileCarouselPage =
        location.pathname.startsWith(
            "/profile-carousel/",
        );

    const shouldHideMobileHeader =
        isExplorePage ||
        isProfileCarouselPage;

    /*
     * 탐색 화면은 자체 하단 내비게이션을 사용하고,
     * 캐러셀 화면에서는 하단 내비게이션을 사용하지 않는다.
     */
    const shouldHideLayoutBottomNavigation =
        isExplorePage ||
        isProfileCarouselPage;

    return (
        <>
            <div
                className={
                    shouldHideMobileHeader
                        ? styles.mobileHiddenHeader
                        : styles.desktopHeader
                }
            >
                <Header showNav />
            </div>

            <Outlet />

            {!shouldHideLayoutBottomNavigation && (
                <BottomNavigation />
            )}
        </>
    );
};

export default MainLayout;