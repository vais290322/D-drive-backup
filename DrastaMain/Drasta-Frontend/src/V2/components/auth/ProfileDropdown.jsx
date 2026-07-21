import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/context/ToastContext";
import { logout } from "@/V2/app/features/auth/authAsyncThunk";
import { USER_ROLES } from "@/V2/config";
import { KeyRound, LogOut, User as UserIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export function ProfileDropdown({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      showToast("Logout successfully.", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to logout!", "error");
    }
  };

  const getUserInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserRole = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return "Administrator";
      case USER_ROLES.USER:
        return "User";
      case USER_ROLES.VOLUNTEER:
        return "Volunteer";
      default:
        return "User";
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-1 rounded-full focus:outline-none hover:scale-110 transition-transform duration-200 cursor-pointer">
          <Avatar className="w-10 h-10 ring-2 ring-white/50 shadow-lg hover:ring-[var(--secondary-color)]/50 transition-all duration-200">
            <AvatarImage src={user.avatar} alt={user.fullName} />
            <AvatarFallback className="bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] text-white font-bold">
              {getUserInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent
          sideOffset={8}
          align="end"
          className="w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-in slide-in-from-top-2 duration-200"
        >
          {/* Profile Header */}
          <div className="relative p-6 bg-gradient-to-br from-[var(--primary-color)]/5 to-[var(--secondary-color)]/5 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-14 h-14 ring-3 ring-white shadow-lg">
                  <AvatarImage src={user.avatar} alt={user.fullName} />
                  <AvatarFallback className="bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] text-white font-bold text-lg">
                    {getUserInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full"></div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-[var(--primary-color)] truncate">
                  {user.fullName}
                </h3>
                {user.email && (
                  <p className="text-sm text-gray-600 truncate mb-2">
                    {user.email}
                  </p>
                )}
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                  {getUserRole(user.role)}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            {user.stats && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 text-center border border-white/30">
                  <div className="text-lg font-bold text-[var(--primary-color)]">
                    {user.stats.contributions || 0}
                  </div>
                  <div className="text-xs text-gray-600">Contributions</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 text-center border border-white/30">
                  <div className="text-lg font-bold text-[var(--secondary-color)]">
                    {user.stats.hours || 0}
                  </div>
                  <div className="text-xs text-gray-600">Hours</div>
                </div>
              </div>
            )}
          </div>

          {/* Volunteer View Profile (conditional) */}
          {user?.role === USER_ROLES.VOLUNTEER && (
            <>
              <DropdownMenuSeparator className="my-0" />
              <div className="p-2">
                <DropdownMenuItem
                  onClick={() => navigate("/volunteer_log")}
                  className="flex items-center px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer rounded-lg mb-1 transition-colors duration-200"
                >
                  <UserIcon
                    size={18}
                    className="mr-3 text-[var(--primary-color)]"
                  />
                  <span className="font-medium">View Profile</span>
                </DropdownMenuItem>
              </div>
            </>
          )}

          {/* Reset Password */}
          <DropdownMenuSeparator />
          <div className="p-2">
            <DropdownMenuItem
              onClick={() => navigate("/reset-password")}
              className="flex items-center px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer rounded-lg mb-1 transition-colors duration-200"
            >
              <KeyRound
                size={18}
                className="mr-3 text-[var(--secondary-color)]"
              />
              <span className="font-medium">Reset Password</span>
            </DropdownMenuItem>
          </div>

          {/* Logout */}
          <DropdownMenuSeparator />
          <div className="p-2">
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 cursor-pointer rounded-lg transition-colors duration-200"
            >
              <LogOut size={18} className="mr-3" />
              <span className="font-medium">Logout</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
