import {
  AlertTriangle,
  ClipboardList,
  HelpCircle,
  Home,
  LogOut,
  Pill,
  RotateCcw,
  Settings,
  Users
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

// Menu items.
const items = [
  {
    title: 'Counter',
    url: '/staff/billing',
    icon: ClipboardList
  },
  {
    title: 'Dashboard',
    url: '/staff/dashboard',
    icon: Home
  },
  {
    title: 'Inventory',
    url: '/staff/inventory',
    icon: Pill
  },
  {
    title: 'Sales Return',
    url: '/staff/returns',
    icon: RotateCcw
  },
  {
    title: 'Customers',
    url: '/staff/customers',
    icon: Users
  },
  {
    title: 'Low Stock',
    url: '/staff/low-stock',
    icon: AlertTriangle
  },
  {
    title: 'Help',
    url: '/staff/help',
    icon: HelpCircle
  },
  {
    title: 'Settings',
    url: '/staff/settings',
    icon: Settings
  },
]

export function StaffAppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarGroupLabel>💊DS Pharmacy</SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>DS Pharmacy</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/logout">
                  <LogOut />
                  <span>Logout</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarFooter>
    </Sidebar>
  )
}
