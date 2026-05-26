"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Tabs from "@components/Tabs";
import { StatusBadge } from "@components/StatusBadge";
import { useAuth } from "@context/AuthContext";
import { consultationService } from "@services/api";
import { ConsultationProvider, useConsultation } from "./ConsultationContext";
import ActivityLogTab from "./ActivityLog";
import LabTestTab from "./LabTestTab";
import MedicalHistoryTab from "./MedicalHistoryTab";
import PatientPrescriptionTab from "./PatientPrescriptionTab";

type ConsultationDetailsClientProps = {
  consultationId: string;
  patientId: string | null;
};

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

function ConsultationDetailsContent({ consultationId }: { consultationId: string }) {
  const router = useRouter();
  const {
    patient,
    patientLoading,
    consultationLoading,
    selectedConsultation,
    selectedConsultationId,
    setSelectedConsultationId,
    isSelectedConsultationActive,
    consultationStatus,
    startConsultation,
  } = useConsultation();

  useEffect(() => {
    if (selectedConsultationId !== consultationId) {
      setSelectedConsultationId(consultationId);
    }
  }, [consultationId, selectedConsultationId, setSelectedConsultationId]);

  const tabs = useMemo(
    () => [
      { label: "Medical History", content: <MedicalHistoryTab /> },
      { label: "Prescription", content: <PatientPrescriptionTab /> },
      { label: "Lab Test", content: <LabTestTab /> },
      { label: "Activity Log", content: <ActivityLogTab /> },
    ],
    []
  );

  const isPending =
    String(selectedConsultation?.status ?? "").toLowerCase() === "pending";

  return (
    <div className="space-y-6 py-2 sm:py-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/dashboard/nurse-dashboard/consultations")}
          className="rounded-full bg-[#ECEEFD] px-4 py-1 text-sm font-medium text-brand-navy hover:underline"
        >
          Back to Consultation Queue
        </button>
        <button
          type="button"
          onClick={() =>
            router.push(`/dashboard/nurse-dashboard/patient/${patient?.id ?? ""}`)
          }
          disabled={!patient?.id}
          className="rounded-full border border-gray-200 px-4 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Open Patient Overview
        </button>
      </div>

      <section className="rounded-lg border bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h2 className="break-words text-xl font-semibold text-[#1A2380]">
              {selectedConsultation?.reason_for_visit || "Consultation Details"}
            </h2>
            <p className="text-sm text-gray-500">
              {patientLoading
                ? "Loading patient..."
                : `${patient?.first_name ?? ""} ${patient?.last_name ?? ""}`.trim() ||
                  "Patient"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedConsultation?.status && (
              <StatusBadge status={toBadgeStatus(String(selectedConsultation.status))} />
            )}
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
              {selectedConsultation?.priority || "-"}
            </span>
            {isPending && (
              <button
                type="button"
                onClick={() => void startConsultation()}
                disabled={consultationStatus === "starting"}
                className="rounded-md bg-[#1A2380] px-3 py-1.5 text-sm text-white hover:bg-[#111B66] disabled:opacity-50"
              >
                {consultationStatus === "starting" ? "Starting..." : "Start Consultation"}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm text-gray-700 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-md bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Consultation ID</p>
            <p className="break-all font-medium">{selectedConsultationId || consultationId}</p>
          </div>
          <div className="rounded-md bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Created</p>
            <p className="font-medium">{formatDate(selectedConsultation?.created_at)}</p>
          </div>
          <div className="rounded-md bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Updated</p>
            <p className="font-medium">
              {formatDate(selectedConsultation?.updated_at || selectedConsultation?.created_at)}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border bg-white p-4 shadow-sm sm:p-5">
        {!consultationLoading && !selectedConsultation && (
          <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            Consultation summary is unavailable from list response, but full tabs are still loaded
            for this consultation.
          </p>
        )}

        {consultationLoading ? (
          <p className="text-sm text-gray-500">Loading consultation details...</p>
        ) : (
          <Tabs key={`consultation-details-tabs-${consultationId}`} tabs={tabs} />
        )}
      </section>
    </div>
  );
}

export default function ConsultationDetailsClient({
  consultationId,
  patientId,
}: ConsultationDetailsClientProps) {
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id ?? null;

  const [resolvedPatientId, setResolvedPatientId] = useState<string | null>(
    patientId
  );
  const [resolving, setResolving] = useState(!patientId);

  useEffect(() => {
    if (resolvedPatientId || !orgId) {
      setResolving(false);
      return;
    }

    let mounted = true;
    const resolvePatientId = async () => {
      setResolving(true);
      try {
        const [pending, inProgress, completed, cancelled] = await Promise.all([
          consultationService.listConsultations(orgId, { status_filter: "Pending" }),
          consultationService.listConsultations(orgId, { status_filter: "In Progress" }),
          consultationService.listConsultations(orgId, { status_filter: "Completed" }),
          consultationService.listConsultations(orgId, { status_filter: "Cancelled" }),
        ]);

        const merged = [
          ...(pending ?? []),
          ...(inProgress ?? []),
          ...(completed ?? []),
          ...(cancelled ?? []),
        ];

        const match = merged.find((item: any) => item.id === consultationId);
        if (mounted) {
          setResolvedPatientId(match?.patient_id ?? null);
        }
      } catch (error) {
        console.error("Failed to resolve consultation patient", error);
      } finally {
        if (mounted) {
          setResolving(false);
        }
      }
    };

    void resolvePatientId();
    return () => {
      mounted = false;
    };
  }, [consultationId, orgId, resolvedPatientId]);

  if (resolving) {
    return (
      <section className="rounded-lg border bg-white p-5 text-sm text-gray-500 shadow-sm">
        Resolving consultation details...
      </section>
    );
  }

  if (!resolvedPatientId) {
    return (
      <section className="rounded-lg border bg-white p-5 text-sm text-gray-500 shadow-sm">
        Unable to resolve patient for this consultation.
      </section>
    );
  }

  return (
    <ConsultationProvider patientId={resolvedPatientId}>
      <ConsultationDetailsContent consultationId={consultationId} />
    </ConsultationProvider>
  );
}
