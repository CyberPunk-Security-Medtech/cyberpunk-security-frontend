"use client";

import InPatientsList from "@components/dashboard/admissions/InPatientsList";

export default function NurseInPatientsPage() {
  return <InPatientsList patientHref={(patientId) => `/dashboard/nurse/patient/${patientId}`} />;
}
