import React from "react";
import hero1 from "../../../assets/Rectangle 7.png";
import hero2 from "../../../assets/Rectangle 6(2).png";
import hero3 from "../../../assets/Rectangle 8(3).png";
import Bg_Image from "../../../assets/banner bg.png";
import { FaPlayCircle } from "react-icons/fa";

const Hero = () => {
  console.log("dsfdsfsdffds");

  return (
    <>
      {/* Mobile View section  */}
      <section
        className="block md:hidden w-full h-[794px] bg-cover bg-center relative overflow-hidden pt-2"
        style={{ backgroundImage: `url(${Bg_Image})` }}
      >
        {/* White overlay */}
        <div className="absolute inset-0 bg-white/80 z-10" />
        {/* Green blur */}
        {/* <div
          className="absolute w-60 h-60 rounded-full bg-[rgba(36,128,51,0.4)] filter blur-2xl top-10 left-1/2 -translate-x-1/2 z-0"
        /> */}
        {/* Yellow blur behind second image */}
        <div
          className="absolute w-[190px] h-[198px] left-[20px] top-[80px] rounded-full"
          style={{
            background: "rgba(22, 101, 52, 0.4)",
            filter: "blur(10px)",
            zIndex: 1,
          }}
        ></div>

        <div className="relative z-20 flex flex-col items-center h-[100vh]  text-center px-4 mt-24">
          <h1 className="font-Literata font-semibold text-3xl leading-tight text-[#1C1C1C]">
            Shaping Young Minds
          </h1>
          <h2 className="font-Literata font-semibold text-3xl leading-tight text-[#0A7200] mt-1">
            Building Bright Futures!
          </h2>
          <p className="font-[Ubuntu] text-sm leading-relaxed text-[#1C1C1C] px-2 max-w-md mt-6">
            We are committed to providing a high-quality education that fosters
            intellectual growth, creativity, and character development.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <button className="bg-[#044C23] text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-[#38B000] transition text-sm">
              Get Started <span>→</span>
            </button>
            <button className="flex items-center gap-2  text-[#1C1C1C] hover:bg-[#eafbe2] transition text-sm">
              <FaPlayCircle className="text-[#38B000]" /> Watch Video{" "}
              <span>→</span>
            </button>
          </div>

          {/* Top two images side by side */}
          <div className="flex w-full  mt-16 gap-4">
            <div className="relative w-1/2">
              <div className="relative w-1/2" />
              <img
                src={hero1}
                alt="Students 1"
                className="relative w-[180px] h-[197px] object-cover rounded-[20px] shadow-md"
              />
            </div>
            <div
              className="absolute w-[160px] h-[158px] left-[210px] top-[250px] rounded-full"
              style={{
                background: "rgba(255, 215, 0, 0.5)",
                filter: "blur(40px)",
                zIndex: 0,
              }}
            ></div>
            <div className="relative w-1/2">
              <img
                src={hero3}
                alt="Students 1"
                className="relative w-[370px] h-[195px] object-cover rounded-[20px]  shadow-md"
              />
            </div>
          </div>

          {/* Bottom full-width image */}
          <div>
          <img
            src={hero2}
            alt="Students 2"
            className=" w-full h-full pt-3"
          />
          </div>
         
        </div>
      </section>
    {/* Computer View section */}
      <section
        className="w-full h-screen bg-cover bg-center bg-no-repeat relative hidden md:block overflow-hidden"
        style={{ backgroundImage: `url(${Bg_Image})` }}
      >
        {/* Overlay gradient */}
        <div
          className="absolute inset-0 bg-white/80"
          style={{ zIndex: 2 }}
        ></div>

        <div className="container mx-auto relative z-10 pt-32 pb-10 px-4 flex flex-col items-center text-center">
          <div
            className="absolute w-[758px] h-[758px] left-[100px] top-[-20px] rounded-full"
            style={{
              background: "rgba(36, 128, 51, 0.4)",
              filter: "blur(200px)",
              zIndex: 1,
            }}
          ></div>
          {/* Headings */}
          <div className="max-w-[1168px] mb-6">
            <h1 className="font-Literata font-semibold text-[96px] leading-tight text-[#1C1C1C]">
              Shaping Young Minds
            </h1>
            <h2 className="font-Literata font-semibold text-[96px] leading-tight text-[#0A7200] mt-2">
              Building Bright Futures!
            </h2>
          </div>

          {/* Subheading */}
          <p className="font-[Ubuntu] text-[24px] leading-[34px] text-[#1C1C1C] max-w-[900px] h-[30px] mb-20">
            We are committed to providing a high-quality education that fosters
            intellectual growth, creativity, and character development.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-6 mb-16">
            <button className="bg-[#1C1C1C] text-white px-7 py-3 rounded-full flex items-center gap-2 cursor-pointer hover:bg-[#38B000] transition font-medium text-base">
              Get Started <span className="ml-2">&#8594;</span>
            </button>
            <button className="flex items-center gap-2 px-7 py-3 rounded-full border cursor-pointer border-[#38B000] text-[#1C1C1C] hover:bg-[#eafbe2] transition font-medium text-base">
              <span className="text-[#38B000] text-lg">
                <FaPlayCircle />
              </span>
              Watch Video <span className="ml-2">&#8594;</span>
            </button>
          </div>

          {/* Images */}
          <div className="flex gap-6 w-full max-w-[1280px] justify-center items-center">
            <img
              src={hero1}
              alt="Students 1"
              className="w-[300px] h-[329px] object-cover rounded-tl-[90px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] shadow-md"
            />
            <img
              src={hero2}
              alt="Students 2"
              className="w-[624px] h-[329px] object-cover rounded-[24px] shadow-md"
            />
            <div className="relative">
              <div
                className="absolute w-[278px] h-[278px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background: "rgba(255, 215, 0, 0.5)",
                  filter: "blur(70px)",
                  zIndex: 0,
                }}
              ></div>
              <img
                src={hero3}
                alt="Students 3"
                className="relative z-10 w-[300px] h-[329px] object-cover rounded-tr-[90px] rounded-tl-[20px] rounded-bl-[20px] rounded-br-[20px] shadow-md"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
