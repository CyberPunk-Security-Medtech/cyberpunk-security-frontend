"use client";

import { useEffect, useMemo, useState } from "react";
import { StatusBadge } from "@components/StatusBadge";
import { DiagnosisModal } from "./DiagnosisModal";
import { useConsultation } from "./ConsultationContext";
import { patientService } from "@services/api";

export default function MedicalHistoryTab() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<any[]>([]);

  const {
    patientId,
    orgId,
    isSelectedConsultationActive,
    selectedConsultationId,
    selectedConsultation,
  } = useConsultation();

  const isCompletedConsultation =
    String(selectedConsultation?.status ?? "").toLowerCase() === "completed";

  const loadDiagnoses = async () => {
    if (!orgId || !patientId) return;
    try {
      const data = await patientService.getPatientDiagnoses(orgId, patientId);
      setRows(data ?? []);
    } catch (error) {
      console.error("Failed to load diagnoses", error);
    }
  };

  useEffect(() => {
    loadDiagnoses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, patientId]);

  const filteredRows = useMemo(() => {
    if (!selectedConsultationId) return rows;
    return rows.filter((row: any) => row.consultation_id === selectedConsultationId);
  }, [rows, selectedConsultationId]);

  return (
    <div className="grid grid-cols-1 gap-6">
      <section className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-[#003C36]">Medical History</h3>
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
              + Add Diagnosis
            </button>
          )} */}
        </div>

        <div className="space-y-4">
          {filteredRows.length === 0 && (
            <div className="rounded-xl border p-4 text-sm text-gray-500">
              No diagnosis records yet.
            </div>
          )}

          {filteredRows.map((h: any) => (
            <div
              key={h.id}
              className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <h4 className="break-words font-medium text-[#003C36]">{h.primary_diagnosis}</h4>
                <p className="break-words text-xs text-gray-500">
                  {h.secondary_diagnosis || h.symptoms || "No additional notes"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-xs text-gray-500">
                  {h.updated_at ? new Date(h.updated_at).toLocaleDateString() : "-"}
                </p>
                <StatusBadge status="Active" />
              </div>
            </div>
          ))}
        </div>

        <DiagnosisModal
          open={open}
          onClose={() => setOpen(false)}
          consultationId={selectedConsultationId}
          orgId={orgId}
          onCreated={loadDiagnoses}
        />
      </section>

    </div>
  );
}
