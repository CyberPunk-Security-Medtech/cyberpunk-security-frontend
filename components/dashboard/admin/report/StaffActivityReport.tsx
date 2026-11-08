"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@context/AuthContext";
import {
  activityService,
  organizationService,
  type ActivityLogRecord,
  type Membership,
} from "@services/api";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import { Select } from "@components/Field";
import { TableSkeleton } from "@components/Skeletons";
import { buildDisplayName } from "@utils/helper";
import StatCard from "./StatCard";
import { PeriodFilters, isAbortError, monthLabel, reportErrorMessage } from "./reportPeriod";

// The backend only has dedicated report endpoints for HMOs and doctors. Every
// other role's report is counted from the organization activity log, which
// records each action with its actor and timestamp.

export type StaffMetric = {
  key: string;
  label: string;
  /** Activity-log actions counted towards this metric. */
  actions: string[];
};

export type StaffReportConfig = {
  id: string;
  /** Membership role, as the backend names it (e.g. "lab_technician"). */
  role: string;
  staffLabel: string;
  metrics: StaffMetric[];
};

export const STAFF_REPORTS: Record<string, StaffReportConfig> = {
  nurses: {
    id: "nurses",
    role: "nurse",
    staffLabel: "Nurse",
    metrics: [
      { key: "vitals", label: "Vitals recorded", actions: ["vitals.recorded"] },
      { key: "consultations", label: "Consultations created", actions: ["consultation.created"] },
      { key: "admissions", label: "Admissions", actions: ["patient.admitted"] },
      { key: "discharges", label: "Discharges", actions: ["patient.discharged"] },
    ],
  },
  lab: {
    id: "lab",
    role: "lab_technician",
    staffLabel: "Lab scientist",
    metrics: [
      { key: "reports", label: "Reports submitted", actions: ["lab_report.submitted"] },
      { key: "corrections", label: "Reports corrected", actions: ["lab_report.corrected"] },
      { key: "files", label: "Files uploaded", actions: ["lab_report.attachment_added"] },
      { key: "updates", label: "Test status updates", actions: ["lab_test.updated"] },
    ],
  },
  pharmacy: {
    id: "pharmacy",
    role: "pharmacist",
    staffLabel: "Pharmacist",
    metrics: [
      { key: "dispensed", label: "Prescriptions dispensed", actions: ["prescription.dispensed"] },
      { key: "corrected", label: "Dispenses corrected", actions: ["dispense.corrected"] },
      { key: "updated", label: "Prescriptions updated", actions: ["prescription.updated"] },
    ],
  },
  records: {
    id: "records",
    role: "record staff",
    staffLabel: "Record officer",
    metrics: [
      { key: "registered", label: "Patients registered", actions: ["patient.registered", "patient.linked_existing"] },
      { key: "updated", label: "Records updated", actions: ["patient.updated"] },
      { key: "consultations", label: "Consultations created", actions: ["consultation.created"] },
    ],
  },
};

const PAGE_SIZE = 200; // the activity-log endpoint's maximum
const MAX_PAGES_PER_ACTION = 25;

