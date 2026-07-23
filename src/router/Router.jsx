import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import AuthCallback from "../pages/Auth/AuthCallback";
import Onboarding from "../pages/Onboarding/Onboarding";
import Explore from "../pages/Explore/Explore";
import ProfileCarouselPage from "../pages/ProfileCarousel/ProfileCarouselPage";
import Mypage from "../pages/MyPage/MyPage";
import Exchange from "../pages/Exchange/Exchange";
import NotFound from "../pages/NotFound/NotFound";
import Scrap from "../pages/Scrap/Scrap";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/auth/google/callback"
                    element={<AuthCallback provider="google" />}
                />

                <Route
                    path="/auth/kakao/callback"
                    element={<AuthCallback provider="kakao" />}
                />

                <Route
                    path="/auth/naver/callback"
                    element={<AuthCallback provider="naver" />}
                />

                {/* 온보딩 */}
                <Route
                    path="/onboarding"
                    element={<Onboarding />}
                />

                {/* 헤더와 공통 레이아웃을 사용하는 화면 */}
                <Route element={<MainLayout />}>
                    <Route
                        path="/explore"
                        element={<Explore />}
                    />

                    <Route
                        path="/mypage"
                        element={<Mypage />}
                    />

                    <Route
                        path="/exchange"
                        element={<Exchange />}
                    />

                    <Route
                    path="/scrap"
                    element={<Scrap />}
                    />
                    
                </Route>

                {/* 풀스크린 프로필 슬라이드 */}
                {/* MainLayout 밖에 있기 때문에 헤더가 표시되지 않음 */}
                <Route
                    path="/profile-carousel/:profileId"
                    element={<ProfileCarouselPage />}
                />

                <Route
                    path="*"
                    element={<NotFound />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;