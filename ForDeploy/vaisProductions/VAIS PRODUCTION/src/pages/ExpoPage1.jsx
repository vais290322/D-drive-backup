// src/components/ExpoPage1.jsx
import React from "react";
import { motion } from "framer-motion";
import foodImg from "../assets/Expo/Rectangle 16.png";
import img1 from "../assets/Expo/Rectangle 20.png";
import img2 from "../assets/Expo/Rectangle 21.png";
import ExpoPage2 from "./ExpoPage2";

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

export default function ExpoPage1() {
  const attractions = [
    { title: "Food", img: foodImg },
    { title: "Lifestyle", img: foodImg },
    { title: "Auto Accessories", img: foodImg },
    { title: "Shows", img: foodImg },
  ];

  return (
    <>
      {/* Event Attractions */}
      <motion.div
        className="bg-gray-100 py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <motion.div
          className="max-w-4xl mx-auto text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl font-bold">Event Attractions</h2>
        </motion.div>

        <motion.div
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {attractions.map(({ title, img }, i) => (
            <motion.div
              key={title}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col items-center"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              whileHover={{ scale: 1.05, boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}
            >
              <motion.div
                className="aspect-w-1 aspect-h-1 w-full"
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={img}
                  alt={title}
                  className="object-cover w-full h-full"
                />
              </motion.div>
              <div className="py-4">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Stall & Brand Zone */}
      <motion.div
        className="bg-white py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <motion.div
          className="max-w-4xl mx-auto text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl font-bold">Stall & Brand Zone</h2>
        </motion.div>

        <motion.div
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {attractions.map(({ title, img }, i) => (
            <motion.div
              key={title}
              className="bg-gray-100 rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col items-center"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              whileHover={{ scale: 1.05, boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}
            >
              <motion.div
                className="aspect-w-1 aspect-h-1 w-full"
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={img}
                  alt={title}
                  className="object-cover w-full h-full"
                />
              </motion.div>
              <div className="py-4">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Gallery Section */}
      <motion.section
        className="bg-gray-900 py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <motion.div
          className="max-w-4xl mx-auto text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Gallery Preview
          </h2>
        </motion.div>

        <motion.div
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[img1, img2].map((src, idx) => (
            <motion.div
              key={idx}
              className="w-full rounded-xl overflow-hidden"
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
            >
              <img
                src={src}
                alt={`Gallery ${idx + 1}`}
                className="w-full h-72 md:h-96 object-cover rounded-xl shadow-lg"
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ExpoPage2 Section with fade-in effect */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <ExpoPage2 />
      </motion.div>
    </>
  );
}
