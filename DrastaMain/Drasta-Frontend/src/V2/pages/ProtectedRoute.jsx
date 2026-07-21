import { useSelector } from "react-redux";
import { Loader } from "../components";
import { USER_ROLES } from "../config";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({
  children,
  allowedRoles = Object.values(USER_ROLES),
  redirectTo = "/home",
}) {
    const { user, status } = useSelector((s) => s.auth);
    
  if (status === "loading") {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
