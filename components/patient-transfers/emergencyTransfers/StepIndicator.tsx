"use client";

import { EmergencyStep } from "./EmergencyTransferTypes";

const steps = [
  {
    id: "patient",
    label: "Patient\nBio-data",
  },
  {
    id: "consent",
    label: "Consent/Verification\nProcess",
  },
  {
    id: "admin",
    label: "Admin Access &\nAuthorization",
  },
];

function getActiveIndex(step: EmergencyStep) {
  if (step === "bioDataOne" || step === "bioDataTwo") return 0;

  if (
    step === "consentVerification" ||
    step === "consentPending" ||
    step === "consentSuccess" ||
    step === "consentDeclined"
  ) {
    return 1;
  }

  return 2;
}

export default function StepIndicator({ currentStep }: { currentStep: EmergencyStep }) {
  const activeIndex = getActiveIndex(currentStep);

  return (
    <div className="mx-auto mt-10 w-full max-w-3xl">
      <div className="relative flex items-start justify-between">
        <div className="absolute left-[8%] right-[8%] top-[11px] h-px bg-gray-200" />

        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          const isDone = index < activeIndex;

          return (
            <div key={step.id} className="relative z-10 flex w-40 flex-col items-center">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white ${
                  isActive || isDone
                    ? "border-[#211783]"
                    : "border-gray-200"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isActive || isDone ? "bg-[#211783]" : "bg-gray-200"
                  }`}
                />
              </div>

              <p
                className={`mt-4 whitespace-pre-line text-center text-sm leading-relaxed ${
                  isActive ? "text-[#211783]" : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}