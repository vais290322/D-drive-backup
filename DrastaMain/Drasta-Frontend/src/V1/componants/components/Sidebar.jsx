import React from "react";
import { NavLink } from "react-router-dom";
import { FaInfoCircle, FaUsers, FaRegLightbulb, FaBookOpen, FaArchive, FaUserTie, FaEnvelope } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";

const PREMIUM_NAVY = "#181C2A";
const PREMIUM_GOLD = "#E8B245";
const WHITE = "#fff";

const navItems = [
  { to: "/v1/dashboard", label: "Dashboard", icon: <LuLayoutDashboard /> },
  { to: "/v1/aboutus", label: "About Us", icon: <FaInfoCircle /> },
  { to: "/v1/team-drasta", label: "Team C-DRASTA", icon: <FaUsers /> },
  { to: "/v1/whatwedo", label: "What We Do", icon: <FaRegLightbulb /> },
  { to: "/v1/research-column", label: "Research Column", icon: <FaBookOpen /> },
  { to: "/v1/data-archive", label: "Data Archive", icon: <FaArchive /> },
  { to: "/v1/directors-desk", label: "Director's Desk", icon: <FaUserTie /> },
  { to: "/v1/contact-us", label: "Contact Us", icon: <FaEnvelope /> },
];

const Sidebar = () => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {}

  return (
    <aside
      className="max-w-64 h-screen fixed left-0 top-0 z-40 p-6 flex flex-col gap-8 shadow-2xl backdrop-blur-sm"
      style={{ 
        background: `linear-gradient(135deg, ${PREMIUM_NAVY} 0%, rgba(24,28,42,0.95) 100%)`,
        color: WHITE,
        borderRight: '1px solid rgba(232,178,69,0.1)'
      }}
    >
      <div className="flex items-center justify-center gap-3 mb-8">
        <span 
          className="text-3xl font-bold tracking-wider"
          style={{ 
            color: PREMIUM_GOLD,
            textShadow: '0 0 20px rgba(232,178,69,0.3)'
          }}
        >
          C-DRASTA
        </span>
      </div>
      <nav className="flex flex-col gap-3">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 font-medium text-base
              ${isActive 
                ? "bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 text-yellow-400 shadow-lg shadow-yellow-500/10" 
                : "hover:bg-yellow-500/10 hover:text-yellow-400 hover:translate-x-1"}`
            }
            style={({ isActive }) => ({
              color: isActive ? PREMIUM_GOLD : WHITE,
              background: isActive ? 'rgba(232,178,69,0.08)' : 'transparent',
              borderLeft: isActive ? `4px solid ${PREMIUM_GOLD}` : '4px solid transparent',
              transform: isActive ? 'translateX(4px)' : 'none',
            })}
            end={item.to === "/"}
          >
            <span 
              className="text-xl transition-transform duration-300 group-hover:scale-110"
              style={{ 
                color: PREMIUM_GOLD,
                filter: 'drop-shadow(0 0 8px rgba(232,178,69,0.3))'
              }}
            >
              {item.icon}
            </span>
            <span className="font-sans tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;