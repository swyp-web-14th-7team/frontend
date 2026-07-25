    import {
    Outlet,
    } from "react-router-dom";

    import Header from "../components/common/Header";

    import styles from "./MainLayout.module.css";

    const MainLayout = () => {
    return (
        <div className={styles.layout}>
        <Header showNav />

        <main className={styles.content}>
            <Outlet />
        </main>
        </div>
    );
    };

    export default MainLayout;