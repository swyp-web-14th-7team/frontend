import { useState } from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Explore from "./pages/Explore/Explore";
import Onboarding from "./pages/Onboarding/Onboarding";
import ProfileCarouselPage from "./pages/ProfileCarousel/ProfileCarouselPage";
import Scrap from "./pages/Scrap/Scrap";

import profiles from "./mocks/profiles";

const INITIAL_SCRAP_DRAWERS = [
  {
    id: 1,
    name: "보류함 2",
    profiles: profiles.slice(0, 8),
  },
  {
    id: 2,
    name: "팀원후보",
    profiles: profiles.slice(8, 16),
  },
];

function App() {
  const [scrapDrawers, setScrapDrawers] =
    useState(INITIAL_SCRAP_DRAWERS);

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

      {/* 공통 헤더를 사용하는 화면 */}
      <Route element={<MainLayout />}>
        <Route
          path="/explore"
          element={<Explore />}
        />

        <Route
          path="/scrap"
          element={
            <Scrap
              drawers={scrapDrawers}
              setDrawers={setScrapDrawers}
            />
          }
        />
      </Route>

      {/* 헤더 없이 전체 화면으로 사용하는 캐러셀 */}
      <Route
        path="/profile-carousel/:profileId"
        element={
          <ProfileCarouselPage
            drawers={scrapDrawers}
            setDrawers={setScrapDrawers}
          />
        }
      />

      {/* 온보딩 */}
      <Route
        path="/onboarding"
        element={<Onboarding />}
      />
    </Routes>
  );
}

export default App;