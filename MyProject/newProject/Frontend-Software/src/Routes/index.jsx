import { createBrowserRouter } from "react-router";
import App from "../App";
import LoginPage from "../pages/auth/LoginPage";
import ErrorPage from "../pages/error/ErrorPage";
import SignupPage from "../pages/auth/SignupPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import ProtectedRouteComponent from "../components/ProtectedRoute/ProtectedRouteComponent";
import DashboardPage from "../pages/DashboardPage";
import AboutPage from "../pages/AboutPage";


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
    element: <h1>Home page</h1>,
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
            element: <DashboardPage/>,
          },
          {
            path: "about",
            element: <AboutPage/>,
          },
          {
            path: "travel",
            element: <div>Travel page for testing</div>,
          },
        ]
      }
    ]
  },
])

export default router;