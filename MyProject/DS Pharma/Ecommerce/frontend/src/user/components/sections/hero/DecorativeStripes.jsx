import { motion as Motion } from 'framer-motion';

export const DecorativeStripes = () => {
  return (
    <Motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.9 }}
      className="hidden sm:flex absolute bottom-0 right-0 z-5 gap-3 items-end pr-0 pb-0"
    >
      {/* First Stripe - Tall Vertical */}
      <div
        className="w-[90%] h-[18px] -skew-x-25 shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-t-[2px]"
      />
      {/* Second Stripe - Medium */}
      <div
        className="w-[90%] h-[18px] -skew-x-25 shadow-[0_2px_8px_rgba(0,0,0,0.06)] rounded-t-[2px]"
      />
    </Motion.div>
  );
};
