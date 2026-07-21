import React, { useEffect, useState } from 'react';
import Header from '../../Header';
import Footer from '../../Footer';
import Fire_Safety from '../../../../assets/Home_images/service page/Inside_Service/fire.jpg';
import { useNavigate } from 'react-router-dom';

function FireSafety() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

 const navigate= useNavigate()
  return (
    <>
      <Header />

      {/* Hero Section */}
      <div
        className={`h-screen flex items-center justify-center text-white bg-cover bg-center transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundImage: `url(${Fire_Safety})`, backgroundBlendMode: 'overlay', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      >
        <div className=" p-10 rounded-xl text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-blue-400  bg-clip-text text-transparent animate-pulse">
            Fire Safety Solutions
          </h1>
          <p className="text-lg mt-4 max-w-2xl">
            Protecting lives and property with advanced fire safety systems and services.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="py-16 px-6  text-center bg-gradient-to-r from-red-100 to-yellow-100 bg-opacity-90 animate-gradient">
        <h2 className="text-4xl font-semibold bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
          Why Fire Safety Matters?
        </h2>
        <p className="text-gray-700 mt-4">
          Fire hazards can be unpredictable. Our fire safety solutions ensure early detection,
          prevention, and quick response to safeguard people and assets.
        </p>
      </div>

      {/* Services Section */}
      <div className="py-16 px-6 bg-gradient-to-r from-red-200 to-yellow-200 bg-opacity-90 animate-gradient">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-semibold bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent text-center">
            Our Fire Safety Services
          </h2>
          <div className="mt-10 grid md:grid-cols-2 gap-8">
            {[
              { title: "Fire Alarm Systems", desc: "Early warning systems to detect and alert about potential fires." },
              { title: "Fire Extinguishers", desc: "Supply and maintenance of high-quality fire extinguishers." },
              { title: "Sprinkler Systems", desc: "Automatic fire suppression systems for enhanced safety." },
              { title: "Fire Safety Training", desc: "Educating staff and individuals on fire prevention and emergency response." },
            ].map((service, index) => (
              <div key={index} className="p-6 bg-white shadow-lg rounded-xl text-center border border-gray-300 transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
                  {service.title}
                </h3>
                <p className="mt-2 text-gray-700">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 px-6 text-center bg-gradient-to-r from-red-300 to-yellow-300 bg-opacity-90 animate-gradient">
        <h2 className="text-4xl font-semibold bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
          Ensure Fire Safety Today!
        </h2>
        <p className="mt-4 text-gray-700">Contact us for fire safety assessments, installations, and training.</p>
        <button onClick={()=>navigate("/contact")} className="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg transform hover:scale-110 transition-transform duration-300">
          Get a Consultation
        </button>
      </div>

      <Footer />
    </>
  );
}

export default FireSafety;
