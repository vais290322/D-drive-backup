import React, { useState } from "react";
import { FaRegNewspaper, FaSlidersH, FaEye, FaLeaf, FaEnvelopeOpenText, FaBookOpen } from "react-icons/fa";
import News from "./Aboutus/News";
import Slider from "./Aboutus/Slider";
import Overview from "./Aboutus/Overview";
import GreenLevel from "./Aboutus/GreenLevel";
import Enquiry from "./Aboutus/Enquiry";
import Rescerch from "./Aboutus/Rescerch";
import MissionHistoryCrud from "./Aboutus/MissionHistoryCrud";
import Gallery from "./Aboutus/Gallery";
import { GoHistory } from "react-icons/go";
import { GrGallery } from "react-icons/gr";


const PREMIUM_NAVY = "#181C2A";
const PREMIUM_GOLD = "#E8B245";
const WHITE = "#fff";

const tabData = [
  { key: "news", label: "News", icon: <FaRegNewspaper /> },
  { key: "slider", label: "Slider", icon: <FaSlidersH /> },
  { key: "overview", label: "Overview", icon: <FaEye /> },
  { key: "greenLevel", label: "Green Level", icon: <FaLeaf /> },
  { key: "enquiry", label: "Enquiry", icon: <FaEnvelopeOpenText /> },
  { key: "rescerch", label: "Higher Studies and Research", icon: <FaBookOpen /> },
  { key: "mission", label: "Mission History", icon: <GoHistory /> },
  { key: "gallery", label: "Gallery", icon: <GrGallery /> },
];

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState("news");

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
        {activeTab === "news" && <News />}
        {activeTab === "slider" && <Slider />}
        {activeTab === "overview" && <Overview />}
        {activeTab === "greenLevel" && <GreenLevel />}
        {activeTab === "enquiry" && <Enquiry />}
        {activeTab === "rescerch" && <Rescerch />}
        {activeTab === "mission" && <MissionHistoryCrud />}
        {activeTab === "gallery" && <Gallery />}
      </div>
    </div>
  );
};

export default AboutUs;
