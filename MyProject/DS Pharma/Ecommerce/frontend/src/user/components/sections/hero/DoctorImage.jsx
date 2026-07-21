import { motion as Motion } from 'framer-motion';

import doctorImg from "@/assets/images/Mask group.png";

export const DoctorImage = () => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="relative z-20 h-[450px] md:h-[700px] lg:h-[600px] w-full max-w-7xl mx-auto flex justify-center items-end mt-auto"
      
    >
      <div className="relative w-full  h-[600px] md:h-[700px] lg:h-[600px] max-w-[300px] md:max-w-[450px] lg:max-w-[400px]">
        <img
          src={doctorImg}
          alt="Healthcare Professional"
          className="w-full h-full block object-contain"
        />
      </div>
    </Motion.div>
  );
};
