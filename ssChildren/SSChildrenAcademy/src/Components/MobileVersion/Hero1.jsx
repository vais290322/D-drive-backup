import React from "react";
import hero1 from "../../assets/Rectangle 7.png";
import hero2 from "../../assets/Rectangle 6(2).png";
import hero3 from "../../assets/Rectangle 8(3).png";
import Bg_Image from "../../assets/banner bg.png";
import { FaPlayCircle } from "react-icons/fa";

const Hero1 = () => {
  return (
    <section
      className="w-full min-h-[80vh] bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url(${Bg_Image})` }}
    >
      {/* Overlay gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-white via-white to-white opacity-80"
        style={{ zIndex: 2 }}
      ></div>
     
      <div
        className="relative z-10 pt-16 pb-10 px-4 flex flex-col items-center text-center"
      >
       <div
        className="absolute w-[558px] h-[558px] left-[50%] -top-[20px] rounded-full transform -translate-x-1/2"
        style={{
          background: "rgba(36, 128, 51, 0.4)",
          filter: "blur(150px)",
          zIndex: 1,
        }}
      ></div>
        {/* Headings */}
        <div className="w-full max-w-[1168px]">
        <h1 className="font-Literata font-semibold text-[48px] md:text-[96px] leading-none text-[#1C1C1C]">
          Shaping Young Minds
        </h1>
        <h2 className="font-Literata font-semibold text-[48px] md:text-[96px] leading-none text-[#38B000] mt-2 ">
          Building Bright Futures!
        </h2>
        </div>
       
        {/* Subheading */}
        <p className="font-[Ubuntu] text-[16px] md:text-[20px] leading-[24px] md:leading-[34px] text-[#1C1C1C] max-w-[1000px] mt-4">
          We are committed to providing a high-quality education that fosters intellectual growth, creativity, and character development.
        </p>
        {/* Buttons */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-10 mt-10">
          <button className="bg-[#1C1C1C] text-white px-7 py-3 rounded-full flex items-center gap-2 hover:bg-[#38B000] transition font-medium text-base">
            Get Started <span className="ml-2">&#8594;</span>
          </button>
          <button className="flex items-center gap-2 px-7 py-3 rounded-full border border-[#38B000] text-[#1C1C1C] hover:bg-[#eafbe2] transition font-medium text-base">
            <span className="text-[#38B000] text-lg"><FaPlayCircle /></span>
            Watch Video <span className="ml-2">&#8594;</span>
          </button>
        </div>
        {/* Images */}
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center items-center mt-2">
          <img
            src={hero1}
            alt="Students 1"
            className="w-[200px] md:w-[300px] h-[219px] md:h-[329px] object-cover rounded-tl-[90px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] shadow-md"
          />
          <img
            src={hero2}
            alt="Students 2"
            className="w-[424px] md:w-[624px] h-[219px] md:h-[329px] object-cover rounded-[24px] shadow-md"
          />
          <div className="relative">
            <div
              className="absolute inset-0 w-[178px] md:w-[278px] h-[178px] md:h-[278px] left-[50%] -translate-x-1/2 top-[50px] -translate-y-1/2 rounded-full"
              style={{ background: "rgba(255, 215, 0, 0.5)", filter: "blur(70px)", zIndex: 0 }}
            ></div>
            <img
              src={hero3}
              alt="Students 3"
              className="relative z-10 w-[200px] md:w-[300px] h-[219px] md:h-[329px] object-cover rounded-tr-[90px] rounded-tl-[20px] rounded-bl-[20px] rounded-br-[20px] shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero1;