"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import {
  consultationService,
  patientService,
  type PatientListRecord,
} from "@services/api";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";

type PatientRow = {
  id: string;
  initials: string;
  name: string;
  gender: string;
  condition: string;
  createdAt: string;
};

const consultationStatuses = [
  "Pending",
  "In Progress",
  "Completed",
  "Cancelled",
] as const;

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const mapPatient = (patient: PatientListRecord): PatientRow => {
  const firstName = patient?.first_name ?? "";
  const lastName = patient?.last_name ?? "";

  return {
    id: patient?.id ?? "",
    initials: `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "NA",
    name: `${firstName} ${lastName}`.trim() || "Unknown Patient",
    gender: patient?.gender || "-",
    condition: patient?.symptoms || "Not recorded",
    createdAt: patient?.created_at || patient?.updated_at || "",
  };
};

export default function NewPatientsAwaitingTriage() {
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id ?? null;

  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTriageQueue = useCallback(
    async (isBackgroundRefresh = false) => {
      if (!orgId) {
        setPatients([]);
        setLoading(false);
        return;
      }

      if (!isBackgroundRefresh) {
        setLoading(true);
      }

      try {
        setError("");
        const [patientResult, ...consultationResults] = await Promise.all([
          patientService.getPatients(orgId),
          ...consultationStatuses.map((status_filter) =>
            consultationService.listConsultations(orgId, { status_filter }),
          ),
        ]);

        const allPatients = Array.isArray(patientResult) ? patientResult : [];
        const consultations = consultationResults.flatMap((result) =>
          Array.isArray(result) ? result : [],
        );
        const consultedPatientIds = new Set(
          consultations
            .map((consultation: any) => consultation?.patient_id)
            .filter(Boolean),
        );

        const awaitingTriage = allPatients
          .filter((patient: PatientListRecord) => patient?.id && !consultedPatientIds.has(patient.id))
          .map(mapPatient)
          .sort((first, second) => {
            const firstTime = new Date(first.createdAt || 0).getTime();
            const secondTime = new Date(second.createdAt || 0).getTime();
            return secondTime - firstTime;
          });

        setPatients(awaitingTriage);
      } catch (loadError) {
        console.error("Failed to load nurse triage queue", loadError);
        setError("Unable to load newly onboarded patients.");
        setPatients([]);
      } finally {
        setLoading(false);
      }
    },
    [orgId],
  );

  useEffect(() => {
    void loadTriageQueue();

    const intervalId = window.setInterval(() => {
      void loadTriageQueue(true);
    }, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadTriageQueue(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadTriageQueue]);

  const visiblePatients = useMemo(() => patients.slice(0, 8), [patients]);

  return (
    <section className="mb-8 rounded-lg border bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-semibold text-[#003C36]">
            New Patients Awaiting Triage
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Newly onboarded patients who still need a nurse consultation and department routing.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && <p className="text-sm text-gray-500">Loading triage queue...</p>}

      {!loading && visiblePatients.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
          No newly onboarded patient is awaiting triage right now.
        </div>
      )}

      {!loading && visiblePatients.length > 0 && (
        <ResponsiveTableRegion label="Patients awaiting nurse triage">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b bg-gray-50 text-gray-600">
              <tr>
                <th scope="col" className="min-w-[180px] bg-gray-50 px-4 py-3 font-medium">Patient</th>
                <th className="px-4 py-3 font-medium">Patient ID</th>
                <th className="px-4 py-3 font-medium">Gender</th>
                <th className="px-4 py-3 font-medium">Condition</th>
                <th className="px-4 py-3 font-medium">Onboarded</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {visiblePatients.map((patient) => (
                <tr key={patient.id} className="border-b last:border-b-0">
                  <td className="bg-white px-4 py-3">
                    <div className="flex items-center gap-3 font-medium text-[#003C36]">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-[#E6F8F7] text-xs font-semibold text-[#00B8A8]">
                        {patient.initials}
                      </div>
                      <span className="break-words">{patient.name}</span>
                    </div>
                  </td>
                  <td className="break-all px-4 py-3 text-gray-600">{patient.id}</td>
                  <td className="px-4 py-3 text-gray-600">{patient.gender}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <span className="line-clamp-1">{patient.condition}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(patient.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/nurse/patient/${patient.id}`}
                      className="inline-flex items-center gap-2 rounded-md bg-[#006B5F] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#005249] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8A8] focus-visible:ring-offset-2 motion-reduce:transition-none"
                    >
                      Open Patient
                      <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ResponsiveTableRegion>
      )}
    </section>
  );
}
