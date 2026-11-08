"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "@components/Modal";
import { FieldLabel, Input, Select, Textarea } from "@components/Field";
import {
  admissionService,
  patientService,
  wardService,
  type Admission,
  type Ward,
} from "@services/api";
import { getApiErrorMessage } from "@utils/apiError";

const MODAL_HEADER = "bg-[var(--dashboard-accent,#1A2380)]";
const PRIMARY_BUTTON =
  "rounded-md bg-[var(--dashboard-accent,#1A2380)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--dashboard-accent-hover,#11185F)] disabled:opacity-50";
const SECONDARY_BUTTON = "rounded-md border px-6 py-2.5 text-sm font-medium hover:bg-gray-50";

export const isWardFull = (ward: Ward) =>
  ward.capacity != null && (ward.occupied ?? 0) >= ward.capacity;

export const describeWardOccupancy = (ward: Ward) =>
  ward.capacity != null
    ? `${ward.occupied ?? 0}/${ward.capacity} beds occupied`
    : `${ward.occupied ?? 0} occupied`;

// Wards are refetched each time a dialog opens so occupancy is current.
function useWards(orgId: string | null | undefined, open: boolean) {
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !orgId) return;
    let cancelled = false;
    setLoading(true);
    wardService
      .listWards(orgId)
      .then((result) => {
        if (!cancelled) setWards(Array.isArray(result) ? result : []);
      })
      .catch((error) => {
        console.error("Failed to load wards", error);
        if (!cancelled) toast.error(getApiErrorMessage(error, "Unable to load wards."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, orgId]);

  return { wards, loading };
}

function WardField({
  id,
  wards,
  loading,
  value,
  onChange,
  currentWardId,
}: {
  id: string;
  wards: Ward[];
  loading: boolean;
  value: string;
  onChange: (wardId: string) => void;
  currentWardId?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id}>Ward</FieldLabel>
      <Select id={id} required value={value} onChange={(e) => onChange(e.target.value)} disabled={loading}>
        <option value="">{loading ? "Loading wards…" : "Select a ward"}</option>
        {wards.map((ward) => {
          // The patient's own ward stays selectable so only the bed can change.
          const full = isWardFull(ward) && ward.id !== currentWardId;
          return (
            <option key={ward.id} value={ward.id} disabled={full}>
              {ward.name} — {describeWardOccupancy(ward)}
              {full ? " (full)" : ""}
            </option>
          );
        })}
      </Select>
      {!loading && wards.length === 0 && (
        <p className="mt-2 text-xs text-amber-700">
          No wards have been set up yet. An administrator can add them under Wards.
        </p>
      )}
    </div>
  );
}

type PatientRef = { id: string; name: string };

