    import { Navigate, Route, Routes } from "react-router-dom";

    import MainLayout from "./layouts/MainLayout";

    import AuthCallback from "./pages/Auth/AuthCallback";
    import Explore from "./pages/Explore/Explore";
    import MyPage from "./pages/MyPage/MyPage";
    import MyProfileDetail from "./pages/MyProfileDetail/MyProfileDetail";
    import Onboarding from "./pages/Onboarding/Onboarding";
    import ProfileDetail from "./pages/Profile/ProfileDetail";
    import ProfileCarouselPage from "./pages/ProfileCarousel/ProfileCarouselPage";
    import ProfileDetailEdit from "./pages/ProfileDetailEdit/ProfileDetailEdit";
    import Saved from "./pages/Saved/Saved";
    import Scrap from "./pages/Scrap/Scrap";
    import Settings from "./pages/Settings/Settings";

    import { isLoggedIn } from "./utils/auth";

    const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn()) {
        return <Navigate to="/explore" replace />;
    }

    return children;
    };

    function App() {
    return (
        <Routes>
        <Route path="/" element={<Navigate to="/explore" replace />} />

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

        <Route element={<MainLayout />}>
            <Route path="/explore" element={<Explore />} />

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
            path="/saved/:connectionId"
            element={
                <ProtectedRoute>
                <ProfileDetail />
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

            <Route path="/profile/:profileId" element={<ProfileDetail />} />

            {/*
            * 내 세부 프로필도 공통 헤더가 보여야 하므로
            * 반드시 MainLayout 안에 둡니다.
            */}
            <Route
            path="/my-profile/:profileId"
            element={
                <ProtectedRoute>
                <MyProfileDetail />
                </ProtectedRoute>
            }
            />
        </Route>

        <Route
            path="/profile-carousel/:profileId"
            element={<ProfileCarouselPage />}
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

    export default App;
