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
import ProfileDetail from "./pages/Profile/ProfileDetail";
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

        <Route
          path="/profile/:profileId"
          element={
            <ProfileDetail
              drawers={scrapDrawers}
              setDrawers={setScrapDrawers}
            />
          }
        />
      </Route>

      <Route
        path="/profile-carousel/:profileId"
        element={
          <ProfileCarouselPage
            drawers={scrapDrawers}
            setDrawers={setScrapDrawers}
          />
        }
      />

      <Route
        path="/onboarding"
        element={<Onboarding />}
      />
    </Routes>
  );
}

export default App;