export function AdmitPatientModal({
  orgId,
  patient,
  consultationId,
  onClose,
  onAdmitted,
}: {
  orgId: string | null | undefined;
  patient: PatientRef | null;
  consultationId?: string | null;
  onClose: () => void;
  onAdmitted: (admission: Admission) => void;
}) {
  const open = Boolean(patient);
  const { wards, loading } = useWards(orgId, open);
  const [wardId, setWardId] = useState("");
  const [bedNumber, setBedNumber] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setWardId("");
    setBedNumber("");
    setReason("");
  }, [open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!orgId || !patient || !wardId) return;
    setSubmitting(true);
    try {
      const admission = await patientService.admitPatient(orgId, patient.id, {
        ward_id: wardId,
        bed_number: bedNumber.trim() || null,
        reason: reason.trim() || null,
        consultation_id: consultationId ?? null,
      });
      toast.success(`${patient.name} admitted`);
      onAdmitted(admission);
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to admit the patient. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Admit patient"
      header={patient?.name}
      isOpen={open}
      onClose={onClose}
      className="max-w-xl"
      headerClassName={MODAL_HEADER}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <WardField id="admit-ward" wards={wards} loading={loading} value={wardId} onChange={setWardId} />
        <div>
          <FieldLabel htmlFor="admit-bed">Bed number (optional)</FieldLabel>
          <Input
            id="admit-bed"
            maxLength={50}
            placeholder="e.g. B4"
            value={bedNumber}
            onChange={(e) => setBedNumber(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel htmlFor="admit-reason">Reason for admission</FieldLabel>
          <Textarea
            id="admit-reason"
            rows={3}
            placeholder="e.g. Observation after severe dehydration"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className={SECONDARY_BUTTON}>
            Cancel
          </button>
          <button type="submit" disabled={submitting || !wardId} className={PRIMARY_BUTTON}>
            {submitting ? "Admitting…" : "Admit patient"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

const patientNameOf = (admission: Admission | null) =>
  admission ? `${admission.patient?.first_name ?? ""} ${admission.patient?.last_name ?? ""}`.trim() : "";

export function MoveWardModal({
  orgId,
  admission,
  onClose,
  onMoved,
}: {
  orgId: string | null | undefined;
  admission: Admission | null;
  onClose: () => void;
  onMoved: (admission: Admission) => void;
}) {
  const open = Boolean(admission);
  const { wards, loading } = useWards(orgId, open);
  const [wardId, setWardId] = useState("");
  const [bedNumber, setBedNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!admission) return;
    setWardId(admission.ward_id);
    setBedNumber(admission.bed_number ?? "");
  }, [admission]);

  const unchanged =
    wardId === admission?.ward_id && bedNumber.trim() === (admission?.bed_number ?? "");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!orgId || !admission || !wardId) return;
    setSubmitting(true);
    try {
      const updated = await admissionService.changeWard(orgId, admission.id, {
        ward_id: wardId,
        bed_number: bedNumber.trim() || null,
      });
      toast.success(`Moved to ${updated.ward?.name ?? "the new ward"}`);
      onMoved(updated);
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to move the patient. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Move ward"
      header={
        admission
          ? `${patientNameOf(admission)} · currently ${admission.ward?.name ?? "—"}${
              admission.bed_number ? `, bed ${admission.bed_number}` : ""
            }`
          : undefined
      }
      isOpen={open}
      onClose={onClose}
      className="max-w-xl"
      headerClassName={MODAL_HEADER}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <WardField
          id="move-ward"
          wards={wards}
          loading={loading}
          value={wardId}
          onChange={setWardId}
          currentWardId={admission?.ward_id}
        />
        <div>
          <FieldLabel htmlFor="move-bed">Bed number (optional)</FieldLabel>
          <Input
            id="move-bed"
            maxLength={50}
            placeholder="e.g. B4"
            value={bedNumber}
            onChange={(e) => setBedNumber(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className={SECONDARY_BUTTON}>
            Cancel
          </button>
          <button type="submit" disabled={submitting || !wardId || unchanged} className={PRIMARY_BUTTON}>
            {submitting ? "Moving…" : "Move patient"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function DischargeModal({
  orgId,
  admission,
  onClose,
  onDischarged,
}: {
  orgId: string | null | undefined;
  admission: Admission | null;
  onClose: () => void;
  onDischarged: (admission: Admission) => void;
}) {
  const open = Boolean(admission);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setNotes("");
  }, [open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!orgId || !admission) return;
    setSubmitting(true);
    try {
      const updated = await admissionService.discharge(orgId, admission.id, {
        discharge_notes: notes.trim() || null,
      });
      toast.success(`${patientNameOf(admission) || "Patient"} discharged`);
      onDischarged(updated);
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to discharge the patient. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Discharge patient"
      header={
        admission
          ? `${patientNameOf(admission)} · ${admission.ward?.name ?? "—"}${
              admission.bed_number ? `, bed ${admission.bed_number}` : ""
            }`
          : undefined
      }
      isOpen={open}
      onClose={onClose}
      className="max-w-xl"
      headerClassName={MODAL_HEADER}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <p className="text-sm text-gray-600">
          This closes the admission and frees the bed. It can&apos;t be undone — the patient
          would need to be admitted again.
        </p>
        <div>
          <FieldLabel htmlFor="discharge-notes">Discharge notes (optional)</FieldLabel>
          <Textarea
            id="discharge-notes"
            rows={4}
            placeholder="Condition at discharge, follow-up instructions…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className={SECONDARY_BUTTON}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {submitting ? "Discharging…" : "Discharge"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
