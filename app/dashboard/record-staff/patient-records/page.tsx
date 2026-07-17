"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, Plus, RotateCcw, Save } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "@components/Modal";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import { useAuth } from "@context/AuthContext";
import { patientService, type PatientCreatePayload } from "@services/api";
import {
  hasRequiredHmoDetails,
  omitHmoDetails,
  type CoverageType,
} from "@utils/patientCoverage";
import {
  getTodayDateInputValue,
  isValidPatientDateOfBirth,
} from "@utils/patientAge";
import {
  mapRecordStaffPatient,
  statusClassName,
  type RecordStaffPatientRow,
} from "../patientDisplay";

const initialForm: PatientCreatePayload = {
  first_name: "",
  last_name: "",
  dob: "",
  gender: "Male",
  marital_status: null,
  blood_group: null,
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

const genderOptions: PatientCreatePayload["gender"][] = ["Male", "Female", "Other"];
const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];
const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const enrolleeTypeOptions = ["Principal", "Dependent", "Corporate", "Private"];
const hmoProviderOptions = ["NHIA", "Reliance HMO", "Hygeia HMO", "AXA Mansard"];
const hmoPlanOptions = ["Basic", "Standard", "Premium", "Executive"];

const medicalFields: Array<[keyof PatientCreatePayload, string, string]> = [
  ["allergies", "Allergies", "Enter Allergies"],
  ["past_medical_history", "Past Medical History", "Enter Past Medical History"],
  ["family_medical_history", "Family Medical History", "Enter Family Medical History"],
  ["symptoms", "Symptoms / Observations", "Enter Symptoms / Observations"],
  ["current_medications", "Current Medications", "Enter Current Medications"],
  ["immunizations", "Immunizations", "Enter Immunizations"],
  ["lifestyle_info", "Lifestyle Info", "Non-smoker, occasional alcohol......"],
];

const FieldLabel = ({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) => (
  <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-slate-600">
    {children}
  </label>
);

const asOptional = (value: string) => value.trim() || null;

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError(error)) return fallback;

  const responseData = error.response?.data as
    | { detail?: string; message?: string }
    | undefined;

  return responseData?.detail || responseData?.message || fallback;
};

