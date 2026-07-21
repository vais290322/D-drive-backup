import React from "react";

const testimonials = [
  {
    name: "Mr. Rajeev Sharma",
    text: "The school has provided an excellent academic foundation for my son. The teachers are supportive, and the emphasis on extracurricular activities has helped him grow into a confident individual.",
    border: "border-[#38B000]",
    nameColor: "text-[#138000]",
  },
  {
    name: "Mrs. Sneha Patel",
    text: "I appreciate the school's focus on values and character building. The caring environment and engaging teaching methods make learning fun for my daughter.",
    border: "border-[#FFD700]",
    nameColor: "text-[#1C1C1C]",
  },
  {
    name: "Mrs. Priya Nair",
    text: "As a parent, I was looking for a safe and nurturing environment for my child. This school has exceeded my expectations with its nurturing approach and modern learning techniques.",
    border: "border-[#38B000]",
    nameColor: "text-[#138000]",
  },
];

const Next7 = () => {
  return (
    <section className="flex items-center justify-center bg-white py-10 md:py-20">
      <div className="w-full flex justify-center items-center">
        <div className="w-[95%] md:w-[90%] max-w-[1200px] min-h-[420px] rounded-[16px] px-4 md:px-6 py-10 md:py-14 relative flex flex-col items-center overflow-hidden">
          {/* Badge */}
          <span
            className="absolute left-1/2 -translate-x-1/2 top-5 font-medium text-[#FFD700] text-xs md:text-[13px] flex items-center justify-center font-Ubuntu z-10"
            style={{
              width: "152px",
              height: "30px",
              background: "rgba(0, 114, 0, 0.7)",
              borderRadius: "100px",
              border: "1px solid rgba(0, 114, 0, 0.7)",
            }}
          >
            Testimonials
          </span>
          {/* Heading */}
          <h2 className="font-Literata font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-tight md:leading-[64px] text-center text-[#1C1C1C] mb-8 md:mb-12 mt-8 z-10 max-w-[874px] mx-auto">
            Real Stories, <span className="text-[#38B000]">Real Experiences!</span>
          </h2>
          {/* Testimonials */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full justify-center items-stretch relative z-10 pt-4 md:pt-10">
            {testimonials.map((t, idx) => (
              <div
                key={t.name}
                className={`flex-1 bg-white rounded-[20px] border ${t.border} p-4 md:p-8 shadow min-w-[260px] transition-all hover:shadow-lg mb-4 md:mb-0`}
              >
                <h3 className={`font-Literata font-bold text-xl sm:text-2xl md:text-[30px] leading-tight md:leading-[30px] ${t.nameColor} mb-2 md:mb-3`}>
                  {t.name}
                </h3>
                <p className="font-Ubuntu font-normal text-base sm:text-lg md:text-[20px] leading-relaxed md:leading-[30px] text-[#1C1C1C]">
                  {t.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Next7;