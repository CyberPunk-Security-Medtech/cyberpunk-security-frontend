"use client";

import { useState } from "react";
import { consultationService } from "@services/api";
import Modal from "@components/Modal";
import { FieldLabel, Input, Textarea } from "@components/Field";
import Button from "@components/Button";
import { toast } from "react-toastify";

interface DiagnosisModalProps {
  open: boolean;
  onClose: () => void;
  consultationId: string | null;
  orgId: string | null;
  onCreated?: () => Promise<void> | void;
}

export function DiagnosisModal({
  open,
  onClose,
  consultationId,
  orgId,
  onCreated,
}: DiagnosisModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    pdx: "",
    sdx: "",
    obs: "",
  });

  const handleSubmit = async () => {
    if (!consultationId || !orgId) return;
    setLoading(true);
    try {
      await consultationService.addDiagnosis(orgId, consultationId, {
        primary_diagnosis: form.pdx,
        secondary_diagnosis: form.sdx || null,
        symptoms: form.obs || null,
      });
      if (onCreated) await onCreated();
      onClose();
      setForm({ pdx: "", sdx: "", obs: "" });
      toast.success("Diagnosis added");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add diagnosis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Create Diagnosis" isOpen={open} onClose={onClose}>
      <form className="space-y-6">
            <div>
          <FieldLabel htmlFor="obs">Symptoms / Observations</FieldLabel>
          <Textarea
            id="obs"
            rows={6}
            placeholder="Enter Symptoms / Observations..."
            value={form.obs}
            onChange={(e) => setForm({ ...form, obs: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel htmlFor="pdx">Primary Diagnosis</FieldLabel>
          <Input
            id="pdx"
            placeholder="Enter primary diagnosis"
            value={form.pdx}
            onChange={(e) => setForm({ ...form, pdx: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel htmlFor="sdx">Secondary Diagnosis</FieldLabel>
          <Input
            id="sdx"
            placeholder="Enter secondary diagnosis"
            value={form.sdx}
            onChange={(e) => setForm({ ...form, sdx: e.target.value })}
          />
        </div>
    
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border px-6 py-2.5 text-sm font-medium">
            Cancel
          </button>
          <Button
            type="button"
            onSubmitHandler={handleSubmit}
            disabled={loading || !consultationId || !orgId}
            className="rounded-full bg-[#1A2380] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Diagnosis"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
