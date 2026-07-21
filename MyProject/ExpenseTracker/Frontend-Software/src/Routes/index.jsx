import { createBrowserRouter, Navigate } from "react-router";
import App from "../App";
import LoginPage from "../pages/auth/LoginPage";
import ErrorPage from "../pages/error/ErrorPage";
import SignupPage from "../pages/auth/SignupPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import ProtectedRouteComponent from "../components/ProtectedRoute/ProtectedRouteComponent";
import DashboardPage from "../pages/DashboardPage";
import ReportPage from "../pages/ReportPage";
import SettingsPage from "../pages/SettingsPage";

const router = createBrowserRouter([
  {
    path: "*",
    element: <ErrorPage/>
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Navigate to="/admin" replace />,
  },
  {
    path: "signup",
    element: <SignupPage />,
  },
  {
    path: "forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "reset-password/:token",
    element: <ResetPasswordPage />,
  },
  {
    path: "/admin",
    element: <App />,
    children: [
      {
        element: <ProtectedRouteComponent />,
        children: [
          {
            path: "",
            element: <DashboardPage/>, // Expense Management
          },
          {
            path: "report",
            element: <ReportPage/>,
          },
          {
            path: "settings",
            element: <SettingsPage/>,
          },
        ]
      }
    ]
  },
])

export default router;