import React, { useEffect, useState } from "react";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import legalBg from "../assets/v1-footerimage.jpg";
import { Plus, Minus } from "lucide-react";
import bookFontpage1 from "../assets/bookFontpage1.png";
import bookFontpage2 from "../assets/bookFontpage2.jpg";

// const projects = [
//   {
//     id: 0,
//     title: "H. Addressing COVID-Learning Loss: Review of Effectiveness of Nanritam's Education for All (EFA) Programme as a Model Intervention for Rural India (2023)",
//     content: (
//       <>
//         <p className="text-gray-500 mb-2 text-[14px] font-semibold">
//           Addressing COVID-Learning Loss: Review of Effectiveness of Nanritam's Education for All (EFA) Programme as a Model Intervention for Rural India (2023)
//         </p>
//         <div className="flex justify-center">
//           <img
//             src={bookFontpage1}
//             alt="Financial Inclusion Book Cover"
//             className="max-w-full h-auto rounded-md shadow-sm border border-gray-200"
//           />
//         </div>
//         <a href="https://drive.google.com/file/d/1LfA4TTLLxbTzKbFv6_6IQijMkYJBrQKZ/view" target="_blank">
//           <button className="w-full sm:w-auto bg-[#962725] hover:bg-[#7a1f1d] text-white font-medium py-2 px-6 rounded transition-colors duration-200">
//             View PDF
//           </button>
//         </a>
//       </>
//     ),
//     isImage: true
//   },
//   {
//     id: 1,
//     title: "G. Impact Assessment Study of Nanritam's Education For All (EFA) Programme(2023)",
//     content: (
//       <>
//         <p className="text-gray-500 mb-2 font-semibold text-[14px]">
//           Impact Assessment Study of Nanritam's Education For All (EFA) Programme(2023)
//         </p>
//         <div className="flex justify-center">
//           <img
//             src={bookFontpage2}
//             alt="Higher Education Book Cover"
//             className="max-w-full h-auto rounded-md shadow-sm border border-gray-200"
//           />
//         </div>
//         <a href="https://drive.google.com/file/d/1uvs2fnGnoLGt7oADRrB_vYXRERnVzYz2/view" target="_blank">
//           <button className="w-full sm:w-auto bg-[#962725] hover:bg-[#7a1f1d] text-white font-medium py-2 px-6 rounded transition-colors duration-200">
//             View PDF
//           </button>
//         </a>
//       </>
//     ),
//     isImage: true
//   },
//   {
//     id: 2,
//     title: "F. Random Check Survey: Tobacco Use Among Adolescents Wave I and Wave II (2019, 2020)",
//     content: (
//       <>
//         <strong className="text-gray-500 mb-2 text-[14px] font-semibold">
//           Random Check Survey: Tobacco Use Among Adolescents Wave I and Wave II (2019, 2020)
//         </strong>
//         <p className="text-sm md:text-[14px] text-gray-600 pl-3 pt-5">
//           Project Brief (Wave I): Team C-DRAṢṬᾹ conducting Random Check of 5% Eligible and Non-eligible Household in Kolkata from Base Line Survey for the Longitudinal Study on Adolescent Tobacco Use and Tobacco Control Policy in India. This survey was about data quality check for the longitudinal study on tobacco use conducted by Healis Sekhsaria Institute of Public Health, Mumbai.
//         </p>
//         <p className="text-sm md:text-[14px] text-gray-600 pl-3 pt-5">
//           Project Brief (Wave I): Team C-DRAṢṬᾹ conducting Random Check of 5% Eligible and Non-eligible Household in Kolkata from Base Line Survey for the Longitudinal Study on Adolescent Tobacco Use and Tobacco Control Policy in India. This survey was about data quality check for the longitudinal study on tobacco use conducted by Healis Sekhsaria Institute of Public Health, Mumbai.
//         </p>
//       </>
//     )
//   },
//   {
//     id: 3,
//     title: "Education among Adivasis in Hingalganj, Sundarban (2019)",
//     content: (
//       <>
//         <strong className="text-gray-500 mb-2 text-[14px] font-semibold">
//           Education among Adivasis in Hingalganj, Sundarban (2019)
//         </strong>
//         <p className="text-sm md:text-[14px] text-gray-600 pl-3 pt-5">
//           Project Brief: Team C-DRAṢṬᾹ conducting the pilot survey for the study Education amongst Adivasis in Hinalganj Block of Sundarban, North 24 Parganas, West Bengal funded by Rashtriya Uchhatara Siksha Abhiyan (RUSA- 2.0) and hosted by JU. The researchers at C-DRAṢṬᾹ were instrumental in developing thesurvey design, questionnaires for the field survey and field team trainingfor the above study.The study was designed to understand the status and reasons for dropout from school education among Adivasis.
//         </p>
//       </>
//     )
//   },
//   {
//     id: 4,
//     title: "D. Intersection of Green Tourism and Capacity Building (2019-20)",
//     content: (
//       <>
//         <strong className="text-gray-500 mb-2 text-[14px] font-semibold">
//           Sikkim's Green Vision: Strategies and Capacity Building ,Volume II – Intersections of Green Tourism and Capacity Building (2019-20)
//         </strong>
//         <p className="text-sm md:text-[14px] text-gray-600 pl-3 pt-5">
//           Project Brief: Team C-DRAṢṬᾹ conducted telephonic, online and face to face survey on tourism experience and green awareness of tourist who had visited Sikkim at least once in the past three years or was visiting Sikkim during the survey.
//         </p>
//       </>
//     )
//   },
//   {
//     id: 5,
//     title: "C. Sikkim's Green Vision: Strategies and Capacity Building - Intersection of Green Tourism and Organic Mission (2018-19)",
//     content: (
//       <>
//         <strong className="text-gray-500 mb-2 text-[14px] font-semibold">
//           Sikkim's Green Vision: Strategies and Capacity Building, Volume I- Intersection of Green Tourism and Organic Mission (2018-19)
//         </strong>
//         <p className="text-sm md:text-[14px] text-gray-600 pl-3 pt-5">
//           Project Brief: As the first step in contributing towards the attainment of goal of Green Living and Livelihood generation aligned with the UN Sustainable Development Goals 2030, C-DRAṢṬᾹ undertook extensive secondary research with support and funding from the Information and Public Relations Department of Government of Sikkim. The research involved an intensive and critical review of existing scientific studies, government reports and independent assessments of various green interventions implemented and experimented across the globe with special focus on Sikkim. Sikkim is the world's first mover to experiment with these concepts under the auspice of the Honourable Chief Minister, Shri. Pawan Chamling, provided a suitable platform to explore these issues.
//         </p>
//         <p className="text-sm md:text-[14px] text-gray-600 pl-3 pt-5">
//           The research study culminated as a book – a two volume series on Sikkim's Green Vision: Strategies and Capacity Building. The study helped to delineate some of the best practices that may be replicated in other regions with similar settings and highlighted how various green interventions specifically green tourism and organic farming may help to reinforce and catalyze each other thereby accelerating progress along the sustainable development path. The book attempted to explore the intersections of the different facets of Sikkim's flagship programs. Eminent policy makers, educationists and experts from various fields contributed to the knowledge base of the book which was co-authored by Dr. Rajlakshmi Mallik, Director, C-DRAṢṬᾹ with Dr. Ajeya Jha, Professor and Head of Department, Sikkim Manipal Institute of Technology (SMIT) and Dr. Sherab Shenga, Secretary, Information and Public Relations Department, Government of Sikkim.
//         </p>
//         <p className="text-sm md:text-[14px] text-gray-600 pl-3 pt-5">
//           The book was launched by Honourable Governor of Sikkim, Sri. Ganga Prasad Chaurasia during Republic Day Celebrations 2019 and Honourable Ex Chief Minister of Sikkim Sri. Pawan Chamling kindly consented to writing the foreword for the book.
//         </p>
//       </>
//     )
//   },
//   {
//     id: 6,
//     title: "B. Impact of Education on Youth Employment in Rural India (2018)",
//     content: (
//       <>
//         <strong className="text-gray-500 mb-2 text-[14px] font-semibold">
//           Impact of Education on Youth Employment in Rural India (2018)
//         </strong>
//         <p className="text-sm md:text-[14px] text-gray-600 pl-3 pt-5">
//           Project Brief: C-DRAṢṬᾹ undertook a survey covering four districts of West Bengal viz. North 24 Parganas, Jalpaiguri, Malda and South Dinajpur for the study of Impact of Education on Youth Employment in Rural India with focus on West Bengal. The survey was based on research design developed at C-DRAṢṬᾹ as part of research advisory for the study with Dr. Rajlakshmi Mallik as the lead advisor from C-DRAṢṬᾹ. The project was hosted and conducted by Department of Economics, Rishi Bankim Chandra Evening College and funded by University Grants Commission.
//         </p>
//       </>
//     )
//   },
//   {
//     id: 7,
//     title: "A. Status of Women in Science (2017)",
//     content: (
//       <>
//         <strong className="text-gray-500 mb-2 text-[14px] font-semibold">
//           Status of Women in Science (2017)
//         </strong>
//         <p className="text-sm md:text-[14px] text-gray-600 pl-3 pt-5">
//           Project Brief: As an extension on the Research theme Women Empowerment: Key to Sustainable Societies, topical study on Status of Women in Science, on pan India basis was conducted. The research study involved a national level survey of more than 1500 scientists and students of science covering 20 states in India and Delhi NCT. The research team consisting of in-house research assistants and 25 post graduate and undergraduate student research interns from several reputed universities and colleges of Kolkata viz. Presidency University, University of Calcutta, University of Kalyani, Bethune College and other were involved in data collection, processing and data analysis and preparation of the report. This project was funded by NITI AAYOG and conducted at C-DRAṢṬᾹ.
//         </p>
//       </>
//     )
//   }
// ];

