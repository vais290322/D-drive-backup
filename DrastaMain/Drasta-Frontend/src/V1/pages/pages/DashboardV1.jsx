import React from "react";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle, FaUsers, FaRegLightbulb, FaBookOpen, FaArchive, FaUserTie } from "react-icons/fa";

const PREMIUM_NAVY = "#181C2A";
const PREMIUM_GOLD = "#E8B245";
const WHITE = "#fff";

const pages = [
  {
    to: "/v1/aboutus",
    icon: <FaInfoCircle size={36} />,
    title: "About Us",
    desc: "Learn more about DRASTA's mission, vision, and values.",
  },
  {
    to: "/v1/team-drasta",
    icon: <FaUsers size={36} />,
    title: "Team C-DRASTA",
    desc: "Meet the passionate team driving DRASTA forward.",
  },
  {
    to: "/v1/whatwedo",
    icon: <FaRegLightbulb size={36} />,
    title: "What We Do",
    desc: "Discover our core activities, services, and impact.",
  },
  {
    to: "/v1/research-column",
    icon: <FaBookOpen size={36} />,
    title: "Research Column",
    desc: "Explore our latest research, articles, and insights.",
  },
  {
    to: "/v1/data-archive",
    icon: <FaArchive size={36} />,
    title: "Data Archive",
    desc: "Access our curated archive of data and resources.",
  },
  {
    to: "/v1/directors-desk",
    icon: <FaUserTie size={36} />,
    title: "Director's Desk",
    desc: "Messages and updates from the Director's Desk.",
  },
];

const DashboardV1 = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full flex flex-col items-center mt-8" style={{ background: PREMIUM_NAVY }}>
      <div className="w-full px-4 py-12 mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight" style={{ color: PREMIUM_GOLD }}>
            Welcome to DRASTA Dashboard
          </h1>
          <p className="text-lg md:text-xl" style={{ color: WHITE, opacity: 0.85 }}>
            Explore our organization, team, research, and resources.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 cursor-pointer">
          {pages.map((page) => (
            <div
              key={page.to}
              className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-yellow-100 transition-transform hover:scale-105 hover:shadow-yellow-200"
              style={{ boxShadow: '0 8px 32px 0 rgba(232,178,69,0.10)' }}
            >
              <div className="mb-4" style={{ color: PREMIUM_GOLD }}>{page.icon}</div>
              <div className="text-xl font-bold mb-2" style={{ color: PREMIUM_NAVY }}>{page.title}</div>
              <div className="text-sm mb-6 text-center" style={{ color: PREMIUM_NAVY, opacity: 0.8 }}>{page.desc}</div>
              <button
                className="px-5 py-2 rounded-full font-semibold transition-colors duration-200 cursor-pointer"
                style={{
                  background: PREMIUM_GOLD,
                  color: PREMIUM_NAVY,
                  border: `1px solid ${PREMIUM_GOLD}`,
                }}
                onClick={() => navigate(page.to)}
                onMouseOver={e => e.currentTarget.style.background = '#c89c2b'}
                onMouseOut={e => e.currentTarget.style.background = PREMIUM_GOLD}
              >
                Go to {page.title}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardV1; 