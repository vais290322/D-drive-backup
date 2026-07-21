import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { decodeToken } from "@/shared/utils/decodeToken";
import { useCartStore } from "@/store/useCartStore";
import { cartService } from "@/services/cartService";
import toastUtil from "@/shared/utils/toast";

/**
 * Hook to handle user login
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const { login: storeLogin } = useAuthStore();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await authService.login({ email, password });
      // console.log("login response in useLogin", response)
      return response;
    },

    onSuccess: async (response) => {
      // 1. Extract Token and User from response
      const token =
        response.data?.token || response.token || response.accessToken;
      let user = response.data || response.user || response.customer;

      // console.log("user in useLogin", user?.role)

      if (!token) {
        toastUtil.error("Invalid login response: No token received");
        return;
      }

      // 2. Persist Token for interceptor use
      localStorage.setItem("authToken", token);



      // 3. Extract identity from token if missing from login response
      if (!user) {
        const decoded = decodeToken(token);
        if (decoded) {
          user = {
            id: decoded.id || decoded.sub || decoded._id,
            role: decoded.role || "user",
            email: decoded.email,
          };
        } else {
          toastUtil.error("Login failed: Could not parse identity from token");
          return;
        }
      }

      // 4. Update global auth state
      storeLogin(user, token);

      // 5. Sync guest cart to backend
      const cartStore = useCartStore.getState();
      const hasGuestItems = cartStore.items.length > 0;
      if (hasGuestItems) {
        toastUtil.info("Syncing your cart...");
        await cartStore.syncLocalStorageToBackend(cartService);
      }

      toastUtil.success("Welcome back!");

      // 6. Navigate based on role or redirect param
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get("redirect");

      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        // If they had items, take them to the cart to complete checkout
        navigate(hasGuestItems ? "/cart" : redirectPath || "/");
      }
    },

    onError: (err) => {
      const message =
        err.message || "Login failed. Please check your credentials.";
      toastUtil.error(message);
    },
  });
};