const API = import.meta.env.VITE_OLD_API_URL;
export const ResearchProjects = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API}/api/v1/research-project`); // Adjust the API endpoint as needed
        const data = await response.json();
        setProjects(data.projects || []); // Ensure data is in the expected format
        console.log("Fetched Projects:", data.projects); // Ensure data is in the expected format
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

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
            {projects.map((project) => (
              <div
                key={project._id}
                className={`border border-[#b2a65f] rounded-lg overflow-hidden transition-all duration-300 ${
                  openIndex === project._id ? "shadow-md" : "shadow-sm"
                }`}
              >
                <button
                  onClick={() => handleToggle(project._id)}
                  className={`w-full flex items-center justify-between p-3 md:p-4 text-left transition-colors duration-200 ${
                    openIndex === project._id
                      ? "bg-gray-50"
                      : "bg-white hover:bg-gray-50"
                  }`}
                  aria-expanded={openIndex === project._id}
                  aria-controls={`project-${project._id}-content`}
                >
                  <div className="flex items-center">
                    <div
                      className={`flex-shrink-0 rounded-sm p-1 mr-3 md:mr-4 hover:bg-[#A0CE4E] ${
                        openIndex === project._id
                          ? "bg-[#A0CE4E] text-white"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      {openIndex === project._id ? (
                        <Minus className="w-3 h-3 md:w-4 md:h-4" />
                      ) : (
                        <Plus className="w-3 h-3 md:w-4 md:h-4" />
                      )}
                    </div>
                    <p
                      className={`text-sm md:text-base text-left hover:text-[#A0CE4E] ${
                        openIndex === project._id
                          ? "text-[#A0CE4E]"
                          : "text-gray-700"
                      }`}
                    >
                      {project.title}
                    </p>
                  </div>
                </button>

                <div
                  id={`project-${project._id}-content`}
                  className={`px-4 transition-all duration-300 overflow-hidden ${
                    openIndex === project._id
                      ? project.image
                        ? "max-h-[1000px] py-3 md:py-4 opacity-100"
                        : "max-h-[500px] py-3 md:py-4 opacity-100"
                      : "max-h-0 py-0 opacity-0"
                  }`}
                >
                  <div
                    className={project.image ? "space-y-3" : "pl-8 md:pl-10"}
                  >
                    <p className="font-semibold text-[14px]">  {project.title}</p>
                    <p className="text-gray-500 mb-2 font-semibold text-[14px]">
                      {project.description}
                    </p>
                    <div className="flex justify-center">
                      <img
                        src={project.image || bookFontpage1}
                        alt="Financial Inclusion Book Cover"
                        className="max-w-full h-auto rounded-md shadow-sm border border-gray-200"
                      />
                    </div>
                    <a
                      href={project.pdfLink || "#"}
                      target="_blank"
                    >
                      <button className="w-full sm:w-auto bg-[#962725] hover:bg-[#7a1f1d] text-white font-medium py-2 px-6 rounded transition-colors duration-200">
                        View PDF
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};
