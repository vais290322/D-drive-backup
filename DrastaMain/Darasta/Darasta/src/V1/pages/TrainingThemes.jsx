import React from "react";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import legalBg from "../assets/v1-footerimage.jpg";
import theme from "../assets/researchtheme1.jpg";
export const TrainingThemes = () => {
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
            In C-DRAṢṬᾹ, the experience gained through ongoing research projects
            feeds into training programs. C-DRAṢṬᾹ also emphasizes the
            importance of different types of research perspectives for
            addressing any development dilemma. Training at C-DRAṢṬᾹ, which is
            realized through{" "}
            <strong className="text-gray-500">Competency Enhancing Workshops (CEWs)</strong>, is linked
            with the various stages of the research process. They
            enableparticipants to provide effective end-to-end solutions to
            various development problems. CEWs consist of modules that are
            stand-alone or collated based on a theme which may be a particular
            research stage or research approach Alternatively, CEWs could also
            correspond to applications in a particular domain(such as education,
            women’s studies, health, etc.). Experts from both academics and
            industry conduct the training sessions. The CEWs benefit
            participants acrossthesocial and environmental sciences as also
            those from different vocations,such as corporate executives,
            administrators, bureaucrats, young professionals, NGO workers,
            students and researchers. However a major thrust area of the CEWs is
            on imparting training for the design and implementation of
            evaluation studies forsocio-economic development projects under CSR.
          </p>
          <p className="text-sm md:text-[14px] text-gray-700 mt-4 mb-6 leading-relaxed">
            In order to achieve its objectives the program design will be
            customized based on feedback from industry, potential trainees and
            advisors from academia and practitioners. An illustrative
            classification of CEWs on <strong className="text-gray-500">Research Methods and its Applications,</strong>  based on participant need, is provided below.
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
          {/* <p className="text-sm md:text-base text-gray-700 mt-6 leading-relaxed">
          The research team at C-DRASTA is equipped to undertake exploratory
          and analytical studies based on primary data from field surveys as
          well as large secondary databases, perception studies and outcome
          and formative evaluation studies, with a focus on CSR projects.
          Quantitative studies are complemented with qualitative research
          where necessary. With its in-house research team and its consultants
          across disciplines, C-DRASTA can provide research and analytical
          support to government departments, corporate houses, development
          practitioners and academics.
        </p> */}
        </section>
      </div>

      <Footer />
    </>
  );
};
