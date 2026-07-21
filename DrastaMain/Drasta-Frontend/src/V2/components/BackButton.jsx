import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function BackButton({ url = "", className = "" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (url) {
      navigate(url);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleBack}
      aria-label="Back"
      className={`text-center cursor-pointer hover:scale-[1.1] text-[#972626] bg-white border border-[#f1d3d3] rounded-full p-3 shadow-lg hover:bg-[#f9eaea] hover:scale-105 transition-transform duration-300
        ${className}`}
    >
      <ArrowLeft />
    </button>
  );
}
