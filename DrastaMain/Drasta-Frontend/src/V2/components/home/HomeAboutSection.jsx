import React from "react";
import { motion } from "framer-motion";
import { Rectangle20, Rectangle21, Rectangle24 } from "@/V2/assets";
import "@/shine.css";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

export function HomeAboutSection() {
  return (
    <motion.section
      className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.h2
        className="text-3xl sm:text-4xl md:text-[40px] font-extrabold mb-10 shine-on-hover"
        variants={textVariants}
        whileHover={{ y: -2, transition: { duration: 0.3 } }}
      >
        About Us
      </motion.h2>

      <motion.div
        className="flex flex-col lg:flex-row gap-8 items-start"
        variants={textVariants}
      >
        {/* Text */}
        <motion.div
          className="lg:w-1/2 text-base sm:text-lg md:text-xl font-normal space-y-6"
          variants={textVariants}
        >
          <motion.p
            className="shine-on-hover leading-relaxed"
            variants={textVariants}
            whileHover={{ y: -2, transition: { duration: 0.3 } }}
          >
            C‑DRASTĀ (to be read as 'C‑DRASTA') was founded in 2015 by a group
            of individuals from different vocations but a common commitment to
            research and training for sustainable economic growth and inclusive
            development of society. These individuals came together to form the
            Board of Trustees of C‑DRASTA, & entrusted the President with the
            responsibility of carrying C‑DRASTĀ's work forward.
          </motion.p>

          <motion.p
            className="shine-on-hover leading-relaxed"
            variants={textVariants}
            whileHover={{ y: -2, transition: { duration: 0.3 } }}
          >
            'DRAŞTA', which means "observer" in Sanskrit, conveyed the Trustees'
            belief that the primary role of a researcher is to reason, report
            and disseminate based on unbiased observation.
          </motion.p>

          <motion.button
            className="shine-on-hover border border-black px-6 py-2 rounded"
            variants={textVariants}
            whileHover={{
              backgroundColor: "#ffffff",
              color: "#000000",
              transition: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            Know More →
          </motion.button>
        </motion.div>

        {/* Images */}
        <motion.div
          className="grid grid-cols-2 grid-rows-2 gap-6 lg:w-1/2 w-full"
          variants={textVariants}
        >
          {[Rectangle21, Rectangle20, Rectangle24].map((src, i) => (
            <motion.img
              key={i}
              src={src}
              alt={`Image ${i + 1}`}
              className={
                i === 0
                  ? "row-span-2 w-full h-64 sm:h-[320px] md:h-[420px] object-cover rounded-2xl"
                  : "w-full h-40 sm:h-[200px] object-cover rounded-2xl"
              }
              variants={textVariants}
              whileHover={{
                scale: 1.05,
                rotate: i % 2 === 0 ? 2 : -2,
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.98 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

export default HomeAboutSection;
