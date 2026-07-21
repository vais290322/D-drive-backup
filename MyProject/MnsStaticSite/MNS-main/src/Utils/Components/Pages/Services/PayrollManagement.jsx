import React from "react";
import { motion } from "framer-motion";
import Header from "../../Header";
import Footer from "../../Footer";
import Payroll from '../../../../assets/Home_images/service page/Inside_Service/payroll.jpg'
import { useNavigate } from "react-router-dom";

const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const PayrollManagement = () => {
  const navigate=useNavigate()
  return (
    <>
      {/* Hero Section */}
      <div
        className="h-screen text-white bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: `url(${Payroll})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <Header />
        <motion.div
          className="z-10 text-center p-10 rounded-xl"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-700 text-transparent bg-clip-text">
            Payroll Management Services
          </h1>
          <p className="text-lg mt-4 max-w-2xl text-gray-300">
            Efficient, accurate, and hassle-free payroll solutions tailored for businesses of all sizes.
          </p>
        </motion.div>
      </div>

      {/* About Section */}
      <motion.div
        className="max-w-6xl mx-auto my-10 py-16 px-6 text-center bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-semibold bg-gradient-to-r from-blue-500 to-blue-800 text-transparent bg-clip-text">
          Why Choose Our Payroll Services?
        </h2>
        <p className="text-gray-700 mt-4">
          We provide end-to-end payroll management, ensuring compliance, accuracy, and timely salary disbursement.
        </p>
      </motion.div>

      {/* Key Features */}
      <motion.div
        className="bg-gradient-to-r from-gray-100 to-gray-300 py-16 px-6"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-semibold text-center bg-gradient-to-r from-blue-500 to-blue-800 text-transparent bg-clip-text">
            Key Features
          </h2>
          <div className="mt-10 grid md:grid-cols-3 gap-8">
            {[
              { title: "Automated Payroll Processing", desc: "Seamlessly process employee salaries, taxes, and benefits." },
              { title: "Tax Compliance & Deductions", desc: "Ensure compliance with tax laws and regulations effortlessly." },
              { title: "Real-time Reports & Insights", desc: "Generate detailed payroll reports for better financial tracking." },
            ].map((feature, index) => (
              <motion.div key={index} className="p-6 bg-white shadow-lg rounded-xl text-center" variants={fadeIn}>
                <h3 className="text-2xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>


      {/* Contact Section */}
      <motion.div
        className="py-16 px-6 text-center bg-gradient-to-r from-blue-100 to-blue-300 rounded-xl"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-semibold bg-gradient-to-r from-blue-500 to-blue-800 text-transparent bg-clip-text">
          Get Started with Payroll Management
        </h2>
        <p className="mt-4 text-gray-700">
          Let us handle your payroll so you can focus on growing your business.
        </p>
        <motion.button
          className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={()=>navigate("/contact")}
        >
          Contact Us
        </motion.button>
      </motion.div>

      <Footer />
    </>
  );
};

export default PayrollManagement;