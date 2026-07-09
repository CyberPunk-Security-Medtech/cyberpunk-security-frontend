"use client";

import AdminAuthorizationStep from "@components/patient-transfers/emergencyTransfers/AdminAuthorizationStep";
import ConsentPendingStep from "@components/patient-transfers/emergencyTransfers/ConsentPendingStep";
import ConsentResultStep from "@components/patient-transfers/emergencyTransfers/ConsentResult";
import ConsentVerificationStep from "@components/patient-transfers/emergencyTransfers/ConsentVerificationStep";
import EmergencyTransferCard from "@components/patient-transfers/emergencyTransfers/EmergencyTransferCard";
import { EmergencyStep, PatientBioData, ToastType } from "@components/patient-transfers/emergencyTransfers/EmergencyTransferTypes";
import PatientBioDataStep from "@components/patient-transfers/emergencyTransfers/PatientBioDataStep";
import PatientContactStep from "@components/patient-transfers/emergencyTransfers/PatientConsentStep";
import TransferSuccessStep from "@components/patient-transfers/emergencyTransfers/TransferSuccessStep";
import { useEffect, useState } from "react";


const initialForm: PatientBioData = {
  fullName: "",
  dob: "",
  maritalStatus: "",
  gender: "",
  address: "",
  stateOfOrigin: "",
  phoneNumber: "",
  email: "",
};

export default function EmergencyTransferPage() {
  const [step, setStep] = useState<EmergencyStep>("bioDataOne");
  const [form, setForm] = useState<PatientBioData>(initialForm);
  const [emergencyOverride, setEmergencyOverride] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [toast, setToast] = useState<ToastType>(null);

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  const handleConsentContinue = () => {
    if (!form.phoneNumber.trim()) {
      setPhoneError(true);
      return;
    }

    setPhoneError(false);
    setStep("consentPending");
    setToast("success");

    window.setTimeout(() => {
      setStep("consentSuccess");
    }, 2000);
  };

  const handleSimulateDecline = () => {
    setStep("consentDeclined");
    setToast("failed");
  };

  return (
    <div className="-mx-4 -my-4 min-h-full bg-[#F3FAFA] md:-mx-12">
      {toast && (
        <div className="fixed right-6 top-24 z-[100] rounded-lg bg-[#F0F1FF] px-7 py-6 font-semibold text-[#211783] shadow-lg">
          <button
            onClick={() => setToast(null)}
            className="absolute right-3 top-2 text-[#211783]"
          >
            ×
          </button>
          SMS Verification {toast === "success" ? "Successful!!!" : "Failed!!!"}
        </div>
      )}

      <EmergencyTransferCard currentStep={step}>
        {step === "bioDataOne" && (
          <PatientBioDataStep
            form={form}
            setForm={setForm}
            onNext={() => setStep("bioDataTwo")}
          />
        )}

        {step === "bioDataTwo" && (
          <PatientContactStep
            form={form}
            setForm={setForm}
            onPrevious={() => setStep("bioDataOne")}
            onNext={() => setStep("consentVerification")}
          />
        )}

        {step === "consentVerification" && (
          <>
            <ConsentVerificationStep
              form={form}
              emergencyOverride={emergencyOverride}
              setEmergencyOverride={setEmergencyOverride}
              error={phoneError}
              onPrevious={() => setStep("bioDataTwo")}
              onNext={handleConsentContinue}
            />

            <div className="mt-4 text-center">
              <button
                onClick={handleSimulateDecline}
                className="text-sm text-red-500 hover:underline"
              >
                Simulate SMS Decline
              </button>
            </div>
          </>
        )}

        {step === "consentPending" && <ConsentPendingStep />}

        {step === "consentSuccess" && (
          <ConsentResultStep
            status="success"
            onPrevious={() => setStep("consentVerification")}
            onContinue={() => setStep("adminAuthorization")}
          />
        )}

        {step === "consentDeclined" && (
          <ConsentResultStep
            status="declined"
            onPrevious={() => setStep("consentVerification")}
          />
        )}

        {step === "adminAuthorization" && (
          <AdminAuthorizationStep
            onPrevious={() => setStep("consentSuccess")}
            onContinue={() => setStep("transferSuccess")}
          />
        )}

        {step === "transferSuccess" && (
          <TransferSuccessStep
            onGoToDashboard={() => {
              setStep("bioDataOne");
              setForm(initialForm);
              setEmergencyOverride(false);
              setPhoneError(false);
            }}
          />
        )}
      </EmergencyTransferCard>
    </div>
  );
}