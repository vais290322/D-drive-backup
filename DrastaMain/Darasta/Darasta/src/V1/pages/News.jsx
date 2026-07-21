import React from "react";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import legalBg from "../assets/v1-footerimage.jpg";

export const News = () => {
  return (
    <>
      <Header />
      <div className="min-h-[49.6vh] bg-white">
        {/* Top Pattern Strip */}
        <div
          className="h-14 bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: `url(${legalBg})` }}
        ></div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-12 text-left">
          <h2 className="text-2xl sm:text-3xl font-medium text-black relative inline-block">
            NEWS
            <span className="block h-[2px] w-16 bg-[#b2a65f] mt-1 "></span>
          </h2>

          <p className="mt-8 text-gray-600 text-lg sm:text-[14px]">
            C-DRAṢṬĀ conducted its first and second online C-DRAṢṬĀ GREEN LIVING
            & LIVELIHOOD (GLL) QUIZ meet on 21ST November and 12th December 2021
            respectively. The contestants post graduate and undergraduate
            students and young professionals from various backgrounds.
          </p>
          <p className="mt-8 text-gray-600 text-lg sm:text-[14px]">
            C-DRAṢṬĀ is happy to share the link of the 2nd meet:
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};
