import React from "react";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import legalBg from "../assets/v1-footerimage.jpg";
import theme from "../assets/researchtheme.png";

export const ResearchThemes = () => {
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
          <p className="text-sm md:text-[14px] text-gray-700 mt-4 mb-6 leading-relaxed">
            In order to understand how the society, economy and environment
            (SEE) intersect and interact, the underlying research themes at
            C-DRASTA span a variety of issues and development dilemmas from the
            three domains and as well as about how they overlap. C-DRASTA is
            sensitive to the fact that many of the development questions
            addressed are not only significant regionally but also gain in
            complexity as one moves to national and global arenas. Accordingly,
            social responsibility, economic viability and environmental
            sustainability, analysed across expanding concentric spatial
            constructs, constitute the three research pillars at C-DRASTA.
          </p>

          {/* Venn Diagram and Caption */}
          <div className="text-center">
            <div className="flex justify-center">
              <img
                src={theme}
                alt="Research Themes Venn Diagram"
                className="w-full max-w-3xl mx-auto border border-gray-200 shadow"
              />
            </div>
          </div>

          {/* Description Below */}
          <p className="text-sm md:text-[14px] text-gray-700 mt-6 leading-relaxed">
            The research team at C-DRASTA is equipped to undertake exploratory
            and analytical studies based on primary data from field surveys as
            well as large secondary databases, perception studies and outcome
            and formative evaluation studies, with a focus on CSR projects.
            Quantitative studies are complemented with qualitative research
            where necessary. With its in-house research team and its consultants
            across disciplines, C-DRASTA can provide research and analytical
            support to government departments, corporate houses, development
            practitioners and academics.
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
};
