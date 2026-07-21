import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { logout } from "@/utils/auth/authSlice"
import airLogo from "../../assets/air.png"
import { useSidebar } from "../ui/sidebar"

export function NavUser() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {state} = useSidebar()
  
  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
    toast.success('Logged out successfully')
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center p-2">
          <img 
            src={airLogo} 
            alt="Airways India" 
            className="h-10 w-10 rounded-lg truncate"
          />
          {
            state==="expanded" && <> 
          <div className="ml-2 grid flex-1 text-left leading-tight">
            <span className="font-semibold text-base tracking-wide bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Airways India</span>
            <span className="text-xs text-gray-500">Attendance System</span>
          </div>
          </>
          }
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout} 
            className="ml-auto text-red-500 hover:text-red-700 hover:bg-red-100 cursor-pointer"
            title="Logout"
          >
            <LogOut className="h-5 w-5 cursor-pointer" />
          </Button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
