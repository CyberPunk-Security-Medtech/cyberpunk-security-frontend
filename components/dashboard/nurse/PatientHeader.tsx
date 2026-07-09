"use client";

import { StatusBadge } from "@components/StatusBadge";
import Button from "@components/Button";
import { useState } from "react";
import { useConsultation } from "./ConsultationContext";
import { CreateConsultationModal } from "./ConsultationModal";

const parseVitals = (raw?: string | null): Array<{ label: string; value: string; status: "Normal" | "High" | "Low" }> => {
  if (!raw) {
    return [{ label: "Vitals", value: "Not recorded", status: "Low" }];
  }
  return [{ label: "Vitals", value: raw, status: "Normal" }];
};

export default function PatientHeader() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    patient,
    patientLoading,
    consultations,
    consultationLoading,
    selectedConsultation,
    patientId,
    hasConsultation,
    refreshConsultations,
  } = useConsultation();

  const vitals = parseVitals(selectedConsultation?.vitals ?? consultations[0]?.vitals);

  const fullName = `${patient?.first_name ?? ""} ${patient?.last_name ?? ""}`.trim() || "Patient";
  const initials =
    `${patient?.first_name?.[0] ?? ""}${patient?.last_name?.[0] ?? ""}`.toUpperCase() || "NA";

  return (
    <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <button
          onClick={() => history.back()}
          className="text-sm w-fit bg-[#ECEEFD] font-medium rounded-full text-brand-navy hover:underline px-4 py-1"
        >
          Back to Patients List
        </button>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          {hasConsultation ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Routed to Department
            </span>
          ) : (
            <Button
              type="button"
              onSubmitHandler={() => setIsCreateModalOpen(true)}
              disabled={consultationLoading}
              className="w-full rounded-md bg-[#1A2380] px-4 py-2 text-white transition hover:bg-[#00B8A8] disabled:opacity-50 sm:w-auto sm:px-6"
            >
              {consultationLoading ? "Loading..." : "Create Consultation"}
            </Button>
          )}
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3 sm:gap-4">
        <div className="h-14 w-14 rounded-full bg-[#E3F7F5] grid place-items-center text-brand-teal font-semibold">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-brand-navy">
            {patientLoading ? "Loading patient..." : fullName}
          </h3>
          <p className="text-sm">
            <span className="text-sm text-[#00B8A8]">PID:</span>{" "}
            <span className="break-all text-gray-700">{patient?.id ?? "-"}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {vitals.map((v) => (
          <div key={v.label} className="border rounded-lg p-4 text-center">
            <p className="break-words font-semibold text-brand-navy">{v.value}</p>
            <p className="text-sm text-gray-500">{v.label}</p>
            <div className="mt-2"><StatusBadge status={v.status} /></div>
          </div>
        ))}
      </div>

      <CreateConsultationModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        patientId={patientId}
        onCreated={() => {
          void refreshConsultations();
        }}
      />
    </div>
  );
}
