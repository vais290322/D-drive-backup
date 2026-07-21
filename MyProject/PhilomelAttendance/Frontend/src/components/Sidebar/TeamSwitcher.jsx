import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import airLogo from "../../assets/air.png"
import { useSidebar } from "../ui/sidebar"

export function TeamSwitcher() {
  const {state} = useSidebar()
  // console.log("state : ",state)
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center p-2">
          <div className="bg-sidebar-primary flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
            <img 
              src={airLogo} 
              alt="Airways India" 
              className="h-full w-full object-cover"
            />
          </div>
          {
            state==="expanded" && <> 
          <div className="ml-2 grid flex-1 text-left text-sm leading-tight">
            <span className="font-semibold text-base tracking-wide bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Philomel Public School</span>
            <span className="text-xs text-gray-500 truncate">Attendance System</span>
          </div>
          </>
          }
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}