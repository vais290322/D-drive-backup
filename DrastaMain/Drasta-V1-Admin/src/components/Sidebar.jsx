import React from "react";
import { NavLink } from "react-router-dom";
import {  FaInfoCircle, FaUsers, FaRegLightbulb, FaBookOpen, FaArchive, FaUserTie } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";

const PREMIUM_NAVY = "#181C2A";
const PREMIUM_GOLD = "#E8B245";
const WHITE = "#fff";

const navItems = [
  { to: "/v1-dashboard", label: "Dashboard", icon: <LuLayoutDashboard /> },
  { to: "/aboutus", label: "About Us", icon: <FaInfoCircle /> },
  { to: "/team-drasta", label: "Team C-DRASTA", icon: <FaUsers /> },
  { to: "/whatwedo", label: "What We Do", icon: <FaRegLightbulb /> },
  { to: "/research-column", label: "Research Column", icon: <FaBookOpen /> },
  { to: "/data-archive", label: "Data Archive", icon: <FaArchive /> },
  { to: "/directors-desk", label: "Director's Desk", icon: <FaUserTie /> },
];

const Sidebar = () => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {}
  return (
    <aside
      className="w-64 h-screen fixed left-0 top-0 z-40 p-6 flex flex-col gap-8 shadow-2xl"
      style={{ background: PREMIUM_NAVY, color: WHITE }}
    >
      <div className="flex items-center justify-center gap-3 mb-8">
        <span className="text-2xl font-bold tracking-wide" style={{ color: PREMIUM_GOLD }}>C-DRASTA</span>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition font-semibold text-base ${isActive ? "bg-gradient-to-r from-yellow-200/60 to-yellow-100/10 text-yellow-900 shadow-lg" : "hover:bg-yellow-100/10 hover:text-yellow-300"}`
            }
            style={({ isActive }) => ({
              color: isActive ? PREMIUM_GOLD : WHITE,
              background: isActive ? 'rgba(232,178,69,0.10)' : 'transparent',
              borderLeft: isActive ? `4px solid ${PREMIUM_GOLD}` : '4px solid transparent',
            })}
            end={item.to === "/"}
          >
            <span className="text-xl" style={{ color: PREMIUM_GOLD }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 