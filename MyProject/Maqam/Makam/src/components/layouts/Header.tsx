import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import routes from '@/routes';

export default function Header() {
  const { user, profile, signOut, isAdmin, isCustomer, isHotelier, isStaff, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const visibleRoutes = routes.filter(route => route.visible);

  // Get dashboard button label based on role
  const getDashboardLabel = () => {
    if (isAdmin) return 'Admin Panel';
    if (isHotelier) return 'Hotelier Dashboard';
    if (isStaff) return 'Staff Dashboard';
    if (isCustomer) return 'My Dashboard';
    return 'My Account';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              MH
            </div>
            <span className="font-bold text-lg hidden xl:inline">Maquam Holidays</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {visibleRoutes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {route.name}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {profile && (
                  <Button asChild variant="default" className="hidden xl:flex">
                    <Link to={getDashboardPath()}>
                      <Shield className="h-4 w-4 mr-2" />
                      {getDashboardLabel()}
                    </Link>
                  </Button>
                )}
                <Button asChild variant="ghost" className="hidden xl:flex">
                  <Link to="/customer-portal">
                    <User className="h-4 w-4 mr-2" />
                    {profile?.username || 'My Account'}
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout} className="hidden xl:flex">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild className="hidden xl:flex">
                <Link to="/login">Login</Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {visibleRoutes.map((route) => (
                    <Link
                      key={route.path}
                      to={route.path}
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      {route.name}
                    </Link>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    {user ? (
                      <>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 text-sm font-medium mb-4 text-primary"
                          >
                            <Shield className="h-4 w-4" />
                            Admin Panel
                          </Link>
                        )}
                        <Link
                          to="/customer-portal"
                          className="flex items-center gap-2 text-sm font-medium mb-4"
                        >
                          <User className="h-4 w-4" />
                          {profile?.username || 'My Account'}
                        </Link>
                        <Button variant="outline" onClick={handleLogout} className="w-full">
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Button asChild className="w-full">
                        <Link to="/login">Login</Link>
                      </Button>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
