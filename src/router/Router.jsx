import {BrowserRouter, Routes, Route} from "react-router-dom";

import Login from "../pages/Login/Login";
import GoogleCallback from "../pages/Auth/GoogleCallback";
import KakaoCallback from "../pages/Auth/KakaoCallback";
import NaverCallback from "../pages/Auth/NaverCallback";
import Onboarding from "../pages/Onboarding/Onboarding";
import Explore from "../pages/Explore/Explore";
import Mypage from "../pages/MyPage/MyPage";
import Exchange from "../pages/Exchange/Exchange";
import NotFound from "../pages/NotFound/NotFound";

function Router() {
    return (
        <BrowserRouter>
        <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
        <Route path="/auth/naver/callback" element={<NaverCallback />} />

        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/exchange" element={<Exchange />} />

        <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
    );
}

export default Router;