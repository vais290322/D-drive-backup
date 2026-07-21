
const MedicineCard = () => {
  return (
    <Motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/60 w-[280px]"
    >
      {/* Medicine Characters Illustration */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          {/* Using the actual medicine character image */}
          <Motion.img
            src="/src/assets/images/medicine-character.png"
            alt="Medicine Character"
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-32 h-auto"
          />

          {/* Sparkle effects around the character */}
          <Motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-2 h-2 rounded-full -top-2 -left-2 bg-cyan-400"
          ></Motion.div>
          <Motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8
            }}
            className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-teal-300 rounded-full"
          ></Motion.div>
          <Motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.9, 0.4]
            }}
            transition={{ 
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2
            }}
            className="absolute w-1 h-1 bg-blue-300 rounded-full -bottom-1 -left-3"
          ></Motion.div>
          <Motion.div
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.7, 0.2]
            }}
            transition={{ 
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.8
            }}
            className="absolute w-1 h-1 bg-purple-300 rounded-full top-4 -right-4"
          ></Motion.div>
        </div>
      </div>

      {/* Text Content */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-center"
      >
        <h3 className="mb-2 text-lg font-semibold leading-tight text-gray-900">
          <span className="text-[#4ECDC4] font-bold">DS Pharma</span> provides the best
        </h3>
        <p className="text-sm leading-relaxed text-gray-700">
          Price For best <span className="text-[#4ECDC4] font-semibold">Quality Medicine</span>
        </p>
      </Motion.div>
    </Motion.div>
  );
};

export default MedicineCard;
