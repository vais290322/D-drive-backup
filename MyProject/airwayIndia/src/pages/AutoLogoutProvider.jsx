import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EXPIRY_KEY = "authExpiry";

function clearAuthData() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userData");
  localStorage.removeItem(EXPIRY_KEY);
}

function isAuthExpired() {
  const expiry = localStorage.getItem(EXPIRY_KEY);
  if (!expiry) return true;
  return Date.now() > Number(expiry);
}

export default function AutoLogoutProvider({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthExpired()) {
      clearAuthData();
      toast("Session expired. Please login again.", { icon: "⏰" });
      navigate("/login", { replace: true });
    } else {
      const expiry = localStorage.getItem(EXPIRY_KEY);
      if (expiry) {
        const timeout = Number(expiry) - Date.now();
        if (timeout > 0) {
          const timer = setTimeout(() => {
            clearAuthData();
            toast("Session expired. Please login again.", { icon: "⏰" });
            navigate("/login", { replace: true });
          }, timeout);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [navigate]);

  return children;
}