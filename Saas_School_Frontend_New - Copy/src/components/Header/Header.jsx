import React from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useBreadcrumb } from "@/context/BreadCrumbContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import { IoIosLogOut } from "react-icons/io";
import { useTheme } from "@/context/ThemeContext";
import BreadCrumbComponent from "../BreadCrumb/BreadCrumbComponent";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setSchoolId, setUser } from "@/utils/auth/authSlice";
import authUrlApi from "@/common/auth";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const schoolId=useSelector((state)=>state?.auth?.schoolId)
  const logout = async () => {
    const res = await axios.post(`${authUrlApi.logout.url}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    if (res) {
      toast.success("Logout Successfully");
      dispatch(setUser(null));
      dispatch(setSchoolId(""));
      navigate("/login");
    }
  };

  return (
    <header
      className={` sticky top-0 z-50 flex  h-[90px] shrink-0 items-center gap-2 transition-[width,height]  ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-20 justify-between   ${
        theme === "light"
          ? "bg-[#242424] border-b border-[#2f2f2f]"
          : "bg-[#c4a7db]"
      } shadow-md  `}
    >
      {/* sidebar trigger and nav header */}
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger
          className={`-ml-1  ${
            theme === "light" ? "text-white" : "text-black"
          } `}
        />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {/* this is the nav header  */}
        <BreadCrumbComponent />
        {/* nav header end here  */}
      </div>
      {/* Nav icons goes here */}
      <div className="flex items-center gap-4 sm:gap-10 px-4 sm:px-8 mr-4">
        {/* light and dark mode  */}
        <div
          onClick={toggleTheme}
          className="bg-[#b58bca] rounded-full p-2 cursor-pointer"
        >
          {" "}
          {theme === "dark" ? (
            <LightModeIcon fontSize="medium" />
          ) : (
            <DarkModeIcon fontSize="medium" />
          )}{" "}
        </div>
        {/* for notification icon */}
        <div className="bg-[#b58bca] rounded-full p-2 cursor-pointer">
          <NotificationsNoneIcon fontSize="medium" />{" "}
        </div>
        {/* for mail icon  */}
        <div className="bg-[#b58bca] rounded-full p-2 cursor-pointer">
          <MailOutlineIcon fontSize="medium" />{" "}
        </div>
        {/* for user icon  */}
        <div
          onClick={logout}
          className="bg-[#b58bca] rounded-full p-2 cursor-pointer"
        >
          <LogoutIcon fontSize="medium" />{" "}
        </div>
      </div>
    </header>
  );
};

export default Header;
