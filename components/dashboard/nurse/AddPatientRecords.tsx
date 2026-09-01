"use client";

import { useState, ChangeEvent } from "react";
import { ChevronRight } from "lucide-react";
import Modal from "@components/Modal";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useAuth } from "@context/AuthContext";
import { PatientCreatePayload, patientService } from "@services/api";
import {
  getTodayDateInputValue,
  isValidPatientDateOfBirth,
} from "@utils/patientAge";
import {
  hasRequiredHmoDetails,
  type CoverageType,
} from "@utils/patientCoverage";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

type FormState = {
  patientId: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  bloodGroup: string;
  email: string;
  phone: string;
  allergies: string;
  pastMedicalHistory: string;
  familyMedicalHistory: string;
  symptoms: string;
  currentMedications: string;
  immunizations: string;
  lifestyleInfo: string;
  enrolleeType: string;
  hmoProvider: string;
  hmoPlan: string;
  hmoNumber: string;
  policyStartDate: string;
  policyExpiryDate: string;
};

const emptyForm: FormState = {
  patientId: "",
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  maritalStatus: "",
  bloodGroup: "",
  email: "",
  phone: "",
  allergies: "",
  pastMedicalHistory: "",
  familyMedicalHistory: "",
  symptoms: "",
  currentMedications: "",
  immunizations: "",
  lifestyleInfo: "",
  enrolleeType: "",
  hmoProvider: "",
  hmoPlan: "",
  hmoNumber: "",
  policyStartDate: "",
  policyExpiryDate: "",
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


export default function AddNewPatientRecordModal({
  isOpen,
  onClose,
  onCreated,
}: Props) {
  const { activeWorkspace } = useAuth();
   const [formData, setFormData] = useState<FormState>(emptyForm);
   const [coverageType, setCoverageType] = useState<CoverageType | "">("");
   const [submitting, setSubmitting] = useState(false);

   // handle input changes
   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
     const { name, value } = e.target;
     setFormData(prev => ({ ...prev, [name]: value }));
    };

   const handleSubmit = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.dob ||
      !formData.gender ||
      !formData.email ||
      !formData.phone
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

      if (
        coverageType === "hmo" &&
        !hasRequiredHmoDetails({
          hmo_provider: formData.hmoProvider,
          hmo_plan: formData.hmoPlan,
          hmo_number: formData.hmoNumber,
        })
      ) {
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
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          dob: formData.dob,
          gender: formData.gender as PatientCreatePayload["gender"],
          email: formData.email.trim().toLowerCase(),
          phone_number: formData.phone.trim(),
        };
  
        const optionalPayload: Partial<PatientCreatePayload> = {};
  
        if (formData.maritalStatus.trim()) {
          optionalPayload.marital_status =
            formData.maritalStatus as NonNullable<PatientCreatePayload["marital_status"]>;
        }
  
        const optionalFields: Array<[keyof Omit<PatientCreatePayload, "first_name" | "last_name" | "dob" | "gender" | "email" | "phone_number" | "marital_status">, string]> = [
          ["blood_group", formData.bloodGroup],
          ["allergies", formData.allergies],
          ["past_medical_history", formData.pastMedicalHistory],
          ["family_medical_history", formData.familyMedicalHistory],
          ["symptoms", formData.symptoms],
          ["current_medications", formData.currentMedications],
          ["immunizations", formData.immunizations],
          ["lifestyle_info", formData.lifestyleInfo],
        ];

        if (coverageType === "hmo") {
          optionalFields.push(
            ["enrollee_type", formData.enrolleeType],
            ["hmo_provider", formData.hmoProvider],
            ["hmo_plan", formData.hmoPlan],
            ["hmo_number", formData.hmoNumber],
            ["policy_start_date", formData.policyStartDate],
            ["policy_expiry_date", formData.policyExpiryDate],
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
  

  return (
    <Modal
      title="Add New Patient Record"
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-6xl"
      headerClassName="bg-[#003C36]"
    >
      <div className="w-full space-y-6 py-2 font-sans md:space-y-8 md:py-4">
          <section className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm space-y-6">

            {/* STEP 1 */}
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#003C36]">
                  Step 1 of 3
                </p>
                <h3 className="text-sm md:text-base font-semibold text-gray-900">
                  Personal Information
                </h3>
                <p className="text-xs text-gray-500">
                  Basic demographic and contact data for patient creation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Patient ID</label>
                  <input
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    placeholder="Patient ID (optional)"
                    className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-500">First Name</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter First Name"
                    className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Last Name</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter Last Name"
                    className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    max={getTodayDateInputValue()}
                    required
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
                  />
                </div>

                <div className="space-y-1 relative">
                  <label className="text-xs text-gray-500">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full h-10 rounded-full border border-gray-200 px-4 pr-10 text-xs md:text-sm text-gray-400 outline-none appearance-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronRight className="w-4 h-4 absolute right-4 top-10 -translate-y-1/2 rotate-[90deg]  text-gray-400 pointer-events-none" />
                </div>

                <div className="space-y-1 relative">
                  <label className="text-xs text-gray-500">Marital Status</label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="w-full h-10 rounded-full border border-gray-200 px-4 pr-10 text-xs md:text-sm text-gray-400 outline-none appearance-none"
                  >
                    <option value="">Select Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                  <ChevronRight className="w-4 h-4 absolute right-4 top-10 -translate-y-1/2 rotate-[90deg]  text-gray-400 pointer-events-none" />
                </div>

                <div className="space-y-1 relative">
                  <label className="text-xs text-gray-500">Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full h-10 rounded-full border border-gray-200 px-4 pr-10 text-xs md:text-sm text-gray-400 outline-none appearance-none"
                  >
                    <option value="">Select Blood Group</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>O+</option>
                    <option>O-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                  <ChevronRight className="w-4 h-4 absolute right-4 top-10 -translate-y-1/2 rotate-[90deg]  text-gray-400 pointer-events-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Email Address</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter Email Address"
                    className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Phone Number</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234 801 234 5678"
                    className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#003C36]">
                  Step 2 of 3
                </p>
                <h3 className="text-sm md:text-base font-semibold text-gray-900">
                  Medical Information
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[
                  ["allergies", "Enter Allergies"],
                  ["pastMedicalHistory", "Enter Past Medical History"],
                  ["familyMedicalHistory", "Enter Family Medical History"],
                  ["symptoms", "Enter Symptoms / Observations"],
                  ["currentMedications", "Enter Current Medications"],
                  ["immunizations", "Enter Immunizations"],
                ].map(([name, placeholder]) => (
                  <div key={name} className="space-y-1">
                    <label className="text-xs text-gray-500">{placeholder.split(" e.g")[0]}</label>
                    <textarea
                      name={name}
                      value={formData[name as keyof FormState]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full min-h-[80px] rounded-xl border border-gray-200 px-4 py-3 text-xs md:text-sm outline-none resize-none"
                    />
                  </div>
                ))}

                <div className="space-y-1 lg:col-span-2">
                  <label className="text-xs text-gray-500">Lifestyle Info</label>
                  <textarea
                    name="lifestyleInfo"
                    value={formData.lifestyleInfo}
                    onChange={handleChange}
                    placeholder="Non smoker, occassional alcohol consumption"
                    className="w-full min-h-[80px] rounded-xl border border-gray-200 px-4 py-3 text-xs md:text-sm outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#003C36]">
                  Step 3 of 3
                </p>
                <h3 className="text-sm md:text-base font-semibold text-gray-900">
                  Payment Coverage
                </h3>
                <p className="text-xs text-gray-500">
                  Choose HMO/Insurance to add policy details, or Self-pay to continue without them.
                </p>
              </div>

              <fieldset>
                <legend className="sr-only">Coverage type</legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(["hmo", "self_pay"] as const).map((option) => (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors motion-reduce:transition-none ${coverageType === option ? "border-[#006B5F] bg-emerald-50 text-[#003C36]" : "border-gray-200 text-gray-700"}`}
                    >
                      <input
                        required
                        type="radio"
                        name="nurse-coverage-type"
                        value={option}
                        checked={coverageType === option}
                        onChange={() => {
                          setCoverageType(option);
                          if (option === "self_pay") {
                            setFormData((current) => ({
                              ...current,
                              enrolleeType: "",
                              hmoProvider: "",
                              hmoPlan: "",
                              hmoNumber: "",
                              policyStartDate: "",
                              policyExpiryDate: "",
                            }));
                          }
                        }}
                      />
                      {option === "hmo" ? "HMO / Insurance" : "Self-pay"}
                    </label>
                  ))}
                </div>
              </fieldset>

              {coverageType === "hmo" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  ["enrolleeType", "Select Enrollee Type", ["Primary", "Dependent"]],
                  ["hmoProvider", "Select HMO Provider", ["AXA", "Hygeia"]],
                  ["hmoPlan", "Select Plan", ["Basic", "Premium"]],
                ].map(([name, label, options]) => (
                  <div key={name as string} className="space-y-1 relative">
                    <label className="text-xs text-gray-500">{label}</label>
                    <select
                      name={name as string} 
                      value={formData[name as keyof FormState]}
                      onChange={handleChange}
                      required={name === "hmoProvider" || name === "hmoPlan"}
                      className="w-full h-10 rounded-full border border-gray-200 px-4 pr-10 text-xs md:text-sm text-gray-400 outline-none appearance-none"
                    >
                      <option value="">Select</option>
                      {(options as string[]).map((opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <ChevronRight className="w-4 h-4 absolute right-4 top-10 -translate-y-1/2 rotate-[90deg]  text-gray-400 pointer-events-none" />
                  </div>
                ))}

                <div className="space-y-1">
                  <label className="text-xs text-gray-500">HMO ID / Enrollee Number</label>
                  <input
                    name="hmoNumber"
                    required
                    value={formData.hmoNumber}
                    onChange={handleChange}
                    placeholder="Enter HMO ID / Enrollee Number"
                    className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Policy Start Date (Optional)</label>
                  <input
                    type="date"
                    name="policyStartDate"
                    value={formData.policyStartDate}
                    onChange={handleChange}
                    className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Policy Expiry Date (Optional)</label>
                  <input
                    type="date"
                    name="policyExpiryDate"
                    value={formData.policyExpiryDate}
                    onChange={handleChange}
                    className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
                  />
                </div>
              </div>
              )}

              {/* ACTIONS */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
                <button
                  onClick={onClose}
                  type="button"
                  className="rounded-full border border-gray-200 px-4 py-2 text-xs md:text-sm text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  type="button"
                  className="rounded-full bg-[#006B5F] text-white px-4 py-2 text-xs md:text-sm font-medium transition-colors hover:bg-[#005249] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8A8] focus-visible:ring-offset-2 motion-reduce:transition-none disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create patient records"}
                </button>
              </div>
            </div>
          </section>
        </div>
    </Modal>
  );
}
