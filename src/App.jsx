<<<<<<< HEAD
<<<<<<< Updated upstream
import { Navigate, Route, Routes } from "react-router-dom";
=======
    import {
    Navigate,
    Route,
    Routes,
    } from "react-router-dom";
>>>>>>> Stashed changes
=======
import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";
>>>>>>> origin/develop

    import MainLayout from "./layouts/MainLayout";

<<<<<<< HEAD
<<<<<<< Updated upstream
=======
import AuthCallback from "./pages/Auth/AuthCallback";
>>>>>>> origin/develop
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
=======
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

    import {
    isLoggedIn,
    } from "./utils/auth";

    const ProtectedRoute = ({
    children,
    }) => {
    if (!isLoggedIn()) {
        return (
        <Navigate
            to="/explore"
            replace
        />
        );
    }

    return children;
    };

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

        <Route
            path="/auth/google/callback"
            element={
            <AuthCallback provider="google" />
            }
        />

        <Route
            path="/auth/kakao/callback"
            element={
            <AuthCallback provider="kakao" />
            }
        />

        <Route
            path="/auth/naver/callback"
            element={
            <AuthCallback provider="naver" />
            }
        />

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
                <ProtectedRoute>
                <Scrap />
                </ProtectedRoute>
            }
            />

            <Route
            path="/saved"
            element={
                <ProtectedRoute>
                <Saved />
                </ProtectedRoute>
            }
            />

            <Route
            path="/profile"
            element={
                <ProtectedRoute>
                <MyPage />
                </ProtectedRoute>
            }
            />

            <Route
            path="/settings"
            element={
                <ProtectedRoute>
                <Settings />
                </ProtectedRoute>
            }
            />

            <Route
            path="/settings/:section"
            element={
                <ProtectedRoute>
                <Settings />
                </ProtectedRoute>
            }
            />

            <Route
            path="/profile/:profileId"
            element={
                <ProfileDetail />
            }
            />
        </Route>

        <Route
            path="/profile-carousel/:profileId"
            element={
            <ProfileCarouselPage />
            }
        />

        <Route
            path="/my-profile/:profileId"
            element={
            <ProtectedRoute>
                <MyProfileDetail />
            </ProtectedRoute>
            }
        />

        <Route
            path="/onboarding"
            element={
            <ProtectedRoute>
                <Onboarding />
            </ProtectedRoute>
            }
        />

        <Route
            path="/my-profile/:profileId/detail-edit"
            element={
            <ProtectedRoute>
                <ProfileDetailEdit />
            </ProtectedRoute>
            }
        />
        </Routes>
    );
    }
>>>>>>> Stashed changes

    export default App;