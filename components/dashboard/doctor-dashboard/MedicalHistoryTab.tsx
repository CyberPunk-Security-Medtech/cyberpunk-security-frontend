"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@components/StatusBadge";
import { DiagnosisModal } from "./DiagnosisModal";
import Button from "@components/Button";
import { useConsultation } from "./ConsultationContext";
import { consultationService, patientService } from "@services/api";
import { toast } from "react-toastify";

export default function MedicalHistoryTab() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<any[]>([]);

  const {
    patientId,
    orgId,
    isConsultationActive,
    currentConsultationId,
  } = useConsultation();

  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

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

  const handleSaveNote = async () => {
    if (!orgId || !currentConsultationId || !note.trim()) return;

    setSavingNote(true);
    try {
      await consultationService.completeConsultation(orgId, currentConsultationId, {
        clinical_notes: note.trim(),
      });
      setNote("");
      toast.success("Note saved");
    } catch (error) {
      console.error("Failed to save note", error);
      toast.error("Failed to save note");
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
      <section className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#1A2380]">Medical History</h3>
          <button
            onClick={() => setOpen(true)}
            disabled={!isConsultationActive || !currentConsultationId}
            className={`rounded-md px-4 py-2.5 text-sm font-medium text-white transition ${
              isConsultationActive && !!currentConsultationId
                ? "bg-[#1A2380] hover:bg-[#00B8A8]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            + Add Diagnosis
          </button>
        </div>

        <div className="space-y-4">
          {rows.length === 0 && (
            <div className="rounded-xl border p-4 text-sm text-gray-500">
              No diagnosis records yet.
            </div>
          )}

          {rows.map((h: any) => (
            <div
              key={h.id}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <h4 className="font-medium text-[#1A2380]">{h.primary_diagnosis}</h4>
                <p className="text-xs text-gray-500">
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
          consultationId={currentConsultationId}
          orgId={orgId}
          onCreated={loadDiagnoses}
        />
      </section>

      <section className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-[#1A2380] mb-4">Doctor&apos;s Note</h3>

        <textarea
          placeholder={isConsultationActive ? "Add Note" : "Start consultation to add notes"}
          disabled={!isConsultationActive || !currentConsultationId}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border border-gray-200 rounded-md p-3 text-sm focus:ring-1 focus:ring-[#00B8A8] outline-none resize-none disabled:bg-gray-50"
          rows={8}
        />

        <div className="flex justify-end mt-4">
          <Button
            type="button"
            onSubmitHandler={handleSaveNote}
            disabled={!isConsultationActive || savingNote || !note.trim() || !currentConsultationId}
            className="bg-[#1A2380] text-white px-4 py-2 rounded-md hover:bg-[#00B8A8] transition text-sm disabled:opacity-50 disabled:bg-gray-300"
          >
            {savingNote ? "Saving..." : "Save Note"}
          </Button>
        </div>
      </section>
    </div>
  );
}
