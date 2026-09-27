"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Search, UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import { patientService, type PatientSearchResult } from "@services/api";

export type WalkInPatient = { id: string; name: string; code?: string | null; detail?: string };

type Candidate = {
  patient_id: string;
  patient_code?: string | null;
  first_name: string;
  last_name: string;
  dob?: string | null;
  match_reason?: string | null;
};

type Props = {
  orgId: string;
  value: WalkInPatient | null;
  onChange: (patient: WalkInPatient | null) => void;
};

const inputClass =
  "mt-1 h-10 w-full rounded-md border border-gray-300 px-3 text-sm font-normal text-gray-900 outline-none focus:border-[#007F73] focus:ring-2 focus:ring-[#007F73]/20";

const emptyForm = { first_name: "", last_name: "", dob: "", gender: "Female", phone_number: "", email: "" };

const fullName = (first?: string | null, last?: string | null) =>
  `${first ?? ""} ${last ?? ""}`.trim() || "Unknown patient";

const formatDob = (dob?: string | null) => {
  if (!dob) return "";
  const date = new Date(dob);
  return Number.isNaN(date.getTime()) ? dob : date.toLocaleDateString(undefined, { dateStyle: "medium" });
};

export default function WalkInPatientPicker({ orgId, value, onChange }: Props) {
  const [mode, setMode] = useState<"search" | "register">("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PatientSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [registering, setRegistering] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const requestRef = useRef(0);

  // Server-side search (name, phone, NIN, email) — debounced, 8 results max.
  useEffect(() => {
    const q = query.trim();
    const version = ++requestRef.current;
    if (mode !== "search" || q.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = window.setTimeout(async () => {
      try {
        const data = await patientService.searchPatients(orgId, { q, limit: 8 });
        if (version === requestRef.current) setResults(Array.isArray(data) ? data : []);
      } catch {
        if (version === requestRef.current) setResults([]);
      } finally {
        if (version === requestRef.current) setSearching(false);
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [mode, orgId, query]);

  const startRegister = () => {
    // Carry a typed name over so staff don't retype it.
    const [first = "", ...rest] = query.trim().split(/\s+/);
    setForm({ ...emptyForm, first_name: first, last_name: rest.join(" ") });
    setCandidates([]);
    setMode("register");
  };

  const register = async (forceCreate = false) => {
    const missing = (["first_name", "last_name", "dob", "phone_number", "email"] as const).filter(
      (key) => !form[key].trim(),
    );
    if (missing.length) {
      toast.error("Enter the patient's name, date of birth, phone number and email.");
      return;
    }
    setRegistering(true);
    try {
      const raw = await patientService.createPatient(orgId, {
        ...form,
        gender: form.gender as "Male" | "Female" | "Other",
        email: form.email.trim(),
        phone_number: form.phone_number.trim(),
        force_create: forceCreate,
      } as Parameters<typeof patientService.createPatient>[1]);
      const result = raw as {
        status?: string;
        patient?: { id: string; patient_code?: string | null; first_name?: string; last_name?: string } | null;
        candidates?: Candidate[] | null;
      };
      if (result.status === "duplicate_candidates") {
        // Nothing was written — let staff pick the existing record or confirm.
        setCandidates(result.candidates ?? []);
        return;
      }
      const patient = result.patient ?? (raw as { id?: string; patient_code?: string | null });
      if (!patient || !("id" in patient) || !patient.id) throw new Error("No patient returned");
      onChange({
        id: patient.id,
        name: fullName(form.first_name, form.last_name),
        code: patient.patient_code,
        detail: result.status === "linked_existing" ? "Existing platform record linked" : "Newly registered",
      });
      toast.success(
        result.status === "linked_existing"
          ? "This patient already had a platform record — it's now linked to your lab."
          : "Patient registered.",
      );
    } catch (error) {
      console.error("Failed to register patient", error);
      const status = (error as { response?: { status?: number } })?.response?.status;
      toast.error(
        status === 403
          ? "Your role can't register patients. Ask an administrator for access."
          : "Couldn't register the patient. Check the details and try again.",
      );
    } finally {
      setRegistering(false);
    }
  };

  if (value) {
    return (
      <div className="mt-2 flex items-start justify-between gap-3 rounded-md border border-teal-200 bg-teal-50 p-3 text-sm">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900">
            {value.name}
            {value.code ? <span className="ml-2 font-normal text-gray-500">{value.code}</span> : null}
          </p>
          {value.detail ? <p className="mt-0.5 text-gray-600">{value.detail}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => {
            onChange(null);
            setMode("search");
          }}
          className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-teal-800 hover:bg-teal-100"
        >
          Change
        </button>
      </div>
    );
  }

  if (mode === "register") {
    return (
      <div className="mt-2 space-y-3 rounded-md border border-gray-200 p-3">
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["first_name", "First name", "text"],
              ["last_name", "Last name", "text"],
              ["dob", "Date of birth", "date"],
              ["phone_number", "Phone number", "tel"],
              ["email", "Email", "email"],
            ] as const
          ).map(([key, label, type]) => (
            <label key={key} className="block text-sm font-medium text-gray-700">
              {label}
              <input
                type={type}
                value={form[key]}
                max={type === "date" ? new Date().toISOString().slice(0, 10) : undefined}
                onChange={(event) => {
                  setForm((current) => ({ ...current, [key]: event.target.value }));
                  setCandidates([]);
                }}
                className={inputClass}
              />
            </label>
          ))}
          <label className="block text-sm font-medium text-gray-700">
            Gender
            <select
              value={form.gender}
              onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))}
              className={inputClass}
            >
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
          </label>
        </div>

        {candidates.length > 0 ? (
          <div role="alert" className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm">
            <p className="font-medium text-amber-900">
              {candidates.length === 1 ? "This may be an existing patient." : "These may be existing patients."}
            </p>
            <p className="mt-0.5 text-amber-800">Same name and date of birth — use the existing record if it&apos;s the same person.</p>
            <ul className="mt-2 space-y-1.5">
              {candidates.map((candidate) => (
                <li key={candidate.patient_id} className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2">
                  <span className="min-w-0">
                    <span className="block font-medium text-gray-900">
                      {fullName(candidate.first_name, candidate.last_name)}
                      {candidate.patient_code ? (
                        <span className="ml-2 font-normal text-gray-500">{candidate.patient_code}</span>
                      ) : null}
                    </span>
                    <span className="block text-xs text-gray-500">Born {formatDob(candidate.dob)}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        id: candidate.patient_id,
                        name: fullName(candidate.first_name, candidate.last_name),
                        code: candidate.patient_code,
                        detail: "Existing patient",
                      })
                    }
                    className="shrink-0 rounded-md border border-teal-600 px-3 py-1 text-xs font-medium text-teal-800 hover:bg-teal-50"
                  >
                    Use this patient
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => setMode("search")}
            className="min-h-9 rounded-md px-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Back to search
          </button>
          <button
            type="button"
            disabled={registering}
            onClick={() => void register(candidates.length > 0)}
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-[#007F73] px-3 text-sm font-medium text-[#007F73] hover:bg-teal-50 disabled:opacity-50"
          >
            {registering ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : null}
            {candidates.length > 0 ? "It's a different person — register" : "Register patient"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <label className="relative block">
        <span className="sr-only">Search patients</span>
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, phone, NIN or email"
          className={`${inputClass} mt-0 pl-9`}
        />
      </label>
      {query.trim().length >= 2 ? (
        <div className="mt-2 rounded-md border border-gray-200" aria-busy={searching}>
          {searching ? (
            <p className="flex items-center gap-2 px-3 py-3 text-sm text-gray-500">
              <Loader2 size={14} className="animate-spin" aria-hidden="true" /> Searching…
            </p>
          ) : results.length > 0 ? (
            <ul className="max-h-56 divide-y divide-gray-100 overflow-y-auto">
              {results.map((patient) => (
                <li key={patient.id}>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        id: patient.id,
                        name: fullName(patient.first_name, patient.last_name),
                        code: patient.patient_code,
                        detail: [patient.gender, patient.dob && `Born ${formatDob(patient.dob)}`, patient.phone_number]
                          .filter(Boolean)
                          .join(" · "),
                      })
                    }
                    className="w-full px-3 py-2.5 text-left text-sm hover:bg-teal-50"
                  >
                    <span className="block font-medium text-gray-900">
                      {fullName(patient.first_name, patient.last_name)}
                      {patient.patient_code ? (
                        <span className="ml-2 font-normal text-gray-500">{patient.patient_code}</span>
                      ) : null}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {[patient.dob && `Born ${formatDob(patient.dob)}`, patient.phone_number].filter(Boolean).join(" · ")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-3 text-sm text-gray-500">No patients match “{query.trim()}”.</p>
          )}
        </div>
      ) : null}
      <button
        type="button"
        onClick={startRegister}
        className="mt-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-[#007F73] hover:bg-teal-50"
      >
        <UserPlus size={15} aria-hidden="true" /> Register a new patient
      </button>
    </div>
  );
}
