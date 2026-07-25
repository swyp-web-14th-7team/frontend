import {
    Outlet,
    useLocation,
} from "react-router-dom";

import Header from "../components/common/Header";
import BottomNavigation from "../components/common/BottomNavigation/BottomNavigation";

import styles from "./MainLayout.module.css";

const MainLayout = () => {
    const location = useLocation();

    /*
     * 탐색 화면은 페이지 내부에
     * 별도의 모바일 헤더가 있으므로
     * 공통 헤더를 모바일에서 숨긴다.
     *
     * 보관함(/saved)은 공통 Header를 표시한다.
     */
    const shouldHideMobileHeader =
        location.pathname === "/explore";

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

            <BottomNavigation />
        </>
    );
};

export default MainLayout;