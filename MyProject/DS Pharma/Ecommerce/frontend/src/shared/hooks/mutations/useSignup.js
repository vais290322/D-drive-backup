import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { decodeToken } from "@/shared/utils/decodeToken";
import toastUtil from "@/shared/utils/toast";

/**
 * Hook to handle user signup
 * Creates a new user in the backend and logs them in
 */
export const useSignup = () => {
  const navigate = useNavigate();
  const { login: storeLogin } = useAuthStore();

  return useMutation({
    mutationFn: async (userData) => {
      // payload: { name, email, phone, password }
      const response = await authService.register(userData);
      return response;
    },

    onSuccess: (response) => {
      let user = response.data?.user || response.user;
      const token = response.data?.token || response.token;

      if (!token) {
        navigate("/login");
        return;
      }

      // If user data is missing from response, decode it from token
      if (!user) {
        const decoded = decodeToken(token);
        if (decoded) {
          user = {
            id: decoded.id || decoded.sub || decoded._id,
            role: decoded.role || "user",
            email: decoded.email,
          };
        }
      }

      // Log in the new user
      storeLogin(user, token);

      toastUtil.success("Account created successfully!");

      // Role-based redirection
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get("redirect");

      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(redirectPath || "/");
      }
    },

    onError: (err) => {
      const message = err.message || "Signup failed. Please try again.";
      toastUtil.error(message);
    },
  });
};
