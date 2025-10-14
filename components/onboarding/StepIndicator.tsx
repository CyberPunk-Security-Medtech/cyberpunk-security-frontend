import React from "react";

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    "Hospital\nInformation",
    "Admin\nAccount",
    "Compliance &\nAuthorization",
  ];

  return (
    <div className="relative w-full max-w-[672px] mx-auto">
      {/* Circle container */}
      <div className="relative flex items-center justify-between">
        {/* Connector line */}
        <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 h-[2px] bg-gray-300 z-0" />

        {/* Circles */}
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center z-10">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white ${
                currentStep > index ? "border-[#1A2380]" : "border-gray-300"
              }`}
            >
              {currentStep > index && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#1A2380]" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Step labels */}
      <div className="flex justify-between mt-2 text-center">
        {steps.map((step, index) => (
          <p key={index} className="text-xs text-gray-600 whitespace-pre-line">
            {step}
          </p>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
