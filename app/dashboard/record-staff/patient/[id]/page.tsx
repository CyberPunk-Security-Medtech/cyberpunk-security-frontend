"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FileText,
  HeartPulse,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { consultationService, patientService } from "@services/api";
import { formatPatientDate } from "../../patientDisplay";

type ConsultationStatus =
  | "Pending"
  | "In Progress"
  | "Completed"
  | "Cancelled";

const consultationStatuses: ConsultationStatus[] = [
  "In Progress",
  "Pending",
  "Completed",
  "Cancelled",
];

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const formatValue = (value?: string | number | null) => {
  if (value === 0) return "0";
  return value ? String(value) : "Not recorded";
};

const getFullName = (patient: any) => {
  const fullName = `${patient?.first_name ?? ""} ${patient?.last_name ?? ""}`.trim();
  return fullName || "Patient";
};

const getInitials = (patient: any) =>
  `${patient?.first_name?.[0] ?? ""}${patient?.last_name?.[0] ?? ""}`.toUpperCase() ||
  "NA";

const getStatusClassName = (status?: string | null) => {
  const normalized = String(status ?? "").toLowerCase();
  if (normalized === "completed") return "bg-emerald-50 text-emerald-700";
  if (normalized === "in progress") return "bg-blue-50 text-blue-700";
  if (normalized === "cancelled") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
};

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div className="rounded-xl border border-slate-100 bg-white p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="mt-2 break-words text-sm font-medium text-slate-800">
      {formatValue(value)}
    </p>
  </div>
);

const SectionHeader = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="mb-4 flex items-start gap-3">
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-[#003C36]">
      <Icon size={18} />
    </span>
    <div>
      <h2 className="font-semibold text-[#111827]">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  </div>
);

