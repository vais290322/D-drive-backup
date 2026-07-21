import { motion as Motion } from 'framer-motion';

export const BackgroundText = () => {
  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="hidden sm:block absolute top-[20%] lg:top-[42%] md:left-[50%]  -translate-x-1/2 -translate-y-1/2 z-1 pointer-events-none text-center"
    >
      <h1
        aria-hidden="true"
        className="font-bold leading-[100%] tracking-[0%] text-center text-white whitespace-nowrap select-none antialiased m-0 p-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-[170px] md:text-[100px] lg:text-[160px]"
        style={{
          fontFamily: 'Gyrotrope',
        }}
      >
        DS Pharma
      </h1>
    </Motion.div>
  );
};
