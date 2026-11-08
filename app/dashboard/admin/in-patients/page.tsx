"use client";

import InPatientsList from "@components/dashboard/admissions/InPatientsList";

export default function AdminInPatientsPage() {
  return (
    <div className="p-6">
      <InPatientsList patientHref={(patientId) => `/dashboard/admin/patient/${patientId}`} />
    </div>
  );
}
