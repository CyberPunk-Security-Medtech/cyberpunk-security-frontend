"use client";

import Link from "next/link";
import { StatusBadge } from "@components/StatusBadge";
import { useConsultation } from "./ConsultationContext";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const toBadgeStatus = (status: string): "Active" | "Pending" | "Completed" => {
  const normalized = status.toLowerCase();
  if (normalized === "in progress") return "Active";
  if (normalized === "completed") return "Completed";
  return "Pending";
};

export default function PatientConsultationList() {
  const {
    consultations,
    consultationLoading,
    selectedConsultationId,
    setSelectedConsultationId,
  } = useConsultation();

  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#1A2380]">Consultations</h3>
        <p className="text-sm text-gray-500">
          Click a consultation to preview key details. Open full details for diagnosis, labs,
          prescriptions, and notes.
        </p>
      </div>

      {consultationLoading && (
        <div className="rounded-lg border p-4 text-sm text-gray-500">
          Loading consultations...
        </div>
      )}

      {!consultationLoading && consultations.length === 0 && (
        <div className="rounded-lg border p-4 text-sm text-gray-500">
          No consultation found for this patient yet.
        </div>
      )}

      {!consultationLoading && consultations.length > 0 && (
        <div className="space-y-3">
          {consultations.map((consultation: any) => {
            const isSelected = consultation.id === selectedConsultationId;
            const detailHref = `/dashboard/doctor-dashboard/consultations/${consultation.id}?patient_id=${consultation.patient_id}`;

            return (
              <div
                key={consultation.id}
                className={`rounded-lg border p-4 transition ${
                  isSelected ? "border-[#1A2380] bg-[#F8F9FF]" : "border-gray-200 bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedConsultationId(isSelected ? null : consultation.id)}
                  className="w-full text-left"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <p className="break-words font-medium text-[#1A2380]">
                        {consultation.reason_for_visit || "Consultation"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {consultation.department?.name || "-"} |{" "}
                        {formatDate(consultation.updated_at || consultation.created_at)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={toBadgeStatus(String(consultation.status || ""))} />
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                        {consultation.priority || "-"}
                      </span>
                      <span className="inline-block text-xs text-gray-500">
                        {isSelected ? "Hide" : "Preview"}
                      </span>
                    </div>
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isSelected ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t pt-4">
                      <div className="mb-4 grid grid-cols-1 gap-3 text-sm text-gray-700 xl:grid-cols-3">
                        <div className="rounded-md bg-gray-50 p-3">
                          <p className="text-xs text-gray-500">Created</p>
                          <p className="font-medium">{formatDate(consultation.created_at)}</p>
                        </div>
                        <div className="rounded-md bg-gray-50 p-3">
                          <p className="text-xs text-gray-500">Last Updated</p>
                          <p className="font-medium">
                            {formatDate(consultation.updated_at || consultation.created_at)}
                          </p>
                        </div>
                        <div className="rounded-md bg-gray-50 p-3">
                          <p className="text-xs text-gray-500">Consultation ID</p>
                          <p className="break-all font-medium">{consultation.id}</p>
                        </div>
                      </div>

                      <p className="mb-4 rounded-lg border border-[#DADDFE] bg-[#EEF2FF] px-3 py-2 text-xs text-[#1A2380]">
                        Preview mode uses lightweight list data. Open full details for complete
                        consultation records.
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={detailHref}
                          className="rounded-md bg-[#1A2380] px-4 py-2 text-sm text-white hover:bg-[#111B66]"
                        >
                          Open Full Consultation
                        </Link>
                        <Link
                          href={`/dashboard/doctor-dashboard/patient/${consultation.patient_id}`}
                          className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Patient Overview
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
