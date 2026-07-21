import { 
  Shield, 
  Settings, 
  Users, 
  Database,
  BarChart3,
  UserCog,
  Lock
} from "lucide-react";
import { Link } from "wouter";

interface SupAdminSidebarProps {
  activeSection: string;
}

export function SupAdminSidebar({ activeSection }: SupAdminSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/dashboard/supadmin" },
    { id: "roles", label: "Role Management", icon: UserCog, path: "/dashboard/supadmin/roles" },
    { id: "users", label: "User Management", icon: Users, path: "/dashboard/supadmin/users" },
    { id: "permissions", label: "Permissions", icon: Lock, path: "/dashboard/supadmin/permissions" },
    { id: "system", label: "System Settings", icon: Settings, path: "/dashboard/supadmin/system" },
    { id: "database", label: "Database", icon: Database, path: "/dashboard/supadmin/database" },
    { id: "audit", label: "Audit Logs", icon: BarChart3, path: "/dashboard/supadmin/audit" },
  ];

  return (
    <div className="bg-card border-r h-full w-64">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">SupAdmin Panel</h2>
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