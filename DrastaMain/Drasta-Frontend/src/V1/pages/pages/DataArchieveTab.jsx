import React, { useState } from "react";
import { FaRegNewspaper, FaSlidersH, FaEye, FaHandsHelping } from "react-icons/fa";
import ResearchTeam from "./ResearchTeam";
import ExpertTeam from "./ExpertTeam";
import { UserSearch } from "lucide-react";
import { GrUserExpert } from "react-icons/gr";
import TrusteeTeam from "./TrusteeTeam";
import { TbMessageCircleUser } from "react-icons/tb";
import AdvisorTeam from "./AdvisorTeam";
import { RiAdminLine } from "react-icons/ri";
import AdminTeam from "./AdminTeam";
import InternTeam from "./InternTeam";
import Researchtheme from "./Researchtheme";
import TrainingTheme from "./TrainingTheme";
import ResearchProject from "./ResearchProject";
import News from "./News";
// import AdvisorList from "./Advisor/AdvisorList";
// import AddAdvisor from "./Advisor/AddAdvisor";
// import Reports from "./Advisor/Reports";
// import TeamOverview from "./Advisor/TeamOverview";

const PREMIUM_NAVY = "#181C2A";
const PREMIUM_GOLD = "#E8B245";
const WHITE = "#fff";

const tabData = [
  { key: "news", label: "News", icon:   <UserSearch /> },

];

const DataArchieveTab = () => {
  const [activeTab, setActiveTab] = useState("news");

  return (
    <div
      style={{ minHeight: "100vh", background: PREMIUM_NAVY, color: WHITE }}
      className="w-full mt-8"
    >
      {/* Top Tab Buttons */}
      <div className="flex border-b  border-yellow-100 cursor-pointer">
        {tabData.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-4 text-lg font-semibold flex items-center gap-2 transition-all duration-200 ${
              activeTab === tab.key ? "border-b-4" : ""
            }`}
            style={{
              color: activeTab === tab.key ? PREMIUM_GOLD : WHITE,
              borderColor: activeTab === tab.key ? PREMIUM_GOLD : "transparent",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="p-6 w-full overflow-x-auto mt-8">
        {activeTab === "news" && <News />}
      </div>
    </div>
  );
};

export default DataArchieveTab;
