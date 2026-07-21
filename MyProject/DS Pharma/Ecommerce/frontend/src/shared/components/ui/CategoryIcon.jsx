import { motion as Motion } from 'framer-motion';

const CategoryIcon = ({ type = 'diabetes', className = '', animate = true }) => {
  const iconVariants = {
    idle: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: [0, -5, 5, 0] }
  };

  const renderIcon = () => {
    switch (type) {
      case 'diabetes':
        return (
          <svg
            className={`w-full h-full ${className}`}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Blood drop shape for diabetes */}
            <Motion.path
              d="M32 8C32 8 20 20 20 32C20 38.627 25.373 44 32 44C38.627 44 44 38.627 44 32C44 20 32 8 32 8Z"
              fill="currentColor"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            {/* Glucose molecule representation */}
            <Motion.circle
              cx="32"
              cy="30"
              r="3"
              fill="white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
            <Motion.circle
              cx="28"
              cy="26"
              r="2"
              fill="white"
              opacity="0.8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            />
            <Motion.circle
              cx="36"
              cy="26"
              r="2"
              fill="white"
              opacity="0.8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            />
            {/* Medical cross */}
            <Motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <rect x="30" y="50" width="4" height="8" fill="currentColor" rx="2" />
              <rect x="28" y="52" width="8" height="4" fill="currentColor" rx="2" />
            </Motion.g>
          </svg>
        );

      case 'heart':
        return (
          <svg
            className={`w-full h-full ${className}`}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Motion.path
              d="M32 54C32 54 8 36 8 22C8 16 12 10 20 10C24 10 28 12 32 16C36 12 40 10 44 10C52 10 56 16 56 22C56 36 32 54 32 54Z"
              fill="currentColor"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>
        );

      case 'brain':
        return (
          <svg
            className={`w-full h-full ${className}`}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Motion.path
              d="M32 8C24 8 18 14 18 22C16 22 14 24 14 26C14 28 16 30 18 30C18 38 24 44 32 44C40 44 46 38 46 30C48 30 50 28 50 26C50 24 48 22 46 22C46 14 40 8 32 8Z"
              fill="currentColor"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>
        );

      default:
        return (
          <Motion.div
            className="w-full h-full rounded-full bg-current flex items-center justify-center text-white text-2xl font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            💊
          </Motion.div>
        );
    }
  };

  return (
    <Motion.div
      className="w-full h-full"
      variants={animate ? iconVariants : {}}
      initial="idle"
      whileHover="hover"
    >
      {renderIcon()}
    </Motion.div>
  );
};

export default CategoryIcon;
