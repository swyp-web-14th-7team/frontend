import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Explore from "./pages/Explore/Explore";
import Login from "./pages/Login/Login";
import Onboarding from "./pages/Onboarding/Onboarding";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/explore" replace />}
      />

      <Route element={<MainLayout />}>
        <Route path="/explore" element={<Explore />} />
      </Route>

      <Route path="/login" element={<Login />} />

      <Route
        path="/onboarding"
        element={<Onboarding />}
      />
    </Routes>
  );
}

export default App;