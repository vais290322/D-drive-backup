import React, { useEffect, useState } from "react";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import legalBg from "../assets/v1-footerimage.jpg";
import { Plus, Minus } from "lucide-react";

const API = import.meta.env.VITE_OLD_API_URL;

export const AbstractsandOngoing = () => {
  // const researchItems = [
  //   {
  //     title: "Financial Inclusion: Empowering by Enhancing Access to Finance",
  //     description:
  //       "1. The current study addresses the role of financing constraints as the predominant impediment to private enterprise development and the nature and terms of informal credit arrangements as an alternative source of finance in the context of developing and low income countries. It does so by focusing on the Handloom sector consisting mostly of MSMEs, in two regions, West Bengal (India) and Burundi offering two very different environments in terms of socio-economic and political backdrop. Apart from being a significant MSME, handloom enterprises constitutes a very significant cottage industry based on a traditional and indigenous skill providing low cost green livelihood opportunities for a lakhs of families, supplementing incomes in seasons of agrarian distress, checking migration and preserving traditional economic relationships and cultural diversity. Being primarily a rural industry and with over half of adult workers being female the handloom sector constitutes the economic life line of two vulnerable segments of society.",
  //     head: "1.Financial Inclusion: Empowering by Enhancing Access to Finance",
  //   },
  //   {
  //     title: "Higher Education: The Key to Empowerment and Economic Growth",
  //     description:
  //       "1. A STUDY OF TEACHER PERFORMANCE AND INCENTIVES IN HIGHER EDUCATION",
  //       head: "1.Higher Education: The Key to Empowerment and Economic Growth",
  //   },
  //   {
  //     title: "Quality of Life: Promoting Dignified Lives and Livelihood",
  //     description:
  //       "1.This work addresses sustainable livelihoods and their role in improving quality of life in marginalized communities.",
  //       head: "1.MULTIDIMENSIONAL POVERTY ESTIMATION",
  //   },
  // ];

  const [researchData, setResearchData] = useState([]);

  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(()=>{
    const fetchResearchData = async () => {
      try {
        const response = await fetch(`${API}/api/v1/abstracts-research`);
        const data = await response.json();
        setResearchData(data.abstracts);
        console.log("Fetched Research Data:", data.abstracts);
      } catch (error) {
        console.error("Error fetching research data:", error);
      }
    }   
    fetchResearchData();

  }, []);

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
            <h2 className="text-xl md:text-2xl  text-gray-800">
              Abstracts and Ongoing Research
            </h2>
            <span className="block h-[2px] w-16 md:w-64 bg-[#b2a65f] mt-2 mb-4 md:mb-6" />
          </div>

          {/* Accordion List */}
          <div className="space-y-3 md:space-y-4">
            {researchData.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`border border-[#b2a65f] rounded-lg overflow-hidden transition-all duration-300 ${
                    isOpen ? "shadow-md" : "shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => handleToggle(index)}
                    className={`w-full flex items-center justify-between p-3 md:p-4 text-left transition-colors duration-200 ${
                      isOpen ? "bg-gray-50" : "bg-white hover:bg-gray-50"
                    }`}
                    aria-expanded={isOpen}
                    aria-controls={`research-item-${index}`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 rounded-sm p-1 mr-3 md:mr-4 ${
                          isOpen
                            ? "bg-lime-500 text-white"
                            : "bg-gray-700 text-white"
                        }`}
                      >
                        {isOpen ? (
                          <Minus className="w-3 h-3 md:w-4 md:h-4" />
                        ) : (
                          <Plus className="w-3 h-3 md:w-4 md:h-4" />
                        )}
                      </div>
                      <p
                        className={`text-sm md:text-base font-medium text-left ${
                          isOpen ? "text-lime-500" : "text-gray-700"
                        }`}
                      >
                        {item.title}
                      </p>
                    </div>
                  </button>

                  <div
                    id={`research-item-${index}`}
                    className={`px-4 pb-0 transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "max-h-[200px] md:max-h-[300px] py-3 md:py-4 opacity-100"
                        : "max-h-0 py-0 opacity-0"
                    }`}
                  >
                    <strong className="text-sm md:text-[14px] text-gray-500 pl-5 pb-10">
                    {item.title}
                    </strong>
                    <p className="text-sm md:text-base text-gray-600 pl-8 md:pl-10">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};
