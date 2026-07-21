import React from "react";
import { Carousel } from ".";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const ActivitySection = ({ activity, isCardOnLeft }) => {
  const animationProps = {
    whileHover: { scale: 1.03 },
    transition: { type: "spring", stiffness: 300, damping: 20 },
  };

  const carouselSection = (
    <motion.div
      {...animationProps}
      className="bg-gray-100 rounded-xl flex items-center justify-center m-4"
      style={{ backgroundColor: `var(--sm-bg, ${activity.color})` }}
    >
      <div className="relative w-full overflow-hidden ml-0 sm:ml-4 h-full bg-white md:bg-transparent md:h-[70%]">
        <Carousel data={activity.events} />
      </div>
    </motion.div>
  );

  const textSection = (
    <Link
      to={`/activity/${activity.categoryId}`}
      className="cursor-pointer group"
    >
      <motion.div
        {...animationProps}
        className={`m-4 bg-white p-6 sm:p-8 rounded-lg border h-[250px] ${
          !isCardOnLeft ? "text-right" : ""
        }`}
      >
        <motion.h3
          {...animationProps}
          className="relative inline-block text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 text-gray-800"
        >
          {activity.categoryTitle}
          <span className="absolute left-0 -bottom-1 h-0.5 bg-gray-800 w-0 group-hover:w-full transition-all duration-300" />
        </motion.h3>
        <p className="text-gray-600 whitespace-pre-line leading-relaxed text-sm lg:text-base pl-2">
          {activity.categoryDescription}
        </p>
      </motion.div>
    </Link>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-stretch overflow-hidden">
      {isCardOnLeft ? (
        <>
          {carouselSection}
          {textSection}
        </>
      ) : (
        <>
          {textSection}
          {carouselSection}
        </>
      )}
    </div>
  );
};
