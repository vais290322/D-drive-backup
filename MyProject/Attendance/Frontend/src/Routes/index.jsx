import { createBrowserRouter } from "react-router";
import App from "../App";
import LoginPage from "../pages/auth/LoginPage";
import ErrorPage from "../pages/error/ErrorPage";
import SignupPage from "../pages/auth/SignupPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import ProtectedRouteComponent from "../components/ProtectedRoute/ProtectedRouteComponent";
import PublicRouteComponent from "../components/PublicRoute/PublicRouteComponent";
import DashboardPage from "../pages/DashboardPage";
import AboutPage from "../pages/AboutPage";
import StudentsPage from "../pages/StudentsPage";
import ReportsPage from "../pages/ReportsPage";

const router = createBrowserRouter([
  {
    path: "*",
    element: <ErrorPage/>
  },
  {
    path: "login",
    element: <PublicRouteComponent><LoginPage /></PublicRouteComponent>,
  },
  {
    path: "signup",
    element: <PublicRouteComponent><SignupPage /></PublicRouteComponent>,
  },
  {
    path: "forgot-password",
    element: <PublicRouteComponent><ForgotPasswordPage /></PublicRouteComponent>,
  },
  {
    path: "reset-password/:token",
    element: <PublicRouteComponent><ResetPasswordPage /></PublicRouteComponent>,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <ProtectedRouteComponent />,
        children: [
          {
            path: "",
            element: <DashboardPage/>,
          },
          {
            path: "about",
            element: <AboutPage/>, 
          },
          {
            path: "students",
            element: <StudentsPage/>,
          },
          {
            path: "reports",
            element: <ReportsPage/>,
          },
        ]
      }
    ]
  },
])

export default router;