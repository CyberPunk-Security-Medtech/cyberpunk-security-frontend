"use client";

import { useEffect, useMemo, useState } from "react";
import { PatientPrescriptionModal } from "./PatientPrescriptionModal";
import { useConsultation } from "./ConsultationContext";
import { patientService } from "@services/api";
import { StatusBadge } from "@components/StatusBadge";

export default function PatientPrescriptionTab() {
  const [open, setOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const {
    isSelectedConsultationActive,
    selectedConsultationId,
    selectedConsultation,
    orgId,
    patientId,
  } = useConsultation();
  const isCompletedConsultation =
    String(selectedConsultation?.status ?? "").toLowerCase() === "completed";

  const loadPrescriptions = async () => {
    if (!orgId || !patientId) return;
    try {
      const result = await patientService.getPatientPrescriptions(orgId, patientId);
      setPrescriptions(result ?? []);
    } catch (error) {
      console.error("Failed to load prescriptions", error);
    }
  };

  useEffect(() => {
    loadPrescriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, patientId]);

  const filteredPrescriptions = useMemo(() => {
    if (!selectedConsultationId) return prescriptions;
    return prescriptions.filter((item: any) => item.consultation_id === selectedConsultationId);
  }, [prescriptions, selectedConsultationId]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr] lg:gap-8">
      <section className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-[#003C36]">Prescription</h3>
          {/* {!isCompletedConsultation && (
            <button
              onClick={() => setOpen(true)}
              disabled={!isSelectedConsultationActive || !selectedConsultationId}
              className={`rounded-md px-4 py-2.5 text-sm font-medium text-white transition ${
                isSelectedConsultationActive && !!selectedConsultationId
                  ? "bg-[#006B5F] hover:bg-[#005249]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              + Add Prescription
            </button>
          )} */}
        </div>

        {!isSelectedConsultationActive && !isCompletedConsultation && (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Start an active consultation before adding prescriptions.
          </p>
        )}

        <div className="space-y-3">
          {filteredPrescriptions.length === 0 && (
            <div className="rounded-xl border p-4 text-sm text-gray-500">
              No prescriptions recorded yet.
            </div>
          )}

          {filteredPrescriptions.map((item: any) => (
            <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-10 w-10 rounded-lg border border-[#B7DED8] bg-[#ECFDF8] flex items-center justify-center">
                    <div className="h-5 w-5 rounded-full border border-[#006B5F] relative">
                      <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#006B5F]" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-gray-900">{item.medication_name}</p>
                    <p className="break-words text-xs text-gray-500">{item.dosage}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span>{item.frequency}</span>
                  <span>{item.duration}</span>
                  <span>{item.route || "-"}</span>
                  <StatusBadge status="Pending" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <PatientPrescriptionModal
          open={open}
          onClose={() => setOpen(false)}
          consultationId={selectedConsultationId}
          orgId={orgId}
          onCreated={loadPrescriptions}
        />
      </section>
    </div>
  );
}
