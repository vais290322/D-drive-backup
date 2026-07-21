import { motion } from "framer-motion";

export function HeroSection({ img, heading, description, buttons }) {
  return (
    <section className="w-full py-2 md:py-6 px-4 sm:px-10 md:px-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-[70vh] rounded-3xl overflow-hidden mx-auto"
      >
        {/* animated background image */}
        <motion.img
          src={img}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 20,
            ease: "easeOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        {/* text & buttons */}
        <div className="absolute inset-0 flex flex-col items-center md:items-start justify-end p-6 sm:p-10 md:p-16 text-white text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-4"
          >
            {heading}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-base sm:text-lg md:text-xl mb-6 max-w-full md:max-w-3xl"
          >
            {description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mt-4 text-lg sm:text-xl md:text-2xl font-bold"
          >
            {buttons}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
