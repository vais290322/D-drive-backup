import { LogOut, Bell, User, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";

interface HeaderComponentProps {
  onToggleSidebar?: () => void;
}

const HeaderComponent = ({ onToggleSidebar }: HeaderComponentProps) => {
  const { logout } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6 shadow-sm">
      {/* Branding and Mobile Toggle */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="md:hidden"
          aria-label="Toggle Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="text-lg font-semibold tracking-tight">MyApp</span>
      </div>

      {/* Right-side actions */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Profile">
          <User className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="sm" onClick={logout} className="gap-1.5">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default HeaderComponent;