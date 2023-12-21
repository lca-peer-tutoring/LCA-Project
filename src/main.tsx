import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { NextUIProvider } from "@nextui-org/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import LoginPage from "./pages/LoginPage.tsx";
import HelpPage from "./pages/HelpPage.tsx";
import CalendarPage from "./pages/CalendarPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "help",
    element: <HelpPage />,
  },
  {
    path: "calendar",
    element: <CalendarPage />,
  },
  {
    path: "settings",
    element: <SettingsPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NextUIProvider>
      <RouterProvider router={router} />
    </NextUIProvider>
  </React.StrictMode>
);
