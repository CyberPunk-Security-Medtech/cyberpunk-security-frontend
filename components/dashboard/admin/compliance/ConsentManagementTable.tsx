"use client";

import { useEffect, useMemo, useState } from "react";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import { TableSkeleton } from "@components/Skeletons";
import { FilterSelect } from "@components/dashboard/ListToolbar";
import { useAuth } from "@context/AuthContext";
import {
  dataSharingService,
  organizationService,
  patientService,
  type DataShareGrant,
  type PatientListRecord,
} from "@services/api";
import { matchesOption, matchesQuery, newestFirst } from "@utils/listFilters";
import ComplianceSearchField from "./ComplianceSearchField";

type ConsentRecord = {
  id: string;
  patient: string;
  status: string;
  action: string;
  facility: string;
  duration: string;
  timestamp: string;
  sortDate: string;
};

const ACTION_LABEL: Record<string, string> = {
  pending_patient: "Awaiting patient consent",
  active: "Granted consent",
  revoked: "Revoked consent",
  expired: "Consent expired",
  verification_failed: "Consent verification failed",
};

const STATUS_OPTIONS = Object.entries(ACTION_LABEL).map(([value, label]) => ({ value, label }));

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
};

/** How long the grant runs, from when it was granted (or created) until it expires. */
const formatDuration = (grant: DataShareGrant) => {
  const start = new Date(grant.granted_by_patient_at ?? grant.created_at).getTime();
  const end = new Date(grant.expires_at).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return "-";
  const hours = Math.round((end - start) / 3_600_000);
  if (hours < 48) return `${hours} hour${hours === 1 ? "" : "s"}`;
  const days = Math.round(hours / 24);
  return `${days} days`;
};

export function ConsentManagementTable() {
  const { activeWorkspace, hydrated } = useAuth();
  const orgId = activeWorkspace?.id;
  const [records, setRecords] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (!hydrated) return;
    if (!orgId) {
      setRecords([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [grants, directory, patients] = await Promise.all([
          dataSharingService.listShareGrants(orgId, { role: "either" }),
          organizationService.getDirectory().catch(() => []),
          patientService
            .getPatients(orgId, { include_shared: true })
            .catch(() => [] as PatientListRecord[]),
        ]);
        if (cancelled) return;

        const orgNames = new Map<string, string>(
          (directory as Array<{ id: string; name: string }>).map((org) => [org.id, org.name]),
        );
        if (activeWorkspace?.name) orgNames.set(orgId, activeWorkspace.name);

        const patientNames = new Map<string, string>();
        (Array.isArray(patients) ? (patients as PatientListRecord[]) : []).forEach((patient) => {
          const name = `${patient.first_name ?? ""} ${patient.last_name ?? ""}`.trim();
          const code = patient.patient_code?.trim();
          const label = name && code ? `${name} (${code})` : name || code;
          if (label) patientNames.set(patient.id, label);
        });

        const mapped = grants.map((grant): ConsentRecord => {
          // Show the other party: where data goes if we share, where it came from if we receive.
          const otherOrgId = grant.source_org_id === orgId ? grant.recipient_org_id : grant.source_org_id;
          const timestamp = grant.granted_by_patient_at ?? grant.updated_at ?? grant.created_at;
          return {
            id: grant.id,
            patient: patientNames.get(grant.patient_id) ?? "Unknown patient",
            status: grant.status,
            action: ACTION_LABEL[grant.status] ?? grant.status,
            facility: orgNames.get(otherOrgId) ?? "Unknown organization",
            duration: formatDuration(grant),
            timestamp: formatDateTime(timestamp),
            sortDate: timestamp,
          };
        });

        setRecords(newestFirst(mapped, (record) => record.sortDate));
      } catch (error) {
        console.error("Failed to load consent records", error);
        if (!cancelled) setRecords([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [hydrated, orgId, activeWorkspace?.name]);

  const filteredRecords = useMemo(
    () =>
      records.filter(
        (record) =>
          matchesQuery(query, record.patient, record.action, record.facility) &&
          matchesOption(statusFilter, record.status),
      ),
    [records, query, statusFilter],
  );
  const hasActiveFilters = !!query.trim() || !!statusFilter;

  return (
    <section aria-labelledby="consent-management-title">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <h2 id="consent-management-title" className="sr-only">
          Consent Management
        </h2>
        <FilterSelect
          allLabel="All consent statuses"
          label="Filter by consent status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_OPTIONS}
        />
        <ComplianceSearchField
          label="Search consent records by patient, action, or facility"
          placeholder="Search Consent Management..."
          value={query}
          onChange={setQuery}
        />
      </div>

      <ResponsiveTableRegion label="Consent management records">
        <table className="w-full min-w-[62rem] text-sm">
          <thead className="text-slate-950">
            <tr>
              <th scope="col" className="min-w-[9rem] px-5 py-4 text-left font-semibold">
                Patient
              </th>
              <th scope="col" className="min-w-[17rem] px-5 py-4 text-left font-semibold">
                Action
              </th>
              <th scope="col" className="min-w-[13rem] px-5 py-4 text-left font-semibold">
                Facility
              </th>
              <th scope="col" className="min-w-[10rem] px-5 py-4 text-left font-semibold">
                Duration
              </th>
              <th scope="col" className="min-w-[13rem] px-5 py-4 text-left font-semibold">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && <TableSkeleton columns={5} />}
            {!loading &&
              filteredRecords.map(({ id, patient, action, facility, duration, timestamp }) => (
                <tr key={id}>
                  <td className="px-5 py-4">{patient}</td>
                  <td className="px-5 py-4">{action}</td>
                  <td className="px-5 py-4">{facility}</td>
                  <td className="px-5 py-4">{duration}</td>
                  <td className="px-5 py-4 tabular-nums">{timestamp}</td>
                </tr>
              ))}
            {!loading && filteredRecords.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                  {hasActiveFilters
                    ? "No consent records match your search."
                    : "No data-sharing consents have been recorded yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ResponsiveTableRegion>
    </section>
  );
}
