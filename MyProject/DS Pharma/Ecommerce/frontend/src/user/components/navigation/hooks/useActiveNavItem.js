import { useLocation } from "react-router-dom";

/**
 * Hook to determine the active navigation item based on current route
 */
export const useActiveNavItem = () => {
  const location = useLocation();

  const getActiveItem = () => {
    const path = location.pathname;
    if (path === "/") return "Home";
    if (path === "/shop") return "Shop";
    if (path.startsWith("/categories") || path.startsWith("/category")) return "Categories";
    if (path.startsWith("/orders")) return "Orders";
    if (path.startsWith("/admin")) return "Admin Panel";
    if (path === "/about") return "About";
    if (path === "/contact") return "Contact";
    return path === "/" ? "Home" : "";
  };

  return getActiveItem();
};
