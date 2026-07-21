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
import { api } from "@/db/api";
import { Badge } from "@/components/ui/badge";

// Update Props Interface
interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  onMobileOpen?: () => void;
}

export default function Sidebar({ mobileOpen = false, onMobileClose, onMobileOpen }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  // Remove local mobileOpen state if controlled via props
  const [localMobileOpen, setLocalMobileOpen] = useState(false);
  const isControlled = onMobileClose !== undefined;

  const isOpen = isControlled ? mobileOpen : localMobileOpen;
  const setOpen = (open: boolean) => {
    if (isControlled) {
      open ? onMobileOpen?.() : onMobileClose?.();
    } else {
      setLocalMobileOpen(open);
    }
  };

  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [openRequestsCount, setOpenRequestsCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  // const navigation = routes.filter((route) => route.visible !== false);

  const navigation = routes.filter((route) => {
    if (route.visible === false) return false;

    // If route has role restriction
    if (route.role) {
      return route.role.includes(profile?.role);
    }

    return true;
  });

  // console.log("naviagation from sidebar : ",profile)

  useEffect(() => {
    loadSettings();
    loadOpenRequests();
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

  const loadOpenRequests = async () => {
    try {
      const requests = await api.serviceRequests.getAll();
      const openCount = requests.filter((req: any) => req.status === 'Open').length;
      setOpenRequestsCount(openCount);
    } catch (error) {
      console.error("Error loading service requests:", error);
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
    <div className="relative flex h-full flex-col bg-gradient-to-b from-slate-950 via-gray-950 to-black overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/3 pointer-events-none" />

      {/* Logo Section with Premium Gradient */}
      <div className={cn(
        "flex items-center gap-3 border-b border-white/5 p-4 transition-all duration-300",
        collapsed && "justify-center p-3"
      )}>
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
          {settings?.logo_url ? (
            <img
              src={settings.logo_url}
              alt="Logo"
              className="h-full w-full object-contain rounded-lg"
            />
          ) : (
            <Building2 className="h-5 w-5 text-white" />
          )}
          <div className="absolute -top-0.5 -right-0.5">
            <Sparkles className="h-3 w-3 text-yellow-400 animate-pulse" />
          </div>
        </div>
        {!collapsed && (
          <div className="animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-base font-bold text-white">
              {settings?.company_name || "Mit Electro World"}
            </span>
            <p className="text-[10px] text-gray-500 tracking-wide uppercase font-medium">
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
                      "group w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 relative overflow-hidden",
                      "hover:bg-white/5 hover:text-white hover:translate-x-1",
                      isActive && "bg-gradient-to-r from-primary/20 via-primary/10 to-transparent text-white shadow-[0_0_20px_rgba(var(--primary),0.1)] border-l-4 border-primary",
                      !isActive && "text-gray-400 hover:text-white",
                      collapsed && "justify-center px-2 border-l-0"
                    )}
                  >
                    {isActive && <div className="absolute inset-y-0 left-0 w-1 bg-primary/50 blur-[2px]" />}
                    {Icon && <Icon className={cn("h-4 w-4 shrink-0 transition-all duration-300", isActive && "text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] scale-110")} />}
                    {!collapsed && (
                      <>
                        <span className={cn("flex-1 text-left animate-in fade-in slide-in-from-left-2 duration-300 truncate", isActive && "font-semibold tracking-wide")}>
                          {item.name}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 shrink-0 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
                        )}
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 relative overflow-hidden",
                      "hover:bg-white/5 hover:text-white hover:translate-x-1",
                      isActive && "bg-gradient-to-r from-primary/20 via-primary/10 to-transparent text-white shadow-[0_0_20px_rgba(var(--primary),0.1)] border-l-4 border-primary",
                      !isActive && "text-gray-400 hover:text-white",
                      collapsed && "justify-center px-2 border-l-0"
                    )}
                  >
                    {isActive && <div className="absolute inset-y-0 left-0 w-1 bg-primary/50 blur-[2px]" />}
                    {Icon && <Icon className={cn("h-4 w-4 shrink-0 transition-all duration-300", isActive && "text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] scale-110")} />}
                    {!collapsed && (
                      <div className="flex flex-1 items-center justify-between">
                        <span className={cn("animate-in fade-in slide-in-from-left-2 duration-300 truncate", isActive && "font-semibold tracking-wide")}>
                          {item.name}
                        </span>
                        {item.name === "Service Requests" && openRequestsCount > 0 && (
                          <Badge variant="destructive" className="h-5 px-1.5 text-[10px] animate-pulse">
                            {openRequestsCount}
                          </Badge>
                        )}
                      </div>
                    )}
                  </Link>
                )}

                {/* Child Items */}
                {hasChildren && isExpanded && !collapsed && (
                  <div
                    className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3 animate-in slide-in-from-top-2 duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.children
                      ?.filter((child) => {
                        if (child.visible === false) return false;

                        if (child.role) {
                          return child.role.includes(profile?.role);
                        }

                        return true;
                      }).map((child) => {
                        const ChildIcon = child.icon;
                        const isChildActive = location.pathname === child.path;

                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpen(false);
                            }}
                            className={cn(
                              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-300 relative",
                              "hover:text-white hover:translate-x-1",
                              isChildActive ? "text-white font-medium bg-white/5 shadow-[0_0_10px_rgba(255,255,255,0.05)]" : "text-gray-500 hover:text-gray-300"
                            )}
                          >
                            {isChildActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_5px_var(--primary)]" />}
                            {ChildIcon && <ChildIcon className={cn("h-3.5 w-3.5 shrink-0 transition-colors", isChildActive ? "text-primary" : "text-gray-600 group-hover:text-gray-400")} />}
                            <span className={cn("transition-colors", isChildActive ? "text-white ml-2" : "")}>
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

      <Separator className="bg-white/5 mx-4 mb-2" />

      {/* User Section with Premium Card */}
      <div className={cn(
        "p-3 transition-all duration-300",
        collapsed ? "p-2" : "px-3 pb-3"
      )}>
        <div className={cn(
          "flex items-center gap-3 rounded-xl p-2.5 transition-all duration-300 border border-white/5 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md shadow-lg group relative overflow-hidden",
          !collapsed && "hover:border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]",
          collapsed && "justify-center p-2 bg-transparent border-0 shadow-none"
        )}>
          {/* Glass Shine Effect */}
          {!collapsed && <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />}

          <Avatar className="h-9 w-9 shrink-0 ring-2 ring-white/10 ring-offset-2 ring-offset-black/50 transition-transform duration-300 group-hover:scale-105">
            <AvatarFallback className="bg-gradient-to-br from-primary to-indigo-600 text-white text-xs font-bold shadow-inner">
              {getInitials(user?.email)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
              <p className="text-sm font-semibold truncate text-white tracking-tight">{user?.email}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_5px_#10b981]"></span>
                </span>
                <p className="text-[10px] text-gray-400 capitalize font-medium tracking-wide">
                  {profile?.role === "collection_agent"
                    ? "cashier"
                    : profile?.role?.replace("_", " ")}
                </p>
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="mt-3 w-full transition-all  hover:scale-[1.02] hover:shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300 bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 border-red-500/30 text-red-400 hover:text-red-300"
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
      {/* Mobile Menu Button with Premium Gradient */}


      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 shadow-2xl transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex fixed inset-y-0 left-0 z-30 shadow-2xl transition-all duration-300 border-r border-white/5",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Spacer for content */}
      <div className={cn(
        "hidden lg:block transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )} />
    </>
  );
}

