"use client";

import PatientAdmissionPanel from "@components/dashboard/admissions/PatientAdmissionPanel";
import PatientVitalsHistory from "@components/dashboard/vitals/PatientVitalsHistory";
import { useConsultation } from "./ConsultationContext";

// Admission and vitals history for the nurse's patient page.
export default function PatientCareSections() {
  const { orgId, patient, patientId, refreshPatient } = useConsultation();
  const patientName =
    `${patient?.first_name ?? ""} ${patient?.last_name ?? ""}`.trim() || "Patient";

  return (
    <div className="mb-6 space-y-6">
      <PatientAdmissionPanel
        orgId={orgId}
        patientId={patientId}
        patientName={patientName}
        onChange={() => void refreshPatient()}
      />
      <PatientVitalsHistory orgId={orgId} patientId={patientId} />
    </div>
  );
}
