"use client";

import { CheckCircle } from "lucide-react";
import { PatientBioData } from "./EmergencyTransferTypes";

export default function ConsentVerificationStep({
  form,
  emergencyOverride,
  setEmergencyOverride,
  error,
  onPrevious,
  onNext,
}: {
  form: PatientBioData;
  emergencyOverride: boolean;
  setEmergencyOverride: (value: boolean) => void;
  error: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mx-auto mt-16 max-w-2xl">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold text-black">Consent Verification Process</h1>
        <p className="mt-3 text-gray-500">SMS Consent Verification</p>
      </div>

      <div className="mx-auto max-w-xl">
        <label className="block">
          <span className="mb-2 block text-sm text-gray-700">Enter Phone Number</span>
          <input
            value={form.phoneNumber}
            readOnly
            placeholder="Enter Phone Number"
            className={`w-full rounded-lg border px-4 py-3 outline-none ${
              error
                ? "border-red-500 bg-red-200 placeholder:text-red-200"
                : "border-gray-300 bg-white"
            }`}
          />
        </label>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setEmergencyOverride(!emergencyOverride)}
            className={`flex items-center gap-3 rounded-lg border-2 px-6 py-4 ${
              emergencyOverride
                ? "border-red-500 bg-red-100 text-red-700"
                : "border-red-500 bg-red-100 text-gray-700"
            }`}
          >
            {emergencyOverride ? (
              <CheckCircle size={18} className="text-red-600" />
            ) : (
              <span className="h-4 w-4 rounded-full border border-red-500" />
            )}
            Emergency Over-Ride
          </button>
        </div>

        <div className="mt-8 rounded-xl border border-[#00B8A8] bg-[#F0FFFF] px-8 py-4 text-center text-[#00B8A8]">
          “By continuing, an sms consent verification will be sent to the associated number above.
          click yes to authorize permission for transfer.”
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between">
        <button onClick={onPrevious} className="text-[#00B8A8]">
          ↢ Previous Page
        </button>

        <button
          onClick={onNext}
          className="rounded-full bg-[#211783] px-10 py-3 text-white hover:bg-[#18105f]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}