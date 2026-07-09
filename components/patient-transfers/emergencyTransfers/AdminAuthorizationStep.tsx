"use client";

import { Check } from "lucide-react";
import { useState } from "react";

export default function AdminAuthorizationStep({
  onPrevious,
  onContinue,
}: {
  onPrevious: () => void;
  onContinue: () => void;
}) {
  const [authorized, setAuthorized] = useState(false);
  const [policy, setPolicy] = useState(false);

  const canContinue = authorized && policy;

  return (
    <div className="mx-auto mt-16 max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-black">Patient Transfer Setup</h1>
        <p className="mt-3 text-gray-500">Admin Authorization</p>
      </div>

      <div className="mx-auto max-w-xl rounded-xl border border-[#00B8A8] bg-[#F0FFFF] px-8 py-5 text-center text-[#00B8A8]">
        “By continuing, you confirm that you are authorized to transfer this Patient in Privacure
        and agree to our Privacy Policy and NDPR, HIPAA, GDPR terms.”
      </div>

      <div className="mx-auto mt-6 max-w-xl space-y-4">
        <AuthorizationBox
          checked={authorized}
          label="I confirm that I am authorized to transfer this Patient."
          onClick={() => setAuthorized(!authorized)}
        />

        <AuthorizationBox
          checked={policy}
          label="I agree to the Privacy Policy and NDPR, HIPAA, GDPR compliance terms."
          onClick={() => setPolicy(!policy)}
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={onPrevious} className="text-[#00B8A8]">
          ↢ Previous Page
        </button>

        <button
          onClick={onContinue}
          disabled={!canContinue}
          className={`rounded-full px-10 py-3 text-white ${
            canContinue
              ? "bg-[#211783] hover:bg-[#18105f]"
              : "cursor-not-allowed bg-[#9690C7]"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function AuthorizationBox({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-lg border border-gray-200 px-6 py-6 text-left"
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded border ${
          checked ? "border-[#211783] bg-[#211783] text-white" : "border-gray-300"
        }`}
      >
        {checked && <Check size={14} />}
      </span>

      <span className="text-gray-700">{label}</span>
    </button>
  );
}