import React from 'react';
import { Loader2 } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="relative h-24 w-24 mb-6">
          {/* Outer ring */}
          <motion.div 
            className="absolute inset-0 rounded-full border-4 border-emerald-100"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Spinning loader */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" strokeWidth={1.5} />
          </div>
          
          {/* Logo or Brand mark could go here */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
             <span className="text-xs font-bold font-gyrotrope">DS</span>
          </div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-semibold text-gray-800 font-gyrotrope tracking-wider"
        >
          DS PHARMA
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-500 mt-2 font-medium"
        >
          Loading your medicine...
        </motion.p>

        {/* Minimal progress bar */}
        <div className="w-48 h-1 bg-gray-100 rounded-full mt-8 overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default PageLoader;
