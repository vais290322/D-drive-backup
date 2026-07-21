import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  User,
  Box,
  Truck,
  LogOut
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { MdCategory } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";
import axios from "axios";
import summaryApi from "@/common/api";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/userSlice";

interface AdminSidebarProps {
  activeSection: string;
}

export function AdminSidebar({ activeSection }: AdminSidebarProps) {
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/dashboard/admin" },
    { id: "staff", label: "Staff Management", icon: User, path: "/dashboard/admin/staff" },
    { id: "users", label: "User Management", icon: Users, path: "/dashboard/admin/users" },
    { id: "products", label: "Product Catalog", icon: Box, path: "/dashboard/admin/products" },
    { id: "orders", label: "Order Processing", icon: ShoppingCart, path: "/dashboard/admin/orders" },
    { id: "delivery", label: "Delivery Management", icon: Truck, path: "/dashboard/admin/delivery" },
    { id: "categories", label: "Category ", icon:MdCategory , path: "/dashboard/admin/categories" },
    { id: "sub-categories", label: "Sub Category ", icon: BiSolidCategory, path: "/dashboard/admin/sub-categories" },
    { id: "settings", label: "Store Settings", icon: Settings, path: "/dashboard/admin/settings" },
  ];

  const [location , setLocation] = useLocation();
  const dispatch = useDispatch();


  const logout = async ()=>{
    const response = await axios.post(`${summaryApi?.logout}`, {}, {
      withCredentials: true,
    })

    if(response?.data?.success){
     toast.success(response?.data?.message || "Logout successful!");
      dispatch(clearUser());
     setLocation("/");
    }
  }


  return (
    <div className="bg-card border-r h-full w-64">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
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
        <Button onClick={logout} >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}