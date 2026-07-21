import React, { useState, useEffect } from "react";
import VaisLogo from "../assets/Expo/vais production(1) 1.png";
import carbg from "../assets/Expo/Rectangle 1.png";
import { motion } from "framer-motion";
import VaisMain from "../assets/Expo/logo 1.png";
import { FaCalendar } from "react-icons/fa";
import { MdAccessTimeFilled, MdLocationOn } from "react-icons/md";
import { FaCar, FaUtensils, FaTrophy } from "react-icons/fa";
import { GiDress } from "react-icons/gi";
import ExpoPage1 from "./ExpoPage1";

function ExpoPage() {
  const features = [
    { icon: <FaCar />, label: "Indian Car Showcase" },
    { icon: <GiDress />, label: "Fashion Show" },
    { icon: <FaUtensils />, label: "Food Stalls & Shopping" },
    { icon: <FaTrophy />, label: "Awards & Lucky Draws" },
  ];

  const targetDate = new Date("2025-07-19T10:00:00");

  function pad(num) {
    return num.toString().padStart(2, "0");
  }

  function getTimeLeft() {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) return { days: "00", minutes: "00", seconds: "00" };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return {
      days: pad(days),
      minutes: pad(minutes),
      seconds: pad(seconds),
    };
  }
  const [time, setTime] = useState(getTimeLeft());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Animation variants
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

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  return (
    <>
      {/* Hero Section */}
      <motion.section
        className="relative w-full min-h-screen bg-gray-100"
        id="expo"
        style={{
          backgroundImage: `url(${carbg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {/* Header Logos */}
        <motion.div
          className="flex flex-col lg:flex-row justify-between items-center px-6 lg:px-[258px] pt-10"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xl font-poppins text-[24px]">Organized By</p>
              <img
                src={VaisLogo}
                alt="Vais Productions"
                className="h-[32px] w-[127.33px]"
              />
            </motion.div>
            <motion.div
              className="flex items-center gap-2 lg:ml-[112px]"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <p className="text-xl font-poppins text-[24px]">Co-Partner</p>
              <img
                src={VaisMain}
                alt="Co-Partner Logo"
                className="h-[32px] w-[51.37px]"
              />
            </motion.div>
          </div>
          {/* Countdown Timer */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <span
              className="text-[#E9700C] font-marker text-4xl mb-1 relative top-5"
              style={{ fontFamily: "Permanent Marker, cursive" }}
            >
              Time Left
            </span>
            <motion.div
              className="flex bg-white rounded-lg shadow px-4 py-2 gap-4 h-[100px]"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-black pt-4">
                  {time.days}
                </span>
                <span className="text-xs text-gray-700 font-semibold">
                  Days
                </span>
              </div>
              <div className="flex items-center">
                <span className="h-8 border-r border-gray-300 mx-2"></span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-black pt-4">
                  {time.minutes}
                </span>
                <span className="text-xs text-gray-700 font-semibold">
                  Minutes
                </span>
              </div>
              <div className="flex items-center">
                <span className="h-8 border-r border-gray-300 mx-2"></span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-black pt-4">
                  {time.seconds}
                </span>
                <span className="text-xs text-gray-700 font-semibold">
                  Seconds
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6 text-center lg:text-left"
            >
              <motion.h1
                className="text-4xl md:text-6xl font-bold font-sans md:text-black text-orange-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                RoadBeast{" "}
                <span className="md:text-orange-500 text-gray-50">2025</span>
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl md:text-gray-600 text-white"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                -Kolkata's Ultimate Car{" "}
                <span className="text-orange-500">&</span> Bike Expo
              </motion.p>

              {/* Event Details */}
              <motion.div
                className="space-y-4 text-lg pt-8 lg:pt-32 text-orange-600 md:text-black"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <div className="flex justify-center lg:justify-start items-center gap-2 text-[20px]">
                  <FaCalendar />{" "}
                  <span className="font-semibold">19 & 20 July 2025</span>
                </div>
                <div className="flex justify-center lg:justify-start items-center gap-2 text-[20px]">
                  <MdAccessTimeFilled />{" "}
                  <span className="font-semibold">10 AM - 8 PM</span>
                </div>
                <div className="flex justify-center lg:justify-start items-center gap-2 text-[20px]">
                  <MdLocationOn />{" "}
                  <span className="font-semibold">Patuli Playground</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* About the Expo */}
      <motion.section
        className="bg-gradient-to-b from-white to-gray-100 py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <motion.div
          className="max-w-7xl mx-auto text-center px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            About the <span className="text-orange-500">EXPO</span>
          </h2>
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Experience the thrill of innovation, speed, and lifestyle at
            Kolkata’s longest car expo. <br />
            From local legends to future concepts—explore it all.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-14 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map(({ icon, label }, i) => (
            <motion.div
              key={label}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center text-center space-y-4"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <motion.div
                className="text-5xl text-orange-500"
                whileHover={{ scale: 1.2, rotate: 8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {icon}
              </motion.div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                {label}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ExpoPage1 Section with fade-in effect */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <ExpoPage1 />
      </motion.div>
    </>
  );
}

export default ExpoPage;
