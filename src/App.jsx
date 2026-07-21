import {
    useState,
} from "react";

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

import profiles from "./mocks/profiles";

const INITIAL_SCRAP_DRAWERS = [
    {
        id: 1,
        name: "보류함 2",
        profiles: profiles.slice(
            0,
            8,
        ),
    },
    {
        id: 2,
        name: "팀원후보",
        profiles: profiles.slice(
            8,
            16,
        ),
    },
];

function App() {
    const [
        scrapDrawers,
        setScrapDrawers,
    ] = useState(
        INITIAL_SCRAP_DRAWERS,
    );

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

            {/*
             * 소셜 로그인 콜백
             */}
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

            {/*
             * 공통 헤더와 레이아웃을
             * 사용하는 화면
             */}
            <Route
                element={
                    <MainLayout />
                }
            >
                <Route
                    path="/explore"
                    element={
                        <Explore />
                    }
                />

                <Route
                    path="/scrap"
                    element={
                        <Scrap
                            drawers={
                                scrapDrawers
                            }
                            setDrawers={
                                setScrapDrawers
                            }
                        />
                    }
                />

                <Route
                    path="/saved"
                    element={
                        <Saved />
                    }
                />

                {/*
                 * 내 프로필 카드 목록
                 */}
                <Route
                    path="/profile"
                    element={
                        <MyPage />
                    }
                />

                <Route
                    path="/settings"
                    element={<Settings />}
                />

                <Route
                    path="/settings/:section"
                    element={<Settings />}
                />

                {/*
                 * 프로필 카드 상세
                 */}
                <Route
                    path="/profile/:profileId"
                    element={
                        <ProfileDetail
                            drawers={
                                scrapDrawers
                            }
                            setDrawers={
                                setScrapDrawers
                            }
                        />
                    }
                />
            </Route>

            {/*
             * 프로필 캐러셀은
             * 공통 레이아웃을 사용하지 않음
             */}
            <Route
                path="/profile-carousel/:profileId"
                element={
                    <ProfileCarouselPage
                        drawers={
                            scrapDrawers
                        }
                        setDrawers={
                            setScrapDrawers
                        }
                    />
                }
            />

            <Route
                path="/my-profile/:profileId"
                element={
                    <MyProfileDetail />
                }
            />

            {/*
             * 온보딩은 공통 헤더를
             * 사용하지 않음
             */}
            <Route
                path="/onboarding"
                element={
                    <Onboarding />
                }
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