const normalizeRole = (role?: string | null) => (role ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");

// Report months are calendar months in UTC, matching the backend's reports.
const periodBounds = (year: number, month: number | null) => {
  const start = Date.UTC(year, month ? month - 1 : 0, 1);
  const end = Date.UTC(year, month ? month : 12, 1) - 1;
  return { since: new Date(start).toISOString(), until: new Date(end).toISOString() };
};

async function fetchAction(
  orgId: string,
  action: string,
  period: { since: string; until: string },
  userId: string | undefined,
  signal: AbortSignal,
) {
  const entries: ActivityLogRecord[] = [];
  for (let page = 0; page < MAX_PAGES_PER_ACTION; page += 1) {
    const batch = await activityService.listOrganizationActivity(
      orgId,
      { ...period, action, user_id: userId, limit: PAGE_SIZE, offset: page * PAGE_SIZE },
      signal,
    );
    const items = Array.isArray(batch) ? batch : [];
    entries.push(...items);
    if (items.length < PAGE_SIZE) return { entries, truncated: false };
  }
  return { entries, truncated: true };
}

type Row = { year: number; month: number; userId: string; name: string; counts: Record<string, number> };

export default function StaffActivityReport({ config }: { config: StaffReportConfig }) {
  const { activeWorkspace, hydrated } = useAuth();
  const orgId = activeWorkspace?.id ?? null;

  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState<number | null>(null);
  const [staffId, setStaffId] = useState("");
  const [staff, setStaff] = useState<Membership[]>([]);
  const [entries, setEntries] = useState<ActivityLogRecord[]>([]);
  const [truncated, setTruncated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hydrated || !orgId) return;
    organizationService
      .getMembers(orgId)
      .then((members) =>
        setStaff(
          (Array.isArray(members) ? members : []).filter(
            (member) => normalizeRole(member.role) === normalizeRole(config.role),
          ),
        ),
      )
      .catch((requestError) => console.error("Failed to load staff", requestError));
  }, [hydrated, orgId, config.role]);

  const actions = useMemo(
    () => Array.from(new Set(config.metrics.flatMap((metric) => metric.actions))),
    [config],
  );

  useEffect(() => {
    if (!hydrated || !orgId) return;
    const controller = new AbortController();
    const period = periodBounds(year, month);
    setLoading(true);
    setError("");
    Promise.all(actions.map((action) => fetchAction(orgId, action, period, staffId || undefined, controller.signal)))
      .then((results) => {
        setEntries(results.flatMap((result) => result.entries));
        setTruncated(results.some((result) => result.truncated));
      })
      .catch((requestError) => {
        if (isAbortError(requestError)) return;
        console.error(`Failed to load ${config.id} report`, requestError);
        setEntries([]);
        setError(reportErrorMessage(requestError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [hydrated, orgId, year, month, staffId, actions, config.id]);

  const { rows, totals } = useMemo(() => {
    // Only count people who currently hold this role, so a doctor creating a
    // consultation doesn't show up in the nurses' report.
    const staffById = new Map(staff.map((member) => [member.user.id, member]));
    const metricFor = new Map<string, string>();
    for (const metric of config.metrics) for (const action of metric.actions) metricFor.set(action, metric.key);

    const grouped = new Map<string, Row>();
    const sums: Record<string, number> = Object.fromEntries(config.metrics.map((metric) => [metric.key, 0]));
    for (const entry of entries) {
      const userId = entry.user?.id;
      const metricKey = metricFor.get(entry.action);
      const member = userId ? staffById.get(userId) : undefined;
      const time = new Date(entry.timestamp);
      if (!userId || !metricKey || !member || Number.isNaN(time.getTime())) continue;
      const rowYear = time.getUTCFullYear();
      const rowMonth = time.getUTCMonth() + 1;
      const id = `${rowYear}-${rowMonth}-${userId}`;
      const row =
        grouped.get(id) ??
        {
          year: rowYear,
          month: rowMonth,
          userId,
          name: buildDisplayName(member.user) || entry.actor_name || "Unnamed staff",
          counts: {},
        };
      row.counts[metricKey] = (row.counts[metricKey] ?? 0) + 1;
      sums[metricKey] += 1;
      grouped.set(id, row);
    }
    const primary = config.metrics[0].key;
    return {
      rows: [...grouped.values()].sort(
        (a, b) => a.month - b.month || (b.counts[primary] ?? 0) - (a.counts[primary] ?? 0),
      ),
      totals: sums,
    };
  }, [entries, staff, config]);

  const activeStaff = new Set(rows.map((row) => row.userId)).size;
  const columns = 2 + config.metrics.length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <PeriodFilters
          idPrefix={`${config.id}-report`}
          year={year}
          month={month}
          onYearChange={setYear}
          onMonthChange={setMonth}
        />
        <div className="sm:w-64">
          <label htmlFor={`${config.id}-report-staff`} className="mb-1 block text-xs font-medium text-slate-600">
            {config.staffLabel}
          </label>
          <Select id={`${config.id}-report-staff`} value={staffId} onChange={(e) => setStaffId(e.target.value)}>
            <option value="">All {config.staffLabel.toLowerCase()}s</option>
            {staff.map((member) => (
              <option key={member.user.id} value={member.user.id}>
                {buildDisplayName(member.user) || "Unnamed staff"}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${config.metrics.length >= 4 ? "xl:grid-cols-5" : "xl:grid-cols-4"}`}>
        <StatCard title={`Active ${config.staffLabel.toLowerCase()}s`} value={loading ? "—" : activeStaff.toLocaleString()} />
        {config.metrics.map((metric) => (
          <StatCard
            key={metric.key}
            title={metric.label}
            value={loading ? "—" : (totals[metric.key] ?? 0).toLocaleString()}
          />
        ))}
      </div>

      {truncated && !loading && (
        <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          This period has more activity than can be counted here. Pick a single month for exact figures.
        </p>
      )}

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : (
        <section className="overflow-hidden rounded-md border bg-white">
          <ResponsiveTableRegion label={`${config.staffLabel} activity by month`}>
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Month</th>
                  <th scope="col" className="px-5 py-3 font-medium">{config.staffLabel}</th>
                  {config.metrics.map((metric) => (
                    <th key={metric.key} scope="col" className="px-5 py-3 text-right font-medium">
                      {metric.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton columns={columns} />
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns} className="px-5 py-6 text-center text-slate-500">
                      No {config.staffLabel.toLowerCase()} activity recorded for this period.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={`${row.year}-${row.month}-${row.userId}`} className="border-t">
                      <td className="whitespace-nowrap px-5 py-3">{monthLabel(row.month, row.year)}</td>
                      <td className="px-5 py-3 font-medium text-slate-800">{row.name}</td>
                      {config.metrics.map((metric) => (
                        <td key={metric.key} className="px-5 py-3 text-right tabular-nums">
                          {(row.counts[metric.key] ?? 0).toLocaleString()}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </ResponsiveTableRegion>
        </section>
      )}

      <p className="text-xs text-slate-500">
        Counted from the activity log for staff who currently hold the {config.staffLabel.toLowerCase()} role.
      </p>
    </div>
  );
}
