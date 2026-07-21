import React, { useState, useEffect, useRef } from "react";
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
import { setSchoolId, setUser, logout as authLogout } from "@/utils/auth/authSlice";
import authUrlApi from "@/common/auth";
import { Bell, Loader2, X, Trash2 } from "lucide-react"; 
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";

import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "@/utils/notifications/notificationsSlice";

const Badge = ({ children, variant = "default", className = "" }) => {
  const baseStyles =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";

  const variantStyles = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-[#452B90] text-white",
    outline:
      "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const user = useSelector((state) => state?.auth?.user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isDarkTheme = theme === "light"; // In your app "light" theme seems to be dark

  // Notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Get notification data from Redux store
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const isLoading = useSelector((state) => state.notifications.loading);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch notifications using Redux
  const fetchUserNotifications = () => {
    dispatch(fetchNotifications());
  };

  // Set up notification polling
  useEffect(() => {
    fetchUserNotifications();

    // Set up polling for new notifications (every 30 seconds)
    const intervalId = setInterval(fetchUserNotifications, 30000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  // Handle notification click
  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.read) {
      dispatch(markNotificationAsRead(notification.id));
    }

    // Navigate based on notification type
    if (notification.type === "post") {
      navigate("/posts");
    } else if (notification.type === "assignment") {
      navigate("/student-assignment");
    } else if (notification.postId) {
      navigate(`/post-details/${notification.postId}`);
    } else {
      navigate("/posts");
    }

    // Close notification panel
    setShowNotifications(false);
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  // Handle delete notification
  const handleDeleteNotification = (e, notificationId) => {
    e.stopPropagation(); // Prevent triggering the notification click
    dispatch(deleteNotification(notificationId));
  };

  // Handle delete all notifications
  const handleDeleteAllNotifications = () => {
    dispatch(deleteAllNotifications());
    setShowNotifications(false);
  };

  // Handle logout
  const logout = async () => {
    try {
      setIsLoggingOut(true);
      const res = await axios.post(`${authUrlApi.logout.url}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res) {
        toast.success("Logged out successfully");
        // dispatch(setUser(null));
        // dispatch(setSchoolId(""));
        dispatch(authLogout());
        navigate("/login"); 
      }
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 flex h-[70px] shrink-0 items-center gap-2 transition-all duration-300 ease-in-out justify-between ${
        isDarkTheme
          ? "bg-gray-800 border-b border-gray-700 text-white"
          : "bg-gradient-to-r from-purple-100 to-indigo-100 border-b border-gray-200 text-gray-800"
      } shadow-md`}
    >
      {/* sidebar trigger and nav header */}
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger
          className={`-ml-1 hover:bg-opacity-80 transition-colors ${
            isDarkTheme
              ? "text-white hover:text-gray-300"
              : "text-gray-800 hover:text-gray-600"
          }`}
        />
        <Separator
          orientation="vertical"
          className={`mr-2 h-5 ${isDarkTheme ? "bg-gray-600" : "bg-gray-300"}`}
        />
        {/* this is the nav header  */}
        <BreadCrumbComponent />
        {/* nav header end here  */}
      </div>

      {/* Nav icons goes here */}
      <div className="flex items-center gap-3 sm:gap-5 px-4 sm:px-6 mr-2">
        {/* light and dark mode with tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleTheme}
                className={`rounded-full p-2.5 cursor-pointer transition-all duration-300 hover:shadow-md ${
                  isDarkTheme
                    ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                    : "bg-indigo-100 hover:bg-indigo-200 text-indigo-600"
                }`}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <LightModeIcon fontSize="small" />
                ) : (
                  <DarkModeIcon fontSize="small" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Toggle {theme === "dark" ? "Light" : "Dark"} Mode</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* for notification icon with tooltip */}
        <div className="relative" ref={notificationRef}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications) {
                      fetchUserNotifications();
                    }
                  }}
                  className={`rounded-full p-2.5 cursor-pointer transition-all duration-300 hover:shadow-md ${
                    isDarkTheme
                      ? "bg-gray-700 hover:bg-gray-600 text-blue-400"
                      : "bg-indigo-100 hover:bg-indigo-200 text-indigo-600"
                  }`}
                  aria-label="Notifications"
                >
                  <NotificationsNoneIcon fontSize="small" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Badge>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Notification dropdown */}
          {showNotifications && (
            <div
              className={`absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-md shadow-lg ${
                isDarkTheme
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div
                className={`p-3 flex justify-between items-center border-b ${
                  isDarkTheme ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h3
                  className={`font-medium ${
                    isDarkTheme ? "text-white" : "text-gray-800"
                  }`}
                >
                  Notifications
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className={`text-xs px-2 py-1 rounded ${
                        isDarkTheme
                          ? "bg-gray-700 text-blue-400 hover:bg-gray-600"
                          : "bg-gray-100 text-blue-600 hover:bg-gray-200"
                      }`}
                    >
                      Mark all as read
                    </button>
                  )}

                  {notifications.length > 0 && (
                    <button
                      onClick={handleDeleteAllNotifications}
                      className={`text-xs px-2 py-1 rounded ${
                        isDarkTheme
                          ? "bg-red-900 text-red-100 hover:bg-red-800"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                    >
                      Clear all
                    </button>
                  )}

                  <button
                    onClick={() => setShowNotifications(false)}
                    className={`p-1 rounded-full ${
                      isDarkTheme
                        ? "text-gray-400 hover:text-white hover:bg-gray-700"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : notifications.length > 0 ? (
                <div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-3 border-b cursor-pointer transition-colors ${
                        isDarkTheme
                          ? "border-gray-700 hover:bg-gray-700"
                          : "border-gray-100 hover:bg-gray-50"
                      } ${
                        !notification.read
                          ? isDarkTheme
                            ? "bg-gray-700"
                            : "bg-blue-50"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`rounded-full p-2 ${
                            isDarkTheme
                              ? "bg-gray-600 text-blue-400"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          <Bell size={16} />
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${
                              isDarkTheme ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              isDarkTheme ? "text-gray-400" : "text-gray-500"
                            }`}
                            title={notification.message}
                          >
                            {notification.message}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              isDarkTheme ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              { addSuffix: true }
                            )}
                          </p>
                        </div>
                        {!notification.read && (
                          <div
                            className={`h-2 w-2 rounded-full ${
                              isDarkTheme ? "bg-blue-400" : "bg-blue-500"
                            }`}
                          />
                        )}
                        <button
                          onClick={(e) =>
                            handleDeleteNotification(e, notification._id)
                          }
                          className={`p-1 rounded-full ${
                            isDarkTheme
                              ? "text-gray-400 hover:text-red-400 hover:bg-gray-600"
                              : "text-gray-500 hover:text-red-500 hover:bg-gray-200"
                          }`}
                          aria-label="Delete notification"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`p-4 text-center ${
                    isDarkTheme ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No notifications
                </div>
              )}
            </div>
          )}
        </div>

        {/* for mail icon with tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`rounded-full p-2.5 cursor-pointer transition-all duration-300 hover:shadow-md ${
                  isDarkTheme
                    ? "bg-gray-700 hover:bg-gray-600 text-green-400"
                    : "bg-indigo-100 hover:bg-indigo-200 text-indigo-600"
                }`}
                aria-label="Messages"
              >
                <MailOutlineIcon fontSize="small" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Messages</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* for logout icon with tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={logout}
                disabled={isLoggingOut}
                className={`rounded-full p-2.5 cursor-pointer transition-all duration-300 hover:shadow-md ${
                  isDarkTheme
                    ? "bg-gray-700 hover:bg-red-700 text-red-400 hover:text-white"
                    : "bg-indigo-100 hover:bg-red-100 text-indigo-600 hover:text-red-600"
                } ${isLoggingOut ? "opacity-70 cursor-not-allowed" : ""}`}
                aria-label="Logout"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <LogoutIcon fontSize="small" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{isLoggingOut ? "Logging out..." : "Logout"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};

export default Header;
