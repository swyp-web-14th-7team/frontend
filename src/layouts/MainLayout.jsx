    import {
    Outlet,
    useLocation,
    } from "react-router-dom";

    import Header from "../components/common/Header";

    import styles from "./MainLayout.module.css";

    const MainLayout = () => {
    const location = useLocation();

    const shouldHideMobileHeader =
        location.pathname === "/explore" ||
        location.pathname === "/scrap";

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
        </>
    );
    };

    export default MainLayout;