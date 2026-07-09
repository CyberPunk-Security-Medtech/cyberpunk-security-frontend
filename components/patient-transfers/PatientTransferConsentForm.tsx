"use client";

import { Bell, Shield } from "lucide-react";
import { useState } from "react";
import TransferDetails from "./TransferDetails";
import ContactProviderInfo from "./ContactProviderInfo";
import IdentityVerification from "./IdentityVerification";
import ConsentDeclaration from "./ConsentDeclaration";


// type Props = {
   // onSubmitConsent: () => void;
// };

export default function PatientTransferConsentForm({ onSubmitConsent }: { onSubmitConsent: () => void }) {
  const [patientName, setPatientName] = useState("");
  const [isGuardian, setIsGuardian] = useState(false);

  const [voiceVerified, setVoiceVerified] = useState(false);
  const [fingerprintVerified, setFingerprintVerified] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);

  const [consent, setConsent] = useState<"yes" | "no" | "">("");

  const allVerified = voiceVerified && fingerprintVerified && faceVerified;
  const canSubmit = patientName.trim() !== "" && allVerified && consent === "yes";

  return (
    <>
      {/* <header className="flex h-[72px] items-center justify-between border-b border-gray-200 bg-white px-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-100" />
          <h1 className="text-lg font-semibold text-gray-700">
            Sisyphus Medical Center
          </h1>
        </div>

        <div className="relative">
          <Bell className="h-6 w-6 text-gray-500" />
          <span className="absolute -right-3 -top-3 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
            99+
          </span>
        </div>
      </header> */}

      <section className="px-8 py-8">
        <div className="mb-10 flex flex-col items-center text-center">
          <Shield className="mb-4 h-20 w-20 text-[#11bdb2]" />
          <h2 className="text-4xl font-bold text-[#201985]">
            Patient Transfer Consent
          </h2>
          <p className="mt-2 text-base text-gray-500">
            Secure verification required for inter-hospital transfer
          </p>
        </div>

        <TransferDetails />

        <ContactProviderInfo
          patientName={patientName}
          setPatientName={setPatientName}
          isGuardian={isGuardian}
          setIsGuardian={setIsGuardian}
        />

        <section className="rounded-xl bg-white px-8 py-9 shadow-sm">
          <IdentityVerification
            voiceVerified={voiceVerified}
            fingerprintVerified={fingerprintVerified}
            faceVerified={faceVerified}
            onVoiceVerify={() => setVoiceVerified(true)}
            onFingerprintVerify={() => setFingerprintVerified(true)}
            onFaceVerify={() => setFaceVerified(true)}
          />

          <ConsentDeclaration
            consent={consent}
            setConsent={setConsent}
            allVerified={allVerified}
          />

          <div className="mt-10 flex flex-col items-center gap-5">
            <button
              disabled={!canSubmit}
              onClick={onSubmitConsent}
              className={`rounded-md px-8 py-4 text-base font-bold text-white transition ${
                canSubmit
                  ? "bg-[#201985] hover:bg-[#17116d]"
                  : "cursor-not-allowed bg-[#201985]/50"
              }`}
            >
              Submit Consent
            </button>

            <p className="text-sm font-semibold text-gray-500">
              All data is encrypted
            </p>
          </div>
        </section>
      </section>
    </>
  );
}