import React from "react";
import Group6 from '../../../assets/Group 6.png';
import BannerBG from "../../../assets/banner bg.png";

const Next2 = () => {
  return (
    <section className="flex justify-center w-full">
      <div
        className="w-full min-h-[500px] md:min-h-[700px] lg:min-h-[978px] bg-[#138000] relative overflow-hidden flex items-center py-10 md:py-0"
        style={{ backgroundImage: `url(${BannerBG})` }}
      >
        <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 md:px-10 gap-8 lg:gap-0">
          <div className="flex-1 flex flex-col justify-center w-full lg:w-1/2 order-2 lg:order-1">
            <span
              className="font-medium text-[#1C1C1C] text-xs sm:text-[15px] flex items-center justify-center transition-all duration-300 cursor-pointer"
              style={{
                width: "130px",
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
              Why Choose Us
            </span>
            <h2
              className="font-Literata font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-tight lg:leading-[64px] text-white mb-2 mt-6 lg:mt-10 max-w-[664px]"
            >
              Nurturing Excellence<br />
              <span className="text-[#FFD700]">Inspiring Success!</span>
            </h2>
            <p className="font-Ubuntu font-normal text-base sm:text-lg md:text-xl lg:text-[24px] leading-relaxed lg:leading-[34px] text-white mb-6 lg:mb-8 mt-4 lg:mt-10 max-w-[762px]">
              At our school, we go beyond academics to shape well-rounded individuals. With a focus on innovation, character building, and holistic development, we provide a supportive environment where students can learn, grow, and thrive.
            </p>
            <button
              className="bg-[#FFD700] text-[#1C1C1C] w-[160px] sm:w-[180px] lg:w-[200px] h-[45px] sm:h-[50px] lg:h-[60px] cursor-pointer mt-6 lg:mt-10 rounded-full flex items-center justify-center gap-2 font-medium text-sm sm:text-base transition-all duration-300 ease-in-out hover:bg-[#ffe066] hover:shadow-lg hover:scale-105 focus:outline-none"
            >
              Read More <span className="ml-2">&#8594;</span>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center w-full lg:w-1/2 order-1 lg:order-2">
            <img 
              src={Group6} 
              alt="Students" 
              className="w-full max-w-[350px] md:max-w-[500px] lg:max-w-[793px] h-auto object-contain" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Next2;