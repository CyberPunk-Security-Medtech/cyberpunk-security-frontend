"use client";

import Image from "next/image";
import { EmergencyStep } from "./EmergencyTransferTypes";
import StepIndicator from "./StepIndicator";

export default function EmergencyTransferCard({
  currentStep,
  children,
}: {
  currentStep: EmergencyStep;
  children: React.ReactNode;
}) {
  const isStatusScreen =
    currentStep === "consentPending" ||
    currentStep === "consentSuccess" ||
    currentStep === "consentDeclined" ||
    currentStep === "transferSuccess";

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#F3FAFA] px-6 py-10">
      <div className="w-full max-w-5xl rounded-2xl bg-white px-12 py-8 shadow-2xl">
        <div className="flex flex-col items-center">
          <Image
            src="/sidebar_logo.svg"
            alt="PrivaCure"
            width={120}
            height={70}
            className="mb-4"
          />

          {!isStatusScreen && <StepIndicator currentStep={currentStep} />}
        </div>

        {children}
      </div>
    </div>
  );
}