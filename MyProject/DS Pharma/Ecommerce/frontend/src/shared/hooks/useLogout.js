import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import toastUtil from "@/shared/utils/toast";

export const useLogout = () => {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);

  const logout = () => {
    // 1. Clear authentication state
    logoutStore();

    // 2. Redirect to homepage
    navigate("/", { replace: true });

    // 3. Show success message
    toastUtil.success("Signed out successfully");
  };

  return logout;
};
