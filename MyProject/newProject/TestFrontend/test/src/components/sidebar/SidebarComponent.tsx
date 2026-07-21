import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link, useLocation } from "react-router";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  ShoppingBag,
  FileText,
  PieChart,
  LineChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Calendar", to: "/calendar", icon: <Calendar size={18} /> },
  { label: "E-commerce", to: "/e-commerce", icon: <ShoppingBag size={18} /> },
  { label: "Documentation", to: "/documentation", icon: <FileText size={18} /> },
];

const chartItems = [
  { label: "Pie Charts", to: "/pie-charts", icon: <PieChart size={18} /> },
  { label: "Line Charts", to: "/line-charts", icon: <LineChart size={18} /> },
];

interface SidebarComponentProps {
  toggled?: boolean;
  setToggled?: (toggled: boolean) => void;
}

const SidebarComponent = ({ toggled, setToggled }: SidebarComponentProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <Sidebar
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onBackdropClick={() => setToggled && setToggled(false)}
      style={{ minHeight: "100svh" }}
    >
      {/* App logo area */}
      <div
        style={{
          padding: "16px",
          fontWeight: 700,
          fontSize: "1.1rem",
          borderBottom: "1px solid #e5e7eb",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {collapsed ? "MA" : "MyApp"}
      </div>

      <Menu
        menuItemStyles={{
          button: ({ active }) => ({
            backgroundColor: active ? "#eff6ff" : undefined,
            color: active ? "#1d4ed8" : undefined,
            fontWeight: active ? 600 : undefined,
            borderRadius: "6px",
            margin: "2px 8px",
          }),
        }}
      >
        {navItems.map(({ label, to, icon }) => (
          <MenuItem
            key={to}
            component={<Link to={to} />}
            active={location.pathname === to}
            icon={icon}
          >
            {label}
          </MenuItem>
        ))}

        <SubMenu label="Charts" icon={<PieChart size={18} />}>
          {chartItems.map(({ label, to, icon }) => (
            <MenuItem
              key={to}
              component={<Link to={to} />}
              active={location.pathname === to}
              icon={icon}
            >
              {label}
            </MenuItem>
          ))}
        </SubMenu>
      </Menu>

      {/* Collapse toggle */}
      <div style={{ padding: "8px", marginTop: "auto" }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full gap-1"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && "Collapse"}
        </Button>
      </div>
    </Sidebar>
  );
};

export default SidebarComponent;