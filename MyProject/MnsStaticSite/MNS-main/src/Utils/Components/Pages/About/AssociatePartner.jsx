import React from "react";
import Linked_services from "../../../../assets/Home_images/home page/linked_services.png";
import Marquee from "react-fast-marquee";
import Image1 from "../../../../assets/Home_images/about page/1686653905435.jpeg";
import Image2 from "../../../../assets/Home_images/about page/abdos.jpg";
import Image3 from "../../../../assets/Home_images/about page/aum-express.webp";
import Image4 from "../../../../assets/Home_images/about page/cabcon.jpeg";
import Image5 from "../../../../assets/Home_images/about page/city-mart-YrDqBoQO6eFPGzp9.avif";
import Image6 from "../../../../assets/Home_images/about page/CLUBTOWN-COURTYARD.jpg";
import Image7 from "../../../../assets/Home_images/about page/GGH6mB_XYAA5CD2.png";
import Image8 from "../../../../assets/Home_images/about page/hotel-mangalam-YrDqBoQObls9paN4.avif";
import Image9 from "../../../../assets/Home_images/about page/images.png";
import Image10 from "../../../../assets/Home_images/about page/kolkata-trends-YD0B5ngZv0CxG1PD.avif";
import Image11 from "../../../../assets/Home_images/about page/logo-new.png";
import Image12 from "../../../../assets/Home_images/about page/logo.png";
import Image13 from "../../../../assets/Home_images/about page/middletoninn-logo.png";
import Image14 from "../../../../assets/Home_images/about page/Orient_BlackSwan_logo.png";
import Image15 from "../../../../assets/Home_images/about page/Swiggy-Logo.png";
import Image16 from "../../../../assets/Home_images/about page/uic_udyog_limited_cover.jpeg";
import Image17 from "../../../../assets/Home_images/about page/Zepto_Logo.svg.png";

function AssociatePartner() {
  const images = [
    Image1,
    Image2,
    Image3,
    Image4,
    Image5,
    Image6,
    Image7,
    Image8,
    Image9,
    Image10,
    Image11,
    Image12,
    Image13,
    Image14,
    Image15,
    Image16,
    Image17,
  ];
  return (
    <>
      <div className=" flex flex-col gap-12 pt-32 px-10 md:px-16 lg:px-32 mb-12">
        <div className="flex items-center">
          <img src={Linked_services} alt="no image" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
          Growing Stronger Together :
          <span className="text-blue-500"> Associate Partners</span>
        </h2>
        <p className="text-gray-600 mt-4 max-w-3xl">
          We take pride in partnering with trusted associates and industry
          leaders who share our commitment to excellence, security, and
          reliability. Our valued partners play a vital role in helping us
          deliver top-tier security, housekeeping, and maintenance solutions
          with unmatched professionalism.
        </p>
      </div>
      <Marquee>
       {images.map((item,idx)=>(
        <div key={idx} className="h-32 w-full flex justify-center mr-5">
        <img src={item} alt="no image" className="h-20 w-36" />
        </div>
       ))}
      </Marquee>
    </>
  );
}

export default AssociatePartner;
