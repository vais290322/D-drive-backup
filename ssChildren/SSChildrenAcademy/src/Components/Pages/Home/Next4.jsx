import React from "react";
import classroomImg from "../../../assets/Rectangle 10(1).png";
import { FaCheck } from "react-icons/fa";
import BannerBG from "../../../assets/banner bg.png";

const Next4 = () => {
  return (
    <section
      className="w-full min-h-[600px] md:min-h-[700px] lg:min-h-[900px] py-10 sm:py-16 lg:py-[100px] px-4 relative overflow-hidden bg-cover bg-center flex items-center"
      style={{
        backgroundColor: "#007200",
      }}
    >
      {/* Background Image with Opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${BannerBG})`,
          opacity: 0.5,
        }}
      ></div>
      <div className="relative z-10 container mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left side - Image and Features */}
        <div className="w-full lg:w-1/2 flex flex-col items-center mb-10 lg:mb-0">
          <img
            src={classroomImg}
            alt="Classroom"
            className="rounded-[20px] md:rounded-[40px] w-full max-w-[835px] h-auto object-cover mb-8"
            style={{
              backgroundColor: "#D9D9D9",
              aspectRatio: "835/410",
            }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-10 gap-y-4 w-full max-w-[835px] mt-6 lg:mt-14">
            {[
              { title: "Pre-Primary (Nursery & Kindergarten)", text: "A fun and engaging introduction to learning." },
              { title: "Primary Education (Grades 1-5)", text: "Focus on foundational skills in literacy, numeracy, and creativity." },
              { title: "Middle School (Grades 6-8)", text: "Expanding knowledge with practical and analytical learning." },
              { title: "Co-Curricular & Skill Development", text: "STEM programs, arts, music, and leadership training." }
            ].map((feat, i) => (
              <div key={i} className="flex items-start gap-3">
                <FaCheck className="mt-1 text-[#FFD700] text-lg flex-shrink-0" />
                <div>
                  <span className="font-Literata font-bold text-base sm:text-lg lg:text-[20px] leading-tight lg:leading-[20px] text-[#FFD700] block">
                    {feat.title}
                  </span>
                  <div className="font-Ubuntu font-normal text-sm sm:text-base lg:text-[20px] leading-relaxed lg:leading-[30px] text-[#FFFFFF]">
                    {feat.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="relative z-10 px-0 sm:px-2">
            <span
              className="inline-block bg-[#EAFBE2] text-[#138000] text-xs sm:text-[15px] px-3 sm:px-4 py-1 rounded-full font-medium mb-4 transition-all duration-300 ease-in-out hover:bg-[#c8e6c9] hover:text-[#0f5c0f]"
            >
              Academics
            </span>
            <h2 className="font-Literata text-2xl sm:text-3xl md:text-4xl lg:text-[48px] xl:text-[56px] leading-tight md:leading-[59px] font-semibold pt-4 sm:pt-10 text-white">
              Excellence in Education<br />
              <span className="text-[#FFD700]">Empowering Every<br className="hidden sm:block" /> Student!</span>
            </h2>
            <p className="font-Ubuntu font-thin text-base sm:text-lg md:text-xl lg:text-[24px] leading-relaxed lg:leading-[34px] text-[#FFFFFF] pt-4 sm:pt-10 max-w-[633px]">
              Our academic programs are designed to foster curiosity, critical thinking, and a passion for lifelong learning. With a well-structured curriculum, experienced faculty, and modern teaching methodologies, we ensure that every student receives a strong foundation for future success.
            </p>
            <button className="bg-[#FFD700] text-[#1C1C1C] cursor-pointer px-5 sm:px-7 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ease-in-out hover:bg-[#ffe066] hover:shadow-lg hover:scale-105 font-medium text-sm sm:text-base mt-8 sm:mt-12 lg:mt-20">
              Read More <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Next4;
