import React from "react";

const Next3 = () => {
  return (
    <section className="flex items-center justify-center bg-white py-10 sm:py-16 md:py-20">
      <div className="w-full flex justify-center items-center">
        <div className="w-[95%] sm:w-[90%] max-w-[1200px] min-h-[420px] rounded-[16px] px-4 sm:px-6 py-10 sm:py-14 relative flex flex-col items-center overflow-hidden">
          {/* Badge */}
          <span
            className="absolute left-1/2 -translate-x-1/2 top-5 font-medium text-[#FFD700] text-xs sm:text-[13px] flex items-center justify-center font-Ubuntu z-10"
            style={{
              width: "152px",
              height: "30px",
              background: "rgba(0, 114, 0, 0.7)",
              borderRadius: "100px",
              border: "1px solid rgba(0, 114, 0, 0.7)",
            }}
          >
            How it Works?
          </span>
          {/* Heading */}
          <h2 className="font-Literata font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-tight lg:leading-[64px] pt-6 sm:pt-10 text-center text-[#1C1C1C] mb-8 sm:mb-12 mt-6 sm:mt-8 z-10 max-w-[874px] mx-auto">
            How is our <span className="text-[#38B000]">Tutoring Service</span>
          </h2>
          {/* Cards */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full justify-center items-stretch relative z-10 pt-4 sm:pt-10">
            {/* Card 1 */}
            <div className="flex-1 bg-white rounded-[20px] border border-[#38B000] p-6 sm:p-8 shadow min-w-[260px] transition-all hover:shadow-lg mb-4 md:mb-0">
              <h3 className="font-bold text-[#138000] text-xl sm:text-2xl mb-2 sm:mb-3 font-Ubuntu">
                Holistic Learning<br className="hidden sm:block" />Approach
              </h3>
              <p className="text-[#1C1C1C] text-sm sm:text-[16px] leading-relaxed sm:leading-[24px] font-Ubuntu">
                We go beyond textbooks, focusing on overall development through academics, sports, and extracurricular activities.
              </p>
            </div>
            {/* Card 2 */}
            <div className="flex-1 bg-white rounded-[20px] border border-[#FFD700] p-6 sm:p-8 shadow w-full md:w-auto lg:w-[465px] transition-all hover:shadow-lg mb-4 md:mb-0">
              <h3 className="font-bold text-[#1C1C1C] text-xl sm:text-2xl mb-2 sm:mb-3 font-Ubuntu">
                Experienced & Caring<br className="hidden sm:block" />Faculty
              </h3>
              <p className="text-[#1C1C1C] text-sm sm:text-[16px] leading-relaxed sm:leading-[24px] font-Ubuntu">
                Our passionate educators guide students toward success with innovative teaching methods.
              </p>
            </div>
            {/* Card 3 */}
            <div className="flex-1 bg-white rounded-[20px] border border-[#38B000] p-6 sm:p-8 shadow min-w-[260px] transition-all hover:shadow-lg">
              <h3 className="font-bold text-[#138000] text-xl sm:text-2xl mb-2 sm:mb-3 font-Ubuntu">
                Safe & Inclusive<br className="hidden sm:block" />Environment
              </h3>
              <p className="text-[#1C1C1C] text-sm sm:text-[16px] leading-relaxed sm:leading-[24px] font-Ubuntu">
                A welcoming and secure space where every student is valued and respected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Next3;