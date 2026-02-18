"use client";

import { useEffect, useState } from "react";
import { PatientPrescriptionModal } from "./PatientPrescriptionModal";
import { useConsultation } from "./ConsultationContext";
import { patientService } from "@services/api";
import { StatusBadge } from "@components/StatusBadge";

export default function PatientPrescriptionTab() {
  const [open, setOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const { isConsultationActive, currentConsultationId, orgId, patientId } = useConsultation();

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
      <section className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#1A2380]">Prescription</h3>
          <button
            onClick={() => setOpen(true)}
            disabled={!isConsultationActive || !currentConsultationId}
            className={`rounded-md px-4 py-2.5 text-sm font-medium text-white transition ${
              isConsultationActive && !!currentConsultationId
                ? "bg-[#1A2380] hover:bg-[#00B8A8]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            + Add Prescription
          </button>
        </div>

        {!isConsultationActive && (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Start an active consultation before adding prescriptions.
          </p>
        )}

        <div className="space-y-3">
          {prescriptions.length === 0 && (
            <div className="rounded-xl border p-4 text-sm text-gray-500">
              No prescriptions recorded yet.
            </div>
          )}

          {prescriptions.map((item: any) => (
            <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg border border-[#DADDFE] bg-[#EEF2FF] flex items-center justify-center">
                    <div className="h-5 w-5 rounded-full border border-[#4F46E5] relative">
                      <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#4F46E5]" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.medication_name}</p>
                    <p className="text-xs text-gray-500">{item.dosage}</p>
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
          consultationId={currentConsultationId}
          orgId={orgId}
          onCreated={loadPrescriptions}
        />
      </section>
    </div>
  );
}
