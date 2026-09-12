"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "react-toastify";
import Button from "@components/Button";
import { useAuth } from "@context/AuthContext";
import {
  patientService,
  type PatientRecord,
  type PatientUpdatePayload,
} from "@services/api";
import { getTodayDateInputValue, isValidPatientDateOfBirth } from "@utils/patientAge";

type PatientEditFormProps = {
  patientId: string;
};

type CoverageType = "hmo" | "self_pay";

type FormField =
  | "first_name"
  | "last_name"
  | "dob"
  | "gender"
  | "marital_status"
  | "blood_group"
  | "email"
  | "phone_number"
  | "allergies"
  | "past_medical_history"
  | "family_medical_history"
  | "symptoms"
  | "current_medications"
  | "immunizations"
  | "lifestyle_info"
  | "enrollee_type"
  | "hmo_provider"
  | "hmo_plan"
  | "hmo_number"
  | "policy_start_date"
  | "policy_expiry_date";

type FormState = Record<FormField, string>;

const nullableFields = [
  "marital_status",
  "blood_group",
  "email",
  "phone_number",
  "allergies",
  "past_medical_history",
  "family_medical_history",
  "symptoms",
  "current_medications",
  "immunizations",
  "lifestyle_info",
  "enrollee_type",
  "hmo_provider",
  "hmo_plan",
  "hmo_number",
  "policy_start_date",
  "policy_expiry_date",
] as const satisfies readonly Exclude<FormField, "first_name" | "last_name" | "dob" | "gender">[];

const hmoFields = [
  "enrollee_type",
  "hmo_provider",
  "hmo_plan",
  "hmo_number",
  "policy_start_date",
  "policy_expiry_date",
] as const satisfies readonly FormField[];

const toDateInputValue = (value?: string | null) => value?.slice(0, 10) ?? "";

const toFormState = (patient: PatientRecord): FormState => ({
  first_name: patient.first_name ?? "",
  last_name: patient.last_name ?? "",
  dob: toDateInputValue(patient.dob ?? patient.date_of_birth),
  gender: patient.gender ?? "",
  marital_status: patient.marital_status ?? "",
  blood_group: patient.blood_group ?? "",
  email: patient.email ?? "",
  phone_number: patient.phone_number ?? "",
  allergies: patient.allergies ?? "",
  past_medical_history: patient.past_medical_history ?? "",
  family_medical_history: patient.family_medical_history ?? "",
  symptoms: patient.symptoms ?? "",
  current_medications: patient.current_medications ?? "",
  immunizations: patient.immunizations ?? "",
  lifestyle_info: patient.lifestyle_info ?? "",
  enrollee_type: patient.enrollee_type ?? "",
  hmo_provider: patient.hmo_provider ?? "",
  hmo_plan: patient.hmo_plan ?? "",
  hmo_number: patient.hmo_number ?? "",
  policy_start_date: toDateInputValue(patient.policy_start_date),
  policy_expiry_date: toDateInputValue(patient.policy_expiry_date),
});

const getCoverageType = (form: FormState): CoverageType =>
  form.hmo_provider || form.hmo_plan || form.hmo_number ? "hmo" : "self_pay";

const getApiErrorMessage = (error: unknown) => {
  if (!isAxiosError(error)) return "Unable to save patient changes. Please try again.";

  const responseData = error.response?.data;
  if (typeof responseData === "object" && responseData !== null) {
    const detail = (responseData as { detail?: unknown; message?: unknown }).detail
      ?? (responseData as { message?: unknown }).message;
    if (typeof detail === "string" && detail.trim()) return detail;
  }

  if (error.response?.status === 403) {
    return "You do not have permission to edit patients in this organization.";
  }
  if (error.response?.status === 404) {
    return "This patient is not available in the selected organization.";
  }
  if (error.response?.status === 422) {
    return "Some patient details are invalid. Review the highlighted information and try again.";
  }

  return "Unable to save patient changes. Please try again.";
};

