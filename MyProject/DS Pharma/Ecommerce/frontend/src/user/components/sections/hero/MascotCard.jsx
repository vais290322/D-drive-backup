import { motion as Motion } from 'framer-motion';

import mascotImg from "@/assets/images/medicine-character.png";

export const MascotCard = () => {
  return (
    <Motion.div
      initial={{ opacity: 0, x: -30, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
      className="hidden md:block absolute bottom-0 left-2  z-30 md:w-60 lg:w-[420px] gap-1"
      style={{padding: '20px'}}
    >
    <div className="flex flex-col items-center justify-center md:gap-14 lg:gap-19">
      {/* Mascot Image */}
      <div className="mb-5 flex justify-center items-center"
      style={{
        
      }}>
        <img
          src={mascotImg}
          alt="DS Pharma Mascots"
          className="w-full h-auto block object-contain max-h-[200px] max-w-[250px] absolute mb-[100px] md:max-h-[200px] md:max-w-[120px] md:mb-2.5 lg:max-h-[150px] lg:max-w-[250px] lg:mb-2.5"
        />
      </div>

      {/* Text Content */}
      <div className="text-center bg-white rounded-[20px] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.15)] max-w-[340px] lg:max-w-[400px]"
      style={{
        padding: '10px 20px',
      }}>
        <p
          className="text-base font-medium text-[#2D3748] leading-normal m-0 tracking-[0.01em] md:text-[8px] sm:text-xs lg:text-base"
          style={{
            fontFamily: 'Gyrotrope',
          }}
        >
          <span className="text-[#4FD1C7] font-bold text-[17px] md:text-[13px] lg:text-[17px]">DS Pharma</span>
          <span className="text-[#2D3748]"> provides the best</span>
          <br />
          <span className="text-[#2D3748]">Price For best </span>
          <span className="text-[#4FD1C7] font-bold text-[17px] md:text-[13px] lg:text-[17px]">Quality Medicine</span>
        </p>
      </div>
      </div>
    </Motion.div>
  );
};
