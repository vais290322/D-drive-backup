import { logo } from "@/assets";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useToast } from "@/context/ToastContext";
import { logout } from "@/V2/app/features/auth/authAsyncThunk";
import { AppSidebar } from "@/V2/components";
import { sidebarItems } from "@/V2/config";
import { PanelLeftOpen } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";

export function AdminLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const segment = location.pathname.split("/").filter(Boolean).pop() || "";
  const label =
    segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();

      showToast("Logout successfully.", "success");
    } catch {
      showToast("Failed to logout!", "error");
    }
  };

  return (
    <>
      <header className="md:p-8 px-6 py-4 flex items-center md:gap-18">
        {/* Back button */}
        {/* <div className="px-4">
          <BackButton url="/home" className="w-full justify-center flex" />
        </div> */}

        <Link to="/home" className="relative group">
          <img
            src={logo}
            alt="Dashboard Logo"
            className="h-16 w-auto cursor-pointer"
          />
          {/* Tooltip */}
          <div
            className="
      absolute left-1/2 -translate-x-1/2 -bottom-8 
      opacity-0 group-hover:opacity-100
      pointer-events-none
      bg-black text-white text-xs px-2 py-1 rounded 
      whitespace-nowrap transition-all duration-200 z-50
    "
          >
            home
          </div>
        </Link>
        {/* For desktop view  */}
        <div className="text-2xl font-bold bg-gray-50 font-sans gap-4 items-center hidden md:flex">
          <PanelLeftOpen
            onClick={() => setOpen(true)}
            className="block md:hidden h-5"
          />
          <h1 className="text-[20px]">
            <span className="text-[1.1em]">Administration-</span> {label}
          </h1>
        </div>
      </header>
      <SidebarProvider className="relative">
        <AppSidebar
          onLogout={handleLogout}
          open={open}
          setOpen={setOpen}
          menuItems={sidebarItems}
        />
        <main className="w-full ">
          {/* For mobile view */}
          <div className="text-2xl font-bold font-sans gap-4 md:hidden flex items-center p-6">
            <PanelLeftOpen
              onClick={() => setOpen(true)}
              className="block md:hidden h-8"
            />
            <h1 className="text-[20px]">
              <span className="text-[1.1em]">Administration-</span> {label}
            </h1>
          </div>

          {/* Main content */}
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
}
