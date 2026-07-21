import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles
} from "lucide-react";
import routes from "@/routes";
import { cn } from "@/lib/utils";
import { getBusinessSettings } from "@/db/settingsApi";
import type { BusinessSettings } from "@/types/types";
import type { RouteConfig } from "@/routes";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const navigation = routes.filter((route) => route.visible !== false);

  useEffect(() => {
    loadSettings();
    // Auto-expand sections that contain the current path
    navigation.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) => location.pathname.startsWith(child.path)
        );
        if (hasActiveChild) {
          setExpandedSections((prev) => ({ ...prev, [item.path]: true }));
        }
      }
    });
  }, [location.pathname]);

  const loadSettings = async () => {
    try {
      const data = await getBusinessSettings();
      setSettings(data);
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  const toggleSection = (path: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const isPathActive = (path: string, children?: RouteConfig[]) => {
    if (location.pathname === path) return true;
    if (children) {
      return children.some((child) => location.pathname.startsWith(child.path));
    }
    return false;
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Logo Section with Premium Gradient */}
      <div className={cn(
        "flex items-center gap-3 border-b border-white/10 p-6 transition-all duration-300 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm",
        collapsed && "justify-center p-4"
      )}>
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/50">
          {settings?.logo_url ? (
            <img
              src={settings.logo_url}
              alt="Logo"
              className="h-full w-full object-contain rounded-xl"
            />
          ) : (
            <Building2 className="h-6 w-6 text-white" />
          )}
          <div className="absolute -top-1 -right-1">
            <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
          </div>
        </div>
        {!collapsed && (
          <div className="animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {settings?.company_name || "Mit Electro World"}
            </span>
            <p className="text-xs text-gray-400 tracking-wide">
              {settings?.tagline || "Loan Management CRM"}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = isPathActive(item.path, item.children);
            const isExpanded = expandedSections[item.path];
            const hasChildren = item.children && item.children.length > 0;

            return (
              <div key={item.path}>
                {/* Parent Item */}
                {hasChildren ? (
                  <button
                    onClick={() => toggleSection(item.path)}
                    className={cn(
                      "group w-full flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300",
                      "hover:bg-gradient-to-r hover:from-primary/20 hover:to-accent/20 hover:shadow-md hover:scale-[1.02]",
                      isActive && "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30",
                      !isActive && "text-gray-300 hover:text-white",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    {Icon && <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300", isActive && "drop-shadow-glow")} />}
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left animate-in fade-in slide-in-from-left-2 duration-300">
                          {item.name}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 shrink-0 transition-transform duration-300" />
                        ) : (
                          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-300" />
                        )}
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300",
                      "hover:bg-gradient-to-r hover:from-primary/20 hover:to-accent/20 hover:shadow-md hover:scale-[1.02]",
                      isActive && "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30",
                      !isActive && "text-gray-300 hover:text-white",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    {Icon && <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300", isActive && "drop-shadow-glow")} />}
                    {!collapsed && (
                      <span className="animate-in fade-in slide-in-from-left-2 duration-300">
                        {item.name}
                      </span>
                    )}
                  </Link>
                )}

                {/* Child Items */}
                {hasChildren && isExpanded && !collapsed && (
                  <div
                    className="ml-4 mt-1.5 space-y-1 border-l-2 border-white/10 pl-4 animate-in slide-in-from-top-2 duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.children?.filter((child) => child.visible !== false).map((child) => {
                      const ChildIcon = child.icon;
                      const isChildActive = location.pathname === child.path;

                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={(e) => {
                            e.stopPropagation();
                            setMobileOpen(false);
                          }}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all duration-300",
                            "hover:bg-white/5 hover:text-white hover:scale-[1.02]",
                            isChildActive && "bg-white/10 text-white font-medium shadow-sm"
                          )}
                        >
                          {ChildIcon && <ChildIcon className="h-4 w-4 shrink-0" />}
                          <span className="text-gray-400 group-hover:text-white transition-colors">
                            {child.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator className="bg-white/10" />

      {/* User Section with Premium Card */}
      <div className={cn(
        "border-t border-white/10 p-4 transition-all duration-300 bg-gradient-to-br from-white/5 to-transparent",
        collapsed && "p-2"
      )}>
        <div className={cn(
          "flex items-center gap-3 rounded-xl p-3 transition-all duration-300 bg-gradient-to-r from-white/10 to-transparent hover:from-white/15 hover:shadow-lg border border-white/10",
          collapsed && "justify-center p-2"
        )}>
          <Avatar className="h-10 w-10 shrink-0 ring-2 ring-primary/50 ring-offset-2 ring-offset-slate-900">
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm font-bold">
              {getInitials(user?.email)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 animate-in fade-in slide-in-from-left-2 duration-300">
              <p className="text-sm font-semibold truncate text-white">{user?.email}</p>
              <p className="text-xs text-gray-400 capitalize flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {profile?.role?.replace("_", " ")}
              </p>
            </div>
          )}
        </div>

        {!collapsed && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="mt-3 w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300 bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 border-red-500/30 text-red-400 hover:text-red-300"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        )}
      </div>

      {/* Collapse Toggle (Desktop Only) with Premium Button */}
      <div className="hidden lg:block border-t border-white/10 p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full transition-all duration-300 hover:bg-white/10 text-gray-400 hover:text-white",
            collapsed && "px-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Collapse
            </>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button with Premium Gradient */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden transition-all duration-300 hover:scale-110 hover:shadow-xl bg-gradient-to-br from-primary to-accent text-white border-none shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 shadow-2xl transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex fixed inset-y-0 left-0 z-30 shadow-2xl transition-all duration-300",
          collapsed ? "w-16" : "w-72"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Spacer for content */}
      <div className={cn(
        "hidden lg:block transition-all duration-300",
        collapsed ? "w-16" : "w-72"
      )} />
    </>
  );
}

