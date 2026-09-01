"use client";

import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import {
  Loader2,
  Search,
  Send,
  X,
} from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-toastify";
import { hasOnboardingConsentForScopes } from "@components/patient-transfers/consentStorage";
import {
  organizationService,
  patientService,
  referralService,
  type ConsentMethod,
  type OrganizationDirectoryEntry,
  type Referral,
  type ReferralPriority,
  type ShareScope,
} from "@services/api";
import { resolvePatientAge } from "@utils/patientAge";

type TransferPatient = {
  id: string;
  name: string;
  patientCode: string;
  age: string;
  gender: string;
  email: string;
  phone: string;
  condition: string;
};

type TransferForm = {
  patientId: string;
  recipientOrgId: string;
  reason: string;
  clinicalSummary: string;
  priority: ReferralPriority;
  scopes: ShareScope[];
  consentMethod: Extract<ConsentMethod, "email_link" | "in_person_attestation">;
  patientEmail: string;
  attestationConfirmed: boolean;
};

const supportedScopes: Array<{ value: ShareScope; label: string; helper: string }> = [
  {
    value: "demographics",
    label: "Patient biodata",
    helper: "Name, date of birth, gender and contact details",
  },
  {
    value: "history",
    label: "Medical history",
    helper: "Past medical history, allergies and related background",
  },
  {
    value: "consultations",
    label: "Consultation notes",
    helper: "Visits, diagnoses and clinician notes",
  },
  {
    value: "lab_results",
    label: "Lab results",
    helper: "Lab test orders and results",
  },
  {
    value: "prescriptions",
    label: "Prescriptions",
    helper: "Medication history and prescriptions",
  },
  {
    value: "immunizations",
    label: "Immunizations",
    helper: "Vaccination records",
  },
];

const initialForm: TransferForm = {
  patientId: "",
  recipientOrgId: "",
  reason: "",
  clinicalSummary: "",
  priority: "routine",
  scopes: ["demographics", "history"],
  consentMethod: "email_link",
  patientEmail: "",
  attestationConfirmed: false,
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "PT";

const normalizeIdentifier = (value: unknown) => {
  if (typeof value !== "string") return "";
  const trimmedValue = value.trim();
  if (!trimmedValue || trimmedValue.toLowerCase() === "none") return "";
  return trimmedValue;
};

const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
    if (error.response?.data?.message) return error.response.data.message;
  }

  return "Something went wrong. Please try again.";
};

