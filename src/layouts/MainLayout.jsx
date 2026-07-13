    import { Outlet } from "react-router-dom";

    import Header from "../components/common/Header";

    const MainLayout = () => {
    return (
        <>
        <Header showNav />

        <Outlet />
        </>
    );
    };

    export default MainLayout;