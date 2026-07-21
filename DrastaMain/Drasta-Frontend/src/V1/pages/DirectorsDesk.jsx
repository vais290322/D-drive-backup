import React, { useEffect, useState } from "react";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import legalBg from "../assets/v1-footerimage.jpg";
import expert8 from "../assets/profile-pic.jpg";

const API = import.meta.env.VITE_OLD_API_URL;
export const DirectorsDesk = () => {
   const [data, setData] = React.useState([]);
     const fetchData = async () => {
         try {
           const response = await fetch(`${API}/api/v1/directors-desk`); // Adjust the API endpoint as needed");
           const result = await response.json();
           setData(result?.directors[0]);
           console.log("Fetched CSR Data:", result.directors[0]);
         } catch (error) {
           console.error("Error fetching CSR data:", error);
         }
       };
    React.useEffect(() => {
       fetchData();
     }, []);

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
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl sm:text-2xl text-black relative inline-block">
            Director's Desk
            <span className="block h-[2px] w-24 bg-[#b2a65f] mt-1"></span>
          </h2>

          <div className="mt-8 flex flex-col md:flex-row gap-8 items-start">
            {/* Director Image */}
            <img
              src={data?.image || expert8}
              alt="Director of C-DRAṢṬᾹ"
              className="w-full md:w-1/3 object-cover rounded-lg shadow-lg"
            />

            {/* Director Message */}
            <div className="text-gray-700 text-[16px] sm:text-[18px] leading-relaxed">
              <p className="mb-4">
               {data?.description}
              </p>
              <div className="mt-6 font-semibold text-gray-800">
                — Mr. {data?.name} <br />
                Director, C-DRAṢṬᾹ
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
