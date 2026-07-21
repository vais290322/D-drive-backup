import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Hotel, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings,
  LogOut,
  Menu
} from 'lucide-react';
import { useEffect, useState} from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const HotelierLayout = () => {
  const { user, profile, signOut, isHotelier } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Redirect if not a hotelier
    if (profile && !isHotelier) {
      navigate('/');
    }
  }, [user, profile, isHotelier, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { icon, label: 'Dashboard', path: '/hotelier' },
    { icon, label: 'My Hotels', path: '/hotelier/hotels' },
    { icon, label: 'Bookings', path: '/hotelier/bookings' },
    { icon, label: 'Guests', path: '/hotelier/guests' },
    { icon, label: 'Analytics', path: '/hotelier/analytics' },
    { icon, label: 'Settings', path: '/hotelier/settings' },
  ];

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-primary">Hotelier Portal</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {profile?.username || profile?.email}
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              navigate(item.path);
              setIsMobileMenuOpen(false);
            }}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="container mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default HotelierLayout;


