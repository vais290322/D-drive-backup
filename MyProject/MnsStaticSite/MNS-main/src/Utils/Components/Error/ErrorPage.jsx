import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: animate ? 1 : 0, y: animate ? 0 : -50 }}
        transition={{ duration: 0.8 }}
        className="text-6xl font-bold"
      >
        404
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: animate ? 1 : 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-xl mt-4"
      >
        Oops! The page you are looking for does not exist.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: animate ? 1 : 0, scale: animate ? 1 : 0.8 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-6"
      >
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg shadow-md hover:bg-blue-700 transition"
        >
          Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default ErrorPage;