"use client";

import { useCallback, useEffect, useState } from "react";
import { UserRound } from "lucide-react";
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
        footer={
          <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <UserRound size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            Patient editing is unavailable until the server provides a supported patient-update
            endpoint. The current record is shown read-only.
          </p>
        }
        loading={loading}
        onRetry={activeWorkspace?.id ? () => void loadPatient() : undefined}
        patient={patient}
        patientId={patientId}
      />
    </div>
  );
}
