import React from "react";
import Banner from "../../../../assets/Home_images/service page/service banner image.png";
import Header from "../../Header";
import Button from "../../Others/Button";
import DiscoverTheDifference from "../Home/DiscoverTheDifference";
import Footer from "../../Footer";
import VerifiedIcon from '@mui/icons-material/Verified';
import Rectangle1 from "../../../../assets/Home_images/service page/Rectangle 23.png";
import Rectangle24 from "../../../../assets/Home_images/service page/Rectangle 24.png";
import Rectangle231 from "../../../../assets/Home_images/service page/Rectangle 23(1).png";
import Rectangle241 from "../../../../assets/Home_images/service page/Rectangle 24(1).png";
import Rectangle232 from "../../../../assets/Home_images/service page/Rectangle 23(2).png";
import Rectangle242 from "../../../../assets/Home_images/service page/Rectangle 24(2).png";

function Service() {
  return (
    <>
      <div
        className="h-screen w-full bg-center bg-cover text-white relative"
        style={{ backgroundImage: `url(${Banner})` }}
      >
        <Header />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10 pt-48">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold pt-10">
              Complete Facility Solutions: Secure, <span className="text-gray-300">Maintain, Clean</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-200 py-10">
              At MNS Secure Solutions, we specialize in comprehensive security, maintenance, and housekeeping services...
            </p>
            <Button title="Read More →" />
          </div>
        </div>
      </div>

      {[{
        title: "Maintenance Services:",
        subtitle: "Ensuring Efficiency & Longevity",
        desc: "A well-maintained facility is key to smooth operations...",
        solutions: ["Routine Upkeep & Preventive Maintenance", "Electrical, Plumbing & Mechanical Repairs", "Property Management Solutions"],
        images: [Rectangle1, Rectangle24]
      }, {
        title: "Housekeeping Services:",
        subtitle: "Clean, Hygienic, Welcoming Spaces",
        desc: "A well-maintained environment enhances health, productivity...",
        solutions: ["Comprehensive Cleaning Services", "Sanitization & Disinfection", "Waste Management & Hygiene Maintenance"],
        images: [Rectangle231, Rectangle241]
      }, {
        title: "Guard Services:",
        subtitle: "Protecting What Matters Most",
        desc: "Security is the foundation of a safe and worry-free environment...",
        solutions: ["24/7 Professional Guarding Services", "Access Control & Surveillance Monitoring", "Emergency Response & Risk Management"],
        images: [Rectangle232, Rectangle242]
      }].map((service, index) => (
        <div className="py-16 bg-white" key={index}>
          <div className={`px-6 flex flex-col-reverse lg:flex-row justify-center gap-16 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
            <div className="flex gap-6">
              <img src={service.images[0]} alt="" className="w-40 sm:w-[300px] h-60 sm:h-[450px] object-cover rounded-2xl shadow-lg" />
              <img src={service.images[1]} alt="" className="w-40 sm:w-[300px] h-60 sm:h-[450px] mt-10 sm:mt-24 object-cover rounded-2xl shadow-lg" />
            </div>
            <div className="max-w-lg  lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-600">{service.title}</h2>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mt-2">{service.subtitle}</h3>
              <p className="mt-4 text-gray-600 text-sm sm:text-base">{service.desc}</p>
              <h4 className="mt-6 font-semibold text-black text-lg">Our Solutions Include:</h4>
              <ul className="mt-3 space-y-3">
                {service.solutions.map((item, i) => (
                  <li key={i} className="flex  gap-2 text-gray-800  lg:justify-start">
                    <VerifiedIcon className="text-blue-600" />
                    <span className="font-medium text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}

      <DiscoverTheDifference />
      <Footer />
    </>
  );
}

export default Service;