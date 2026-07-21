import { useEffect } from "react";

const Logout = ({ onLogout }) => {
  useEffect(() => {
    if (onLogout) onLogout();
    window.location.replace("/");
  }, [onLogout]);
  return null;
};

export default Logout;
