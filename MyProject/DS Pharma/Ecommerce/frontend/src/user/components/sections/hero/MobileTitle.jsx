import { motion as Motion } from 'framer-motion';

export const MobileTitle = () => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative z-30 px-4 sm:hidden mt-8 mb-4 text-center"
      style={{marginTop: '80px'}}
    >
      <h1
        className="font-bold text-[#2D3748] leading-[1.2] tracking-[0.02em] m-0 px-4 drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]"
        style={{
          fontFamily: 'Gyrotrope',
          fontSize: 'clamp(32px, 10vw, 48px)',

        }}
      >
        DS Pharma
      </h1>
      <p
        className="text-sm font-medium text-[#4A5568] mt-2 tracking-[0.01em]"
        style={{
          fontFamily: 'Gyrotrope',
        }}
      >
        Best Price For Quality Medicine
      </p>
    </Motion.div>
  );
};
