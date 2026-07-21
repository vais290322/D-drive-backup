import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";

import Plans from "../pages/Plans";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
// import Courses from "../pages/Courses";
import Payments from "../pages/Payments";
import AddPlans from "../pages/AddPlans";
import AddStudent from "../pages/AddStudent";
import AddCourse from "../pages/AddCourse";
import EditStudent from "../pages/EditStudent";
import StudentPayment from "../pages/StudentPayment";
import AddPayment from "../pages/AddPayment";
import Cheque from "../pages/Cheque";
import Resetpassword from "../pages/Resetpassword";
import AddSession from "../pages/Session";
import Receipt from "../pages/Receipt";
import ManageCourseSetup from "../pages/Course";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/reset-password/:id",
    element: <Resetpassword />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "students", element: <Students /> },
      { path: "courses", element: <ManageCourseSetup /> },
      { path: "plans", element: <Plans /> },
      { path: "sessions", element: <AddSession /> },
            { path: "receipts", element: <Receipt /> },
      { path: "payments", element: <Payments /> },
      {
        path: "add-plans",
        element: <AddPlans />,
      },
      {
        path: "add-student",
        element: <AddStudent />,
      },
      {
        path: "/edit-student/:id",
        element: <EditStudent />,
      },
      {
        path: "/payment-student/:id",
        element: <StudentPayment />,
      },
      {
        path: "/add-payment/:id",
        element: <AddPayment />,
      },
      {
        path: "/add-payment",
        element: <AddPayment />,
      },
      {
        path: "/payments",
        element: <Payments />,
      },
      {
        path: "/cheque",
        element: <Cheque />,
      },
      {
        path: "/view-cheque/:id",
        element: <Cheque />,
      },
      {
        path: "add-course",
        element: <AddCourse />,
      },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}