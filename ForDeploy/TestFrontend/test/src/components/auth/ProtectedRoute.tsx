import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";

/**
 * ProtectedRoute — wraps any routes that require authentication.
 * If the user is NOT authenticated, they are redirected to /login.
 * If authenticated, renders child routes via <Outlet />.
 */
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
