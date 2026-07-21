import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Building2, Menu, LogOut, Bell, AlertCircle } from "lucide-react";
import GlobalSearch from "@/components/common/GlobalSearch";
import routes from "@/routes";
import { api } from "@/db/api";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openRequests, setOpenRequests] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const navigation = routes.filter((route) => route.visible !== false);

  useEffect(() => {
    loadOpenRequests();
  }, [location.pathname]); // Reload when path changes (user might have updated something)

  const loadOpenRequests = async () => {
    try {
      const requests = await api.serviceRequests.getAll();
      const open = requests.filter((req: any) => req.status === 'Open');
      setOpenRequests(open);
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

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-primary">Mit Electro World</span>
              <p className="text-xs text-muted-foreground">Loan Management CRM</p>
            </div>
          </Link>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === item.path
                ? "text-primary"
                : "text-muted-foreground"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <GlobalSearch />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {openRequests.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px]"
                  >
                    {openRequests.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h4 className="font-semibold leading-none">Notifications</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  You have {openRequests.length} open service requests
                </p>
              </div>
              <ScrollArea className="h-[300px]">
                {openRequests.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No new notifications
                  </div>
                ) : (
                  <div className="divide-y">
                    {openRequests.map((req) => (
                      <div
                        key={req._id || req.id}
                        className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => navigate('/service-requests')}
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {req.customer_name}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {req.problem_statement}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {new Date(req.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>

          <div className="hidden items-center gap-2 md:flex">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getInitials(user?.email)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:block">
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {profile?.role?.replace("_", " ")}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="hidden md:flex"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 border-b pb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {profile?.role?.replace("_", " ")}
                    </p>
                  </div>
                </div>

                <nav className="flex flex-col gap-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${location.pathname === item.path
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                        }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="mt-auto"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

