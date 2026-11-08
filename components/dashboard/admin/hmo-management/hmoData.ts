"use client";

import { useEffect, useState } from "react";
import {
  patientService,
  reportService,
  type HmoConsultationReport,
  type PatientRecord,
} from "@services/api";

// There is no HMO registry in the backend: an HMO exists in this hospital
// because patients are registered under it (patient.hmo_provider). Everything
// here is derived from those patient records plus the HMO consultation report.

export type PolicyStatus = "Active" | "Expiring soon" | "Expired" | "No expiry date";

export type HmoSummary = {
  /** Lower-cased provider name; the report also matches case-insensitively. */
  key: string;
  name: string;
  patients: PatientRecord[];
  activePolicies: number;
  expiredPolicies: number;
  consultations: number;
  lastEnrolledAt: string | null;
};

const EXPIRING_WINDOW_DAYS = 30;

export const providerKey = (name: string) => name.trim().toLowerCase();

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const policyStatus = (patient: PatientRecord): PolicyStatus => {
  if (!patient.policy_expiry_date) return "No expiry date";
  const expiry = new Date(`${patient.policy_expiry_date}T00:00:00`);
  if (Number.isNaN(expiry.getTime())) return "No expiry date";
  const today = startOfToday();
  if (expiry < today) return "Expired";
  const soon = new Date(today);
  soon.setDate(soon.getDate() + EXPIRING_WINDOW_DAYS);
  return expiry <= soon ? "Expiring soon" : "Active";
};

export const POLICY_STATUS_STYLES: Record<PolicyStatus, string> = {
  Active: "bg-green-100 text-green-700",
  "Expiring soon": "bg-amber-100 text-amber-800",
  Expired: "bg-red-100 text-red-700",
  "No expiry date": "bg-slate-100 text-slate-600",
};

// Picks the most common spelling, so "AXA Mansard" wins over "axa mansard".
const preferredName = (names: string[]) => {
  const counts = new Map<string, number>();
  for (const name of names) counts.set(name, (counts.get(name) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? names[0];
};

export const summarizeHmos = (
  patients: PatientRecord[],
  report: HmoConsultationReport | null,
): HmoSummary[] => {
  const groups = new Map<string, PatientRecord[]>();
  for (const patient of patients) {
    const provider = patient.hmo_provider?.trim();
    if (!provider) continue;
    const key = providerKey(provider);
    groups.set(key, [...(groups.get(key) ?? []), patient]);
  }

  const consultationsByKey = new Map<string, number>();
  const reportNames = new Map<string, string>();
  for (const row of report?.rows ?? []) {
    const key = providerKey(row.hmo_provider);
    consultationsByKey.set(key, (consultationsByKey.get(key) ?? 0) + row.consultation_count);
    reportNames.set(key, row.hmo_provider);
  }

  return [...groups.entries()]
    .map(([key, members]) => {
      const statuses = members.map(policyStatus);
      const enrolledDates = members
        .map((patient) => patient.created_at)
        .filter((value): value is string => Boolean(value))
        .sort();
      return {
        key,
        name: preferredName(members.map((patient) => patient.hmo_provider!.trim())) ?? reportNames.get(key) ?? key,
        patients: members,
        activePolicies: statuses.filter((status) => status !== "Expired").length,
        expiredPolicies: statuses.filter((status) => status === "Expired").length,
        consultations: consultationsByKey.get(key) ?? 0,
        lastEnrolledAt: enrolledDates[enrolledDates.length - 1] ?? null,
      };
    })
    .sort((a, b) => b.patients.length - a.patients.length || a.name.localeCompare(b.name));
};

/** Loads patients and this year's HMO consultation report for the HMO pages. */
export function useHmoDirectory(orgId: string | null | undefined, year: number) {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [report, setReport] = useState<HmoConsultationReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportUnavailable, setReportUnavailable] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!orgId) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    Promise.allSettled([
      patientService.getPatients(orgId),
      reportService.getHmoConsultationReport(orgId, { year }),
    ]).then(([patientResult, reportResult]) => {
      if (cancelled) return;
      if (patientResult.status === "fulfilled") {
        setPatients(Array.isArray(patientResult.value) ? (patientResult.value as PatientRecord[]) : []);
      } else {
        console.error("Failed to load patients for HMO view", patientResult.reason);
        setPatients([]);
        setError("Unable to load patient coverage. Please try again.");
      }
      // Consultation counts are a bonus; the page still works without them.
      setReport(reportResult.status === "fulfilled" ? reportResult.value : null);
      setReportUnavailable(reportResult.status === "rejected");
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [orgId, year, reloadKey]);

  return {
    patients,
    report,
    loading,
    error,
    reportUnavailable,
    reload: () => setReloadKey((key) => key + 1),
  };
}
