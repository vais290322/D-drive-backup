import React from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import Plumber from '../../../../assets/Home_images/service page/Inside_Service/plumbing.jpg';
import { useNavigate } from "react-router-dom";

function ElectricalPlumbingMaintainance() {
 const navigate= useNavigate()
  return (
    <>
      {/* Hero Section */}
      <div
        className="h-screen pt-44  text-white bg-cover w-full bg-center relative"
        style={{ backgroundImage: `url(${Plumber})` }}
      >
        <Header />
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="relative p-10 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-300 to-blue-700 bg-clip-text text-transparent animate-pulse">
            Electrical & Plumbing Maintenance
          </h1>
          <p className="text-lg mt-4 max-w-2xl mx-auto">
            Professional maintenance services to ensure safety and efficiency
            for your home and business.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="py-16 px-6 text-center bg-gradient-to-r from-blue-50 to-blue-200  shadow-lg">
        <h2 className="text-4xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent animate-fade-in">
          Why Choose Our Services?
        </h2>
        <p className="text-gray-700 mt-4 animate-fade-in">
          We provide expert electrical and plumbing maintenance with quality
          assurance and prompt service.
        </p>
      </div>

      {/* Services Section */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-300 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-semibold text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent animate-bounce">
            Our Services
          </h2>
          <div className="mt-10 grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-white shadow-lg rounded-xl text-center hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-semibold">Electrical Maintenance</h3>
              <p className="mt-2 text-gray-600">
                Electrical inspections, wiring repairs, lighting solutions, and
                more.
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-xl text-center hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-semibold">Plumbing Maintenance</h3>
              <p className="mt-2 text-gray-600">
                Leak repairs, drain cleaning, water heater servicing, and more.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-6xl mx-auto py-16 px-6 bg-gradient-to-r from-gray-200 to-gray-400 rounded-xl shadow-lg">
        <h2 className="text-4xl font-semibold text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent animate-slide-in">
          How It Works
        </h2>
        <div className="mt-10 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-gray-300 rounded-xl hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-semibold">Step 1</h3>
            <p className="mt-2 text-gray-700">
              Schedule an inspection with our experts.
            </p>
          </div>
          <div className="p-6 bg-gray-300 rounded-xl hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-semibold">Step 2</h3>
            <p className="mt-2 text-gray-700">
              Get a detailed assessment and quote.
            </p>
          </div>
          <div className="p-6 bg-gray-300 rounded-xl hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-semibold">Step 3</h3>
            <p className="mt-2 text-gray-700">
              Our team performs quality maintenance and repairs.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 px-6 text-center bg-gradient-to-r from-blue-100 to-blue-300 rounded-xl shadow-lg">
        <h2 className="text-4xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent animate-pulse">
          Need Maintenance? Contact Us!
        </h2>
        <p className="mt-4 text-gray-700 animate-fade-in">
          Our skilled professionals are ready to assist you.
        </p>
        <button className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg animate-bounce" onClick={()=>navigate("/contact")} >
          Get a Quote
        </button>
      </div>
      <Footer />
    </>
  );
}

export default ElectricalPlumbingMaintainance;