import { motion } from "framer-motion";
import {
  PortfolioImg1,
  PortfolioImg2,
  PortfolioImg3,
  PortfolioImg4,
  PortfolioImg5,
  PortfolioImg6,
} from "../assets";
import { Section } from "../components";
import Image1 from "../assets/Home_images/about page/mirchi.jpg";
import Image2 from "../assets/Home_images/about page/logo.png";
import Image3 from "../assets/Home_images/about page/logo 1.png";
import Image4 from "../assets/Home_images/about page/saibaba.png";
import Image5 from "../assets/Home_images/about page/tata.jpg";
import Image6 from "../assets/Home_images/about page/vortex.avif";
import Image7 from "../assets/INK_Logo.png"
import Image8 from "../assets/Home_images/about page/redfm.png"
import Image9 from "../assets/Home_images/about page/air.png"

import Marquee from "react-fast-marquee";

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};
const images = [Image1, Image2, Image3, Image4, Image5, Image6, Image7, Image8, Image9];
function Portfolio() {
  return (
    <Section
      id="portfolio"
      // className="mx-auto mt-[150px] px-4 md:px-10 lg:px-32 max-w-7xl"
    >
      <div className="flex flex-wrap items-center gap-3 px-4 md:px-10">
        <h1 className="h-[1px] w-24 bg-[#f73801] font-extralight"></h1>
        <h2 className="text-xl font-semibold text-gray-500">Our Portfolio</h2>
      </div>
      <h1 className="text-[28px] md:text-4xl xl:text-[50px] font-extralight mt-5 px-4 md:px-10 text-[#393939]">
        Inspiring <span className="text-[#393939] font-medium">Ideas</span>{" "}
        <span className="text-[#f73801] font-medium">Unleashed</span>
      </h1>

      <div className="grid grid-cols-6 gap-2 p-4 grid-rows-7 md:p-10">
        <motion.div
          className="col-span-2 col-start-1 row-span-3 row-start-2"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        >
          <img
            src={PortfolioImg1}
            alt="Portfolio 1"
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
        </motion.div>

        <motion.div
          className="col-span-2 col-start-1 row-span-3 row-start-5"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        >
          <img
            src={PortfolioImg3}
            alt="Portfolio 3"
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
        </motion.div>

        <motion.div
          className="flex col-span-2 col-start-3 row-span-5 row-start-1"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        >
          <img
            src={PortfolioImg5}
            alt="Portfolio 5"
            className="w-full h-[90%] rounded-lg shadow-lg object-cover self-end"
          />
        </motion.div>

        <motion.div
          className="col-span-2 col-start-3 row-span-3 row-start-6"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        >
          <img
            src={PortfolioImg6}
            alt="Portfolio 6"
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
        </motion.div>

        <motion.div
          className="col-span-2 col-start-5 row-span-3 row-start-2"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        >
          <img
            src={PortfolioImg2}
            alt="Portfolio 2"
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
        </motion.div>

        <motion.div
          className="col-span-2 col-start-5 row-span-3 row-start-5"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        >
          <img
            src={PortfolioImg4}
            alt="Portfolio 4"
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
        </motion.div>
      </div>

      <motion.div className="flex items-center justify-center">
        <motion.button
          className="mt-8 px-6 py-3 border border-[#393939] rounded-full text-[#393939] hover:bg-black hover:text-white transition font-medium"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          View More Works
        </motion.button>
      </motion.div>
      <Marquee className="flex items-center justify-start w-full h-32 px-2 mt-10 overflow-hidden bg-white">
        {images.map((item, idx) => (
          <div key={idx} className="flex items-center justify-center h-32 mr-10">
              <img
                src={item}
                alt={`logo-${idx}`}
                className="object-contain h-16 transition-all duration-300 w-28 sm:h-20 sm:w-36 xs:h-14 xs:w-24 hover:scale-105"
              />
          </div>
        ))}
      </Marquee>
    </Section>
  );
}

export default Portfolio;
