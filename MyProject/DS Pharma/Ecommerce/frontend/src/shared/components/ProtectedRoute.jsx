import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import PageLoader from './loaders/PageLoader';

/**
 * Protected Route Component
 * Restricts access to authenticated users and optionally filters by role
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  // If still loading auth state, show a loader
  if (isLoading) {
    return <PageLoader />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If adminOnly is true and user is not an admin, redirect to home
  // Assuming backend returns role: 'admin' for admin users
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
