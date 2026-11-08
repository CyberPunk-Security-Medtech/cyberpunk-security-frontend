"use client";

import InPatientsList from "@components/dashboard/admissions/InPatientsList";

export default function DoctorInPatientsPage() {
  return <InPatientsList patientHref={(patientId) => `/dashboard/doctor/patient/${patientId}`} />;
}