function FieldLabel({ label, children, optional = false }: { label: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span>
        {label}{optional && <span className="font-normal text-slate-500"> (optional)</span>}
      </span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

const fieldClassName = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#051466] focus:ring-2 focus:ring-[#051466]/20";

export default function PatientEditForm({ patientId }: PatientEditFormProps) {
  const router = useRouter();
  const { activeWorkspace, hydrated } = useAuth();
  const [originalForm, setOriginalForm] = useState<FormState | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [coverageType, setCoverageType] = useState<CoverageType>("self_pay");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadPatient = useCallback(async () => {
    if (!activeWorkspace?.id || !patientId) {
      setError("Select an organization workspace to edit this patient.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const patient = await patientService.getPatient(activeWorkspace.id, patientId);
      const nextForm = toFormState(patient);
      setOriginalForm(nextForm);
      setForm(nextForm);
      setCoverageType(getCoverageType(nextForm));
    } catch (loadError) {
      console.error("Failed to load patient for editing", loadError);
      setError(getApiErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [activeWorkspace?.id, patientId]);

  useEffect(() => {
    if (hydrated) void loadPatient();
  }, [hydrated, loadPatient]);

  const patientName = useMemo(() => {
    if (!form) return "Patient";
    return `${form.first_name} ${form.last_name}`.trim() || "Patient";
  }, [form]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((current) => current ? { ...current, [name]: value } : current);
  };

  const setCoverage = (nextCoverage: CoverageType) => {
    setCoverageType(nextCoverage);
    if (nextCoverage === "self_pay") {
      setForm((current) => current ? {
        ...current,
        enrollee_type: "",
        hmo_provider: "",
        hmo_plan: "",
        hmo_number: "",
        policy_start_date: "",
        policy_expiry_date: "",
      } : current);
    }
  };

  const createPayload = (): PatientUpdatePayload | null => {
    if (!form || !originalForm) return null;

    const firstName = form.first_name.trim();
    const lastName = form.last_name.trim();
    if (!firstName || !lastName) {
      setError("First name and last name are required.");
      return null;
    }
    if (form.dob && !isValidPatientDateOfBirth(form.dob)) {
      setError("Enter a valid date of birth that is not in the future.");
      return null;
    }
    if (form.gender && !["Male", "Female", "Other"].includes(form.gender)) {
      setError("Select a valid gender.");
      return null;
    }
    if (coverageType === "hmo" && (!form.hmo_provider.trim() || !form.hmo_plan.trim() || !form.hmo_number.trim())) {
      setError("HMO provider, plan, and enrollee number are required for an HMO patient.");
      return null;
    }

    const payload: PatientUpdatePayload = {};
    const setIfChanged = <T extends keyof PatientUpdatePayload>(field: T, value: PatientUpdatePayload[T]) => {
      const originalValue = originalForm[field as FormField] ?? "";
      const currentValue = form[field as FormField] ?? "";
      if (originalValue !== currentValue) payload[field] = value;
    };

    setIfChanged("first_name", firstName);
    setIfChanged("last_name", lastName);
    setIfChanged("dob", form.dob || undefined);
    setIfChanged("gender", form.gender ? form.gender as PatientUpdatePayload["gender"] : undefined);

    for (const field of nullableFields) {
      const value = form[field].trim();
      setIfChanged(field, value || null);
    }

    if (coverageType === "self_pay") {
      for (const field of hmoFields) {
        if (originalForm[field] !== "") payload[field] = null;
      }
    }

    return payload;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const payload = createPayload();
    if (!payload) return;
    if (Object.keys(payload).length === 0) {
      toast.info("No changes to save.");
      return;
    }
    if (!activeWorkspace?.id) {
      setError("Select an organization workspace to edit this patient.");
      return;
    }

    setSubmitting(true);
    try {
      await patientService.updatePatient(activeWorkspace.id, patientId, payload);
      toast.success("Patient updated successfully.");
      router.push("/dashboard/admin");
    } catch (submitError) {
      console.error("Failed to update patient", submitError);
      setError(getApiErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Link
        href={`/dashboard/admin/patient/${patientId}`}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-[#051466] hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466]"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        Back to patient record
      </Link>

      <header className="mt-5">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Edit patient</h1>
        <p className="mt-1 text-sm text-slate-600">Update the information recorded for {patientName}.</p>
      </header>

      {loading ? (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm" aria-live="polite">
          Loading patient information...
        </section>
      ) : error && !form ? (
        <section className="mt-6 rounded-2xl border border-red-200 bg-white p-6 shadow-sm" role="alert">
          <p className="text-sm text-red-700">{error}</p>
          <Button className="mt-4" onClick={() => void loadPatient()}>Retry</Button>
        </section>
      ) : form ? (
        <form className="mt-6 space-y-6" onSubmit={handleSubmit} noValidate>
          {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</p>}

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Personal information</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FieldLabel label="First name"><input required name="first_name" value={form.first_name} onChange={handleChange} className={fieldClassName} autoComplete="given-name" /></FieldLabel>
              <FieldLabel label="Last name"><input required name="last_name" value={form.last_name} onChange={handleChange} className={fieldClassName} autoComplete="family-name" /></FieldLabel>
              <FieldLabel label="Date of birth" optional><input type="date" name="dob" max={getTodayDateInputValue()} value={form.dob} onChange={handleChange} className={fieldClassName} /></FieldLabel>
              <FieldLabel label="Gender" optional><select name="gender" value={form.gender} onChange={handleChange} className={fieldClassName}><option value="">Not recorded</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></FieldLabel>
              <FieldLabel label="Marital status" optional><select name="marital_status" value={form.marital_status} onChange={handleChange} className={fieldClassName}><option value="">Not recorded</option><option value="Single">Single</option><option value="Married">Married</option><option value="Divorced">Divorced</option><option value="Widowed">Widowed</option></select></FieldLabel>
              <FieldLabel label="Blood group" optional><select name="blood_group" value={form.blood_group} onChange={handleChange} className={fieldClassName}><option value="">Not recorded</option>{["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bloodGroup) => <option key={bloodGroup} value={bloodGroup}>{bloodGroup}</option>)}</select></FieldLabel>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Contact details</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FieldLabel label="Email address" optional><input type="email" name="email" value={form.email} onChange={handleChange} className={fieldClassName} autoComplete="email" /></FieldLabel>
              <FieldLabel label="Phone number" optional><input type="tel" name="phone_number" value={form.phone_number} onChange={handleChange} className={fieldClassName} autoComplete="tel" /></FieldLabel>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Clinical information</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(["allergies", "past_medical_history", "family_medical_history", "symptoms", "current_medications", "immunizations", "lifestyle_info"] as const).map((field) => (
                <FieldLabel key={field} label={field.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())} optional>
                  <textarea name={field} value={form[field]} onChange={handleChange} className={`${fieldClassName} min-h-24 resize-y`} />
                </FieldLabel>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Coverage information</h2>
            <fieldset className="mt-5">
              <legend className="text-sm font-medium text-slate-700">Coverage type</legend>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium ${coverageType === "hmo" ? "border-[#051466] bg-indigo-50 text-[#051466]" : "border-slate-200 text-slate-700"}`}><input type="radio" name="coverage_type" checked={coverageType === "hmo"} onChange={() => setCoverage("hmo")} />HMO / Insurance</label>
                <label className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium ${coverageType === "self_pay" ? "border-[#051466] bg-indigo-50 text-[#051466]" : "border-slate-200 text-slate-700"}`}><input type="radio" name="coverage_type" checked={coverageType === "self_pay"} onChange={() => setCoverage("self_pay")} />Self-pay</label>
              </div>
            </fieldset>
            {coverageType === "hmo" && <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FieldLabel label="Enrollee type" optional><input name="enrollee_type" value={form.enrollee_type} onChange={handleChange} className={fieldClassName} /></FieldLabel>
              <FieldLabel label="HMO provider"><input required name="hmo_provider" value={form.hmo_provider} onChange={handleChange} className={fieldClassName} /></FieldLabel>
              <FieldLabel label="HMO plan"><input required name="hmo_plan" value={form.hmo_plan} onChange={handleChange} className={fieldClassName} /></FieldLabel>
              <FieldLabel label="HMO number"><input required name="hmo_number" value={form.hmo_number} onChange={handleChange} className={fieldClassName} /></FieldLabel>
              <FieldLabel label="Policy start date" optional><input type="date" name="policy_start_date" value={form.policy_start_date} onChange={handleChange} className={fieldClassName} /></FieldLabel>
              <FieldLabel label="Policy expiry date" optional><input type="date" name="policy_expiry_date" value={form.policy_expiry_date} onChange={handleChange} className={fieldClassName} /></FieldLabel>
            </div>}
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <Link href={`/dashboard/admin/patient/${patientId}`} className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466]">Cancel</Link>
            <Button type="submit" isLoading={submitting} disabled={submitting}><Save size={17} aria-hidden="true" />Save changes</Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
