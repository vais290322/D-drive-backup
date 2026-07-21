import React from "react";
import Button from "../../Others/Button";
import Ellipse5 from "../../../../assets/Home_images/home page/Ellipse 5.png";
import Ellipse6 from "../../../../assets/Home_images/home page/Ellipse 6.png";
import Ellipse7 from "../../../../assets/Home_images/home page/Ellipse 7.png";
import bgImg3rd from "../../../../assets/Home_images/home page/Group 12.png";
import Rectangle3 from "../../../../assets/Home_images/home page/Rectangle 6(1).png";
import Linked_Services1 from "../../../../assets/Home_images/home page/linked_services(1).png";
import Quality from "../../../../assets/Home_images/home page/Quality.png";
import { AvatarCircles } from "../../../../components/magicui/avatar-circles";

function KeepingYourWorld() {
  const avatars = [
    { imageUrl: Ellipse5 },
    { imageUrl: Ellipse6 },
    { imageUrl: Ellipse7 },
  ];

  return (
    <section
      className="relative bg-cover py-16 px-6 md:px-20 flex flex-col md:flex-row items-center gap-16 md:gap-32 min-h-[700px]"
      style={{ backgroundImage: `url(${bgImg3rd})` }}
    >
      {/* Left Side (Image & Info Box) */}
      <div className="relative w-full md:w-1/2 flex flex-col items-center">
        <div className="w-full  md:max-w-none rounded-2xl overflow-hidden">
          <img
            src={Rectangle3}
            alt="Cleaning Professional"
            className="w-full h-auto md:h-full object-cover rounded-xl"
          />
        </div>
        <div
          className="absolute px-4 -bottom-20 md:-bottom-20 left-1/2 transform -translate-x-1/2 w-full md:w-[90%] 
                     h-[50%] md:h-[40%] bg-blue-200 text-gray-900 rounded-3xl shadow-lg flex flex-row md:flex-row items-center 
                     justify-between  gap-4 p-4]"
        >
          <div className="flex flex-col justify-start ">
            <div className="flex items-center gap-2">
              <AvatarCircles avatarUrls={avatars} />
              <div className="flex flex-col">
                <p className="text-lg md:text-xl font-extrabold">+15</p>
                <strong className="text-xs md:text-sm">People Trusted</strong>
              </div>
            </div>
            <p className="text-xs md:text-sm pt-2">
              Trusted by 15+ valued clients who rely on our expertise in
              security.
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex justify-start gap-2">
              <img
                src={Quality}
                alt="Quality"
                className="h-8 md:h-10 w-8 md:w-10"
              />
              <div>
                <p className="text-lg md:text-xl font-extrabold">+150</p>
                <strong className="text-xs md:text-sm">Quality Service</strong>
              </div>
            </div>
            <p className="text-xs md:text-sm pt-2">
              We take pride in delivering 150+ high-quality services, ensuring
              excellence.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side (Text Content) */}
      <div className="w-full md:w-1/2 flex flex-col items-start mt-10 justify-center gap-3 md:text-left pl-5">
        <img
          src={Linked_Services1}
          alt="Linked Services"
          className=" md:mx-0 mt-9 h-8 w-8"
        />
        <p className=" mt-7 font-unna text-3xl md:text-[49px] flex flex-col">
          <span className="font-semibold text-[#fff7ed]">
            Keeping Your World
          </span>
          <span className="mt-[5px] md:mt-[15px] font-extralight text-2xl md:text-[46px] text-[#BFD7EA]">
            Secure & Spotless
          </span>
        </p>
        <p className="text-gray-300 pt-3 md:pt-5 mb-6 md:mb-10 text-sm md:text-base">
          At MNS Secure Solutions Pvt Ltd, we provide top-tier security,
          housekeeping, payroll management, and maintenance services to ensure a
          safe, clean, and efficient environment.
        </p>
        <div className="flex justify-start md:justify-start">
          <Button title="Read More →" />
        </div>
      </div>
    </section>
  );
}

export default KeepingYourWorld;







    <div className="max-w-sm mx-auto p-4">
      <div className="relative rounded-lg overflow-hidden bg-white shadow-lg">
        {/* Image Section */}
        <div className="relative">
          <img
            src="https://source.unsplash.com/400x300/?nature"
            alt="Card Image"
            className="w-full h-60 object-cover md:rounded-lg rounded-t-full"
          />

          {/* Text Box */}
          <div className="absolute inset-x-5 -bottom-6 md:-bottom-6 bg-white/40 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg md:w-2/3 w-[80%] mx-auto text-center">
            <h3 className="text-lg font-semibold text-gray-900">Beautiful Landscape</h3>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 pt-10 text-center md:pt-6">
          <p className="text-gray-700">
            Discover the most stunning landscapes around the world. Experience nature like never before!
          </p>
        </div>
      </div>
    </div>