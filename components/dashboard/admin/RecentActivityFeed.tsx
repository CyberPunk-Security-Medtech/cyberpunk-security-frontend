"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { activityService, type ActivityLogRecord } from "@services/api";

const FEED_SIZE = 8;
// The backend has no push channel, so the feed polls. Polling pauses while
// the tab is hidden and refreshes immediately when it becomes visible again.
const POLL_INTERVAL_MS = 15_000;

const ACTION_LABELS: Record<string, string> = {
  "patient.registered": "Patient registered",
  "patient.linked_existing": "Existing patient linked",
  "patient.updated": "Patient record updated",
  "patient.admitted": "Patient admitted",
  "patient.ward_changed": "Patient moved ward",
  "patient.discharged": "Patient discharged",
  "consultation.created": "Consultation created",
  "consultation.attended": "Consultation started",
  "consultation.completed": "Consultation completed",
  "note.created": "Doctor's note added",
  "diagnosis.created": "Diagnosis added",
  "vitals.recorded": "Vitals recorded",
  "prescription.created": "Prescription written",
  "prescription.updated": "Prescription updated",
  "prescription.dispensed": "Prescription dispensed",
  "dispense.corrected": "Dispense corrected",
  "lab_test.created": "Lab test ordered",
  "lab_test.updated": "Lab test updated",
  "lab_report.submitted": "Lab report submitted",
  "lab_report.corrected": "Lab report corrected",
  "lab_report.attachment_added": "Lab file uploaded",
  "lab_report.attachment_deleted": "Lab file removed",
  "member.invited": "Staff member invited",
  "member.removed": "Staff member removed",
  "member.role_updated": "Staff role changed",
  "invitation.accepted": "Invitation accepted",
  "invitation.revoked": "Invitation revoked",
  "department.created": "Department created",
  "ward.created": "Ward created",
  "organization.updated": "Organization settings updated",
  "organization.logo_updated": "Organization logo updated",
  "verification.submitted": "Verification submitted",
  "verification.approved": "Verification approved",
  "verification.rejected": "Verification rejected",
};

const DETAIL_KEYS = [
  "patient_name",
  "name",
  "test_name",
  "medication_name",
  "ward_name",
  "email",
  "role",
  "reason_for_visit",
  "status",
] as const;

const formatAction = (action: string) => {
  if (ACTION_LABELS[action]) return ACTION_LABELS[action];
  const words = action.replace(/[._-]+/g, " ").trim();
  return words ? `${words.charAt(0).toUpperCase()}${words.slice(1)}` : "Activity";
};

const detailText = (details: Record<string, unknown> | null | undefined) => {
  for (const key of DETAIL_KEYS) {
    const value = details?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
};

const relativeTime = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

const timeAgo = (value: string, now: number) => {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "";
  const seconds = Math.round((time - now) / 1000);
  if (Math.abs(seconds) < 45) return "just now";
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return relativeTime.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relativeTime.format(hours, "hour");
  return relativeTime.format(Math.round(hours / 24), "day");
};

export default function RecentActivityFeed({ orgId }: { orgId: string | null | undefined }) {
  const [entries, setEntries] = useState<ActivityLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
  const knownIds = useRef<Set<string> | null>(null);
  const inFlight = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    if (!orgId) return;
    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;
    try {
      const result = await activityService.listOrganizationActivity(
        orgId,
        { limit: FEED_SIZE },
        controller.signal,
      );
      const next = (Array.isArray(result) ? result : [])
        .slice()
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, FEED_SIZE);
      // Highlight entries that arrived since the previous poll (not on first load).
      if (knownIds.current) {
        const seen = knownIds.current;
        setFreshIds(new Set(next.filter((entry) => !seen.has(entry.id)).map((entry) => entry.id)));
      }
      knownIds.current = new Set(next.map((entry) => entry.id));
      setEntries(next);
      setError("");
      setLastUpdated(Date.now());
    } catch (requestError) {
      if (controller.signal.aborted) return;
      const status = (requestError as { response?: { status?: number } })?.response?.status;
      setError(
        status === 403
          ? "You don't have permission to view organization activity."
          : "Couldn't refresh activity. Retrying…",
      );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    if (!orgId) return;
    knownIds.current = null;
    setLoading(true);
    void load();

    let timer: number | undefined;
    const start = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => void load(), POLL_INTERVAL_MS);
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void load();
        start();
      } else {
        window.clearInterval(timer);
      }
    };

    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      inFlight.current?.abort();
    };
  }, [orgId, load]);

  // Keeps the relative timestamps ("2 minutes ago") moving between polls.
  useEffect(() => {
    const ticker = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(ticker);
  }, []);

  useEffect(() => {
    if (freshIds.size === 0) return;
    const timeout = window.setTimeout(() => setFreshIds(new Set()), 4_000);
    return () => window.clearTimeout(timeout);
  }, [freshIds]);

  const live = !error && lastUpdated !== null;

  return (
    <section className="rounded-md border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-emerald-600">Recent activity</p>
          <p className="mt-0.5 text-xs text-slate-500" aria-live="polite">
            {lastUpdated ? `Updated ${timeAgo(new Date(lastUpdated).toISOString(), now)}` : "Connecting…"}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            live ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
          }`}
        >
          <span className="relative flex h-2 w-2">
            {live && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping" />
            )}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${live ? "bg-emerald-500" : "bg-amber-500"}`} />
          </span>
          {live ? "Live" : lastUpdated === null && !error ? "Connecting" : "Reconnecting"}
        </span>
      </div>

      {error && <p className="mt-3 text-xs text-amber-700">{error}</p>}

      <ul className="mt-4 space-y-1">
        {loading ? (
          Array.from({ length: 4 }, (_, index) => (
            <li key={index} className="h-10 animate-pulse rounded-md bg-slate-100" />
          ))
        ) : entries.length === 0 ? (
          <li className="text-sm text-slate-500">No activity recorded yet.</li>
        ) : (
          entries.map((entry) => {
            const detail = detailText(entry.details);
            const actor = entry.actor_name?.trim();
            return (
              <li
                key={entry.id}
                className={`flex gap-3 rounded-md px-2 py-2 text-sm transition-colors duration-700 motion-reduce:transition-none ${
                  freshIds.has(entry.id) ? "bg-emerald-50" : ""
                }`}
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-slate-800">
                    {formatAction(entry.action)}
                    {detail ? <span className="text-slate-500"> · {detail}</span> : null}
                  </p>
                  <p className="text-xs text-slate-500">
                    {actor ? `${actor} · ` : ""}
                    <time dateTime={entry.timestamp} title={new Date(entry.timestamp).toLocaleString()}>
                      {timeAgo(entry.timestamp, now)}
                    </time>
                  </p>
                </div>
              </li>
            );
          })
        )}
      </ul>

      <div className="mt-3 flex justify-end">
        <Link
          href="/dashboard/admin/audit-logs"
          className="text-xs font-medium text-[#051466] hover:underline"
        >
          View all activity
        </Link>
      </div>
    </section>
  );
}
