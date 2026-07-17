import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthCallback from "../pages/Auth/AuthCallback";
import Login from "../pages/Login/Login";
import Onboarding from "../pages/Onboarding/Onboarding";
import Explore from "../pages/Explore/Explore";
import ProfileCarouselPage from "../pages/ProfileCarousel/ProfileCarouselPage";
import Mypage from "../pages/MyPage/MyPage";
import Exchange from "../pages/Exchange/Exchange";
import NotFound from "../pages/NotFound/NotFound";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

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

                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/explore" element={<Explore />} />

                <Route
                    path="/profile-carousel/:profileId"
                    element={<ProfileCarouselPage />}
                />

                <Route path="/mypage" element={<Mypage />} />
                <Route path="/exchange" element={<Exchange />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;