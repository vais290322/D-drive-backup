import { type ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "./AuthProvider";

interface RequireAuthProps {
  children: ReactNode;
  whiteList?: string[];
}

export function RequireAuth({ children, whiteList = [] }: RequireAuthProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    const isWhitelisted = whiteList.some((path) => {
      if (path.endsWith("/*")) {
        const basePath = path.slice(0, -2);
        return location.pathname.startsWith(basePath);
      }
      return location.pathname === path;
    });

    if (!user && !isWhitelisted) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [user, loading, location.pathname, navigate, whiteList]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}

