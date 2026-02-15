"use client";

import React, { useState } from "react";
import Modal from "@components/Modal";
import { FieldLabel, Input, Textarea } from "@components/Field";
import { Plus } from "lucide-react";
import { consultationService } from "@services/api";
import Button from "@components/Button";
import { toast } from "react-toastify";

interface PatientPrescriptionModalProps {
  open: boolean;
  onClose: () => void;
  consultationId: string | null;
  orgId: string | null;
  onCreated?: () => Promise<void> | void;
}

export function PatientPrescriptionModal({
  open,
  onClose,
  consultationId,
  orgId,
  onCreated,
}: PatientPrescriptionModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    medication_name: "",
    dosage: "",
    frequency: "",
    interval: "",
    duration: "",
    durationType: "Days",
    route: "",
    start_date: "",
    instructions: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!consultationId || !orgId) return;
    setLoading(true);
    try {
      await consultationService.createPrescription(orgId, consultationId, {
        medication_name: formData.medication_name,
        dosage: formData.dosage,
        frequency: [formData.frequency, formData.interval].filter(Boolean).join(" ").trim(),
        duration: `${formData.duration} ${formData.durationType}`.trim(),
        route: formData.route || null,
        start_date: formData.start_date || null,
        instructions: formData.instructions || null,
      });
      onClose();
      if (onCreated) await onCreated();
      setFormData({
        medication_name: "",
        dosage: "",
        frequency: "",
        interval: "",
        duration: "",
        durationType: "Days",
        route: "",
        start_date: "",
        instructions: "",
      });
      toast.success("Prescription created");
    } catch (e) {
      console.error(e);
      toast.error("Failed to create prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Create New Prescription" isOpen={open} onClose={onClose}>
      <div className="relative flex flex-col max-h-[95vh]">
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div>
              <FieldLabel htmlFor="medication_name">Medication Name</FieldLabel>
              <Input
                id="medication_name"
                placeholder="Search Medication Name"
                type="text"
                value={formData.medication_name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <FieldLabel htmlFor="dosage">Dosage</FieldLabel>
              <Input
                id="dosage"
                placeholder="Enter Dosage (500mg)"
                type="text"
                value={formData.dosage}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="frequency">Frequency</FieldLabel>
                <select
                  id="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#00B8A8]"
                >
                  <option value="">Select Frequency</option>
                  <option value="Once">Once</option>
                  <option value="Twice">Twice</option>
                  <option value="Thrice">Thrice</option>
                </select>
              </div>

              <div>
                <FieldLabel htmlFor="interval">Interval</FieldLabel>
                <Input
                  id="interval"
                  placeholder="Daily"
                  value={formData.interval}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="duration">Duration</FieldLabel>
                <Input
                  id="duration"
                  placeholder="Enter Duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <FieldLabel htmlFor="durationType">Duration Type</FieldLabel>
                <select
                  id="durationType"
                  value={formData.durationType}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#00B8A8]"
                >
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Month">Month</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="route">Route</FieldLabel>
                <select
                  id="route"
                  value={formData.route}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#00B8A8]"
                >
                  <option value="">Select Route</option>
                  <option value="Oral">Oral</option>
                  <option value="Injection">Injection</option>
                  <option value="Topical">Topical</option>
                </select>
              </div>

              <div>
                <FieldLabel htmlFor="start_date">Start Date</FieldLabel>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="instructions">Special Instructions</FieldLabel>
              <Textarea
                id="instructions"
                rows={4}
                placeholder="Write Special Instructions"
                value={formData.instructions}
                onChange={handleChange}
              />
            </div>

            <div>
              <button
                type="button"
                className="flex items-center justify-center gap-2 w-full md:w-auto border border-[#1A2380] text-[#1A2380] font-medium rounded-full px-5 py-2.5 text-sm hover:bg-[#F4F5FF]"
              >
                <Plus size={16} />
                Add Another Medication
              </button>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3 -mx-6 -mb-6 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <Button
                type="submit"
                disabled={loading || !consultationId || !orgId}
                className="rounded-full bg-[#1A2380] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#00B8A8] transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Save & Send to Pharmacist"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
