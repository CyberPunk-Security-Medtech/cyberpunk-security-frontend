'use client';

import { useState, type ChangeEvent } from "react";
import Modal from "@components/Modal"; 
import { patientService, type PatientCreatePayload } from "@services/api";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@context/AuthContext";

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormState = {
  first_name: string;
  last_name: string;
  dob: string;
  gender: string;
  marital_status: string;
  blood_group: string;
  email: string;
  phone_number: string;
  allergies: string;
  past_medical_history: string;
  family_medical_history: string;
  symptoms: string;
  current_medications: string;
  immunizations: string;
  lifestyle_info: string;
  enrollee_type: string;
  hmo_provider: string;
  hmo_plan: string;
  hmo_number: string;
  policy_start_date: string;
  policy_expiry_date: string;
};

const emptyForm: FormState = {
  first_name: "",
  last_name: "",
  dob: "",
  gender: "",
  marital_status: "",
  blood_group: "",
  email: "",
  phone_number: "",
  allergies: "",
  past_medical_history: "",
  family_medical_history: "",
  symptoms: "",
  current_medications: "",
  immunizations: "",
  lifestyle_info: "",
  enrollee_type: "",
  hmo_provider: "",
  hmo_plan: "",
  hmo_number: "",
  policy_start_date: "",
  policy_expiry_date: "",
};

const asOptional = (value: string): string | undefined => {
  const next = value.trim();
  return next.length > 0 ? next : undefined;
};

const resolveWorkspaceIdFromStorage = (): string | null => {
  const raw = localStorage.getItem("activeWorkspace");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as { id?: string };
    return parsed?.id ?? null;
  } catch {
    return null;
  }
};

const extractApiErrorMessage = (responseData: unknown): string | null => {
  if (!responseData) return null;
  if (typeof responseData === "string") return responseData;
  if (typeof responseData !== "object") return null;

  const data = responseData as Record<string, unknown>;
  const directMessage = data.detail ?? data.message;
  if (typeof directMessage === "string" && directMessage.trim().length > 0) {
    return directMessage;
  }

  const errorMap = data.errors as Record<string, unknown> | undefined;
  if (!errorMap) return null;

  const details = Object.entries(errorMap)
    .map(([field, value]) => `${field}: ${String(value)}`)
    .join(" | ");

  return details.length > 0 ? details : null;
};

