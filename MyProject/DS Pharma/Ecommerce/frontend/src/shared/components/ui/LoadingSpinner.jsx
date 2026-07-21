import { motion as Motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        {/* Animated DS Pharma Logo */}
        <Motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
            DS Pharma
          </h1>
        </Motion.div>

        {/* Loading Spinner */}
        <Motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full mx-auto mb-4"
        ></Motion.div>

        {/* Loading Text */}
        <Motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 text-lg"
        >
          Loading your healthcare solutions...
        </Motion.p>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-1 mt-4">
          {[0, 1, 2].map((index) => (
            <Motion.div
              key={index}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2
              }}
              className="w-2 h-2 bg-teal-500 rounded-full"
            ></Motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