export default function PatientTransferDashboard({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const { activeWorkspace, hydrated } = useAuth();
  const [patients, setPatients] = useState<TransferPatient[]>([]);
  const [organizations, setOrganizations] = useState<OrganizationDirectoryEntry[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [form, setForm] = useState<TransferForm>(initialForm);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const orgId = activeWorkspace?.id;

  const selectedPatient = useMemo(
    () => patients.find((patient) => patient.id === form.patientId) ?? null,
    [form.patientId, patients],
  );
  const hasPriorConsent = useMemo(
    () =>
      form.patientId
        ? hasOnboardingConsentForScopes(form.patientId, form.scopes)
        : false,
    [form.patientId, form.scopes],
  );

  const filteredPatients = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return patients;

    return patients.filter((patient) =>
      [patient.name, patient.patientCode, patient.condition]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [patients, searchTerm]);

  const pendingCount = referrals.filter((referral) => referral.status === "sent").length;
  const completedCount = referrals.filter(
    (referral) => referral.status === "completed",
  ).length;

  useEffect(() => {
    if (!hydrated || !orgId) return;

    const loadTransferData = async () => {
      setLoading(true);

      try {
        const [patientRows, directoryRows, referralRows] = await Promise.all([
          patientService.getPatients(orgId),
          organizationService.getDirectory({ accepts_referrals: true }),
          referralService.listReferrals(orgId, { direction: "outgoing" }),
        ]);

        const mappedPatients = (patientRows as any[]).map((patient) => {
          const name = `${patient.first_name ?? ""} ${patient.last_name ?? ""}`.trim();
          const patientCode =
            normalizeIdentifier(patient.hmo_number) ||
            normalizeIdentifier(patient.nin) ||
            patient.id.slice(0, 8);

          return {
            id: patient.id,
            name: name || "Unnamed patient",
            patientCode,
            age: String(resolvePatientAge(patient.age, patient.dob ?? patient.date_of_birth)),
            gender: patient.gender ?? "N/A",
            email: patient.email ?? "",
            phone: patient.phone_number ?? "",
            condition: patient.symptoms || patient.past_medical_history || "Not specified",
          };
        });

        setPatients(mappedPatients);
        setOrganizations(directoryRows.filter((org) => org.id !== orgId));
        setReferrals(referralRows);
      } catch (loadError) {
        toast.error(getErrorMessage(loadError));
      } finally {
        setLoading(false);
      }
    };

    loadTransferData();
  }, [hydrated, orgId]);

  const openTransferModal = (patient?: TransferPatient) => {
    setForm({
      ...initialForm,
      patientId: patient?.id ?? "",
      patientEmail: patient?.email ?? "",
    });
    setOpenModal(true);
  };

  const updateForm = <Key extends keyof TransferForm>(
    key: Key,
    value: TransferForm[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleScope = (scope: ShareScope) => {
    setForm((current) => {
      const hasScope = current.scopes.includes(scope);
      const scopes = hasScope
        ? current.scopes.filter((item) => item !== scope)
        : [...current.scopes, scope];

      return { ...current, scopes };
    });
  };

  const validateForm = () => {
    if (!orgId) return "Please select a workspace before sending a referral.";
    if (!form.patientId) return "Please select a patient.";
    if (!form.recipientOrgId) return "Please select a receiving hospital.";
    if (!form.reason.trim()) return "Please enter the reason for referral.";
    if (form.scopes.length === 0) return "Please choose at least one record to share.";

    if (hasPriorConsent) return "";

    if (form.consentMethod === "email_link" && !form.patientEmail.trim()) {
      return "Patient email is required for email-link consent.";
    }

    if (
      form.consentMethod === "in_person_attestation" &&
      !form.attestationConfirmed
    ) {
      return "Please confirm the patient gave consent in person.";
    }

    return "";
  };

  const submitTransfer = async () => {
    const validationMessage = validateForm();
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    setSubmitting(true);

    try {
      const referral = await referralService.createReferral(orgId!, {
        patient_id: form.patientId,
        recipient_org_id: form.recipientOrgId,
        reason: form.reason.trim(),
        clinical_summary: form.clinicalSummary.trim() || null,
        priority: form.priority,
        scopes: form.scopes,
        consent_method: hasPriorConsent
          ? "in_person_attestation"
          : form.consentMethod,
        patient_email:
          !hasPriorConsent && form.consentMethod === "email_link"
            ? form.patientEmail.trim()
            : null,
      });

      setReferrals((current) => [referral, ...current]);
      setOpenModal(false);
      toast.success(
        hasPriorConsent
          ? "Referral sent using the patient's onboarding consent."
          : form.consentMethod === "email_link"
          ? "Referral sent. The patient will receive an email link to approve record sharing."
          : "Referral sent. In-person consent was attested and record access can become active immediately.",
      );
    } catch (submitError) {
      toast.error(getErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  if (hydrated && !orgId) {
    return (
      <main className="min-h-screen bg-[#f7fbfb] px-6 py-8">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          Please select a workspace before managing patient transfers.
        </div>
      </main>
    );
  }

  return (
    <main
      className={
        embedded
          ? "min-h-full bg-[#f7fbfb] px-4 py-6 md:px-8"
          : "-mx-4 -my-4 min-h-full bg-[#f7fbfb] px-4 py-8 md:-mx-12 md:px-12"
      }
    >
      <div className="mb-6">
        <div>
          <p className="text-sm font-medium text-[#19a89a]">Interoperability</p>
          <h1 className="text-3xl font-bold text-[#211783]">Patient Transfers</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Refer patients to another hospital and request access to the records
            needed for continuity of care.
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Outgoing Referrals" value={String(referrals.length)} />
        <StatCard title="Pending Response" value={String(pendingCount)} />
        <StatCard title="Completed Transfers" value={String(completedCount)} />
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex w-full items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 md:max-w-md">
          <Search size={18} className="text-gray-400" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search patient by name or ID"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        <button
          onClick={() => openTransferModal()}
          className="rounded-xl bg-[#24128f] px-5 py-2.5 text-sm font-semibold text-white"
        >
          New Referral
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b border-gray-100 p-4">
          <h2 className="font-semibold text-gray-900">Patient Overview</h2>
          <p className="text-sm text-gray-500">
            Select a patient, choose a receiving hospital, and request consent.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-[#effafa] text-gray-600">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Patient ID</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Clinical Note</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                    Loading patients...
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-t border-gray-100">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8fbf8] text-xs font-semibold text-[#008c83]">
                          {getInitials(patient.name)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <p className="text-xs text-gray-500">{patient.email || patient.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{patient.patientCode}</td>
                    <td className="px-4 py-4 text-gray-600">{patient.age}</td>
                    <td className="px-4 py-4 text-gray-600">{patient.gender}</td>
                    <td className="max-w-xs truncate px-4 py-4 text-gray-600">
                      {patient.condition}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => openTransferModal(patient)}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#19c7b6] px-3 py-2 text-xs font-semibold text-white"
                      >
                        <Send size={14} />
                        Refer Patient
                      </button>
                    </td>
                  </tr>
                ))
              )}

              {!loading && filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {openModal && (
        <TransferRequestModal
          patients={patients}
          organizations={organizations}
          form={form}
          selectedPatient={selectedPatient}
          submitting={submitting}
          hasPriorConsent={hasPriorConsent}
          onClose={() => setOpenModal(false)}
          onSubmit={submitTransfer}
          onUpdate={updateForm}
          onToggleScope={toggleScope}
        />
      )}
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="mt-2 text-3xl font-bold text-[#111827]">{value}</h3>
    </div>
  );
}

function TransferRequestModal({
  patients,
  organizations,
  form,
  selectedPatient,
  submitting,
  hasPriorConsent,
  onClose,
  onSubmit,
  onUpdate,
  onToggleScope,
}: {
  patients: TransferPatient[];
  organizations: OrganizationDirectoryEntry[];
  form: TransferForm;
  selectedPatient: TransferPatient | null;
  submitting: boolean;
  hasPriorConsent: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onUpdate: <Key extends keyof TransferForm>(
    key: Key,
    value: TransferForm[Key],
  ) => void;
  onToggleScope: (scope: ShareScope) => void;
}) {
  const handlePatientChange = (patientId: string) => {
    const patient = patients.find((item) => item.id === patientId);
    onUpdate("patientId", patientId);
    onUpdate("patientEmail", patient?.email ?? "");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Send Patient Referral</h2>
            <p className="text-sm text-gray-500">
              Choose who receives the patient record and how consent is captured.
            </p>
          </div>

          <button onClick={onClose} aria-label="Close referral modal">
            <X size={22} />
          </button>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-100 p-4">
            <p className="mb-3 text-xs font-semibold uppercase text-[#211783]">
              Step 1 - Patient
            </p>
            <select
              value={form.patientId}
              onChange={(event) => handlePatientChange(event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#19c7b6]"
            >
              <option value="">Select patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} - {patient.patientCode}
                </option>
              ))}
            </select>

            {selectedPatient && (
              <div className="mt-3 grid gap-3 rounded-xl bg-[#f7fbfb] p-3 text-xs text-gray-600 md:grid-cols-4">
                <span>Patient ID: {selectedPatient.patientCode}</span>
                <span>Age: {selectedPatient.age}</span>
                <span>Gender: {selectedPatient.gender}</span>
                <span>Email: {selectedPatient.email || "Not available"}</span>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-gray-100 p-4">
            <p className="mb-3 text-xs font-semibold uppercase text-[#211783]">
              Step 2 - Receiving Hospital
            </p>
            <select
              value={form.recipientOrgId}
              onChange={(event) => onUpdate("recipientOrgId", event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#19c7b6]"
            >
              <option value="">Select receiving hospital</option>
              {organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name}
                </option>
              ))}
            </select>
          </section>

          <section className="rounded-2xl border border-gray-100 p-4">
            <p className="mb-3 text-xs font-semibold uppercase text-[#211783]">
              Step 3 - Referral Details
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">
                  Reason for referral
                </span>
                <input
                  value={form.reason}
                  onChange={(event) => onUpdate("reason", event.target.value)}
                  placeholder="Cardiology evaluation"
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#19c7b6]"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">
                  Priority
                </span>
                <select
                  value={form.priority}
                  onChange={(event) =>
                    onUpdate("priority", event.target.value as ReferralPriority)
                  }
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#19c7b6]"
                >
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </label>
            </div>

            <label className="mt-4 block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Clinical summary
              </span>
              <textarea
                value={form.clinicalSummary}
                onChange={(event) => onUpdate("clinicalSummary", event.target.value)}
                placeholder="Summarize why this patient is being referred."
                className="h-24 w-full resize-none rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#19c7b6]"
              />
            </label>
          </section>

          <section className="rounded-2xl border border-gray-100 p-4">
            <p className="mb-3 text-xs font-semibold uppercase text-[#211783]">
              Step 4 - Records To Share
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {supportedScopes.map((scope) => (
                <button
                  key={scope.value}
                  type="button"
                  onClick={() => onToggleScope(scope.value)}
                  className={`rounded-xl border p-3 text-left text-sm transition ${
                    form.scopes.includes(scope.value)
                      ? "border-[#19c7b6] bg-[#effafa]"
                      : "border-gray-200 hover:border-[#19c7b6]"
                  }`}
                >
                  <span className="flex items-start gap-2 font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={form.scopes.includes(scope.value)}
                      readOnly
                      className="mt-1 accent-[#19c7b6]"
                    />
                    {scope.label}
                  </span>
                  <span className="mt-1 block pl-6 text-xs text-gray-500">
                    {scope.helper}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 p-4">
            <p className="mb-3 text-xs font-semibold uppercase text-[#211783]">
              Step 5 - Patient Consent
            </p>
            {hasPriorConsent ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                This patient already gave in-person onboarding consent for all
                selected record categories. No extra consent step is needed for
                this demo referral.
              </div>
            ) : (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  <ConsentChoice
                    checked={form.consentMethod === "email_link"}
                    title="Email link"
                    text="The patient receives an email and must approve before records are viewable."
                    onClick={() => onUpdate("consentMethod", "email_link")}
                  />
                  <ConsentChoice
                    checked={form.consentMethod === "in_person_attestation"}
                    title="In-person attestation"
                    text="Use this when the patient is physically present and has already consented."
                    onClick={() => onUpdate("consentMethod", "in_person_attestation")}
                  />
                </div>

                {form.consentMethod === "email_link" && (
                  <label className="mt-4 block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">
                      Patient email
                    </span>
                    <input
                      value={form.patientEmail}
                      onChange={(event) => onUpdate("patientEmail", event.target.value)}
                      placeholder="patient@example.com"
                      className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#19c7b6]"
                    />
                  </label>
                )}

                {form.consentMethod === "in_person_attestation" && (
                  <label className="mt-4 flex items-start gap-3 rounded-xl bg-[#effafa] p-3 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={form.attestationConfirmed}
                      onChange={(event) =>
                        onUpdate("attestationConfirmed", event.target.checked)
                      }
                      className="mt-1 accent-[#19c7b6]"
                    />
                    I confirm the patient gave consent in person for this hospital to
                    access the selected records.
                  </label>
                )}
              </>
            )}
          </section>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-[#24128f] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#9088c7]"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Send Referral
          </button>
        </div>
      </div>
    </div>
  );
}

function ConsentChoice({
  checked,
  title,
  text,
  onClick,
}: {
  checked: boolean;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        checked ? "border-[#19c7b6] bg-[#effafa]" : "border-gray-200 hover:border-[#19c7b6]"
      }`}
    >
      <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
        <span
          className={`h-3 w-3 rounded-full ${
            checked ? "bg-[#19c7b6]" : "bg-gray-300"
          }`}
        />
        {title}
      </span>
      <span className="mt-2 block text-xs text-gray-500">{text}</span>
    </button>
  );
}
