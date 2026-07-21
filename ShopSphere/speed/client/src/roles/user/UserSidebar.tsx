import { 
  User, 
  ShoppingCart, 
  Heart, 
  MapPin, 
  Settings,
  Gift
} from "lucide-react";
import { Link } from "wouter";

interface UserSidebarProps {
  activeSection: string;
}

export function UserSidebar({ activeSection }: UserSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: User, path: "/dashboard/user" },
    { id: "orders", label: "My Orders", icon: ShoppingCart, path: "/dashboard/user/orders" },
    { id: "wishlist", label: "Wishlist", icon: Heart, path: "/dashboard/user/wishlist" },
    { id: "address", label: "Address Book", icon: MapPin, path: "/dashboard/user/address" },
    { id: "profile", label: "Profile", icon: User, path: "/dashboard/user/profile" },
    { id: "loyalty", label: "Loyalty Points", icon: Gift, path: "/loyalty" },
    { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/user/settings" },
  ];

  return (
    <div className="bg-card border-r h-full w-64">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">My Account</h2>
      </div>
      
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link href={item.path}>
                <a className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  activeSection === item.id 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                }`}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}