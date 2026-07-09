"use client";

import PatientTransferConsentForm from "@components/patient-transfers/PatientTransferConsentForm";
import PatientTransferWorkflow from "@components/patient-transfers/PatientTransferWorkflow";
import { useState } from "react";

type WorkflowStep =
  | "sms-pending"
  | "sms-success"
  | "consent-form"
  | "submitted";



export default function PatientConsentPage() {
    const [step, setStep] = useState<WorkflowStep>("sms-pending");
  // return <PatientTransferWorkflow />;
  return <PatientTransferConsentForm onSubmitConsent={() => setStep("submitted")} />;
}




