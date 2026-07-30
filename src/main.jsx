import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import {
  NotificationProvider,
} from "./contexts/NotificationContext.jsx";

import NotificationToast from "./components/common/NotificationToast/NotificationToast";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root"),
).render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <App />
        <NotificationToast />
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>,
);