export default function AddPatientModal({ isOpen, onClose}: AddPatientModalProps) {
  const { activeWorkspace } = useAuth();
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.dob ||
      !formData.gender ||
      !formData.email ||
      !formData.phone_number
    ) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (!["Male", "Female", "Other"].includes(formData.gender)) {
      toast.error("Please select a valid gender.");
      return;
    }

    try {
      const orgId = activeWorkspace?.id ?? resolveWorkspaceIdFromStorage();

      if (!orgId) {
        toast.error("No active workspace found.");
        return;
      }

      const payload: PatientCreatePayload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        dob: formData.dob,
        gender: formData.gender as PatientCreatePayload["gender"],
        email: formData.email.trim().toLowerCase(),
        phone_number: formData.phone_number.trim(),
      };

      const optionalPayload: Partial<PatientCreatePayload> = {};

      if (formData.marital_status.trim()) {
        optionalPayload.marital_status =
          formData.marital_status as NonNullable<PatientCreatePayload["marital_status"]>;
      }

      const optionalFields: Array<[keyof Omit<PatientCreatePayload, "first_name" | "last_name" | "dob" | "gender" | "email" | "phone_number" | "marital_status">, string]> = [
        ["blood_group", formData.blood_group],
        ["allergies", formData.allergies],
        ["past_medical_history", formData.past_medical_history],
        ["family_medical_history", formData.family_medical_history],
        ["symptoms", formData.symptoms],
        ["current_medications", formData.current_medications],
        ["immunizations", formData.immunizations],
        ["lifestyle_info", formData.lifestyle_info],
        ["enrollee_type", formData.enrollee_type],
        ["hmo_provider", formData.hmo_provider],
        ["hmo_plan", formData.hmo_plan],
        ["hmo_number", formData.hmo_number],
        ["policy_start_date", formData.policy_start_date],
        ["policy_expiry_date", formData.policy_expiry_date],
      ];

      for (const [field, rawValue] of optionalFields) {
        const nextValue = asOptional(rawValue);
        if (nextValue !== undefined) {
          optionalPayload[field] = nextValue;
        }
      }

      setSubmitting(true);
      await patientService.createPatient(orgId, {
        ...payload,
        ...optionalPayload,
      });
      toast.success("Patient created successfully");
      onClose();
      setFormData(emptyForm);
    } catch (error) {
      console.error("Failed to create patient:", error);
      if (isAxiosError(error)) {
        const backendMessage = extractApiErrorMessage(error.response?.data);
        toast.error(backendMessage ?? "Failed to create patient");
      } else {
        toast.error("Failed to create patient");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* <button
        className="bg-[#1A2380] text-white px-4 py-2 rounded-md"
        onClick={() => setIsOpen(true)}
      >
        Add Patient
      </button> */}

      <Modal
        title="Patient Details"
        isOpen={isOpen}
        onClose={onClose}
        className="w-full max-w-4xl"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
              className="border rounded-md px-3 py-2 w-full"
            />
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              className="border rounded-md px-3 py-2 w-full"
            />
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 w-full"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 w-full"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select
              name="marital_status"
              value={formData.marital_status}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 w-full"
            >
              <option value="">Marital Status (Optional)</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
            <input
              type="text"
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
              placeholder="Blood Group"
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded-md px-3 py-2 w-full"
            required
          />
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border rounded-md px-3 py-2 w-full"
            required
          />

          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="Allergies"
            className="border rounded-md px-3 py-2 w-full"
          />

          <textarea
            name="past_medical_history"
            value={formData.past_medical_history}
            onChange={handleChange}
            placeholder="Past Medical History"
            className="border rounded-md px-3 py-2 w-full"
          />

          <textarea
            name="family_medical_history"
            value={formData.family_medical_history}
            onChange={handleChange}
            placeholder="Family Medical History"
            className="border rounded-md px-3 py-2 w-full"
          />

          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="Symptoms"
            className="border rounded-md px-3 py-2 w-full"
          />

          <textarea
            name="current_medications"
            value={formData.current_medications}
            onChange={handleChange}
            placeholder="Current Medications"
            className="border rounded-md px-3 py-2 w-full"
          />

          <textarea
            name="immunizations"
            value={formData.immunizations}
            onChange={handleChange}
            placeholder="Immunizations"
            className="border rounded-md px-3 py-2 w-full"
          />

          <textarea
            name="lifestyle_info"
            value={formData.lifestyle_info}
            onChange={handleChange}
            placeholder="Lifestyle Information"
            className="border rounded-md px-3 py-2 w-full"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="enrollee_type"
              value={formData.enrollee_type}
              onChange={handleChange}
              placeholder="Enrollee Type"
              className="border rounded-md px-3 py-2 w-full"
            />
            <input
              type="text"
              name="hmo_provider"
              value={formData.hmo_provider}
              onChange={handleChange}
              placeholder="HMO Provider"
              className="border rounded-md px-3 py-2 w-full"
            />
            <input
              type="text"
              name="hmo_plan"
              value={formData.hmo_plan}
              onChange={handleChange}
              placeholder="HMO Plan"
              className="border rounded-md px-3 py-2 w-full"
            />
            <input
              type="text"
              name="hmo_number"
              value={formData.hmo_number}
              onChange={handleChange}
              placeholder="HMO Number"
              className="border rounded-md px-3 py-2 w-full"
            />
            <input
              type="date"
              name="policy_start_date"
              value={formData.policy_start_date}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 w-full"
            />
            <input
              type="date"
              name="policy_expiry_date"
              value={formData.policy_expiry_date}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#1A2380] text-white px-4 py-2 rounded-md mt-4 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </Modal>
    </>
  );
}
