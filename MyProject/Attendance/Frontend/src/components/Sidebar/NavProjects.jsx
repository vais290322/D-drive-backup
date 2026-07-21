import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavLink, useLocation } from "react-router"

export function NavProjects({
  projects,
}) {
  const { isMobile } = useSidebar()
  const location = useLocation();

  return (
    <SidebarGroup >
      <SidebarGroupLabel>Attendance</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton tooltip={item.name} asChild>
                <NavLink 
                  to={item.url} 
                  className={`flex items-center cursor-pointer gap-[12px] ${isActive && "text-green-500"}`}
                >
                  {item.icon && (
                    <item.icon className="h-6 w-6" fontSize="medium" />
                  )}
                  <span className="text-[18px]">{item.name}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}


