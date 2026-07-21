import { createBrowserRouter, Navigate } from "react-router";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import DashboardPage from "../pages/DashboardPage";

const router = createBrowserRouter([
  // ── Auth pages (no layout, no protection) ─────────────────
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },

  // ── Protected pages (inside MainLayout) ────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          // Root → redirect to dashboard
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: "dashboard", element: <DashboardPage /> },
          { path: "calendar", element: <h1 className="text-2xl font-bold">Calendar</h1> },
          { path: "e-commerce", element: <h1 className="text-2xl font-bold">E-commerce</h1> },
          { path: "documentation", element: <h1 className="text-2xl font-bold">Documentation</h1> },
          { path: "pie-charts", element: <h1 className="text-2xl font-bold">Pie Charts</h1> },
          { path: "line-charts", element: <h1 className="text-2xl font-bold">Line Charts</h1> },
        ],
      },
    ],
  },
]);

export default router;