export default function RecordStaffPatientDetailsPage() {
  const params = useParams<{ id: string }>();
  const patientId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { activeWorkspace, hydrated } = useAuth();

  const [patient, setPatient] = useState<any | null>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPatientDetails = useCallback(async () => {
    if (!activeWorkspace?.id || !patientId) {
      setPatient(null);
      setConsultations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [patientResult, ...consultationResults] = await Promise.all([
        patientService.getPatient(activeWorkspace.id, patientId),
        ...consultationStatuses.map((status_filter) =>
          consultationService.listConsultations(activeWorkspace.id, {
            status_filter,
          }),
        ),
      ]);

      const mergedConsultations = consultationResults.flatMap((result) =>
        Array.isArray(result) ? result : [],
      );
      const uniqueConsultations = Array.from(
        new Map(mergedConsultations.map((consultation) => [consultation.id, consultation])).values(),
      );
      const patientConsultations = uniqueConsultations
        .filter((consultation: any) => consultation?.patient_id === patientId)
        .sort((first: any, second: any) => {
          const firstTime = new Date(first.updated_at ?? first.created_at ?? 0).getTime();
          const secondTime = new Date(second.updated_at ?? second.created_at ?? 0).getTime();
          return secondTime - firstTime;
        });

      setPatient(patientResult);
      setConsultations(patientConsultations);
    } catch (fetchError) {
      console.error("Failed to load record staff patient details", fetchError);
      setError("Unable to load patient details. Please try again.");
      setPatient(null);
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  }, [activeWorkspace?.id, patientId]);

  useEffect(() => {
    if (!hydrated) return;
    void fetchPatientDetails();
  }, [fetchPatientDetails, hydrated]);

  const patientName = useMemo(() => getFullName(patient), [patient]);
  const initials = useMemo(() => getInitials(patient), [patient]);

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 text-sm text-slate-500 shadow-sm">
        Loading patient details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/record-staff/patient-records"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#003C36] hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Patient Records
        </Link>
        <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Link
        href="/dashboard/record-staff/patient-records"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#003C36] hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Patient Records
      </Link>

      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-teal-50 text-lg font-bold text-[#003C36]">
              {initials}
            </span>
            <div>
              <h1 className="dashboard-page-title text-[#111827]">{patientName}</h1>
              <p className="mt-1 break-all text-sm text-slate-500">
                Patient Code: {formatValue(patient?.patient_code ?? patient?.id)}
              </p>
            </div>
          </div>
          <span className="w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
            Record Staff View
          </span>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={UserRound}
          title="Patient Biodata"
          description="Basic demographic and contact information captured during onboarding."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DetailItem label="Gender" value={patient?.gender} />
          <DetailItem label="Date of Birth" value={formatPatientDate(patient?.dob ?? patient?.date_of_birth)} />
          <DetailItem label="Marital Status" value={patient?.marital_status} />
          <DetailItem label="Blood Group" value={patient?.blood_group} />
          <DetailItem label="Email" value={patient?.email} />
          <DetailItem label="Phone Number" value={patient?.phone_number ?? patient?.phone} />
          <DetailItem label="Created" value={formatDateTime(patient?.created_at)} />
          <DetailItem label="Last Updated" value={formatDateTime(patient?.updated_at)} />
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={HeartPulse}
          title="Medical Information"
          description="Read-only background information recorded for this patient."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <DetailItem label="Symptoms / Observations" value={patient?.symptoms} />
          <DetailItem label="Allergies" value={patient?.allergies} />
          <DetailItem label="Past Medical History" value={patient?.past_medical_history} />
          <DetailItem label="Family Medical History" value={patient?.family_medical_history} />
          <DetailItem label="Current Medications" value={patient?.current_medications} />
          <DetailItem label="Immunizations" value={patient?.immunizations} />
          <DetailItem label="Lifestyle Info" value={patient?.lifestyle_info} />
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={ShieldCheck}
          title="HMO & Insurance"
          description="Insurance information available from the patient record."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <DetailItem label="Enrollee Type" value={patient?.enrollee_type} />
          <DetailItem label="HMO Provider" value={patient?.hmo_provider} />
          <DetailItem label="HMO Plan / Coverage" value={patient?.hmo_plan} />
          <DetailItem label="HMO Number" value={patient?.hmo_number} />
          <DetailItem label="Policy Start Date" value={formatPatientDate(patient?.policy_start_date)} />
          <DetailItem label="Policy Expiry Date" value={formatPatientDate(patient?.policy_expiry_date)} />
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={ClipboardList}
          title="Consultation History"
          description="All consultations recorded for this patient in this organization."
        />

        {consultations.length === 0 ? (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-500">
            No consultation has been recorded for this patient yet.
          </div>
        ) : (
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <article
                key={consultation.id}
                className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h3 className="font-semibold text-[#111827]">
                      {consultation.reason_for_visit || "Consultation"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {consultation.department?.name || "Department not recorded"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClassName(
                        consultation.status,
                      )}`}
                    >
                      {consultation.status || "Pending"}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {consultation.priority || "Routine"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-sm md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      <CalendarDays size={14} />
                      Created
                    </p>
                    <p className="mt-2 text-slate-700">
                      {formatDateTime(consultation.created_at)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      <CalendarDays size={14} />
                      Updated
                    </p>
                    <p className="mt-2 text-slate-700">
                      {formatDateTime(consultation.updated_at)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      <HeartPulse size={14} />
                      Vitals
                    </p>
                    <p className="mt-2 text-slate-700">
                      {formatValue(consultation.vitals)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      <FileText size={14} />
                      Consultation ID
                    </p>
                    <p className="mt-2 break-all text-slate-700">
                      {formatValue(consultation.id)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-slate-100 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Clinical Notes
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                      {formatValue(consultation.clinical_notes ?? consultation.notes)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-100 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Contact Snapshot
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-slate-700">
                      <p className="flex items-center gap-2">
                        <Mail size={14} />
                        {formatValue(patient?.email)}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone size={14} />
                        {formatValue(patient?.phone_number ?? patient?.phone)}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
