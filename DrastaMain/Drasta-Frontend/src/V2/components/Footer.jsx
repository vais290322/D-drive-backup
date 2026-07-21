import React from "react";
import { Link } from "react-router-dom";
import { Logo, Rectangle31 } from "@/V2/assets";
import { navbarItems } from "@/V2/config";
import { motion } from "framer-motion";
import { rectangleBrush, tomPaper5 } from "@/assets";

export const Footer = ({ landingPage = false }) => {
  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren",
      },
    },
  };

  const hoverPop = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  };

  return (
    <footer className="relative bg-[var(--primary-color)] text-white pt-[200px] pb-20 mt-[350px] ">
      {landingPage && (
        <img
          src={tomPaper5}
          alt="Torn paper top"
          className="absolute w-full h-[15%] object-fit z-10 -top-[10%] left-0 rotate-180"
        />
      )}

      {/* Banner */}
      <motion.section
        className="z-10 absolute w-[85%] h-[380px] bottom-[85%] left-1/2 -translate-x-1/2 rounded-xl overflow-hidden "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <div
          className="w-full h-full bg-cover bg-center relative "
          style={{ backgroundImage: `url(${landingPage ? rectangleBrush : Rectangle31})` }}
        >
          <div className="absolute" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-6">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#F3C304] mb-4 sm:mb-6">
              Want To Know More?
            </h2>
            <p className="text-sm sm:text-base md:text-lg max-w-md sm:max-w-2xl md:max-w-4xl text-white">
              Major thrust area of the CEWs is research methodology for the
              design and implementation of evaluation studies and its
              applications to Green & Inclusive development. Other than
              empowerment through training for technical advancement, C-DRAŞŢA
              is engaged in empowering through dissemination by organizing Green
              Awareness Workshop (GAW) and Campaigns on themes related to 'Green
              Living and Livelihood'.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Footer Grid */}
      <motion.div
        className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
      >
        {/* Left Column */}
        <motion.div variants={fadeUp} className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-white rounded p-2">
              <img src={Logo} alt="Logo" className="h-14" />
            </div>
          </div>
          <p className="text-sm font-bold max-w-sm text-white">
            The Centre for Development Research, Sustainability & Technical
            Advancement (C-DRASTĀ) is a non-profit and autonomous institution
            dedicated to sustainable development policy.
          </p>
        </motion.div>

        {/* Middle Column */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-start md:items-center"
        >
          <h4 className="text-2xl font-bold mb-6 border-b-2 border-[#F3C304]">
            Quick Links
          </h4>
          <ul className="space-y-2">
            {navbarItems.map(({ title, url }, idx) => (
              <motion.li
                key={idx}
                variants={fadeUp}
                whileHover={{ x: 5 }}
                className="overflow-hidden"
              >
                <Link
                  to={url}
                  className="text-white hover:text-[#F3C304] text-lg font-medium"
                >
                  {title}
                </Link>
              </motion.li>
            ))}
          </ul>
          <Link to="/">
          <button  className="inline-block text-yellow-400 hover:text-white px-4 py-2 rounded text-lg font-bold cursor-pointer">
            ← Back
          </button>
          </Link>
        </motion.div>

        {/* Right Column */}
        <motion.div variants={fadeUp} className="space-y-6">
          <motion.div {...hoverPop}>
            <Link
              to="/volunteer"
              className="inline-block border-2 border-[#F3C304] text-[#F3C304] px-4 py-2 rounded text-lg font-bold hover:bg-[#F3C304] hover:text-white transition"
            >
              Join Us as Volunteer
            </Link>
          </motion.div>
          <div className="text-[16px] text-white">
            <h5 className="text-xl mb-2">Address</h5>
            <p>
              <strong>City Office:</strong>
              <br />
              Gopal Bhawan, 42, Vidyasagar Street, Kolkata-700009
            </p>
            <p className="mt-4">
              <strong>Registered Office:</strong>
              <br />
              A/2/5, Pearl Apartment, 506, Kailash Bose Street, Kolkata-700006
            </p>
            <p className="mt-4">
              <a href="mailto:info@drasta.org" className="underline">
                info@drasta.org
              </a>
              ,
              <a href="mailto:director@drasta.org" className="ml-2 underline">
                director@drasta.org
              </a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
