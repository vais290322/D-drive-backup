import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { ScrollToTop } from "@/components/auth/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "@/components/common/Sidebar";
import routes from "./routes";
import type { RouteConfig } from "./routes";
import { Building2 } from "lucide-react";

// Flatten routes to include children for React Router
function flattenRoutes(routes: RouteConfig[]): RouteConfig[] {
  const flattened: RouteConfig[] = [];
  
  routes.forEach((route) => {
    flattened.push(route);
    if (route.children) {
      flattened.push(...route.children);
    }
  });
  
  return flattened;
}

function ProtectedRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/login";
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLoadingTimeout(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      navigate("/login");
    }
  }, [user, loading, isLoginPage, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <div className="text-center space-y-6 p-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-primary/20" />
              <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Building2 className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Digital Dreems</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {loadingTimeout ? "Still loading... Please wait" : "Initializing application..."}
            </p>
          </div>

          {loadingTimeout && (
            <div className="mt-4 rounded-lg bg-muted/50 p-4 text-xs text-muted-foreground">
              <p>If this takes too long, please:</p>
              <ul className="mt-2 space-y-1 text-left">
                <li>• Check your internet connection</li>
                <li>• Refresh the page</li>
                <li>• Clear browser cache</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background  ">
      {!isLoginPage && user && <Sidebar />}
      <main className={`flex-grow ${!isLoginPage && user ? "bg-secondary/30 p-6 lg:p-8" : ""}`}>
        <div className={!isLoginPage && user ? "mx-auto max-w-7xl" : ""}>
          <Routes>
            {flattenRoutes(routes).map((route, index) => {
              const Component = route.component;
              return (
                <Route
                  key={`route-${index}-${route.path}`}
                  path={route.path}
                  element={<Component />}
                />
              );
            })}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Toaster />
        <ProtectedRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
