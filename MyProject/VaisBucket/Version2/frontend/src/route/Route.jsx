import React from 'react'
import { createBrowserRouter } from 'react-router'
import App from '../App'
import ForgotPassowrdPage from '../pages/auth/ForgotPassowrdPage'
import LoginPage from '../pages/auth/LoginPage'
import ResetPasswordpage from '../pages/auth/ResetPasswordpage'
import SignupPage from '../pages/auth/SignupPage'
import DashboardPage from '../pages/DashboardPage'
import UploadPage from '../pages/UploadPage'
import MediaGalleryPage from '../pages/MediaGalleryPage'
import ApiKeysPage from '../pages/ApiKeysPage'
import DeveloperDocsPage from '../pages/DeveloperDocsPage'
import AdminDashboardPage from '../pages/AdminDashboardPage'
import ProtectedRoute from '../components/ProtectedRoute'
import HomePage from '../pages/public/HomePage'
import AboutPage from '../pages/public/AboutPage'
import ContactPage from '../pages/public/ContactPage'
import BlogPage from '../pages/public/BlogPage'
import PricingPage from '../pages/public/PricingPage'

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassowrdPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordpage />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      // Public Routes
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/blog",
        element: <BlogPage />,
      },
      {
        path: "/pricing",
        element: <PricingPage />,
      },

      // Protected Routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/upload",
            element: <UploadPage />,
          },
          {
            path: "/gallery",
            element: <MediaGalleryPage />,
          },
          {
            path: "/api-keys",
            element: <ApiKeysPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute adminOnly={true} />,
        children: [
          {
            path: "/admin",
            element: <AdminDashboardPage />,
          },
        ],
      },
      {
        path: "/docs",
        element: <DeveloperDocsPage />,
      },
    ],
  },
]);

export default router
