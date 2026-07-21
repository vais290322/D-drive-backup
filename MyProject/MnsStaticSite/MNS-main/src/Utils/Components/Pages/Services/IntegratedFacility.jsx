import React from "react";
import { motion } from "framer-motion";
import Header from "../../Header";
import Footer from "../../Footer";
import Integrated from "../../../../assets/Home_images/service page/Inside_Service/integrated.jpg";
import { useNavigate } from "react-router-dom";

function IntegratedFacility() {

  const navigate=useNavigate()
  return (
    <>
      {/* Hero Section */}
      <div
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${Integrated})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <Header />
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative text-white text-center p-10 max-w-3xl"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-300 via-green-500 to-green-700 bg-clip-text text-transparent">
            Integrated Facility Services
          </h1>
          <p className="text-lg mt-4">
            Providing comprehensive solutions to maintain and enhance your
            facility’s efficiency.
          </p>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-gradient-to-r from-gray-100 to-gray-200 py-16 px-6"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-semibold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            Our Comprehensive Services
          </h2>
          <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
            From maintenance to security, we offer a full range of facility
            services tailored to your needs.
          </p>
          <div className="mt-10 grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Building Maintenance",
                desc: "Ensuring the structural integrity and functionality of your premises.",
              },
              {
                title: "Janitorial Services",
                desc: "High-quality cleaning solutions for a pristine environment.",
              },
              {
                title: "Security Solutions",
                desc: "Professional security services to safeguard your property.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
                  background:
                    "linear-gradient(to bottom right, #ffffff, #e6f7eb)",
                }}
                className="p-6 bg-white shadow-lg rounded-xl text-center border border-gray-300 cursor-pointer transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-700">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Why Choose Us Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto py-16 px-6 text-center"
      >
        <h2 className="text-4xl font-semibold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
          Why Choose Our Services?
        </h2>
        <p className="text-gray-700 mt-4">
          We prioritize efficiency, reliability, and top-tier service to ensure
          your facility runs seamlessly.
        </p>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="py-16 px-6 text-center bg-gradient-to-r from-green-700 to-green-900 text-white"
      >
        <h2 className="text-4xl font-semibold">Get in Touch Today!</h2>
        <p className="mt-4 max-w-2xl mx-auto">
          Partner with us for top-notch facility management solutions tailored
          to your needs.
        </p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-6 px-8 py-3 bg-white text-green-700 font-semibold rounded-full shadow-lg transition-all hover:bg-gray-200" onClick={()=>navigate("/contact")}
        >
          Contact Us
        </motion.button>
      </motion.div>
      <Footer />
    </>
  );
}

export default IntegratedFacility;
