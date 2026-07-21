import { motion } from "framer-motion";
import { TestimonialImg } from "../assets";
const Testimonial = () => {
  return (
    <div
      className="mx-4 md:mx-10 lg:mx-[56px] mt-20 h-auto md:h-[522px] rounded-xl bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url(${TestimonialImg})` }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-[60%] lg:w-[50%] p-6 md:p-10 bg-opacity-80"
      >
        <div className="flex flex-col md:pl-10">
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-16 md:w-24 bg-[#f73801]"></div>
            <p className="text-xs md:text-sm text-white uppercase tracking-wide">
              Testimonials
            </p>
          </div>
          <h2 className="text-2xl md:text-4xl font-semibold text-white mt-6 md:mt-10">
            <span className="font-extralight">See what</span>{" "}
            <span className="font-semibold">Our Clients</span>
            <span className="font-extralight"> are</span>{" "}
            <span className="font-semibold">Saying</span>
          </h2>
          <p className="text-sm md:text-lg text-white mt-6 md:mt-10 leading-relaxed">
            <span className="text-[#f73801] font-bold">"</span> Vais Productions
            transformed our vision into reality with their exceptional
            creativity and professionalism.{" "}
            <span className="text-[#f73801] font-bold">"</span>
          </p>
          <div className="mt-6 md:mt-10 flex flex-col sm:flex-row justify-between">
            <div className="mb-4 sm:mb-0">
              <p className="font-semibold text-white text-sm md:text-base">
                Christin Andrew Smith
              </p>
              <p className="text-gray-400 text-xs md:text-sm">
                Investor at ABC
              </p>
            </div>
            <div>
              <p className="text-yellow-500 font-semibold text-base md:text-lg">
                4.5 ★{" "}
              </p>
              <p className="text-white text-xs md:text-sm font-semibold">
                Ratings
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Testimonial;
