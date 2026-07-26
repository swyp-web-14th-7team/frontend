import {
    useLayoutEffect,
} from "react";

import {
    Outlet,
    useLocation,
} from "react-router-dom";

import Header from "../components/common/Header";
import BottomNavigation from "../components/common/BottomNavigation/BottomNavigation";

import styles from "./MainLayout.module.css";

const ScrollToTop = () => {
    const location =
        useLocation();

    useLayoutEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });

        // 브라우저별 스크롤 컨테이너 대응
        document.documentElement.scrollTop =
            0;

        document.body.scrollTop =
            0;
    }, [
        location.pathname,
    ]);

    return null;
};

const MainLayout = () => {
    const location =
        useLocation();

    /*
     * 탐색 화면은 페이지 내부에
     * 별도의 모바일 헤더가 있으므로
     * 공통 헤더를 모바일에서 숨깁니다.
     */
    const shouldHideMobileHeader =
        location.pathname ===
        "/explore";

    return (
        <>
            <ScrollToTop />

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

            <BottomNavigation />
        </>
    );
};

export default MainLayout;