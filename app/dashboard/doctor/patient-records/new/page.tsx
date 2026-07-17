"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import { patientService, type PatientCreatePayload } from "@services/api";
import { useAuth } from "@context/AuthContext";
import {
  hasRequiredHmoDetails,
  omitHmoDetails,
  type CoverageType,
} from "@utils/patientCoverage";
import {
  getTodayDateInputValue,
  isValidPatientDateOfBirth,
} from "@utils/patientAge";

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

export default function AddNewPatientRecord() {
  const router = useRouter();
  const { activeWorkspace, hydrated } = useAuth();

  const [form, setForm] = useState<PatientCreatePayload>(initialForm);
  const [coverageType, setCoverageType] = useState<CoverageType | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!hydrated) return;
    if (activeWorkspace?.id) return;
    toast.error("No active workspace selected. Please select a workspace first.");
    router.replace("/auth/workspace-select");
  }, [activeWorkspace?.id, hydrated, router]);

  const update = (key: keyof PatientCreatePayload, value: string | null) => {
    setForm((prev) => ({ ...prev, [key]: value as never }));
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeWorkspace?.id) {
      toast.error("No active workspace selected");
      return;
    }

    if (!coverageType) {
      setFormError("Select HMO/Insurance or Self-pay before submitting.");
      return;
    }

    if (!isValidPatientDateOfBirth(form.dob)) {
      setFormError("Enter a valid date of birth that is not in the future.");
      return;
    }

    if (coverageType === "hmo" && !hasRequiredHmoDetails(form)) {
      setFormError("HMO provider, plan, and enrollee number are required for HMO patients.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = coverageType === "self_pay" ? omitHmoDetails(form) : form;
      await patientService.createPatient(activeWorkspace.id, payload);
      toast.success("Patient created successfully");
      router.push("/dashboard/doctor/patient-records");
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Failed to create patient";
      setFormError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6 md:space-y-8 font-sans py-2 md:py-4">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:relative">
        <Link
          href="/dashboard/doctor/patient-records"
          className="inline-flex items-center gap-2 rounded-full bg-[#ECEEFD] text-[#1A2380] text-xs md:text-sm font-medium px-4 py-2 hover:bg-[#E0E4FA] transition"
        >
          <ChevronLeft size={16} />
          Back to Patients List
        </Link>
        <h2 className="text-sm md:text-base font-semibold text-gray-900 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
          Add New Patient Record
        </h2>
        <div className="hidden sm:block w-[170px]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm space-y-6"
      >
        {formError && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}
        <section className="space-y-4">
          <h3 className="text-sm md:text-base font-semibold text-gray-900">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
              placeholder="First Name"
              value={form.first_name}
              onChange={(e) => update("first_name", e.target.value)}
              required
            />
            <input
              className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
              placeholder="Last Name"
              value={form.last_name}
              onChange={(e) => update("last_name", e.target.value)}
              required
            />
            <label className="space-y-1 text-xs text-gray-500 md:text-sm">
              <span>Date of Birth</span>
              <input
                type="date"
                max={getTodayDateInputValue()}
                className="h-10 w-full rounded-full border border-gray-200 px-4 text-xs text-gray-900 outline-none md:text-sm"
                value={form.dob}
                onChange={(e) => update("dob", e.target.value)}
                required
              />
            </label>
            <select
              className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
              value={form.gender}
              onChange={(e) => update("gender", e.target.value)}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select
              className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
              value={form.marital_status ?? ""}
              onChange={(e) => update("marital_status", e.target.value || null)}
            >
              <option value="">Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
            <input
              className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
              placeholder="Blood Group (e.g O+)"
              value={form.blood_group ?? ""}
              onChange={(e) => update("blood_group", e.target.value || null)}
            />
            <input
              type="email"
              className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
            <input
              className="w-full h-10 rounded-full border border-gray-200 px-4 text-xs md:text-sm outline-none"
              placeholder="Phone Number"
              value={form.phone_number}
              onChange={(e) => update("phone_number", e.target.value)}
              required
            />
          </div>
        </section>

        <section className="space-y-4 border-t border-gray-100 pt-6">
          <h3 className="text-sm md:text-base font-semibold text-gray-900">
            Medical Information
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <textarea
              className="w-full min-h-[80px] rounded-xl border border-gray-200 px-4 py-3 text-xs md:text-sm outline-none resize-none"
              placeholder="Allergies"
              value={form.allergies ?? ""}
              onChange={(e) => update("allergies", e.target.value)}
            />
            <textarea
              className="w-full min-h-[80px] rounded-xl border border-gray-200 px-4 py-3 text-xs md:text-sm outline-none resize-none"
              placeholder="Past Medical History"
              value={form.past_medical_history ?? ""}
              onChange={(e) => update("past_medical_history", e.target.value)}
            />
            <textarea
              className="w-full min-h-[80px] rounded-xl border border-gray-200 px-4 py-3 text-xs md:text-sm outline-none resize-none"
              placeholder="Family Medical History"
              value={form.family_medical_history ?? ""}
              onChange={(e) => update("family_medical_history", e.target.value)}
            />
            <textarea
              className="w-full min-h-[80px] rounded-xl border border-gray-200 px-4 py-3 text-xs md:text-sm outline-none resize-none"
              placeholder="Symptoms / Observations"
              value={form.symptoms ?? ""}
              onChange={(e) => update("symptoms", e.target.value)}
            />
            <textarea
              className="w-full min-h-[80px] rounded-xl border border-gray-200 px-4 py-3 text-xs md:text-sm outline-none resize-none"
              placeholder="Current Medications"
              value={form.current_medications ?? ""}
              onChange={(e) => update("current_medications", e.target.value)}
            />
            <textarea
              className="w-full min-h-[80px] rounded-xl border border-gray-200 px-4 py-3 text-xs md:text-sm outline-none resize-none"
              placeholder="Immunizations"
              value={form.immunizations ?? ""}
              onChange={(e) => update("immunizations", e.target.value)}
            />
          </div>
          <textarea
            className="w-full min-h-[80px] rounded-xl border border-gray-200 px-4 py-3 text-xs md:text-sm outline-none resize-none"
            placeholder="Lifestyle Info"
            value={form.lifestyle_info ?? ""}
            onChange={(e) => update("lifestyle_info", e.target.value)}
          />
        </section>

        <section className="space-y-4 border-t border-gray-100 pt-6">
          <h3 className="text-sm md:text-base font-semibold text-gray-900">
            Payment Coverage
          </h3>
          <p className="text-xs text-gray-500 md:text-sm">
            Choose HMO/Insurance to add policy details, or Self-pay to continue without them.
          </p>
          <fieldset>
            <legend className="sr-only">Coverage type</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(["hmo", "self_pay"] as const).map((option) => (
                <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors motion-reduce:transition-none ${coverageType === option ? "border-[#1A2380] bg-indigo-50 text-[#1A2380]" : "border-gray-200 text-gray-700"}`}>
                  <input
                    required
                    type="radio"
                    name="standalone-coverage-type"
                    value={option}
                    checked={coverageType === option}
                    onChange={() => {
                      setCoverageType(option);
                      setFormError("");
                      if (option === "self_pay") setForm((current) => omitHmoDetails(current));
                    }}
                  />
                  {option === "hmo" ? "HMO / Insurance" : "Self-pay"}
                </label>
              ))}
            </div>
          </fieldset>

          {coverageType === "hmo" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <label className="space-y-2 text-xs font-medium text-gray-700 md:text-sm">
                <span>Enrollee Type (Optional)</span>
                <input className="h-10 w-full rounded-full border border-gray-200 px-4 outline-none" value={form.enrollee_type ?? ""} onChange={(e) => update("enrollee_type", e.target.value)} />
              </label>
              <label className="space-y-2 text-xs font-medium text-gray-700 md:text-sm">
                <span>HMO Provider</span>
                <input required className="h-10 w-full rounded-full border border-gray-200 px-4 outline-none" value={form.hmo_provider ?? ""} onChange={(e) => update("hmo_provider", e.target.value)} />
              </label>
              <label className="space-y-2 text-xs font-medium text-gray-700 md:text-sm">
                <span>HMO Plan</span>
                <input required className="h-10 w-full rounded-full border border-gray-200 px-4 outline-none" value={form.hmo_plan ?? ""} onChange={(e) => update("hmo_plan", e.target.value)} />
              </label>
              <label className="space-y-2 text-xs font-medium text-gray-700 md:text-sm">
                <span>HMO ID / Enrollee Number</span>
                <input required className="h-10 w-full rounded-full border border-gray-200 px-4 outline-none" value={form.hmo_number ?? ""} onChange={(e) => update("hmo_number", e.target.value)} />
              </label>
              <label className="space-y-2 text-xs font-medium text-gray-700 md:text-sm">
                <span>Policy Start Date (Optional)</span>
                <input type="date" className="h-10 w-full rounded-full border border-gray-200 px-4 outline-none" value={form.policy_start_date ?? ""} onChange={(e) => update("policy_start_date", e.target.value)} />
              </label>
              <label className="space-y-2 text-xs font-medium text-gray-700 md:text-sm">
                <span>Policy Expiry Date (Optional)</span>
                <input type="date" className="h-10 w-full rounded-full border border-gray-200 px-4 outline-none" value={form.policy_expiry_date ?? ""} onChange={(e) => update("policy_expiry_date", e.target.value)} />
              </label>
            </div>
          )}
        </section>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            type="button"
            className="rounded-full border border-gray-200 px-4 py-2 text-xs md:text-sm text-gray-600 hover:bg-gray-50 transition"
            onClick={() => router.push("/dashboard/doctor/patient-records")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-[#1A2380] text-white px-4 py-2 text-xs md:text-sm font-medium hover:bg-[#111B66] transition disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create patient records"}
          </button>
        </div>
      </form>
    </div>
  );
}
