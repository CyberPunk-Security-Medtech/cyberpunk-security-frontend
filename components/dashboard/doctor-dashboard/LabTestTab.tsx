"use client";

import { useEffect, useState } from "react";
import Modal from "@components/Modal";
import { FieldLabel, Input, Select, Textarea } from "@components/Field";
import { StatusBadge } from "@components/StatusBadge";
import { consultationService, patientService } from "@services/api";
import { useConsultation } from "./ConsultationContext";
import { toast } from "react-toastify";

export default function LabTestTab() {
  const [open, setOpen] = useState(false);
  const [tests, setTests] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    orgId,
    patientId,
    currentConsultationId,
    isConsultationActive,
  } = useConsultation();

  const [form, setForm] = useState({
    test_name: "",
    test_category: "",
    priority: "Routine",
    clinical_notes: "",
  });

  const loadTests = async () => {
    if (!orgId || !patientId) return;
    try {
      const res = await patientService.getPatientLabTests(orgId, patientId);
      setTests(res ?? []);
    } catch (error) {
      console.error("Failed to load lab tests", error);
    }
  };

  useEffect(() => {
    loadTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, patientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId || !currentConsultationId) return;

    setSubmitting(true);
    try {
      await consultationService.orderLabTest(orgId, currentConsultationId, {
        test_name: form.test_name,
        test_category: form.test_category || null,
        priority: form.priority,
        clinical_notes: form.clinical_notes || null,
      });
      toast.success("Lab test ordered");
      setOpen(false);
      setForm({
        test_name: "",
        test_category: "",
        priority: "Routine",
        clinical_notes: "",
      });
      await loadTests();
    } catch (error) {
      console.error(error);
      toast.error("Failed to order test");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-brand-navy">Lab Test</h3>
        <button
          disabled={!isConsultationActive || !currentConsultationId}
          onClick={() => setOpen(true)}
          className="rounded-md bg-brand-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-[#141a66] disabled:opacity-50"
        >
          + Order Lab Test
        </button>
      </div>
      <div className="space-y-3">
        {tests.length === 0 && (
          <div className="rounded-xl border px-4 py-4 text-sm text-gray-500">
            No lab tests recorded.
          </div>
        )}
        {tests.map((t: any) => (
          <div key={t.id} className="flex items-center justify-between rounded-xl border px-4 py-4">
            <div className="min-w-0">
              <p className="truncate font-medium text-brand-navy">{t.test_name}</p>
              <p className="text-xs text-gray-500">{t.test_category || "Uncategorized"}</p>
            </div>
            <div className="flex items-center gap-3">
              {t.priority && (
                <span className="rounded-full bg-[#FFEBEC] px-2.5 py-1 text-xs font-medium text-[#CC1820]">
                  {t.priority}
                </span>
              )}
              <StatusBadge status={String(t.status).toLowerCase() === "completed" ? "Completed" : "Pending"} />
            </div>
          </div>
        ))}
      </div>
      <Modal title="Order New Test" isOpen={open} onClose={() => setOpen(false)}>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <FieldLabel>Test Name</FieldLabel>
            <Input
              placeholder="Enter Test Name"
              value={form.test_name}
              onChange={(e) => setForm((prev) => ({ ...prev, test_name: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FieldLabel>Test Category</FieldLabel>
              <Input
                placeholder="e.g Hematology"
                value={form.test_category}
                onChange={(e) => setForm((prev) => ({ ...prev, test_category: e.target.value }))}
              />
            </div>
            <div>
              <FieldLabel>Priority</FieldLabel>
              <Select
                value={form.priority}
                onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
              >
                <option>Routine</option>
                <option>Urgent</option>
                <option>Stat</option>
              </Select>
            </div>
          </div>
          <div>
            <FieldLabel>Clinical Notes / Reason</FieldLabel>
            <Textarea
              rows={5}
              placeholder="Write Special Instructions"
              value={form.clinical_notes}
              onChange={(e) => setForm((prev) => ({ ...prev, clinical_notes: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="rounded-full border px-6 py-2.5 text-sm font-medium">
              Cancel
            </button>
            <button
              disabled={submitting || !orgId || !currentConsultationId}
              className="rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              type="submit"
            >
              {submitting ? "Submitting..." : "Submit Test Request"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
