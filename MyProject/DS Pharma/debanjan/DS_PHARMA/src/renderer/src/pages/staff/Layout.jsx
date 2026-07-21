import { StaffAppSidebar } from '@/components/staff-app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Outlet } from 'react-router'

export default function Layout() {
  return (
    <SidebarProvider>
      <StaffAppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
