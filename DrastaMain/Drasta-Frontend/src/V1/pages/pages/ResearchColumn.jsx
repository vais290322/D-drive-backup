import React, { useState } from "react";
import { FaHandsHelping, FaFlask, FaBookOpen, FaClipboardList } from "react-icons/fa";
import CSR from "./ResearchColumn/CSR";
import OngoingResearch from "./ResearchColumn/OngoingResearch";
import CSRContent from "./ResearchColumn/CSRContent";

const PREMIUM_NAVY = "#181C2A";
const PREMIUM_GOLD = "#E8B245";
const WHITE = "#fff";

const tabData = [
  { key: "csr", label: "CSR Blog", icon: <FaBookOpen /> },
  { key: "ongoing", label: "Ongoing Research", icon: <FaClipboardList /> },
  { key: "csr-content", label: "CSR Content", icon: <FaHandsHelping /> },
];

const ResearchColumn = () => {
  const [activeTab, setActiveTab] = useState("csr");

  return (
    <div
      style={{ background: PREMIUM_NAVY, color: WHITE }}
      className="w-full mt-4 sm:mt-8 min-h-screen"
    >
      {/* Tabs */}
      <div className="flex flex-wrap sm:flex-nowrap overflow-x-auto border-b border-yellow-100 w-full cursor-pointer scrollbar-thin scrollbar-thumb-[#E8B245] scrollbar-track-[#181C2A]">
        {tabData.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-3 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-200 whitespace-nowrap focus:outline-none rounded-t-md ${
              activeTab === tab.key ? "border-b-4" : ""
            }`}
            style={{
              color: activeTab === tab.key ? PREMIUM_GOLD : WHITE,
              borderColor: activeTab === tab.key ? PREMIUM_GOLD : "transparent",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <span className="text-lg sm:text-xl">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-2 sm:p-6 w-full overflow-x-auto mt-4 sm:mt-8 min-h-[300px]">
        {activeTab === "csr" && <CSR />}
        {activeTab === "ongoing" && <OngoingResearch />} 
        {activeTab === "csr-content" && <CSRContent />} 
      </div>
    </div>
  );
};

export default ResearchColumn;