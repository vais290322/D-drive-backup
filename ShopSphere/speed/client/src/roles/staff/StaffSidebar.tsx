import summaryApi from "@/common/api";
import { Button } from "@/components/ui/button";
import { clearUser } from "@/store/userSlice";
import axios from "axios";
import { 
  Package, 
  ShoppingCart, 
  Box,
  Tag,
  ClipboardList,
  LogOut
} from "lucide-react";

import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

interface StaffSidebarProps {
  activeSection: string;
}

export function StaffSidebar({ activeSection }: StaffSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: ClipboardList, path: "/dashboard/staff" },
    { id: "inventory", label: "Inventory Management", icon: Package, path: "/dashboard/staff/inventory" },
    { id: "orders", label: "Order Processing", icon: ShoppingCart, path: "/dashboard/staff/orders" },
    { id: "products", label: "Product Management", icon: Box, path: "/dashboard/staff/products" },
    { id: "pricing", label: "Price Updates", icon: Tag, path: "/dashboard/staff/pricing" },
    { id: "tasks", label: "Task List", icon: ClipboardList, path: "/dashboard/staff/tasks" },
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
        <h2 className="text-lg font-semibold">Staff Panel</h2>
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

      <div className="absolute bottom-0 w-full p-4 ">
              <Button onClick={logout}>
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
    </div>
  );
}