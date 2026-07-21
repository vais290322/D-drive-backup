import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRouteV1 = ({ isAuthenticated, children }) => {
  // Check for both user authentication and token
  const token = localStorage.getItem("token");
  const isAuthorized = isAuthenticated && token;

  if (!isAuthorized) {
    // Redirect to V1 login instead of landing page
    return <Navigate to="/v1-login" replace />;
  }
  return children;
};

export default ProtectedRouteV1;