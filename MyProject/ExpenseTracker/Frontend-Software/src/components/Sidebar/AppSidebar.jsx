import * as React from "react"
import { useSelector } from "react-redux"
import {
  PieChart,
  Settings2,
  Wallet,
} from "lucide-react"

import NavMain from "./NavMain"
import { TeamSwitcher } from "./TeamSwitcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "./NavUser"

const teams = [
  {
    name: "Expense Tracker",
    logo: Wallet,
    plan: "v1.0.0",
  }
];

const navItems = [
  {
    title: "Expense Management",
    url: "/admin",
    icon: Wallet,
    isActive: true,
  },
  {
    title: "Report Summary",
    url: "/admin/report",
    icon: PieChart,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings2,
  },
];

export function AppSidebar({ ...props }) {
  const user = useSelector((state) => state.auth.user) || {
    username: "Guest User",
    email: "guest@example.com",
  };

  const formattedUser = {
    name: user.username,
    email: user.email,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`,
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter className="cursor-pointer">
        <NavUser user={formattedUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

