import React from "react";
import teacher1 from "../../../assets/Image1.jpg";
import teacher2 from "../../../assets/Image2.jpg";
import teacher3 from "../../../assets/Image3.jpg";
import teacher4 from "../../../assets/Image4.jpg";

const teachers = [
  {
    name: "Mrs. Pooja Verma",
    title: "Head of Academics",
    desc: "Passionate about innovative teaching methods, she leads the academic team with dedication and expertise.",
    img: teacher1,
    color: "from-[#F7B733] to-[#FC4A1A]",
    text: "text-[#FFD700]",
  },
  {
    name: "Ms. Neha Kapoor",
    title: "Senior English Teacher",
    desc: "A language enthusiast who inspires students to develop strong communication and literary skills.",
    img: teacher2,
    color: "from-[#43C6AC] to-[#191654]",
    text: "text-[#FFD700]",
  },
  {
    name: "Mr. Amit Saxena",
    title: "Mathematics Coordinator",
    desc: "Bringing numbers to life, he makes learning mathematics engaging and concept-driven.",
    img: teacher3,
    color: "from-[#232526] to-[#414345]",
    text: "text-[#FFD700]",
  },
  {
    name: "Mr. Arvind Nair",
    title: "Social Studies Expert",
    desc: "Passionate about history, he helps students connect with the world around them.",
    img: teacher4,
    color: "from-[#232526] to-[#414345]",
    text: "text-[#FFD700]",
  },
];

const Next5 = () => {
  return (
    <section className="w-full py-10 sm:py-12 md:py-16 px-4 bg-gradient-to-r from-[#FFFDE4] via-white to-[#EAFBE2]">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Badge */}
        <span className="inline-block bg-[#EAFBE2] text-[#38B000] text-xs sm:text-[15px] px-3 sm:px-4 py-1 rounded-full font-medium mb-4 sm:mb-6">
          Meet Our Teachers
        </span>
        {/* Heading */}
        <h2 className="font-Literata font-bold text-3xl sm:text-4xl md:text-[44px] lg:text-[54px] text-center text-[#1C1C1C] mb-8 sm:mb-12 px-2">
          Guiding Minds, <span className="text-[#38B000]">Inspiring Futures</span>
        </h2>
        {/* Teacher Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full justify-items-center">
          {teachers.map((teacher, idx) => (
            <div
              key={teacher.name}
              className={`w-full max-w-[300px] rounded-[28px] overflow-hidden relative shadow-lg bg-gradient-to-br ${teacher.color} transition-transform duration-300 ease-in-out hover:scale-95`}
              style={{ minHeight: "320px", maxHeight: "370px" }}
            >
              <div className="h-full">
                <img
                  src={teacher.img}
                  alt={teacher.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <div className={`font-bold text-base sm:text-lg mb-1 ${teacher.text}`}>{teacher.name}</div>
                <div className="text-white text-xs sm:text-sm font-semibold mb-1">{teacher.title}</div>
                <div className="text-white text-xs sm:text-[14px] leading-tight sm:leading-[20px]">{teacher.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Next5;