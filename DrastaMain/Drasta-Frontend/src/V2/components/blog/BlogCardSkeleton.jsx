import { motion } from "framer-motion";

export const BlogCardSkeleton = ({ variant = "grid" }) => {
  const base = "bg-gray-300 rounded-lg animate-pulse";

  return (
    <motion.div
      initial={{ opacity: 0.5, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
      className={
        variant === "sidebar"
          ? "flex items-center space-x-4 py-3 border-l-4 border-gray-200 bg-[#F5F8FD] pl-5"
          : "bg-white border border-gray-200 rounded-lg p-4 shadow-sm w-full max-w-full sm:max-w-xl"
      }
    >
      {variant === "sidebar" ? (
        <>
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/3"></div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start w-full">
          <div className="w-full sm:w-20 h-40 sm:h-20 bg-gray-300 rounded"></div>
          <div className="flex-1 min-w-0 space-y-3">
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-4/5"></div>
              <div className="h-4 bg-gray-300 rounded w-3/5"></div>
            </div>
            <div className="h-3 bg-gray-300 rounded w-24"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gray-300 rounded w-11/12"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
