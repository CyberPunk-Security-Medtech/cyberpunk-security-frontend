"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import SharedPatientDetails from "@components/dashboard/SharedPatientDetails";
import { useAuth } from "@context/AuthContext";
import { patientService, type PatientDetailRecord } from "@services/api";

type PatientDetailsProps = {
  patientId: string;
};

const isPatientDetailRecord = (value: unknown): value is PatientDetailRecord =>
  typeof value === "object" && value !== null;

export default function PatientDetails({ patientId }: PatientDetailsProps) {
  const { activeWorkspace, hydrated } = useAuth();
  const [patient, setPatient] = useState<PatientDetailRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPatient = useCallback(async () => {
    if (!activeWorkspace?.id || !patientId) {
      setPatient(null);
      setError("Select an organization workspace to view this patient.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await patientService.getPatient(activeWorkspace.id, patientId);
      if (!isPatientDetailRecord(result)) {
        throw new Error("The patient record returned an unsupported format.");
      }
      setPatient(result);
    } catch (loadError) {
      console.error("Failed to load admin patient details", loadError);
      setPatient(null);
      setError("Unable to load patient details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [activeWorkspace?.id, patientId]);

  useEffect(() => {
    if (hydrated) void loadPatient();
  }, [hydrated, loadPatient]);

  return (
    <div className="px-4 md:px-8">
      <SharedPatientDetails
        backHref="/dashboard/admin"
        backLabel="Back to dashboard"
        error={error}
        actions={
          <Link
            href={`/dashboard/admin/patient/${patientId}/edit`}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#051466] px-4 text-sm font-semibold text-white hover:bg-[#020B44] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466] focus-visible:ring-offset-2"
          >
            <Pencil size={16} aria-hidden="true" />
            Edit patient
          </Link>
        }
        loading={loading}
        onRetry={activeWorkspace?.id ? () => void loadPatient() : undefined}
        patient={patient}
        patientId={patientId}
      />
    </div>
  );
}
