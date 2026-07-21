import React from "react";
import { Button } from "@/components/ui/button";

const Audit = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative flex flex-col items-center bg-white px-8 py-8 rounded-3xl shadow-2xl border-4 border-transparent bg-clip-padding"
        style={{

          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
        }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-3xl font-bold transition focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-r from-purple-500 to-pink-400 rounded-full p-5 mb-6 shadow-lg animate-pulse">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
              <path fill="#fff" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500 text-center drop-shadow-lg">
            Upgrade to Pro
          </h2>
          <p className="mb-8 text-center text-gray-700 text-lg">
            The <span className="font-semibold text-purple-600">Audit</span> feature is available only for Pro users.<br />
            Please upgrade your plan to access this feature.
          </p>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-3 rounded-xl shadow-lg hover:from-purple-700 hover:to-pink-600 transition text-lg font-semibold"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Audit;