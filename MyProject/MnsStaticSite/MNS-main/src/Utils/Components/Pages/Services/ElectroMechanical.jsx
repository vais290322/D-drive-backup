import React from "react";
import Electro_Mechanical from "../../../../assets/Home_images/service page/Inside_Service/electro_mechanical.jpg";
import Header from "../../Header";
import Footer from "../../Footer";
import Mechanical_Work from '../../../../assets/Home_images/service page/Inside_Service/AdobeStock_304474910-1024x683.jpeg';
import Electrical_Work from '../../../../assets/Home_images/service page/Inside_Service/electrical.jpg';

function ElectroMechanical() {
  return (
    <>
      <div
        className="h-screen w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${Electro_Mechanical})` }}
      >
        <Header />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-80"></div>
        <div className="relative flex flex-col items-start justify-start text-white pt-48 px-32">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Electro-Mechanical Services
          </h1>
          <p className="text-lg mt-4 max-w-2xl bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
            Providing top-notch electro-mechanical solutions for industrial,
            commercial, and residential sectors with cutting-edge technology and
            expertise.
          </p>
        </div>
      </div>
      {/* Description Section with Images */}
      <div className="w-full mx-auto py-16 px-6 bg-gradient-to-r from-gray-100 to-gray-300 rounded-xl shadow-xl">
        <h2 className="text-4xl font-semibold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent text-center">
          Our Expertise
        </h2>
        <p className="text-gray-700 text-center mt-4">
          We specialize in providing electro-mechanical solutions that include
          installation, maintenance, and repairs for electrical and mechanical
          systems.
        </p>

        <div className="flex gap-20 mt-12">
          {/* Image Section */}
          <div className="w-1/2 flex flex-col justify-center gap-6">
            <img
              src={Electrical_Work}
              alt="Electrical Work"
              className="rounded-xl shadow-lg h-[40%] w-[90%] hover:scale-105 transition-transform duration-300"
            />
            <img
              src={Mechanical_Work}
              alt="Mechanical Work"
              className="rounded-xl shadow-lg h-[40%] w-[90%] mt-4 hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Service Details */}
          <div className="w-1/2 flex flex-col justify-center bg-gradient-to-r from-blue-50 to-purple-100 p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent ">
              What We Offer:
            </h3>
            <ul className="mt-4 space-y-3 text-gray-800 text-lg font-medium">
              <li className="hover:text-blue-600 transition">✔ Electrical system design and installation</li>
              <li className="hover:text-purple-600 transition">✔ HVAC & mechanical system solutions</li>
              <li className="hover:text-blue-600 transition">✔ Preventive maintenance & repair</li>
              <li className="hover:text-purple-600 transition">✔ Fire alarm & security systems</li>
              <li className="hover:text-blue-600 transition">✔ Renewable energy solutions</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ElectroMechanical;
