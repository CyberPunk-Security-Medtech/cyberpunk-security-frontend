'use client';

import { useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from "react";
import Modal from "@components/Modal";
import { FieldLabel, Input, Select, Textarea } from "@components/Field";
import { patientService, type PatientCreatePayload } from "@services/api";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@context/AuthContext";
import {
  hasRequiredHmoDetails,
  type CoverageType,
} from "@utils/patientCoverage";
import {
  getTodayDateInputValue,
  isValidPatientDateOfBirth,
} from "@utils/patientAge";

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
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

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

const MEDICAL_FIELDS: Array<[keyof FormState, string, string]> = [
  ["symptoms", "Symptoms", "Presenting complaints"],
  ["allergies", "Allergies", "e.g. Penicillin"],
  ["current_medications", "Current medications", "Drug, dose and frequency"],
  ["past_medical_history", "Past medical history", "Previous conditions or surgeries"],
  ["family_medical_history", "Family medical history", "e.g. Hypertension, diabetes"],
  ["immunizations", "Immunizations", "Vaccines received"],
  ["lifestyle_info", "Lifestyle", "Smoking, alcohol, exercise, diet"],
];

const SECTION_TITLE = "text-sm font-semibold uppercase tracking-wide text-gray-500";

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

export default function AddPatientModal({ isOpen, onClose, onCreated }: AddPatientModalProps) {
  const { activeWorkspace } = useAuth();
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [coverageType, setCoverageType] = useState<CoverageType | "">("");
  const [submitting, setSubmitting] = useState(false);

  // handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
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

    if (!isValidPatientDateOfBirth(formData.dob)) {
      toast.error("Enter a valid date of birth that is not in the future.");
      return;
    }

    if (!coverageType) {
      toast.error("Select HMO/Insurance or Self-pay before submitting.");
      return;
    }

    if (coverageType === "hmo" && !hasRequiredHmoDetails(formData)) {
      toast.error("HMO provider, plan, and enrollee number are required for HMO patients.");
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
      ];

      if (coverageType === "hmo") {
        optionalFields.push(
          ["enrollee_type", formData.enrollee_type],
          ["hmo_provider", formData.hmo_provider],
          ["hmo_plan", formData.hmo_plan],
          ["hmo_number", formData.hmo_number],
          ["policy_start_date", formData.policy_start_date],
          ["policy_expiry_date", formData.policy_expiry_date],
        );
      }

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
      onCreated?.();
      onClose();
      setFormData(emptyForm);
      setCoverageType("");
    } catch (error) {
      console.error("Failed to create patient:", error);
      if (isAxiosError(error)) {
        const backendMessage = extractApiErrorMessage(error.response?.data);
        const message = backendMessage ?? "Failed to create patient";
        toast.error(message);
      } else {
        toast.error("Failed to create patient");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const textField = (
    name: keyof FormState,
    label: string,
    props: InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <div>
      <FieldLabel htmlFor={`add-patient-${name}`}>{label}</FieldLabel>
      <Input
        id={`add-patient-${name}`}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        {...props}
      />
    </div>
  );

  return (
    <Modal
      title="Add patient"
      header="Fields marked * are required"
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-4xl"
      headerClassName="bg-[var(--dashboard-accent,#1A2380)]"
    >
      <form className="space-y-8" onSubmit={handleSubmit}>
        <section className="space-y-4">
          <h4 className={SECTION_TITLE}>Personal details</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {textField("first_name", "First name *", { required: true, autoComplete: "off" })}
            {textField("last_name", "Last name *", { required: true, autoComplete: "off" })}
            {textField("dob", "Date of birth *", {
              required: true,
              type: "date",
              max: getTodayDateInputValue(),
            })}
            <div>
              <FieldLabel htmlFor="add-patient-gender">Gender *</FieldLabel>
              <Select id="add-patient-gender" name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </div>
            <div>
              <FieldLabel htmlFor="add-patient-marital_status">Marital status</FieldLabel>
              <Select
                id="add-patient-marital_status"
                name="marital_status"
                value={formData.marital_status}
                onChange={handleChange}
              >
                <option value="">Not specified</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </Select>
            </div>
            <div>
              <FieldLabel htmlFor="add-patient-blood_group">Blood group</FieldLabel>
              <Select
                id="add-patient-blood_group"
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
              >
                <option value="">Unknown</option>
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className={SECTION_TITLE}>Contact</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {textField("email", "Email *", { required: true, type: "email", autoComplete: "off", placeholder: "name@example.com" })}
            {textField("phone_number", "Phone number *", { required: true, type: "tel", inputMode: "tel", placeholder: "e.g. 08012345678" })}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h4 className={SECTION_TITLE}>Medical background</h4>
            <p className="mt-1 text-sm text-gray-500">Optional. You can complete this later from the patient record.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {MEDICAL_FIELDS.map(([name, label, placeholder]) => (
              <div key={name}>
                <FieldLabel htmlFor={`add-patient-${name}`}>{label}</FieldLabel>
                <Textarea
                  id={`add-patient-${name}`}
                  name={name}
                  rows={2}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>
        </section>

        <fieldset className="space-y-4">
          <legend className={SECTION_TITLE}>Payment coverage *</legend>
          <p className="text-sm text-gray-500">
            Choose HMO/Insurance to add policy details, or Self-pay to continue without them.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(["hmo", "self_pay"] as const).map((option) => (
              <label
                key={option}
                className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm font-medium transition-colors motion-reduce:transition-none ${
                  coverageType === option
                    ? "border-[var(--dashboard-accent,#1A2380)] bg-indigo-50 text-[var(--dashboard-accent,#1A2380)]"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="coverage_type"
                  value={option}
                  checked={coverageType === option}
                  className="accent-[var(--dashboard-accent,#1A2380)]"
                  onChange={() => {
                    setCoverageType(option);
                    if (option === "self_pay") {
                      setFormData((current) => ({
                        ...current,
                        enrollee_type: "",
                        hmo_provider: "",
                        hmo_plan: "",
                        hmo_number: "",
                        policy_start_date: "",
                        policy_expiry_date: "",
                      }));
                    }
                  }}
                />
                {option === "hmo" ? "HMO / Insurance" : "Self-pay"}
              </label>
            ))}
          </div>

          {coverageType === "hmo" && (
            <div className="grid grid-cols-1 gap-4 rounded-md border border-gray-200 bg-gray-50/60 p-4 md:grid-cols-2">
              {textField("hmo_provider", "HMO provider *", { required: true, placeholder: "e.g. Avon HMO" })}
              {textField("hmo_plan", "HMO plan *", { required: true })}
              {textField("hmo_number", "Enrollee number *", { required: true })}
              {textField("enrollee_type", "Enrollee type", { placeholder: "e.g. Principal, Dependant" })}
              {textField("policy_start_date", "Policy start date", { type: "date" })}
              {textField("policy_expiry_date", "Policy expiry date", {
                type: "date",
                min: formData.policy_start_date || undefined,
              })}
            </div>
          )}
        </fieldset>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-6 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-[var(--dashboard-accent,#1A2380)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--dashboard-accent-hover,#11185F)] disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Add patient"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
