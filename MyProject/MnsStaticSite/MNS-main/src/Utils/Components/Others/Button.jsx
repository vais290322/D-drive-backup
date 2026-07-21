import React from "react";
import { useNavigate } from "react-router-dom";

function Button({ title }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/contact")}
      className="bg-[#197BBD] text-white px-5 md:px-6 py-2 md:py-3 rounded-full text-[18px] md:text-base font-light hover:bg-blue-700"
    >
      {title}
    </button>
  );
}

export default Button;