export default function RecordStaffPatientRecordsPage() {
  const { activeWorkspace, hydrated } = useAuth();
  const [form, setForm] = useState<PatientCreatePayload>(initialForm);
  const [coverageType, setCoverageType] = useState<CoverageType | "">("");
  const [patients, setPatients] = useState<RecordStaffPatientRow[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  const fetchPatients = useCallback(async () => {
    if (!activeWorkspace?.id) {
      setPatients([]);
      setLoadingPatients(false);
      return;
    }

    try {
      setLoadingPatients(true);
      setError("");
      const data = await patientService.getPatients(activeWorkspace.id);
      const patientList = Array.isArray(data) ? data : [];
      setPatients(patientList.map(mapRecordStaffPatient));
    } catch (fetchError) {
      console.error("Failed to load record staff patients", fetchError);
      setError("Unable to load patient records. Please try again.");
      setPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  }, [activeWorkspace?.id]);

  useEffect(() => {
    if (!hydrated) return;
    void fetchPatients();
  }, [fetchPatients, hydrated]);

  const updateField = (
    field: keyof PatientCreatePayload,
    value: string | null,
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const resetForm = () => {
    setForm(initialForm);
    setCoverageType("");
    setError("");
  };

  const closeModal = () => {
    if (submitting) return;
    resetForm();
    setIsModalOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeWorkspace?.id) {
      toast.error("No active organization selected");
      return;
    }

    if (!coverageType) {
      setError("Select HMO/Insurance or Self-pay before creating the patient record.");
      return;
    }

    if (!isValidPatientDateOfBirth(form.dob)) {
      setError("Enter a valid date of birth that is not in the future.");
      return;
    }

    if (coverageType === "hmo" && !hasRequiredHmoDetails(form)) {
      setError("HMO provider, plan, and enrollee number are required for HMO patients.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const payload = coverageType === "self_pay" ? omitHmoDetails(form) : form;
      await patientService.createPatient(activeWorkspace.id, payload);
      toast.success("Patient record created successfully");
      resetForm();
      setIsModalOpen(false);
      await fetchPatients();
    } catch (submitError) {
      const message = getApiErrorMessage(
        submitError,
        "Failed to create patient record",
      );
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="dashboard-page-title text-[#111827]">Patient Records</h1>
          <p className="mt-2 text-sm text-slate-500">
            View onboarded patients and add new patient records for this organization.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#003C36] px-5 py-3 text-sm font-semibold text-white hover:bg-[#002E29]"
        >
          <Plus size={16} />
          Add New Patient Record
        </button>
      </section>

      {!isModalOpen && error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-[#111827]">Patient Records</h2>
          <p className="mt-1 text-sm text-slate-500">
            Patients created in this organization and awaiting nurse review.
          </p>
        </div>

        <ResponsiveTableRegion label="Record Staff patient records">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-[#F5F7FA] text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th scope="col" className="min-w-[190px] bg-[#F5F7FA] px-5 py-3 font-semibold">Patient</th>
                <th className="px-5 py-3 font-semibold">Patient ID</th>
                <th className="px-5 py-3 font-semibold">Gender</th>
                <th className="px-5 py-3 font-semibold">Department</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingPatients && (
                <tr>
                  <td className="px-5 py-8 text-center text-slate-500" colSpan={6}>
                    Loading patient records...
                  </td>
                </tr>
              )}

              {!loadingPatients && patients.length === 0 && (
                <tr>
                  <td className="px-5 py-8 text-center text-slate-500" colSpan={6}>
                    No patient records found yet.
                  </td>
                </tr>
              )}

              {!loadingPatients &&
                patients.map((patient) => (
                  <tr key={patient.id} className="border-t border-slate-100">
                    <td className="bg-white px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700">
                          {patient.initials || "NA"}
                        </span>
                        <div>
                          <p className="font-medium text-[#111827]">{patient.name}</p>
                          <p className="text-xs text-slate-500">{patient.dateOfBirth}</p>
                        </div>
                      </div>
                    </td>
                    <td className="break-all px-5 py-4 font-mono text-xs text-slate-500">
                      {patient.id}
                    </td>
                    <td className="px-5 py-4 text-slate-700">{patient.gender}</td>
                    <td className="px-5 py-4 text-slate-700">{patient.ward}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(
                          patient.status,
                        )}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {patient.id ? (
                        <Link
                          href={`/dashboard/record-staff/patient/${patient.id}`}
                          aria-label={`View ${patient.name}`}
                          className="inline-flex text-[#0088CC] hover:text-[#006EA6]"
                        >
                          <Eye size={17} />
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-400">Unavailable</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </ResponsiveTableRegion>
      </section>

      <Modal
        title="Add New Patient Record"
        isOpen={isModalOpen}
        onClose={closeModal}
        className="w-full max-w-6xl"
        headerClassName="bg-[#003C36]"
      >
        {error && (
          <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="border-b border-slate-100 pb-8">
            <p className="text-sm font-semibold text-[#003C36]">Step 1 of 3</p>
            <h2 className="mt-1 text-2xl font-bold text-[#111827]">
              Personal Information
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Basic demographic and contact data for patient creation.
            </p>

            <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <FieldLabel>First Name</FieldLabel>
                <input
                  required
                  value={form.first_name}
                  onChange={(event) => updateField("first_name", event.target.value)}
                  placeholder="Enter First Name"
                  className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003C36]"
                />
              </div>
              <div>
                <FieldLabel>Last Name</FieldLabel>
                <input
                  required
                  value={form.last_name}
                  onChange={(event) => updateField("last_name", event.target.value)}
                  placeholder="Enter Last Name"
                  className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003C36]"
                />
              </div>
              <div>
                <FieldLabel>Date of Birth</FieldLabel>
                <input
                  required
                  type="date"
                  max={getTodayDateInputValue()}
                  value={form.dob}
                  onChange={(event) => updateField("dob", event.target.value)}
                  className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003C36]"
                />
              </div>
              <div>
                <FieldLabel>Gender</FieldLabel>
                <select
                  required
                  value={form.gender}
                  onChange={(event) =>
                    updateField(
                      "gender",
                      event.target.value as PatientCreatePayload["gender"],
                    )
                  }
                  className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003C36]"
                >
                  {genderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Marital Status</FieldLabel>
                <select
                  value={form.marital_status ?? ""}
                  onChange={(event) =>
                    updateField("marital_status", asOptional(event.target.value))
                  }
                  className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003C36]"
                >
                  <option value="">Select Marital Status</option>
                  {maritalStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Blood Group</FieldLabel>
                <select
                  value={form.blood_group ?? ""}
                  onChange={(event) =>
                    updateField("blood_group", asOptional(event.target.value))
                  }
                  className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003C36]"
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroupOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Email Address</FieldLabel>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="Enter Email Address"
                  className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003C36]"
                />
              </div>
              <div>
                <FieldLabel>Phone Number</FieldLabel>
                <input
                  required
                  value={form.phone_number}
                  onChange={(event) => updateField("phone_number", event.target.value)}
                  placeholder="+234 -"
                  className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003C36]"
                />
              </div>
            </div>
          </section>

          <section className="border-b border-slate-100 pb-8">
            <p className="text-sm font-semibold text-[#003C36]">Step 2 of 3</p>
            <h2 className="mt-1 text-2xl font-bold text-[#111827]">
              Medical Information
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Patient background, observations, medication and immunization notes.
            </p>

            <div className="mt-7 grid gap-5 lg:grid-cols-2">
              {medicalFields.map(([field, label, placeholder]) => (
                <div key={field}>
                  <FieldLabel>{label}</FieldLabel>
                  <textarea
                    value={(form[field] as string | null) ?? ""}
                    onChange={(event) => updateField(field, event.target.value)}
                    placeholder={placeholder}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003C36]"
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="text-sm font-semibold text-[#003C36]">Step 3 of 3</p>
            <h2 className="mt-1 text-2xl font-bold text-[#111827]">
              Payment Coverage
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Choose how this patient will pay. HMO details are only needed for insured patients.
            </p>

            <fieldset className="mt-7">
              <legend className="text-sm font-semibold text-slate-700">Coverage type</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {(["hmo", "self_pay"] as const).map((option) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors motion-reduce:transition-none ${coverageType === option ? "border-[#003C36] bg-emerald-50 text-[#003C36]" : "border-slate-200 text-slate-700"}`}
                  >
                    <input
                      type="radio"
                      name="record-staff-coverage-type"
                      value={option}
                      checked={coverageType === option}
                      onChange={() => {
                        setCoverageType(option);
                        setError("");
                        if (option === "self_pay") {
                          setForm((current) => omitHmoDetails(current));
                        }
                      }}
                      required
                    />
                    {option === "hmo" ? "HMO / Insurance" : "Self-pay"}
                  </label>
                ))}
              </div>
            </fieldset>

            {coverageType === "hmo" && (
            <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <FieldLabel htmlFor="record-enrollee-type">Enrollee Type</FieldLabel>
                <select
                  id="record-enrollee-type"
                  value={form.enrollee_type ?? ""}
                  onChange={(event) =>
                    updateField("enrollee_type", asOptional(event.target.value))
                  }
                  className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003C36]"
                >
                  <option value="">Select Enrollee Type</option>
                  {enrolleeTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="record-hmo-provider">HMO Provider</FieldLabel>
                <select
                  id="record-hmo-provider"
                  required
                  value={form.hmo_provider ?? ""}
                  onChange={(event) =>
                    updateField("hmo_provider", asOptional(event.target.value))
                  }
                  className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003C36]"
                >
                  <option value="">Select HMO Provider</option>
                  {hmoProviderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="record-hmo-plan">HMO Plan / Coverage</FieldLabel>
                <select
                  id="record-hmo-plan"
                  required
                  value={form.hmo_plan ?? ""}
                  onChange={(event) =>
                    updateField("hmo_plan", asOptional(event.target.value))
                  }
                  className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003C36]"
                >
                  <option value="">Select Plan</option>
                  {hmoPlanOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="record-hmo-number">HMO ID / Enrollee Number</FieldLabel>
                <input
                  id="record-hmo-number"
                  required
                  value={form.hmo_number ?? ""}
                  onChange={(event) => updateField("hmo_number", event.target.value)}
                  placeholder="Enter HMO ID / Enrollee Number"
                  className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003C36]"
                />
              </div>
              <div>
                <FieldLabel htmlFor="record-policy-start">Policy Start Date (Optional)</FieldLabel>
                <input
                  id="record-policy-start"
                  type="date"
                  value={form.policy_start_date ?? ""}
                  onChange={(event) =>
                    updateField("policy_start_date", event.target.value)
                  }
                  className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003C36]"
                />
              </div>
              <div>
                <FieldLabel htmlFor="record-policy-expiry">Policy Expiry Date (Optional)</FieldLabel>
                <input
                  id="record-policy-expiry"
                  type="date"
                  value={form.policy_expiry_date ?? ""}
                  onChange={(event) =>
                    updateField("policy_expiry_date", event.target.value)
                  }
                  className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003C36]"
                />
              </div>
            </div>
            )}
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeModal}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-8 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              <RotateCcw size={16} />
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#003C36] px-8 py-3 text-sm font-semibold text-white hover:bg-[#002E29] disabled:opacity-60"
            >
              <Save size={16} />
              {submitting ? "Creating..." : "Create patient records"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
