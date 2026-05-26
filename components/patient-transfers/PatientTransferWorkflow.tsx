"use client";

import { useState } from "react";
import SmsConsentPending from "./SmsConsentPending";
import SmsConsentSuccess from "./SmsConsentSuccess";
import PatientTransferConsentForm from "./PatientTransferConsentForm";
import ConsentSubmitted from "./ConsentSubmitted";

type WorkflowStep =
  | "sms-pending"
  | "sms-success"
  | "consent-form"
  | "submitted";

export default function PatientTransferWorkflow() {
  const [step, setStep] = useState<WorkflowStep>("sms-pending");

  return (
    <main className="min-h-screen flex-1 bg-[#eefdfa]">
      {step === "sms-pending" && (
        <SmsConsentPending
          onVerified={() => setStep("sms-success")}
        />
      )}

      {step === "sms-success" && (
        <SmsConsentSuccess
          onContinue={() => setStep("consent-form")}
        />
      )}

      {step === "consent-form" && (
        <PatientTransferConsentForm
          onSubmitConsent={() => setStep("submitted")}
        />
      )}

      {step === "submitted" && <ConsentSubmitted />}
    </main>
  );
}