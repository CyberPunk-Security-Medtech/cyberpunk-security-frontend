"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ShieldPlus, UserRound } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { patientService, type PatientCreatePayload, type PatientListRecord } from "@services/api";
import { resolvePatientAge } from "@utils/patientAge";

type PatientDetailsProps = {
  patientId: string;
};

type PatientDetailRecord = PatientListRecord & Partial<PatientCreatePayload>;

const isPatientDetailRecord = (value: unknown): value is PatientDetailRecord =>
  typeof value === "object" && value !== null;

const displayValue = (value?: string | number | null) => {
  if (value === 0) return "0";
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);
  return "Not recorded";
};

const formatDate = (value?: string | null) => {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(date);
};

function DetailItem({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-2 break-words text-sm font-medium leading-6 text-slate-800">
        {displayValue(value)}
      </dd>
    </div>
  );
}

function DetailsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</dl>
    </section>
  );
}

export default function PatientDetails({ patientId }: PatientDetailsProps) {
  const { activeWorkspace, hydrated } = useAuth();
  const [patient, setPatient] = useState<PatientDetailRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPatient = useCallback(async () => {
    if (!activeWorkspace?.id || !patientId) {
      setPatient(null);
      setError("Select an organization workspace to view this patient.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await patientService.getPatient(activeWorkspace.id, patientId);
      if (!isPatientDetailRecord(result)) {
        throw new Error("The patient record returned an unsupported format.");
      }
      setPatient(result);
    } catch (loadError) {
      console.error("Failed to load admin patient details", loadError);
      setPatient(null);
      setError("Unable to load patient details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [activeWorkspace?.id, patientId]);

  useEffect(() => {
    if (hydrated) void loadPatient();
  }, [hydrated, loadPatient]);

  const patientName = useMemo(() => {
    if (!patient) return "Patient";
    return `${patient.first_name ?? ""} ${patient.last_name ?? ""}`.trim() || "Patient";
  }, [patient]);
  const initials = useMemo(
    () => `${patient?.first_name?.[0] ?? ""}${patient?.last_name?.[0] ?? ""}`.toUpperCase() || "P",
    [patient],
  );
  const age = resolvePatientAge(patient?.age, patient?.dob ?? patient?.date_of_birth);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Link
        href="/dashboard/admin"
        className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-[#051466] hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466]"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        Back to dashboard
      </Link>

      {loading ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm" aria-live="polite">
          Loading patient details...
        </section>
      ) : error ? (
        <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm" role="alert">
          <p className="text-sm text-red-700">{error}</p>
          {activeWorkspace?.id && (
            <button
              type="button"
              onClick={() => void loadPatient()}
              className="mt-4 min-h-10 rounded-lg bg-[#051466] px-4 text-sm font-semibold text-white hover:bg-[#020B44] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466] focus-visible:ring-offset-2"
            >
              Retry
            </button>
          )}
        </section>
      ) : patient ? (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-emerald-50 text-base font-semibold text-emerald-700">
                  {initials}
                </span>
                <div className="min-w-0">
                  <h1 className="truncate text-xl font-semibold text-slate-900 sm:text-2xl">{patientName}</h1>
                  <p className="mt-1 break-all text-sm text-slate-500">Patient ID: {patient.id ?? patientId}</p>
                </div>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <ShieldPlus size={15} aria-hidden="true" />
                Patient record
              </span>
            </div>
          </section>

          <DetailsSection title="Patient information">
            <DetailItem label="Date of birth" value={formatDate(patient.dob ?? patient.date_of_birth)} />
            <DetailItem label="Age" value={age} />
            <DetailItem label="Gender" value={patient.gender} />
            <DetailItem label="Marital status" value={patient.marital_status} />
            <DetailItem label="Blood group" value={patient.blood_group} />
            <DetailItem label="Registered" value={formatDate(patient.created_at)} />
          </DetailsSection>

          <DetailsSection title="Contact details">
            <DetailItem label="Email address" value={patient.email} />
            <DetailItem label="Phone number" value={patient.phone_number} />
            <DetailItem label="Department" value={patient.department} />
          </DetailsSection>

          <DetailsSection title="Clinical information">
            <DetailItem label="Symptoms" value={patient.symptoms} />
            <DetailItem label="Allergies" value={patient.allergies} />
            <DetailItem label="Past medical history" value={patient.past_medical_history} />
            <DetailItem label="Family medical history" value={patient.family_medical_history} />
            <DetailItem label="Current medications" value={patient.current_medications} />
            <DetailItem label="Immunizations" value={patient.immunizations} />
          </DetailsSection>

          <DetailsSection title="Coverage information">
            <DetailItem label="Coverage type" value={patient.enrollee_type ?? "Self-pay"} />
            <DetailItem label="HMO provider" value={patient.hmo_provider} />
            <DetailItem label="HMO plan" value={patient.hmo_plan} />
            <DetailItem label="Enrollee number" value={patient.hmo_number} />
            <DetailItem label="Policy start date" value={formatDate(patient.policy_start_date)} />
            <DetailItem label="Policy expiry date" value={formatDate(patient.policy_expiry_date)} />
          </DetailsSection>

          <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <UserRound size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            Patient editing is unavailable until the server provides a supported patient-update endpoint. The current record is shown read-only.
          </p>
        </>
      ) : null}
    </div>
  );
}
