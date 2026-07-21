import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/Expo/Logo.png";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import thankYou from "../assets/Expo/Thank You.png";
import ExpoForm from "./ExpoForm";
import { useNavigate } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, type: "spring" },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

function ExpoPage2() {
  const [isExpoFormOpen, setIsExpoFormOpen] = useState(false);
  const logos = [logo, logo, logo, logo, logo, logo];
  const address =
    "Block E, Baishnabghata Patuli Twp, Patuli, Kolkata, West Bengal 700047";
  const googleMapURL =
    "https://www.google.com/maps/place/Patuli+Mela+Ground/@22.4759535,88.3844652,17z";


    const navigate = useNavigate()
  return (
    <>
      {/* Sponsors & Partners */}
      {/* <motion.section
        className="bg-gray-50 py-20 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <motion.div
          className="max-w-3xl mx-auto text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Sponsors & Partners
          </h2>
        </motion.div>
        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {logos.map((src, idx) => (
            <motion.div
              key={idx}
              className="flex items-center justify-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition"
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              whileHover={{
                scale: 1.07,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              }}
            >
              <img
                src={src}
                alt={`Sponsor ${idx + 1}`}
                className="h-12 w-auto object-contain"
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.section> */}

      {/* Map & Location */}
      <motion.section
        className="bg-white py-20 px-4 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <motion.a
          href={googleMapURL}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-6 right-6 bg-orange-500 text-white text-sm md:text-base font-medium px-4 py-2 rounded hover:bg-orange-600 transition"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          View in Google Map ↗
        </motion.a>

        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-4 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          Map & Location
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl text-gray-700 mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {address}
        </motion.p>

        <motion.div
          className="w-full h-[400px] md:h-[600px]"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <iframe
            title="Patuli Mela Ground Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.101808893809!2d88.3822703154293!3d22.47594978524183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02715c9e4e09fb%3A0x665a7a6b8b8f1d34!2sPatuli%20Mela%20Ground!5e0!3m2!1sen!2sin!4v1718787777123!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-xl"
          ></iframe>
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="bg-[#E9700C] text-white py-20 px-4 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-10 leading-tight">
            Ready To Experience The Future Of Mobility?
          </h2>

          <motion.div
            className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.button
              className="bg-white text-black font-bold text-lg md:text-2xl px-10 py-3 rounded-lg hover:bg-gray-100 transition"
              whileHover={{ scale: 1.07 }}
              onClick={() => setIsExpoFormOpen(true)}
            >
              Register Now
            </motion.button>
            <motion.button
              className="bg-black text-white font-bold text-lg md:text-2xl px-10 py-3 rounded-lg hover:bg-gray-800 transition"
              whileHover={{ scale: 1.07 }}
              onClick={ ()=> navigate("/join-expo") }
            >
              Become a Sponsor
            </motion.button>
          </motion.div>
          {/* <h2 className="text-3xl md:text-5xl font-bold mb-10 leading-tight">
            Ready to experience the future of mobility?
          </h2> */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-6 text-base sm:text-lg md:text-xl font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {/* Phone */}
            <a
              href="tel:+918343939495"
              className="flex items-center gap-2 hover:underline text-white"
            >
              <FaPhoneAlt className="text-lg sm:text-xl" />
              <span>Call Us: +91 8343939495</span>
            </a>

            {/* Email */}
            <a
              href="mailto:info@vaisproductions.com"
              className="flex items-center gap-2 hover:underline text-white"
            >
              <FaEnvelope className="text-lg sm:text-xl" />
              <span>Mail Us: info@vaisproductions.com</span>
            </a>
          </motion.div>

          {/* Thank You Image */}
          <motion.div
            className="flex justify-center mt-10"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <img
              src={thankYou}
              alt="Thank You"
              className="w-40 sm:w-52 md:w-64 object-contain"
              loading="lazy"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ExpoForm Dialog */}
      <AnimatePresence>
        {isExpoFormOpen && (
          <motion.div
            className="fixed inset-0 z-[1000] bg-black bg-opacity-60 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative w-full max-w-2xl mx-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ExpoForm onClose={() => setIsExpoFormOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ExpoPage2;
