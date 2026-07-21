import React, { useEffect } from "react";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import legalBg from "../assets/v1-footerimage.jpg";
import theme from "../assets/researchtheme.png";
import api from "@/V2/service";
const API = import.meta.env.VITE_OLD_API_URL;
export const ResearchThemes = () => {
  const [research, setResearch] = React.useState([]);
  useEffect(() => {
    const fetchResearchThemes = async () => {
      try {
        const response = await fetch(`${API}/api/v1/research-theme`); // Adjust the API endpoint as needed
        const data = await response.json();
        setResearch(data?.themes[0]);
        console.log("Fetched Research Themes:", data?.themes[0]);
      } catch (error) {
        console.error("Error fetching research themes:", error);
      }
    };
    fetchResearchThemes();
  }, []);
  return (
    <>
      <Header />
      <div className="min-h-[49.6vh] bg-white">
        {/* Top Pattern Strip */}
        <div
          className="h-14 bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: `url(${legalBg})` }}
        ></div>
        <section className="max-w-6xl mx-auto px-4 py-12">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl  mb-2">
            Themes
            <span className="block h-[2px] w-16 bg-[#b2a65f] mt-1"></span>
          </h2>

          {/* Intro Paragraph */}
          <p className="text-sm text-gray-800 leading-relaxed text-justify">
            {research.contentHeader ||
              "In order to understand how the society, economy and environment (SEE) intersect and interact, the underlying research themes at C-DRASTA span a variety of issues and development dilemmas from the three domains as well as their overlaps. C-DRASTA is sensitive to the fact that many development questions addressed are not only regionally significant but also gain complexity at national and global levels. Accordingly, social responsibility, economic viability, and environmental sustainability—analysed across expanding concentric spatial constructs—constitute the three research pillars at C-DRASTA."}
          </p>

          {/* Venn Diagram and Caption */}
          <div className="text-center">
            <div className="flex justify-center">
              <img
                src={research.image || theme}
                alt="Research Themes Venn Diagram"
                className="w-full max-w-3xl mx-auto border border-gray-200 shadow"
              />
            </div>
          </div>

          {/* Description Below */}
          <p className="text-sm md:text-[14px] text-gray-700 mt-6 leading-relaxed">
            <p className="text-sm text-gray-800 leading-relaxed text-justify">
              {research.contentFooter ||
                "The research team at C-DRASTA is equipped to undertake exploratory and analytical studies based on primary data from field surveys as well as large secondary databases, perception studies, and outcome and formative evaluation studies, with a focus on CSR projects. Quantitative studies are complemented with qualitative research where necessary. With its in-house research team and its consultants across disciplines, C-DRASTA can provide research and analytical support to government departments, corporate houses, development practitioners, and academics."}
            </p>
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
};
