import React, { useState } from "react";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import legalBg from "../assets/v1-footerimage.jpg";
import { Plus, Minus } from "lucide-react";
import bookFontpage1 from "../assets/bookFontpage1.png";
import bookFontpage2 from "../assets/bookFontpage2.jpg";

export const ResearchProjects = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-470px)] bg-white">
        {/* Top Pattern Strip */}
        <div
          className="h-14 bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: `url(${legalBg})` }}
        ></div>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          {/* Title */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl  text-gray-800">Projects</h2>
            <span className="block h-[2px] w-16 md:w-20 bg-[#b2a65f] mt-2 mb-4 md:mb-6" />
          </div>

          {/* Accordion List */}
          <div className="space-y-3 md:space-y-4">
            {/* Item 1 */}
            <div
              className={`border border-[#b2a65f] rounded-lg overflow-hidden transition-all duration-300 ${
                openIndex === 0 ? "shadow-md" : "shadow-sm"
              }`}
            >
              <button
                onClick={() => handleToggle(0)}
                className={`w-full flex items-center justify-between p-3 md:p-4 text-left transition-colors duration-200 ${
                  openIndex === 0 ? "bg-gray-50" : "bg-white hover:bg-gray-50"
                }`}
                aria-expanded={openIndex === 0}
                aria-controls="project-1-content"
              >
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 rounded-sm p-1 mr-3 md:mr-4 hover:bg-[#A0CE4E] ${
                      openIndex === 0
                        ? "bg-[#A0CE4E] text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {openIndex === 0 ? (
                      <Minus className="w-3 h-3 md:w-4 md:h-4" />
                    ) : (
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                  </div>
                  <p
                    className={`text-sm md:text-base  text-left hover:text-[#A0CE4E] ${
                      openIndex === 0 ? "text-[#A0CE4E]" : "text-gray-700"
                    }`}
                  >
                    H. Addressing COVID-Learning Loss: Review of Effectiveness
                    of Nanritam's Education for All (EFA) Programme as a Model
                    Intervention for Rural India (2023)
                  </p>
                </div>
              </button>

              <div
                id="project-1-content"
                className={`px-4 transition-all duration-300 overflow-hidden ${
                  openIndex === 0
                    ? "max-h-[1000px] py-3 md:py-4 opacity-100"
                    : "max-h-0 py-0 opacity-0"
                }`}
              >
                <div className="space-y-3">
                  <p className="text-gray-500 mb-2 text-[14px] font-semibold">
                    Addressing COVID-Learning Loss: Review of Effectiveness of
                    Nanritam’s Education for All (EFA) Programme as a Model
                    Intervention for Rural India (2023)
                  </p>
                  <div className="flex justify-center">
                    <img
                      src={bookFontpage1}
                      alt="Financial Inclusion Book Cover"
                      className="max-w-full h-auto rounded-md shadow-sm border border-gray-200"
                    />
                  </div>
                  
                  <a href="https://drive.google.com/file/d/1LfA4TTLLxbTzKbFv6_6IQijMkYJBrQKZ/view" target="_blank">
                  <button className="w-full sm:w-auto bg-[#962725] hover:bg-[#7a1f1d] text-white font-medium py-2 px-6 rounded transition-colors duration-200">
                    View PDF
                  </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div
              className={`border border-[#b2a65f] rounded-lg overflow-hidden transition-all duration-300 ${
                openIndex === 1 ? "shadow-md" : "shadow-sm"
              }`}
            >
              <button
                onClick={() => handleToggle(1)}
                className={`w-full flex items-center justify-between p-3 md:p-4 text-left transition-colors duration-200 ${
                  openIndex === 1 ? "bg-gray-50" : "bg-white hover:bg-gray-50"
                }`}
                aria-expanded={openIndex === 1}
                aria-controls="project-2-content"
              >
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 rounded-sm p-1 mr-3 md:mr-4 hover:bg-[#A0CE4E] ${
                      openIndex === 1
                        ? "bg-[#A0CE4E] text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {openIndex === 1 ? (
                      <Minus className="w-3 h-3 md:w-4 md:h-4" />
                    ) : (
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                  </div>
                  <p
                    className={`text-sm md:text-base  text-left hover:text-[#A0CE4E] ${
                      openIndex === 1 ? "text-[#A0CE4E]" : "text-gray-700"
                    }`}
                  >
                    G. Impact Assessment Study of Nanritam’s Education For All
                    (EFA) Programme(2023)
                  </p>
                </div>
              </button>

              <div
                id="project-2-content"
                className={`px-4 transition-all duration-300 overflow-hidden ${
                  openIndex === 1
                    ? "max-h-[1000px] py-3 md:py-4 opacity-100"
                    : "max-h-0 py-0 opacity-0"
                }`}
              >
                <div className="space-y-3">
                  <p className="text-gray-500 mb-2 font-semibold text-[14px]">
                    Impact Assessment Study of Nanritam’s Education For All
                    (EFA) Programme(2023)
                  </p>
                  <div className="flex justify-center">
                    <img
                      src={bookFontpage2}
                      alt="Higher Education Book Cover"
                      className="max-w-full h-auto rounded-md shadow-sm border border-gray-200"
                    />
                  </div>
                  <a href="https://drive.google.com/file/d/1uvs2fnGnoLGt7oADRrB_vYXRERnVzYz2/view" target="_blank">
                  <button className="w-full sm:w-auto bg-[#962725] hover:bg-[#7a1f1d] text-white font-medium py-2 px-6 rounded transition-colors duration-200">
                    View PDF
                  </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Item 3 */}
            <div
              className={`border border-[#b2a65f] rounded-lg overflow-hidden transition-all duration-300 ${
                openIndex === 2 ? "shadow-md" : "shadow-sm"
              }`}
            >
              <button
                onClick={() => handleToggle(2)}
                className={`w-full flex items-center justify-between p-3 md:p-4 text-left transition-colors duration-200 ${
                  openIndex === 2 ? "bg-gray-50" : "bg-white hover:bg-gray-50"
                }`}
                aria-expanded={openIndex === 2}
                aria-controls="project-3-content"
              >
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 rounded-sm p-1 mr-3 md:mr-4 hover:bg-[#A0CE4E] ${
                      openIndex === 2
                        ? "bg-[#A0CE4E] text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {openIndex === 2 ? (
                      <Minus className="w-3 h-3 md:w-4 md:h-4" />
                    ) : (
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                  </div>
                  <p
                    className={`text-sm md:text-base  text-left hover:text-[#A0CE4E] ${
                      openIndex === 2 ? "text-[#A0CE4E]" : "text-gray-700"
                    }`}
                  >
                    F. Random Check Survey: Tobacco Use Among Adolescents Wave I
                    and Wave II (2019, 2020)
                  </p>
                </div>
              </button>

              <div
                id="project-3-content"
                className={`px-4 transition-all duration-300 overflow-hidden ${
                  openIndex === 2
                    ? "max-h-[500px] py-3 md:py-4 opacity-100"
                    : "max-h-0 py-0 opacity-0"
                }`}
              >
                <div className="pl-8 md:pl-10">
                  <strong className="text-gray-500 mb-2 text-[14px] font-semibold">
                    Random Check Survey: Tobacco Use Among Adolescents Wave I
                    and Wave II (2019, 2020)
                  </strong>
                  <p className="text-sm md:text-[14px] text-gray-600 pl-3 pt-5">
                    Project Brief (Wave I): Team C-DRAṢṬᾹ conducting Random
                    Check of 5% Eligible and Non-eligible Household in Kolkata
                    from Base Line Survey for the Longitudinal Study on
                    Adolescent Tobacco Use and Tobacco Control Policy in India.
                    This survey was about data quality check for the
                    longitudinal study on tobacco use conducted by Healis
                    Sekhsaria Institute of Public Health, Mumbai.
                  </p>
                  <p className="text-sm md:text-[14px] text-gray-600 pl-3 pt-5">
                    Project Brief (Wave I): Team C-DRAṢṬᾹ conducting Random
                    Check of 5% Eligible and Non-eligible Household in Kolkata
                    from Base Line Survey for the Longitudinal Study on
                    Adolescent Tobacco Use and Tobacco Control Policy in India.
                    This survey was about data quality check for the
                    longitudinal study on tobacco use conducted by Healis
                    Sekhsaria Institute of Public Health, Mumbai.
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`border border-[#b2a65f] rounded-lg overflow-hidden transition-all duration-300 ${
                openIndex === 3 ? "shadow-md" : "shadow-sm"
              }`}
            >
              <button
                onClick={() => handleToggle(3)}
                className={`w-full flex items-center justify-between p-3 md:p-4 text-left transition-colors duration-200 ${
                  openIndex === 3 ? "bg-gray-50" : "bg-white hover:bg-gray-50"
                }`}
                aria-expanded={openIndex === 3}
                aria-controls="project-3-content"
              >
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 rounded-sm p-1 mr-3 md:mr-4 hover:bg-[#A0CE4E] ${
                      openIndex === 3
                        ? "bg-[#A0CE4E] text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {openIndex === 3 ? (
                      <Minus className="w-3 h-3 md:w-4 md:h-4" />
                    ) : (
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                  </div>
                  <p
                    className={`text-sm md:text-base  text-left hover:text-[#A0CE4E] ${
                      openIndex === 3 ? "text-[#A0CE4E]" : "text-gray-700"
                    }`}
                  >
                    Education among Adivasis in Hingalganj, Sundarban (2019)
                  </p>
                </div>
              </button>

              <div
                id="project-3-content"
                className={`px-4 transition-all duration-300 overflow-hidden ${
                  openIndex === 3
                    ? "max-h-[500px] py-3 md:py-4 opacity-100"
                    : "max-h-0 py-0 opacity-0"
                }`}
              >
                <div className="pl-8 md:pl-10">
                  <strong className="text-gray-500 mb-2 text-[14px] font-semibold">
                    Education among Adivasis in Hingalganj, Sundarban (2019)
                  </strong>
                  <p className="text-sm md:text-[14px] text-gray-600 pl-3 pt-5">
                    Project Brief: Team C-DRAṢṬᾹ conducting the pilot survey for
                    the study Education amongst Adivasis in Hinalganj Block of
                    Sundarban, North 24 Parganas, West Bengal funded by
                    Rashtriya Uchhatara Siksha Abhiyan (RUSA- 2.0) and hosted by
                    JU. The researchers at C-DRAṢṬᾹ were instrumental in
                    developing thesurvey design, questionnaires for the field
                    survey and field team trainingfor the above study.The study
                    was designed to understand the status and reasons for
                    dropout from school education among Adivasis.
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`border border-[#b2a65f] rounded-lg overflow-hidden transition-all duration-300 ${
                openIndex === 4 ? "shadow-md" : "shadow-sm"
              }`}
            >
              <button
                onClick={() => handleToggle(4)}
                className={`w-full flex items-center justify-between p-3 md:p-4 text-left transition-colors duration-200 ${
                  openIndex === 4 ? "bg-gray-50" : "bg-white hover:bg-gray-50"
                }`}
                aria-expanded={openIndex === 4}
                aria-controls="project-3-content"
              >
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 rounded-sm p-1 mr-3 md:mr-4 hover:bg-[#A0CE4E] ${
                      openIndex === 4
                        ? "bg-[#A0CE4E] text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {openIndex === 4 ? (
                      <Minus className="w-3 h-3 md:w-4 md:h-4" />
                    ) : (
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                  </div>
                  <p
                    className={`text-sm md:text-base  text-left hover:text-[#A0CE4E] ${
                      openIndex === 4 ? "text-[#A0CE4E]" : "text-gray-700"
                    }`}
                  >
                    D. Intersection of Green Tourism and Capacity Building
                    (2019-20)
                  </p>
                </div>
              </button>

              <div
                id="project-3-content"
                className={`px-4 transition-all duration-300 overflow-hidden ${
                  openIndex === 4
                    ? "max-h-[500px] py-3 md:py-4 opacity-100"
                    : "max-h-0 py-0 opacity-0"
                }`}
              >
                <div className="pl-8 md:pl-10">
                  <strong className="text-gray-500 mb-2 text-[14px] font-semibold">
                    Sikkim’s Green Vision: Strategies and Capacity Building
                    ,Volume II – Intersections of Green Tourism and Capacity
                    Building (2019-20)
                  </strong>
                  <p className="text-sm md:text-[14px] text-gray-600 pl-3 pt-5">
                    Project Brief: Team C-DRAṢṬᾹ conducted telephonic, online
                    and face to face survey on tourism experience and green
                    awareness of tourist who had visited Sikkim at least once in
                    the past three years or was visiting Sikkim during the
                    survey.
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`border border-[#b2a65f] rounded-lg overflow-hidden transition-all duration-300 ${
                openIndex === 5 ? "shadow-md" : "shadow-sm"
              }`}
            >
              <button
                onClick={() => handleToggle(5)}
                className={`w-full flex items-center justify-between p-3 md:p-4 text-left transition-colors duration-200 ${
                  openIndex === 5 ? "bg-gray-50" : "bg-white hover:bg-gray-50"
                }`}
                aria-expanded={openIndex === 5}
                aria-controls="project-3-content"
              >
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 rounded-sm p-1 mr-3 md:mr-4 hover:bg-[#A0CE4E] ${
                      openIndex === 5
                        ? "bg-[#A0CE4E] text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {openIndex === 5 ? (
                      <Minus className="w-3 h-3 md:w-4 md:h-4" />
                    ) : (
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                  </div>
                  <p
                    className={`text-sm md:text-base  text-left hover:text-[#A0CE4E] ${
                      openIndex === 5 ? "text-[#A0CE4E]" : "text-gray-700"
                    }`}
                  >
                    C. Sikkim’s Green Vision: Strategies and Capacity Building -
                    Intersection of Green Tourism and Organic Mission (2018-19)
                  </p>
                </div>
              </button>

              <div
                id="project-3-content"
                className={`px-4 transition-all duration-300 overflow-hidden ${
                  openIndex === 5
                    ? "max-h-[500px] py-3 md:py-4 opacity-100"
                    : "max-h-0 py-0 opacity-0"
                }`}
              >
                <div className="pl-8 md:pl-10">
                  <strong className="text-gray-500 mb-2 text-[14px] font-semibold">
                    Sikkim’s Green Vision: Strategies and Capacity Building,
                    Volume I- Intersection of Green Tourism and Organic Mission
                    (2018-19)
                  </strong>
                  <p className="text-sm md:text-[14px] text-gray-600 pl-3 pt-5">
                    Project Brief: As the first step in contributing towards the
                    attainment of goal of Green Living and Livelihood generation
                    aligned with the UN Sustainable Development Goals 2030,
                    C-DRAṢṬᾹ undertook extensive secondary research with support
                    and funding from the Information and Public Relations
                    Department of Government of Sikkim. The research involved an
                    intensive and critical review of existing scientific
                    studies, government reports and independent assessments of
                    various green interventions implemented and experimented
                    across the globe with special focus on Sikkim. Sikkim is the
                    world’s first mover to experiment with these concepts under
                    the auspice of the Honourable Chief Minister, Shri. Pawan
                    Chamling, provided a suitable platform to explore these
                    issues.
                  </p>
                  <p className="text-sm md:text-[14px] text-gray-600 pl-3 pt-5">
                    The research study culminated as a book – a two volume
                    series on Sikkim’s Green Vision: Strategies and Capacity
                    Building. The study helped to delineate some of the best
                    practices that may be replicated in other regions with
                    similar settings and highlighted how various green
                    interventions specifically green tourism and organic farming
                    may help to reinforce and catalyze each other thereby
                    accelerating progress along the sustainable development
                    path. The book attempted to explore the intersections of the
                    different facets of Sikkim’s flagship programs. Eminent
                    policy makers, educationists and experts from various fields
                    contributed to the knowledge base of the book which was
                    co-authored by Dr. Rajlakshmi Mallik, Director, C-DRAṢṬᾹ
                    with Dr. Ajeya Jha, Professor and Head of Department, Sikkim
                    Manipal Institute of Technology (SMIT) and Dr. Sherab
                    Shenga, Secretary, Information and Public Relations
                    Department, Government of Sikkim.
                  </p>
                  <p className="text-sm md:text-[14px] text-gray-600 pl-3 pt-5">
                    The book was launched by Honourable Governor of Sikkim, Sri.
                    Ganga Prasad Chaurasia during Republic Day Celebrations 2019
                    and Honourable Ex Chief Minister of Sikkim Sri. Pawan
                    Chamling kindly consented to writing the foreword for the
                    book.
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`border border-[#b2a65f] rounded-lg overflow-hidden transition-all duration-300 ${
                openIndex === 6 ? "shadow-md" : "shadow-sm"
              }`}
            >
              <button
                onClick={() => handleToggle(6)}
                className={`w-full flex items-center justify-between p-3 md:p-4 text-left transition-colors duration-200 ${
                  openIndex === 6 ? "bg-gray-50" : "bg-white hover:bg-gray-50"
                }`}
                aria-expanded={openIndex === 6}
                aria-controls="project-3-content"
              >
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 rounded-sm p-1 mr-3 md:mr-4 hover:bg-[#A0CE4E] ${
                      openIndex === 6
                        ? "bg-[#A0CE4E] text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {openIndex === 6 ? (
                      <Minus className="w-3 h-3 md:w-4 md:h-4" />
                    ) : (
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                  </div>
                  <p
                    className={`text-sm md:text-base  text-left hover:text-[#A0CE4E] ${
                      openIndex === 6 ? "text-[#A0CE4E]" : "text-gray-700"
                    }`}
                  >
                    B. Impact of Education on Youth Employment in Rural India
                    (2018)
                  </p>
                </div>
              </button>

              <div
                id="project-3-content"
                className={`px-4 transition-all duration-300 overflow-hidden ${
                  openIndex === 6
                    ? "max-h-[500px] py-3 md:py-4 opacity-100"
                    : "max-h-0 py-0 opacity-0"
                }`}
              >
                <div className="pl-8 md:pl-10">
                  <strong className="text-gray-500 mb-2 text-[14px] font-semibold">
                    Impact of Education on Youth Employment in Rural India
                    (2018)
                  </strong>
                  <p className="text-sm md:text-[14px] text-gray-600 pl-3 pt-5">
                    Project Brief: C-DRAṢṬᾹ undertook a survey covering four
                    districts of West Bengal viz. North 24 Parganas, Jalpaiguri,
                    Malda and South Dinajpur for the study of Impact of
                    Education on Youth Employment in Rural India with focus on
                    West Bengal. The survey was based on research design
                    developed at C-DRAṢṬᾹ as part of research advisory for the
                    study with Dr. Rajlakshmi Mallik as the lead advisor from
                    C-DRAṢṬᾹ. The project was hosted and conducted by Department
                    of Economics, Rishi Bankim Chandra Evening College and
                    funded by University Grants Commission.
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`border border-[#b2a65f] rounded-lg overflow-hidden transition-all duration-300 ${
                openIndex === 7 ? "shadow-md" : "shadow-sm"
              }`}
            >
              <button
                onClick={() => handleToggle(7)}
                className={`w-full flex items-center justify-between p-3 md:p-4 text-left transition-colors duration-200 ${
                  openIndex === 7 ? "bg-gray-50" : "bg-white hover:bg-gray-50"
                }`}
                aria-expanded={openIndex === 7}
                aria-controls="project-3-content"
              >
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 rounded-sm p-1 mr-3 md:mr-4 hover:bg-[#A0CE4E] ${
                      openIndex === 7
                        ? "bg-[#A0CE4E] text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {openIndex === 7 ? (
                      <Minus className="w-3 h-3 md:w-4 md:h-4" />
                    ) : (
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                  </div>
                  <p
                    className={`text-sm md:text-base  text-left hover:text-[#A0CE4E] ${
                      openIndex === 7 ? "text-[#A0CE4E]" : "text-gray-700"
                    }`}
                  >
                    A. Status of Women in Science (2017)
                  </p>
                </div>
              </button>

              <div
                id="project-3-content"
                className={`px-4 transition-all duration-300 overflow-hidden ${
                  openIndex === 7
                    ? "max-h-[500px] py-3 md:py-4 opacity-100"
                    : "max-h-0 py-0 opacity-0"
                }`}
              >
                <div className="pl-8 md:pl-10">
                  <strong className="text-gray-500 mb-2 text-[14px] font-semibold">
                    Status of Women in Science (2017)
                  </strong>
                  <p className="text-sm md:text-[14px] text-gray-600 pl-3 pt-5">
                    Project Brief: As an extension on the Research theme Women
                    Empowerment: Key to Sustainable Societies, topical study on
                    Status of Women in Science, on pan India basis was
                    conducted. The research study involved a national level
                    survey of more than 1500 scientists and students of science
                    covering 20 states in India and Delhi NCT. The research team
                    consisting of in-house research assistants and 25 post
                    graduate and undergraduate student research interns from
                    several reputed universities and colleges of Kolkata viz.
                    Presidency University, University of Calcutta, University of
                    Kalyani, Bethune College and other were involved in data
                    collection, processing and data analysis and preparation of
                    the report. This project was funded by NITI AAYOG and
                    conducted at C-DRAṢṬᾹ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};
