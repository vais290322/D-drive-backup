import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiClipboard,
  FiCreditCard,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import { FaIndianRupeeSign, FaReceipt } from "react-icons/fa6";
import { GrPlan } from "react-icons/gr";
import { PiStudentBold } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import { Banknote, Calendar } from "lucide-react";
import toast from "react-hot-toast";

const Sidebar = ({ isMobile, onClose }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("userData"));

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    toast.success("Logged out successfully");
    if (onClose) onClose();
    window.location.replace("/login");
  };

  const menuItems = [
    {
      label: "Dashboard",
      to: "/",
      //  icon: <RxDashboard size={20} />
    },
    {
      label: "Payments",
      to: "/payments",
      // icon: <FaIndianRupeeSign size={20} />,
    },
    {
      label: "Courses",
      to: "/courses",
      //  icon: <FiBook size={20} />
    },
    {
      label: "Students",
      to: "/students",
      // icon: <PiStudentBold size={20} />
    },

    {
      label: "Cheque Lists",
      to: "/cheque",
      // icon: <Banknote size={20} />
    },
  ];

  return (
    <>
      {/* Mobile Drawer */}
      {isMobile && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-40"
          onClick={onClose}
        >
          <aside
            className="w-64 h-full bg-red-500 shadow-md p-6  absolute top-0 left-0 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="text-red-600 text-xl mb-4">
              <FiX />
            </button>

            {/* User info 
            {user && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">Welcome,</p>
                <p className="font-medium text-gray-800">Admin</p>
              </div>
            )} */}

            <ul className="space-y-2">
              {menuItems.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.to}
                    className={`h-10 flex items-center justify-center text-[#AA1C26] font-bold transition-all duration-200
  ${
    location.pathname === item.to
      ? "bg-white text-[#E3222B] rounded-3xl px-4"
      : "hover:bg-white hover:text-red-500"
  }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              {/* Logout button */}
              <li className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 font-medium transition-all duration-200 hover:bg-red-50 hover:text-red-600 w-full"
                >
                  <FiLogOut size={20} />
                  Logout
                </button>
              </li>
            </ul>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
<aside className="hidden md:block w-64 bg-[#ECE0E0] text-white shadow-sm pt-24 pb-6 h-[700px] fixed top-0 left-0">
  <ul className="space-y-4">
    {menuItems.map((item, idx) => (
      <li key={idx} className="w-full">
<Link
  to={item.to}
  className={`w-full flex items-center justify-end gap-3 px-10 py-2 font-bold text-xl transition-all duration-200
    ${
      location.pathname === item.to
        ? "bg-white text-[#E3222B]"
        : "text-[#AA1C26] hover:bg-white hover:text-[#E3222B]"
    }`}
>
  <span className="text-right">{item.label}</span>
  {item.icon}
</Link>

      </li>
    ))}
  </ul>
</aside>

    </>
  );
};

export default Sidebar;
