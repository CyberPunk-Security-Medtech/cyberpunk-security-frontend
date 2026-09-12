"use client";

import { useEffect, useMemo, useState } from "react";
import { DiagnosisModal } from "./DiagnosisModal";
import { useConsultation } from "./ConsultationContext";
import { patientService } from "@services/api";
import ConsultationNotesPanel from "./ConsultationNotesPanel";
import {
  ClinicalListThumbnail,
  DiagnosisEmptyState,
} from "@components/dashboard/consultations/ClinicalListPresentation";

type DiagnosisRecord = {
  id: string;
  consultation_id?: string | null;
  primary_diagnosis: string;
  secondary_diagnosis?: string | null;
  symptoms?: string | null;
  updated_at?: string | null;
};

export default function MedicalHistoryTab() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<DiagnosisRecord[]>([]);

  const {
    patientId,
    orgId,
    isSelectedConsultationActive,
    selectedConsultationId,
  } = useConsultation();

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
    return rows.filter((row) => row.consultation_id === selectedConsultationId);
  }, [rows, selectedConsultationId]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr] lg:gap-8">
      <section className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-[#1A2380]">Medical History</h3>
          <button
            onClick={() => setOpen(true)}
            disabled={!isSelectedConsultationActive || !selectedConsultationId}
            className={`rounded-md px-4 py-2.5 text-sm font-medium text-white transition ${
              isSelectedConsultationActive && !!selectedConsultationId
                ? "bg-[#1A2380] hover:bg-[#00B8A8]"
                : "cursor-not-allowed bg-gray-300"
            }`}
          >
            + Add Diagnosis
          </button>
        </div>

        <div className="space-y-4">
          {filteredRows.length === 0 && (
            <DiagnosisEmptyState tone="doctor" />
          )}

          {filteredRows.map((h) => (
            <div
              key={h.id}
              className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <ClinicalListThumbnail kind="diagnosis" tone="doctor" />
                <div className="min-w-0">
                  <h4 className="break-words font-medium text-[#1A2380]">{h.primary_diagnosis}</h4>
                  <p className="break-words text-xs text-gray-500">
                    {h.secondary_diagnosis || h.symptoms || "No additional notes"}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {h.updated_at ? new Date(h.updated_at).toLocaleDateString() : "-"}
              </p>
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

      <ConsultationNotesPanel />
    </div>
  );
}
