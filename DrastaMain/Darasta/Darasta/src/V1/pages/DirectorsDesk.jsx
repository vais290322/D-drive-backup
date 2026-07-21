import React from "react";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import legalBg from "../assets/v1-footerimage.jpg";
export const DirectorsDesk = () => {
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
          <h2 className="text-2xl sm:text-2xl  text-black relative inline-block">
            Director's Desk
            <span className="block h-[2px] w-24 bg-[#b2a65f] mt-1 "></span>
          </h2>

          <p className="mt-8 text-gray-600 text-[16px] sm:text-[30px] contact_legal">
            Comming Soon....
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};
