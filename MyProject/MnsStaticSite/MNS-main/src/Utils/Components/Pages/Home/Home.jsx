import React from "react";
import Header from "../../Header";
import Button from "../../Others/Button";
import BgVideo from "../../../../assets/Home_images/home page/Rectangle_Video.mp4";
import Security from "./Security";
import Footer from "../../Footer";
import ExportCareOfSource from "./ExportCareOfSource";
import KeepingYourWorld from "./KeepingYourWorld";
import TrustedByBusiness from "./TrustedByBusiness";
import ImageGallary from "../Gallary/ImageGallary";
import DiscoverTheDifference from "./DiscoverTheDifference";

function Home() {
  return (
    <>
      <div className="relative w-full h-screen flex flex-col overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={BgVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-black bg-opacity-45"></div>
        <Header />
        <div className="relative flex flex-col justify-center items-center gap-5 md:items-start h-full px-6 md:px-16 lg:px-24 text-white text-center md:text-left">
          <p className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl text-[#fff7ed] font-bold sm:w-[80%] md:w-[60%] font-unna">
            <span className="font-extralight">
              Smart Solutions for Security,
            </span>
            <span className="text-[#BFD7EA]"> Maintenance </span>
            <span className="font-extralight">& Cleanliness!</span>
          </p>
          <p className="mt-4 text-[#BFD7EA] px-4 sm:px-8 md:px-0 md:w-[80%] lg:w-[60%] text-sm sm:text-base ">
            At <span className="font-semibold">MNS Secure Solutions</span>, we
            specialize in providing top-quality Maintenance, Guard, and
            Housekeeping Services tailored to meet your needs. Whether it's
            ensuring security, keeping your premises spotless, or handling
            maintenance tasks efficiently, we’ve got you covered.
          </p>
          <div className="mt-6 flex justify-center md:justify-start">
            <Button
              title="Read More →"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg text-sm sm:text-base"
            />
          </div>
        </div>
        <div className="absolute right-4 bottom-10 text-white transform rotate-90 text-xs sm:text-sm hidden md:block">
          Scroll Down
        </div>
      </div>
      <ExportCareOfSource />
      <KeepingYourWorld />
      <Security />
      <TrustedByBusiness />
      <ImageGallary />
      <DiscoverTheDifference />
      <Footer />
    </>
  );
}

export default Home;
