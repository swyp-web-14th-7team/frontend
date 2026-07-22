import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import AuthCallback from "./pages/Auth/AuthCallback";
import Explore from "./pages/Explore/Explore";
import MyPage from "./pages/MyPage/MyPage";
import Onboarding from "./pages/Onboarding/Onboarding";
import ProfileCarouselPage from "./pages/ProfileCarousel/ProfileCarouselPage";
import ProfileDetail from "./pages/Profile/ProfileDetail";
import ProfileDetailEdit from "./pages/ProfileDetailEdit/ProfileDetailEdit";
import MyProfileDetail from "./pages/MyProfileDetail/MyProfileDetail";
import Scrap from "./pages/Scrap/Scrap";
import Saved from "./pages/Saved/Saved";
import Settings from "./pages/Settings/Settings";

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Navigate
                        to="/explore"
                        replace
                    />
                }
            />

            {/* 소셜 로그인 콜백 */}

            <Route
                path="/auth/google/callback"
                element={
                    <AuthCallback
                        provider="google"
                    />
                }
            />

            <Route
                path="/auth/kakao/callback"
                element={
                    <AuthCallback
                        provider="kakao"
                    />
                }
            />

            <Route
                path="/auth/naver/callback"
                element={
                    <AuthCallback
                        provider="naver"
                    />
                }
            />

            {/* 공통 헤더와 레이아웃을 사용하는 화면 */}

            <Route
                element={<MainLayout />}
            >
                <Route
                    path="/explore"
                    element={<Explore />}
                />

                <Route
                    path="/scrap"
                    element={<Scrap />}
                />

                <Route
                    path="/saved"
                    element={<Saved />}
                />

                <Route
                    path="/profile"
                    element={<MyPage />}
                />

                <Route
                    path="/settings"
                    element={<Settings />}
                />

                <Route
                    path="/settings/:section"
                    element={<Settings />}
                />

                <Route
                    path="/profile/:profileId"
                    element={
                        <ProfileDetail />
                    }
                />
            </Route>

            {/* 공통 레이아웃을 사용하지 않는 화면 */}

            <Route
                path="/profile-carousel/:profileId"
                element={
                    <ProfileCarouselPage />
                }
            />

            <Route
                path="/my-profile/:profileId"
                element={
                    <MyProfileDetail />
                }
            />

            <Route
                path="/onboarding"
                element={<Onboarding />}
            />

            <Route
                path="/my-profile/:profileId/detail-edit"
                element={
                    <ProfileDetailEdit />
                }
            />
        </Routes>
    );
}

export default App;