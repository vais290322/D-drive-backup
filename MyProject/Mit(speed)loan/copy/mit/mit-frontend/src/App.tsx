import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { ScrollToTop } from "@/components/auth/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "@/components/common/Sidebar";
import routes from "./routes";
import type { RouteConfig } from "./routes";
import { Building2 } from "lucide-react";
import BottomNav from "@/components/mobile/BottomNav";

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
  const [settings, setSettings] = useState<{ company_name: string; tagline?: string; logo_url?: string | null } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const publicRoutes = ["/login", "/customer-payment", "/forgot-password", "/reset-password"];

const isPublicRoute = publicRoutes.some((route) =>
  location.pathname.startsWith(route)
);

  useEffect(() => {
    // Fetch settings for dynamic loading screen
    const fetchSettings = async () => {
      try {
        const { getPublicBusinessSettings } = await import("@/db/settingsApi");
        const data = await getPublicBusinessSettings();
        if (data) {
          setSettings({
            company_name: data.company_name || 'Mit Electro World',
            tagline: data.tagline || undefined,
            logo_url: data.logo_url
          });

          // Update Browser Title and Favicon
          if (data.company_name) {
            document.title = data.company_name;
          }
          if (data.logo_url) {
            let favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (!favicon) {
              favicon = document.createElement('link');
              favicon.rel = 'icon';
              document.head.appendChild(favicon);
            }
            favicon.href = data.logo_url;
          }
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLoadingTimeout(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading]);

useEffect(() => {
  if (!loading && !user && !isPublicRoute) {
    navigate("/login");
  }
}, [user, loading, isPublicRoute, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <div className="text-center space-y-6 p-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-primary/20" />
              <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              {/* Center logo or icon inside spinner */}
              <div className="absolute inset-0 flex items-center justify-center">
                {settings?.logo_url ? (
                  <img
                    src={settings.logo_url}
                    alt="Logo"
                    className="h-8 w-8 object-contain rounded-full"
                  />
                ) : (
                  <Building2 className="h-6 w-6 text-primary" />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-primary">
              <h2 className="text-xl font-semibold">{settings?.company_name || 'Mit Electro World'}</h2>
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
    <div className="flex min-h-screen bg-background">
      {!isLoginPage && user && (
        <>
          <Sidebar
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
            onMobileOpen={() => setMobileMenuOpen(true)}
          />
          {/* Mobile Bottom Navigation */}
          <BottomNav onMenuClick={() => setMobileMenuOpen(true)} />
        </>
      )}
      <main className={`flex-grow ${!isLoginPage && user ? "bg-secondary/30 p-4 md:p-6 lg:p-8 pb-24 md:pb-6 lg:pb-8" : ""}`}>
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

