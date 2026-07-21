import React from "react";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import advisor1 from "../assets/Abhirup-Sarkar-1.jpg";
import advisor2 from "../assets/Aloke-Kar-1.jpg";
import advisor3 from "../assets/Basudeb-Chaudhuri-1.jpg";
import advisor4 from "../assets/Diganta-Mukherjee-3.jpg";
import advisor5 from "../assets/Krishnendu-Ghosh-Dastidar-1.jpg";
import advisor6 from "../assets/Mallikarjun-Rao-4.jpg";
import advisor7 from "../assets/Sanjay-Roy-1.jpg";
import advisor8 from "../assets/Surajit-Borkotoky-2.jpg";
import advisor9 from "../assets/Sudipta-Sarangi.jpg";

import legalBg from "../assets/v1-footerimage.jpg";

// Sample data array (replace image paths accordingly)
const advisors = [
  {
    name: "Dr. Abhirup Sarkar",
    designation: "Indian Statistical Institute, Kolkata",
    image: advisor1,
  },
  {
    name: "Sri. Aloke Kar",
    designation: "Indian Statistical Institute, Kolkata",
    image: advisor2,
  },
  {
    name: "Dr. Basudeb Chaudhuri",
    designation: "European Commission",
    image: advisor3,
  },
  {
    name: "Dr. Diganta Mukherjee",
    designation: "Indian Statistical Institute, Kolkata",
    image: advisor4,
  },
  {
    name: "Dr. Krishnendu Ghosh Dastidar",
    designation: "Jawaharlal Nehru University, Delhi",
    image: advisor5,
  },
  {
    name: "Dr. Mallikarjun Rao",
    designation: "Indian Institute of Technology, Mumbai",
    image: advisor6,
  },
  {
    name: "Dr. Mallikarjun Rao",
    designation: "Indian Institute of Technology, Mumbai",
    image: advisor6,
  },
  {
    name: "Sri. Sanjay Roy",
    designation: "Independent Consultant, Kolkata",
    image: advisor7,
  },
  {
    name: "Dr. Surajit Borkotoky",
    designation: "Dibrugarh University, Dibrugarh",
    image: advisor8,
  },
  {
    name: "Dr. Sudipta Sarangi",
    designation: "Virginia Tech University, USA",
    image: advisor9,
  },
];

export const Advisors = () => {
  return (
    <>
      <Header />
      <div
        className="h-14 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${legalBg})` }}
      ></div>
      <section className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl  text-black">
            Advisors
          </h2>
          <div className="h-[2px] w-16 bg-[#b2a65f] mt-1 mb-6"></div>

          {/* Intro Text */}
          <p className="text-sm sm:text-base text-gray-700 mb-10 max-w-4xl leading-relaxed">
            In order to execute its vision and chart out the future path of the
            organization, the Board of Trustees seeks the advice and guidance of
            illustrious scholars, professionals, and eminent social reformers.
            The panel of Advisors helps C-DRASTA with their knowledge,
            experience, and expert advice.
          </p>

          {/* Advisors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advisors.map((advisor, index) => (
              <div key={index} className="flex items-start gap-4">
                <img
                  src={advisor.image}
                  alt={advisor.name}
                  className="w-[150px] h-[150px] object-cover border-4 border-gray-200"
                />
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-black">
                    {advisor.name}
                  </h3>
                  <p className="text-sm text-gray-700 pt-4">{advisor.designation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
