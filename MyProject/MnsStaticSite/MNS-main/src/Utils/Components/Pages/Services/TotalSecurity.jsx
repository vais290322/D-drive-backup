import React from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../../../../assets/Home_images/service page/security-guard-workspace.jpg";
import Header from "../../Header";
import Footer from "../../Footer";
import Button from "../../Others/Button";
import Security1 from "../../../../assets/Home_images/service page/Inside_Service/security1.jpg";
import Security2 from "../../../../assets/Home_images/service page/Inside_Service/security2.jpg";
import Security3 from "../../../../assets/Home_images/service page/Inside_Service/security3.jpg";
import Bouncer1 from "../../../../assets/Home_images/service page/Inside_Service/bouncer1.jpg";
import Bouncer2 from "../../../../assets/Home_images/service page/Inside_Service/bouncer2.jpg";
import Bouncer3 from "../../../../assets/Home_images/service page/Inside_Service/bouncer3.jpg";

function TotalSecurity() {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="h-screen w-full bg-center bg-cover p-8 relative"
        style={{ backgroundImage: `url(${Banner})` }}
      >
        <Header />
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 text-white p-6 md:p-32 flex flex-col gap-5 w-full md:w-1/2 mt-20">
          <h1 className="text-3xl md:text-4xl font-bold">Professional Security Services</h1>
          <p className="mt-4 text-base md:text-lg">
            At <span className="text-blue-600">MNS</span>, we provide top-tier
            security solutions tailored to safeguard businesses, residences, and
            public spaces. Our highly trained security professionals are
            dedicated to ensuring a secure environment with round-the-clock
            protection, advanced surveillance, and rapid emergency response.
          </p>
          <div>
            <Button title="Get a Free Quote →"  onClick={() => navigate("/contact")} />
          </div>
        </div>
      </div>
      <div className="w-full p-6 md:p-8">
        <div className="max-w-6xl mt-10 p-6 md:p-8 mx-auto">
          <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-10 md:gap-20">
            <div className="w-full md:w-1/2 flex flex-col justify-center gap-5 ">
              <h2 className="text-4xl md:text-6xl font-bold text-blue-700">Guard Services</h2>
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-800">Protecting What Matters Most</h3>
              <p className="text-gray-600 mt-4 text-sm md:text-base">
                Security is the foundation of a safe and worry-free environment.
                At MNS Secure Solutions, we provide highly trained security
                personnel committed to ensuring the safety of your business,
                residence, and assets.
              </p>
              <div>
                <h4 className="mt-6 text-lg md:text-xl font-semibold text-gray-800">Our Security Solutions Include:</h4>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-center text-gray-700">
                    <span className="text-blue-600 mr-2">✔</span> 24/7 Professional Guarding Services
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-blue-600 mr-2">✔</span> Access Control & Surveillance Monitoring
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-blue-600 mr-2">✔</span> Emergency Response & Risk Management
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full mx-10 md:w-1/2 flex gap-4 justify-center">
              <img src={Security1} alt="Security Guard" className="w-1/3 rounded-xl shadow-md" />
              <img src={Security2} alt="Surveillance" className="w-1/2 rounded-xl shadow-md mt-10" />
              <img src={Security3} alt="Security Guard" className="w-1/3 rounded-xl shadow-md mt-20" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-wrap md:flex-nowrap items-center justify-center gap-10 md:gap-16 px-6 md:px-32 pb-20 md:pb-32 border-t border-blue-600 py-10">
        <div className="w-full mx-16 md:mx-10 md:w-1/2 flex justify-center gap-4 mt-10">
          <img src={Bouncer1} alt="Security Guard" className="w-1/3 rounded-xl shadow-md mt-20" />
          <img src={Bouncer2} alt="Surveillance" className="w-1/2 h-[310px] rounded-xl shadow-md mt-10" />
          <img src={Bouncer3} alt="Security Guard" className="w-1/3 rounded-xl shadow-md" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col ">
          <h2 className="text-4xl md:text-6xl font-bold text-blue-700">Bouncer Services</h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-800">Ensuring Safety & Order</h3>
          <p className="text-gray-600 mt-4 text-sm md:text-base">
            Our professional bouncers are trained to manage crowd control,
            ensure VIP security, and handle any disturbances with efficiency.
            At MNS Secure Solutions, we provide experienced security personnel
            to maintain a safe environment at your venue.
          </p>
          <div>
            <h4 className="mt-6 text-lg md:text-xl font-semibold text-gray-800">Our Bouncer Solutions Include:</h4>
            <ul className="mt-3 space-y-2">
              <li className="flex items-center text-gray-700">
                <span className="text-blue-600 mr-2">✔</span> Nightclub & Bar Security
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-blue-600 mr-2">✔</span> Concert & Event Crowd Management
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-blue-600 mr-2">✔</span> VIP Protection & Access Control
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TotalSecurity;
