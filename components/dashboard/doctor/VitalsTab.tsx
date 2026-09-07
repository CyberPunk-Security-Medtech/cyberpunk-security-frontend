"use client";

import { useEffect, useState } from "react";
import Modal from "@components/Modal";
import { FieldLabel, Input, Textarea } from "@components/Field";
import { consultationService, VitalRecord } from "@services/api";
import { useConsultation } from "./ConsultationContext";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "@utils/apiError";
import { LoaderIcon } from "@components/Skeletons";

// Field definitions mirror the backend's VitalRecordCreate ranges —
// submitting a value outside these is rejected with 422 before it lands.
const VITALS_FIELDS: Array<{
  name: keyof VitalsForm;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  placeholder: string;
}> = [
  { name: "temperature", label: "Temperature", unit: "°C", min: 20, max: 45, step: 0.1, placeholder: "e.g. 36.8" },
  { name: "heart_rate", label: "Heart Rate", unit: "bpm", min: 10, max: 300, step: 1, placeholder: "e.g. 72" },
  { name: "systolic_bp", label: "Systolic BP", unit: "mmHg", min: 30, max: 300, step: 1, placeholder: "e.g. 120" },
  { name: "diastolic_bp", label: "Diastolic BP", unit: "mmHg", min: 20, max: 200, step: 1, placeholder: "e.g. 80" },
  { name: "respiratory_rate", label: "Respiratory Rate", unit: "/min", min: 1, max: 100, step: 1, placeholder: "e.g. 16" },
  { name: "oxygen_saturation", label: "Oxygen Saturation", unit: "%", min: 0, max: 100, step: 0.1, placeholder: "e.g. 98" },
  { name: "weight", label: "Weight", unit: "kg", min: 0.2, max: 700, step: 0.1, placeholder: "e.g. 70.5" },
  { name: "height", label: "Height", unit: "cm", min: 10, max: 300, step: 0.1, placeholder: "e.g. 175" },
];

type VitalsForm = {
  temperature: string;
  heart_rate: string;
  systolic_bp: string;
  diastolic_bp: string;
  respiratory_rate: string;
  oxygen_saturation: string;
  weight: string;
  height: string;
  notes: string;
};

const EMPTY_FORM: VitalsForm = {
  temperature: "",
  heart_rate: "",
  systolic_bp: "",
  diastolic_bp: "",
  respiratory_rate: "",
  oxygen_saturation: "",
  weight: "",
  height: "",
  notes: "",
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

// Shows a filled measurement; null/undefined renders as "-" so rows keep
// their shape when only some vitals were captured.
const displayValue = (record: VitalRecord, field: (typeof VITALS_FIELDS)[number]["name"]) => {
  const raw = record[field];
  return raw === null || raw === undefined ? "-" : `${raw} ${VITALS_FIELDS.find((f) => f.name === field)?.unit ?? ""}`.trim();
};

export default function VitalsTab() {
  const [open, setOpen] = useState(false);
  const [vitals, setVitals] = useState<VitalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<VitalsForm>(EMPTY_FORM);

  const { orgId, selectedConsultationId, isSelectedConsultationActive } =
    useConsultation();

  const loadVitals = async () => {
    if (!orgId || !selectedConsultationId) return;
    setLoading(true);
    try {
      const result = await consultationService.listVitals(orgId, selectedConsultationId);
      setVitals(result ?? []);
    } catch (error) {
      console.error("Failed to load vitals", error);
      toast.error("Failed to load vitals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVitals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, selectedConsultationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId || !selectedConsultationId) return;

    // Convert the text inputs to the nullable numbers the API expects,
    // dropping empty fields entirely.
    const payload: Record<string, number | string | null> = {};
    let hasMeasurement = false;
    for (const field of VITALS_FIELDS) {
      const raw = form[field.name].trim();
      if (raw === "") continue;
      const value = Number(raw);
      if (Number.isNaN(value)) {
        toast.error(`${field.label} must be a number.`);
        return;
      }
      if (value < field.min || value > field.max) {
        toast.error(`${field.label} must be between ${field.min} and ${field.max} ${field.unit}.`);
        return;
      }
      payload[field.name] = value;
      hasMeasurement = true;
    }

    if (form.notes.trim()) {
      payload.notes = form.notes.trim();
    }

    if (!hasMeasurement && !form.notes.trim()) {
      toast.error("Enter at least one vital sign or a note.");
      return;
    }

    setSubmitting(true);
    try {
      await consultationService.recordVitals(
        orgId,
        selectedConsultationId,
        payload as Parameters<typeof consultationService.recordVitals>[2],
      );
      toast.success("Vitals recorded");
      setOpen(false);
      setForm(EMPTY_FORM);
      await loadVitals();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to record vitals. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-brand-navy">Vitals</h3>
          <p className="text-xs text-gray-500">
            Recorded for this consultation.
          </p>
        </div>
        <button
          disabled={!isSelectedConsultationActive || !selectedConsultationId}
          onClick={() => setOpen(true)}
          className="rounded-md bg-[#1A2380] hover:bg-[#00B8A8] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          + Record Vitals
        </button>
      </div>

      {!isSelectedConsultationActive && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Start an active consultation before recording vitals.
        </p>
      )}

      {loading ? (
        <div className="py-6">
          <LoaderIcon />
        </div>
      ) : vitals.length === 0 ? (
        <div className="rounded-xl border px-4 py-4 text-sm text-gray-500">
          No vitals recorded yet.
        </div>
      ) : (
        <div className="space-y-3">
          {vitals.map((record) => (
            <div key={record.id} className="rounded-xl border px-4 py-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-gray-500">
                  Recorded {formatDateTime(record.recorded_at)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {VITALS_FIELDS.map((field) => (
                  <div key={field.name} className="rounded-md bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">{field.label}</p>
                    <p className="font-medium text-gray-800">{displayValue(record, field.name)}</p>
                  </div>
                ))}
              </div>
              {record.notes && (
                <p className="mt-3 rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                  {record.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal title="Record Vitals" isOpen={open} onClose={() => setOpen(false)}>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {VITALS_FIELDS.map((field) => (
              <div key={field.name}>
                <FieldLabel htmlFor={`vitals-${field.name}`}>
                  {field.label} ({field.unit})
                </FieldLabel>
                <Input
                  id={`vitals-${field.name}`}
                  type="number"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  inputMode="decimal"
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [field.name]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>
          <div>
            <FieldLabel htmlFor="vitals-notes">Notes</FieldLabel>
            <Textarea
              id="vitals-notes"
              rows={4}
              placeholder="Any observations about these readings"
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border px-6 py-2.5 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              disabled={submitting || !orgId || !selectedConsultationId}
              className="rounded-full bg-[#1A2380] hover:bg-[#00B8A8] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              type="submit"
            >
              {submitting ? "Submitting..." : "Save Vitals"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
