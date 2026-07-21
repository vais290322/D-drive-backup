import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import BannerBG from "../../../assets/banner bg.png";

const faqs = [
  {
    question: "What is the admission process for new students?",
    answer:
      "To apply, fill out the online admission form, submit the required documents, and schedule an entrance assessment (if applicable). Once selected, parents will receive an admission confirmation with further details.",
  },
  {
    question: "What are the age criteria for admission?",
    answer: "The age criteria vary by grade level. Please refer to our admissions page for detailed information.",
  },
  {
    question: "Does the school offer online admission & fee payment?",
    answer: "Yes, we offer online admission and fee payment options for convenience.",
  },
  {
    question: "What curriculum does the school follow?",
    answer: "Our school follows a comprehensive curriculum designed to foster academic excellence and holistic development.",
  },
  {
    question: "What facilities does the school provide?",
    answer: "We provide state-of-the-art facilities including science labs, sports fields, and art studios.",
  },
  {
    question: "Are there extracurricular activities available?",
    answer: "Yes, we offer a wide range of extracurricular activities including sports, music, and drama.",
  },
];

const Next6 = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="flex justify-center w-full overflow-hidden min-h-[500px] md:min-h-[700px] lg:min-h-[978px]">
      <div
        className="w-full h-full bg-[#138000] relative overflow-hidden bg-cover bg-center flex items-center py-12 md:py-16 lg:py-0"
        style={{ backgroundImage: `url(${BannerBG})` }}
      >
        <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 md:px-10 gap-8 lg:gap-4">
          <div className="flex-1 flex flex-col ml-0 md:ml-8 lg:ml-16 justify-center w-full lg:w-1/2">
            <span
              className="font-medium text-[#1C1C1C] text-xs sm:text-[15px] flex items-center justify-center transition-all duration-300 cursor-pointer"
              style={{
                width: "120px",
                height: "28px",
                background: "rgba(255, 215, 0, 0.7)",
                borderRadius: "70px",
                border: "1px solid rgba(255, 215, 0, 0.7)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255, 215, 0, 1)";
                e.currentTarget.style.boxShadow = "0 4px 16px 0 rgba(255, 215, 0, 0.25)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255, 215, 0, 0.7)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              FAQ
            </span>
            <h2
              className="font-Literata font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-tight lg:leading-[64px] text-white mb-2 mt-6 lg:mt-10 max-w-[664px]"
            >
              Have Questions?<br />
              <span className="text-[#FFD700]">We've Got Answers!</span>
            </h2>
            <p className="font-Ubuntu font-normal text-base sm:text-lg md:text-xl lg:text-[24px] leading-relaxed lg:leading-[34px] text-white mb-6 lg:mb-8 mt-4 lg:mt-10 max-w-[762px]">
              Find answers to common queries about our admissions process, curriculum, facilities, and more. If you need further assistance, feel free to contact us!
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center w-full lg:w-1/2 px-2 sm:px-4">
            <div className="bg-transparent rounded-[22px] border border-[#2b7a2f] p-0 w-full">
              {faqs.map((faq, idx) => (
                <div
                  key={faq.question}
                  className={`rounded-[22px] mb-3 transition-all duration-300 ${
                    openIndex === idx ? "bg-[#174d1a]/60 border border-[#FFD700]" : "bg-transparent"
                  }`}
                >
                  <button
                    className={`w-full flex justify-between items-center px-4 sm:px-6 py-3 sm:py-5 text-left focus:outline-none ${
                      openIndex === idx
                        ? "text-[#FFD700] font-bold text-base sm:text-lg"
                        : "text-white font-medium text-base sm:text-lg"
                    }`}
                    onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                  >
                    <span className="pr-2">
                      {faq.question}
                    </span>
                    <span className="flex-shrink-0">
                      {openIndex === idx ? (
                        <FaChevronUp className="inline ml-2" />
                      ) : (
                        <FaChevronDown className="inline ml-2" />
                      )}
                    </span>
                  </button>
                  {openIndex === idx && faq.answer && (
                    <div className="px-4 sm:px-6 pb-3 sm:pb-5 text-white text-sm sm:text-[15px] leading-relaxed sm:leading-[22px]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Next6;