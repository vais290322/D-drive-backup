import React from "react";
const StepIndicatorForAdmission = ({ steps, currentStep }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 relative">
        {/* Dynamic Horizontal Line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-300 z-0"></div>
        <div
          className="absolute top-4 left-0 h-0.5 bg-green-500 z-10 transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          // Determine alignment based on array length and index
          const alignmentClass =
            steps.length === 2
              ? index === 0
                ? "items-start"
                : "items-end"
              : index === 0
              ? "items-start"
              : index === steps.length - 1
              ? "items-end"
              : "items-center";

          return (
            <div
              key={index}
              className={`relative z-20 flex flex-col ${alignmentClass}`}
            >
              {/* Step Circle */}
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold ${
                  index <= currentStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              <div>
                <p
                  className={`text-xs sm:text-sm ${
                    index <= currentStep ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  {step}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicatorForAdmission;
