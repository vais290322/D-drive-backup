import React, { useEffect } from "react";
import Joyride, { STATUS } from "react-joyride";
import { useTheme } from "@/context/ThemeContext";
import { FaLightbulb, FaArrowRight, FaArrowLeft, FaTimes } from "react-icons/fa";

const TourGuide = ({ 
  steps, 
  run, 
  stepIndex, 
  onCallback,
  continuous = true,
  showSkipButton = true,
  showProgress = true
}) => {
  const { theme } = useTheme();

  // Custom tooltip component for more attractive UI
  const Tooltip = ({
    continuous,
    index,
    step,
    backProps,
    closeProps,
    primaryProps,
    skipProps,
    isLastStep,
    size,
  }) => (
    <div
      className={`p-4 rounded-lg shadow-xl border-2 max-w-md ${
        theme === "light"
          ? "bg-gray-800 text-white border-purple-600"
          : "bg-white text-gray-900 border-purple-600"
      }`}
    >
      <div className="flex items-center mb-3">
        <div className="bg-purple-600 p-2 rounded-full mr-3">
          <FaLightbulb className="hover:text-white text-lg text-yellow-500 " />
        </div>
        <h2 className="text-lg font-bold">
          Step {index + 1} of {size}
        </h2>
        <button
          {...closeProps}
          className="ml-auto text-gray-400 hover:text-gray-300 focus:outline-none"
        >
          <FaTimes size={18} />
        </button>
      </div>
      
      <div className="mb-4 text-base leading-relaxed">{step.content}</div>
      
      <div className="flex justify-between items-center">
        {!isLastStep && (
          <button
            {...skipProps}
            className={`px-3 py-1 rounded-md ${
              theme === "light"
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Skip
          </button>
        )}
        
        <div className="flex space-x-2">
          {index > 0 && (
            <button
              {...backProps}
              className={`flex items-center px-4 py-2 rounded-md ${
                theme === "light"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
          )}
          
          <button
            {...primaryProps}
            className="flex items-center px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isLastStep ? "Finish" : "Next"} {!isLastStep && <FaArrowRight className="ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Joyride
      callback={onCallback}
      continuous={continuous}
      hideCloseButton={true}
      run={run}
      scrollToFirstStep={true}
      showProgress={false} // We're showing our own progress
      showSkipButton={false} // We're handling this in our custom tooltip
      stepIndex={stepIndex}
      steps={steps}
      disableOverlayClose={false}
      spotlightClicks={false}
      tooltipComponent={Tooltip}
      styles={{
        options: {
          arrowColor: theme === "light" ? "#1f2937" : "#fff",
          overlayColor: "rgba(0, 0, 0, 0.75)",
          zIndex: 1000,
          spotlightShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
        },
        spotlight: {
          backgroundColor: "transparent",
        },
        overlay: {
          mixBlendMode: "hard-light",
        },
      }}
    />
  );
};

export default TourGuide;