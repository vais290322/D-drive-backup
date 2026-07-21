import React from "react";
import { IoIosCloud } from "react-icons/io";
import logo1 from "../../../assets/logo1.png";
import logo2 from "../../../assets/logo2.png";
import logo3 from "../../../assets/logo3.png";
import logo4 from "../../../assets/logo4.png";
import logo5 from "../../../assets/logo5.png";
import cloud from "../../../assets/icomoon-free_cloud.png";
import graduationImg from "../../../assets/Rectangle 10.png";
import Group1 from "../../../assets/Group 1.png";
import Group2 from "../../../assets/Group 2.png";
import BannerBG from "../../../assets/Group 8.png";
import { IoSchool } from "react-icons/io5";


const Next1 = () => {
  return (
    <>
     <div className="w-full hidden md:flex justify-center items-center mt-20">
        <div className="bg-[#138000] rounded-[32px] w-[1520px] h-[334px] py-10 px-8 relative  items-center shadow-lg">
          {/* Dotted Arrow */}
          <svg
            width="102"
            height="40"
            viewBox="0 0 102 40"
            fill="none"
            className="absolute left-20 top-12"
          >
            <path
              d="M 0 35 Q 40 10 80 25"
              stroke="#FFD700"
              strokeWidth="3"
              strokeDasharray="5 5"
              fill="none"
            />
            <polygon points="92,20 102,25 92,30" fill="#FFD700" />
          </svg>
          {/* Title */}
          <div>
            <h2 className="text-[#FFD700] text-[40px] md:text-3xl font-semibold mb-8 mt-10 font-Literata text-center">
              Trusted by best Companies
            </h2>
          </div>

          {/* Logos */}
          <div className="flex  justify-center items-center gap-10 md:gap-16 w-[1292px] h-[44px] pt-[60px] ml-12">
            <img
              src={logo1}
              alt="Logo 1"
              className="h-[27px] w-[148.5px]  object-contain"
            />
            <img
              src={logo2}
              alt="Logo 2"
              className="h-[28px] w-[152.6px] object-contain"
            />
            <img
              src={logo3}
              alt="Logo 3"
              className="h-[41px] w-[167px] object-contain"
            />
            <img
              src={logo4}
              alt="Logo 4"
              className="h-[40px] w-[172px] object-contain"
            />
            <img
              src={logo5}
              alt="Logo 5"
              className="h-[44px] w-[126px] object-contain"
            />
          </div>
          {/* Cloud Icon */}
          <img
            src={cloud}
            alt="Logo 5"
            className="h-[67px] w-[67px] object-contain mt-12 ml-[1360px]"
          />
        </div>
      </div>
      {/* for next section */}
      <section className="hidden md:flex items-center justify-center py-20 mt-10">
        <div className="flex items-center justify-center gap-10 w-[1824px] h-[782px]">
          <div className="flex flex-col items-center  w-1/2">
            <img
              src={graduationImg}
              alt="Graduation"
              className="rounded-[28px] w-[835px] h-[410px] object-cover mb-6"
            />
            {/* Vision & Mission Cards */}
            <div className="flex gap-6">
              {/* Vision Card */}
              <div className="flex-1 bg-[#FFD700] rounded-[22px] p-14 shadow-md flex flex-col w-[411px] h-[341px] relative">
                <div className="flex items-center gap-2 mb-2 ">
                  <p className=" flex items-center gap-5 font-bold text-[#138000] text-[30px]">
                    <IoSchool />
                    Our Vision
                  </p>
                </div>
                <p className="font-Ubuntu text-[#1C1C1C] text-[20px] leading-[22px] mt-10">
                  To inspire young minds to become responsible global citizens
                  and lifelong learners.
                </p>
                <img
                  src={Group1}
                  alt="vision-bg"
                  className="absolute right-5 bottom-9 h-[134.56px] w-[154.16px] opacity-60 pointer-events-none select-none"
                />
              </div>
              <div className="flex-1 bg-[#138000] rounded-[22px] p-14 shadow-md flex flex-col w-[411px] h-[341px] relative">
                <div className="flex items-center gap-2 mb-2">
                  <p className=" flex items-center gap-5 font-bold text-[#FFD700] text-[30px]">
                    <IoSchool />
                    Our Mission
                  </p>
                </div>
                <p className="font-Ubuntu text-[#FFFFFF] text-[20px] leading-[22px] mt-10">
                  To cultivate curiosity, critical thinking, and leadership
                  qualities in students through excellence in education and
                  moral values.
                </p>
                <img
                  src={Group2}
                  alt="vision-bg"
                  className="absolute right-5 bottom-9 h-[134.56px] w-[154.16px] opacity-60 pointer-events-none select-none"
                />
              </div>
            </div>
          </div>
          <div
            className="w-full min-h-[80vh] bg-cover bg-center bg-no-repeat relative overflow-hidden"
            style={{ backgroundImage: `url(${BannerBG})` }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-br from-white via-white to-white opacity-80"
              style={{ zIndex: 1 }}
            ></div>
            <div
              className="absolute w-[390px] h-[390px] left-[390px] top-[150px]  rounded-full"
              style={{
                background: "#248033",
                filter: "blur(150px)",
                zIndex: 2,
              }}
            />
            {/* Content */}
            <div className="relative z-10 px-6 my-36 ">
              <span className="inline-block bg-[#EAFBE2] text-[#138000] text-sm px-4 py-1 rounded-full font-medium mb-4 transition duration-200 hover:bg-[#c6f3b1] hover:shadow-lg cursor-pointer">
                About Us
              </span>
              <h2 className="font-Literata font-semibold text-[64px] leading-[64px] text-[#1C1C1C] mb-10 mt-6">
                Empowering Minds,
                <br />
                <span className="text-[#38B000]">Shaping Futures</span>
              </h2>
              <p className="font-Ubuntu font-normal text-[20px] leading-[24px] text-[#1C1C1C] mb-16 w-2/3 pr-16">
                At our school, we are dedicated to fostering academic
                excellence, personal growth, and character development. Our
                mission is to provide a nurturing and inspiring environment
                where students not only excel in academics but also develop
                essential life skills, creativity, and confidence.
              </p>
              <button
                className="bg-[#004B23] text-white rounded-full flex items-center gap-2 hover:bg-[#38B000] transition font-medium text-base"
                style={{ width: "200px", height: "60px", padding: 30 }}
              >
                Read More <span className="ml-2">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* For Responsive Mobile Version */}

      <div className="w-full  flex justify-center items-center mt-10">
        <div className="bg-[#138000] rounded-[32px] w-[1520px] h-[334px] py-10 px-8 relative  items-center shadow-lg">
          {/* Dotted Arrow */}
          <svg
            width="102"
            height="40"
            viewBox="0 0 102 40"
            fill="none"
            className="absolute left-20 top-12"
          >
            <path
              d="M 0 35 Q 40 10 80 25"
              stroke="#FFD700"
              strokeWidth="3"
              strokeDasharray="5 5"
              fill="none"
            />
            <polygon points="92,20 102,25 92,30" fill="#FFD700" />
          </svg>
          {/* Title */}
          <div>
            <h2 className="text-[#FFD700] text-[40px] md:text-3xl font-semibold mb-8 mt-10 font-Literata text-center">
              Trusted by best Companies
            </h2>
          </div>

          {/* Logos */}
          <div className="flex  justify-center items-center gap-10 md:gap-16 w-[1292px] h-[44px] pt-[60px] ml-12">
            <img
              src={logo1}
              alt="Logo 1"
              className="h-[27px] w-[148.5px]  object-contain"
            />
            <img
              src={logo2}
              alt="Logo 2"
              className="h-[28px] w-[152.6px] object-contain"
            />
            <img
              src={logo3}
              alt="Logo 3"
              className="h-[41px] w-[167px] object-contain"
            />
            <img
              src={logo4}
              alt="Logo 4"
              className="h-[40px] w-[172px] object-contain"
            />
            <img
              src={logo5}
              alt="Logo 5"
              className="h-[44px] w-[126px] object-contain"
            />
          </div>
          {/* Cloud Icon */}
          <img
            src={cloud}
            alt="Logo 5"
            className="h-[67px] w-[67px] object-contain mt-12 ml-[1360px]"
          />
        </div>
      </div>
      {/* for next section */}
      <section className="flex items-center justify-center py-20 mt-10">
        <div className="flex items-center justify-center gap-10 w-[1824px] h-[782px]">
          <div className="flex flex-col items-center  w-1/2">
            <img
              src={graduationImg}
              alt="Graduation"
              className="rounded-[28px] w-[835px] h-[410px] object-cover mb-6"
            />
            {/* Vision & Mission Cards */}
            <div className="flex gap-6">
              {/* Vision Card */}
              <div className="flex-1 bg-[#FFD700] rounded-[22px] p-14 shadow-md flex flex-col w-[411px] h-[341px] relative">
                <div className="flex items-center gap-2 mb-2 ">
                  <p className=" flex items-center gap-5 font-bold text-[#138000] text-[30px]">
                    <IoSchool />
                    Our Vision
                  </p>
                </div>
                <p className="font-Ubuntu text-[#1C1C1C] text-[20px] leading-[22px] mt-10">
                  To inspire young minds to become responsible global citizens
                  and lifelong learners.
                </p>
                <img
                  src={Group1}
                  alt="vision-bg"
                  className="absolute right-5 bottom-9 h-[134.56px] w-[154.16px] opacity-60 pointer-events-none select-none"
                />
              </div>
              <div className="flex-1 bg-[#138000] rounded-[22px] p-14 shadow-md flex flex-col w-[411px] h-[341px] relative">
                <div className="flex items-center gap-2 mb-2">
                  <p className=" flex items-center gap-5 font-bold text-[#FFD700] text-[30px]">
                    <IoSchool />
                    Our Mission
                  </p>
                </div>
                <p className="font-Ubuntu text-[#FFFFFF] text-[20px] leading-[22px] mt-10">
                  To cultivate curiosity, critical thinking, and leadership
                  qualities in students through excellence in education and
                  moral values.
                </p>
                <img
                  src={Group2}
                  alt="vision-bg"
                  className="absolute right-5 bottom-9 h-[134.56px] w-[154.16px] opacity-60 pointer-events-none select-none"
                />
              </div>
            </div>
          </div>
          <div
            className="w-full min-h-[80vh] bg-cover bg-center bg-no-repeat relative overflow-hidden"
            style={{ backgroundImage: `url(${BannerBG})` }}
          >
            {/* <div
              className="absolute inset-0 bg-gradient-to-br from-white via-white to-white opacity-80"
              style={{ zIndex: 1 }}
            ></div>
            <div
              className="absolute w-[390px] h-[390px] left-[390px] top-[150px]  rounded-full"
              style={{
                background: "#248033",
                filter: "blur(150px)",
                zIndex: 2,
              }}
            /> */}
            {/* Content */}
            <div className="relative z-10 px-6 my-36 ">
              <span className="inline-block bg-[#EAFBE2] text-[#138000] text-sm px-4 py-1 rounded-full font-medium mb-4 transition duration-200 hover:bg-[#c6f3b1] hover:shadow-lg cursor-pointer">
                About Us
              </span>
              <h2 className="font-Literata font-semibold text-[64px] leading-[64px] text-[#1C1C1C] mb-10 mt-6">
                Empowering Minds,
                <br />
                <span className="text-[#38B000]">Shaping Futures</span>
              </h2>
              <p className="font-Ubuntu font-normal text-[20px] leading-[24px] text-[#1C1C1C] mb-16 w-2/3 pr-16">
                At our school, we are dedicated to fostering academic
                excellence, personal growth, and character development. Our
                mission is to provide a nurturing and inspiring environment
                where students not only excel in academics but also develop
                essential life skills, creativity, and confidence.
              </p>
              <button
                className="bg-[#004B23] text-white rounded-full flex items-center gap-2 hover:bg-[#38B000] transition font-medium text-base"
                style={{ width: "200px", height: "60px", padding: 30 }}
              >
                Read More <span className="ml-2">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Next1;
