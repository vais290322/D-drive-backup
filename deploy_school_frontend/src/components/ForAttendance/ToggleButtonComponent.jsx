import React from "react";

const ToggleButtonComponent = ({ isOn, onToggle }) => {
  return (
    <div
      className={`w-16 h-7 flex items-center rounded-full  cursor-pointer ${
        isOn ? "bg-green-500" : "bg-gray-300"
      }`}
      onClick={onToggle}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isOn ? "translate-x-10" : "translate-x-0"
        }`}
      ></div>
    </div>
  );
};

export default ToggleButtonComponent;
