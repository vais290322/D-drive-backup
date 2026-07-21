import {
  Home,
  ClipboardList,
  Users,
  Truck,
  FileText,
  BarChart,
  AlertTriangle,
  Settings,
  Pill,
  LogOut,
  Layers,
  Package
} from 'lucide-react'
import { Link, useLocation } from 'react-router'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: Home
  },
  {
    title: 'Categories',
    url: '/admin/categories',
    icon: Layers
  },
  {
    title: 'Inventory',
    url: '/admin/inventory',
    icon: Package
  },
  {
    title: 'Billing',
    url: '/admin/billing',
    icon: ClipboardList,
    badge: '3'
  },
  {
    title: 'Sales',
    url: '/admin/sales',
    icon: BarChart
  },
  {
    title: 'Customers',
    url: '/admin/customers',
    icon: Users
  },
  {
    title: 'Suppliers',
    url: '/admin/suppliers',
    icon: Truck
  },
  {
    title: 'Stock & Expiry',
    url: '/admin/stock',
    icon: AlertTriangle,
    badge: 'Low'
  },
  {
    title: 'GST Reports',
    url: '/admin/gst-reports',
    icon: FileText
  },
  {
    title: 'Settings',
    url: '/admin/settings',
    icon: Settings
  }
]

export function AdminAppSidebar() {
  return (
    <Sidebar className="border-0">
      <SidebarHeader>
        <SidebarGroupLabel>💊DS Pharmacy</SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => {
                const isActive = location.pathname.startsWith(item.url)
                const colors = [
                  'from-pink-400 to-pink-600',
                  'from-yellow-200 to-yellow-400',
                  'from-green-300 to-green-500',
                  'from-indigo-400 to-indigo-600',
                  'from-purple-400 to-purple-600',
                  'from-rose-400 to-rose-600',
                  'from-amber-300 to-amber-500',
                  'from-sky-300 to-sky-500',
                  'from-teal-300 to-teal-500',
                  'from-violet-300 to-violet-500'
                ]
                const color = colors[index % colors.length]

                return (
                  <SidebarMenuItem key={item.title} className="relative">
                    {isActive && (
                      <span
                        className={`absolute left-0 top-1/2 -translate-y-1/2 h-9 w-1 rounded-r-md bg-gradient-to-b ${color}`}
                      />
                    )}

                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link to={item.url} className="flex items-center">
                        <span
                          className={`inline-flex items-center justify-center size-7 rounded-md bg-gradient-to-tr ${color} text-white mr-3 shadow-sm`}
                        >
                          <item.icon className="size-4" />
                        </span>
                        <span
                          className={
                            isActive
                              ? 'font-semibold text-sidebar-foreground'
                              : 'text-sidebar-foreground/90'
                          }
                        >
                          {item.title}
                        </span>
                        {item.badge && (
                          <SidebarMenuBadge className="ml-auto">{item.badge}</SidebarMenuBadge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
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
