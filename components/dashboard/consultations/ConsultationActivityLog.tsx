"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { LoaderIcon } from "@components/Skeletons";
import {
  activityService,
  type ActivityLogRecord,
} from "@services/api";

const PAGE_SIZE = 50;

const ACTION_LABELS: Record<string, string> = {
  "consultation.created": "Consultation created",
  "consultation.attended": "Consultation started",
  "consultation.completed": "Consultation completed",
  "note.created": "Doctor's note added",
  "diagnosis.created": "Diagnosis added",
  "prescription.created": "Prescription created",
  "prescription.updated": "Prescription updated",
  "lab_test.created": "Lab test ordered",
  "lab_test.updated": "Lab test updated",
  "vitals.recorded": "Vitals recorded",
};

const DETAIL_KEYS = [
  "message",
  "description",
  "reason_for_visit",
  "reason",
  "status",
  "test_name",
  "diagnosis",
  "note",
] as const;

type ConsultationActivityLogProps = {
  orgId: string | null;
  consultationId: string | null;
  theme: "doctor" | "nurse";
  refreshKey?: string | null;
};

const themeStyles = {
  doctor: {
    heading: "text-brand-navy",
    dot: "bg-brand-teal",
    button:
      "border-brand-navy text-brand-navy hover:bg-[#ECEEFD] focus-visible:ring-brand-navy",
  },
  nurse: {
    heading: "text-[#003C36]",
    dot: "bg-[#00B8A8]",
    button:
      "border-[#006B5F] text-[#006B5F] hover:bg-[#E6F8F7] focus-visible:ring-[#00B8A8]",
  },
} as const;

const formatAction = (action: string): string => {
  if (ACTION_LABELS[action]) return ACTION_LABELS[action];

  const words = action.replace(/[._-]+/g, " ").trim();
  if (!words) return "Consultation activity";
  return `${words.charAt(0).toUpperCase()}${words.slice(1)}`;
};

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleString();
};

const getDetailText = (details: Record<string, unknown>): string | null => {
  for (const key of DETAIL_KEYS) {
    const value = details[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return null;
};

const sortNewestFirst = (entries: ActivityLogRecord[]): ActivityLogRecord[] =>
  [...entries].sort(
    (first, second) =>
      new Date(second.timestamp).getTime() - new Date(first.timestamp).getTime(),
  );

const getActivityErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string" && detail.trim()) return detail;

    if (error.response?.status === 403) {
      return "Your account does not have permission to view this consultation activity.";
    }
  }

  return "Unable to load the activity log. Please try again.";
};

export default function ConsultationActivityLog({
  orgId,
  consultationId,
  theme,
  refreshKey,
}: ConsultationActivityLogProps) {
  const styles = themeStyles[theme];
  const [entries, setEntries] = useState<ActivityLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [retryVersion, setRetryVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadActivity = async () => {
      if (!orgId || !consultationId) {
        setEntries([]);
        setError(null);
        setHasMore(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setLoadMoreError(null);

      try {
        const result = await activityService.listConsultationActivity(
          orgId,
          consultationId,
          { limit: PAGE_SIZE, offset: 0 },
          controller.signal,
        );
        const page = Array.isArray(result) ? result : [];
        setEntries(sortNewestFirst(page));
        setHasMore(page.length === PAGE_SIZE);
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setEntries([]);
        setHasMore(false);
        setError(getActivityErrorMessage(requestError));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void loadActivity();
    return () => controller.abort();
  }, [consultationId, orgId, refreshKey, retryVersion]);

  const loadMore = async () => {
    if (!orgId || !consultationId || loadingMore) return;

    setLoadingMore(true);
    setLoadMoreError(null);

    try {
      const result = await activityService.listConsultationActivity(
        orgId,
        consultationId,
        { limit: PAGE_SIZE, offset: entries.length },
      );
      const page = Array.isArray(result) ? result : [];
      setEntries((current) => {
        const uniqueEntries = new Map(
          [...current, ...page].map((entry) => [entry.id, entry]),
        );
        return sortNewestFirst(Array.from(uniqueEntries.values()));
      });
      setHasMore(page.length === PAGE_SIZE);
    } catch (requestError) {
      setLoadMoreError(getActivityErrorMessage(requestError));
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <section
      className="rounded-lg border bg-white p-4 shadow-sm sm:p-6"
      aria-labelledby="consultation-activity-title"
    >
      <h3
        id="consultation-activity-title"
        className={`mb-6 text-lg font-semibold ${styles.heading}`}
      >
        Activity Log
      </h3>

      {!orgId || !consultationId ? (
        <p className="rounded-xl border p-4 text-sm text-gray-500">
          Select a consultation to view its activity.
        </p>
      ) : loading ? (
        <div className="py-6" aria-label="Loading consultation activity">
          <LoaderIcon />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4" role="alert">
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => setRetryVersion((current) => current + 1)}
            className={`mt-3 rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${styles.button}`}
          >
            Try again
          </button>
        </div>
      ) : entries.length === 0 ? (
        <p className="rounded-xl border p-4 text-sm text-gray-500">
          No activity has been recorded for this consultation yet.
        </p>
      ) : (
        <>
          <ol className="space-y-0" aria-label="Consultation activity history">
            {entries.map((entry, index) => {
              const detailText = getDetailText(entry.details);
              const isLast = index === entries.length - 1;

              return (
                <li key={entry.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-[5px] top-3 w-px bg-gray-200"
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className={`relative mt-1.5 h-3 w-3 shrink-0 rounded-full ring-4 ring-white ${styles.dot}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`break-words font-medium ${styles.heading}`}>
                      {formatAction(entry.action)}
                    </p>
                    <p className="mt-1 break-words text-sm text-gray-600">
                      {entry.actor_name || "System"}
                    </p>
                    {detailText && (
                      <p className="mt-1 break-words text-sm text-gray-600">
                        {detailText}
                      </p>
                    )}
                    <time
                      dateTime={entry.timestamp}
                      className="mt-1 block text-xs text-gray-500"
                    >
                      {formatDate(entry.timestamp)}
                    </time>
                  </div>
                </li>
              );
            })}
          </ol>

          {loadMoreError && (
            <p className="mt-4 text-sm text-red-700" role="alert">
              {loadMoreError}
            </p>
          )}

          {hasMore && (
            <button
              type="button"
              onClick={() => void loadMore()}
              disabled={loadingMore}
              className={`mt-5 min-h-10 rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${styles.button}`}
            >
              {loadingMore ? "Loading..." : "Load older activity"}
            </button>
          )}
        </>
      )}
    </section>
  );
}
