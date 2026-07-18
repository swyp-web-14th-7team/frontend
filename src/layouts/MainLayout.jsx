import { Outlet, useLocation } from "react-router-dom";

import Header from "../components/common/Header";

import styles from "./MainLayout.module.css";

const MainLayout = () => {
    const location = useLocation();

    const isExplorePage =
        location.pathname === "/explore";

    return (
        <>
            <div
                className={
                    isExplorePage
                        ? styles.exploreDesktopHeader
                        : styles.desktopHeader
                }
            >
                <Header showNav />
            </div>

            <Outlet />
        </>
    );
};

export default MainLayout;