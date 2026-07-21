import summaryApi from "@/common/api";
import { Button } from "@/components/ui/button";
import { clearUser } from "@/store/userSlice";
import axios from "axios";
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  Package,
  Navigation,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

interface DeliverySidebarProps {
  activeSection: string;
}

export function DeliverySidebar({ activeSection }: DeliverySidebarProps) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Truck,
      path: "/dashboard/delivery",
    },
    {
      id: "routes",
      label: "Delivery Routes",
      icon: MapPin,
      path: "/dashboard/delivery/routes",
    },
    {
      id: "schedule",
      label: "Today's Schedule",
      icon: Clock,
      path: "/dashboard/delivery/schedule",
    },
    {
      id: "in-transit",
      label: "In Transit",
      icon: Navigation,
      path: "/dashboard/delivery/transit",
    },
    {
      id: "delivered",
      label: "Delivered",
      icon: CheckCircle,
      path: "/dashboard/delivery/delivered",
    },
    {
      id: "pending",
      label: "Pending Pickup",
      icon: Package,
      path: "/dashboard/delivery/pending",
    },
  ];

  const [location, setLocation] = useLocation();
  const dispatch = useDispatch();

  const logout = async () => {
    const response = await axios.post(
      `${summaryApi?.logout}`,
      {},
      {
        withCredentials: true,
      }
    );

    if (response?.data?.success) {
      toast.success(response?.data?.message || "Logout successful!");
      dispatch(clearUser());
      setLocation("/");
    }
  };

  return (
    <div className="bg-card border-r h-full w-64">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Delivery Panel</h2>
      </div>

      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link href={item.path}>
                <a
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full p-4 ">
        <Button onClick={logout}>
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
