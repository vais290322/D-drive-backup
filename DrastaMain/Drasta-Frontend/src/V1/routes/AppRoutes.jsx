import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/pages/LoginV1";
import Dashboard from "../pages/pages/DashboardV1";
import ProtectedRoute from "./ProtectedRouteV1";
import AboutUs from "../pages/pages/AboutUs";
import ResearchColumn from "../pages/pages/ResearchColumn";
import DirectorsDesk from "../pages/pages/DirectorsDeskV1";
import TeamDrastaTab from "../pages/pages/TeamDrastaTab";
import WhatWeDoTab from "../pages/pages/WhatWeDoTab";
import DataArchieveTab from "../pages/pages/DataArchieveTab";
import Logout from "./Logout";

const AppRoutes = ({ isAuthenticated, onLogin, user, onLogout }) => (
  <Routes>
    <Route path="/v1-login" element={isAuthenticated ? <Navigate to="/v1-dashboard" replace /> : <Login onLogin={onLogin} />} />
    <Route path="/logout" element={<Logout onLogout={onLogout} />} />
    <Route
      path="/v1-dashboard"
      element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <Dashboard user={user} onLogout={onLogout} />
        </ProtectedRoute>
      }
    />
    <Route
      path="/aboutus"
      element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <AboutUs />
        </ProtectedRoute>
      }
    />
  <Route
      path="/team-drasta"
      element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <TeamDrastaTab/>
        </ProtectedRoute>
      }
    />
      <Route
      path="/whatwedo"
      element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <WhatWeDoTab />
        </ProtectedRoute>
      }
    />
    <Route
      path="/research-column"
      element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <ResearchColumn />
        </ProtectedRoute>
      }
    />
      <Route
      path="/data-archive"
      element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <DataArchieveTab />
        </ProtectedRoute>
      }
    />
    <Route
      path="/directors-desk"
      element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <DirectorsDesk />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<div className="flex flex-col items-center justify-center min-h-screen"><h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1></div>} />
  </Routes>
);

export default AppRoutes; 