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
  ChevronUp
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
    <div className="flex h-full flex-col ">
      {/* Logo Section */}
      <div className={cn(
        "flex items-center gap-3 border-b p-6 transition-all duration-300",
        collapsed && "justify-center p-4"
      )}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
          {settings?.logo_url ? (
            <img 
              src={settings.logo_url} 
              alt="Logo" 
              className="h-full w-full object-contain rounded-lg"
            />
          ) : (
            <Building2 className="h-6 w-6 text-primary-foreground" />
          )}
        </div>
        {!collapsed && (
          <div className="animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-lg font-bold text-primary">
              {settings?.company_name || "Digital Dreems"}
            </span>
            <p className="text-xs text-muted-foreground">
              {settings?.tagline || "Loan Management CRM"}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
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
                      "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300",
                      "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02]",
                      isActive && "bg-primary text-primary-foreground shadow-md",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    {Icon && <Icon className="h-5 w-5 shrink-0" />}
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left animate-in fade-in slide-in-from-left-2 duration-300">
                          {item.name}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 shrink-0" />
                        )}
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300",
                      "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02]",
                      isActive && "bg-primary text-primary-foreground shadow-md",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    {Icon && <Icon className="h-5 w-5 shrink-0" />}
                    {!collapsed && (
                      <span className="animate-in fade-in slide-in-from-left-2 duration-300">
                        {item.name}
                      </span>
                    )}
                  </Link>
                )}

                {/* Child Items */}
                {hasChildren && isExpanded && !collapsed && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-border pl-3 animate-in slide-in-from-top-2 duration-300">
                    {item.children?.filter((child) => child.visible !== false).map((child) => {
                      const ChildIcon = child.icon;
                      const isChildActive = location.pathname === child.path;
                      
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-300",
                            "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02]",
                            isChildActive && "bg-accent text-accent-foreground font-medium"
                          )}
                        >
                          {ChildIcon && <ChildIcon className="h-4 w-4 shrink-0" />}
                          <span>{child.name}</span>
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

      <Separator />

      {/* User Section */}
      <div className={cn(
        "border-t p-4 transition-all duration-300",
        collapsed && "p-2"
      )}>
        <div className={cn(
          "flex items-center gap-3 rounded-lg p-2 transition-all duration-300 hover:bg-accent",
          collapsed && "justify-center"
        )}>
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {getInitials(user?.email)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 animate-in fade-in slide-in-from-left-2 duration-300">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground capitalize">
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
            className="mt-3 w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        )}
      </div>

      {/* Collapse Toggle (Desktop Only) */}
      <div className="hidden lg:block border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full transition-all duration-300 hover:bg-accent",
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
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden transition-all duration-300 hover:scale-110 hover:shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r bg-background transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar (use fixed width and push slightly down) */}
      <aside
        className={cn(
          "hidden lg:flex fixed top-4 bottom-0 left-0 z-30 border-r bg-background transition-all duration-300",
          // When collapsed use a small fixed width, otherwise use a wider fixed width
          collapsed ? "w-16" : "w-80"
        )}
      >
        <SidebarContent />
      </aside>
      
      {/* Spacer for content: matches sidebar width so the main area occupies the remaining space */}
      <div className={cn(
        "hidden lg:block transition-all duration-300 bg-background",
        collapsed ? "w-16" : "w-80"
      )} />
    </>
  );
}
