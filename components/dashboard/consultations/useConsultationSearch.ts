"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  consultationService,
  type ConsultationRecord,
  type ConsultationStatus,
} from "@services/api";
import { buildDisplayName } from "@utils/helper";
import { matchesQuery, newestFirst } from "@utils/listFilters";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

type SearchState = {
  /** True when a search is typed and results replace the paged queue. */
  active: boolean;
  loading: boolean;
  error: string | null;
  matches: ConsultationRecord[];
};

/**
 * Searches every consultation in a status tab, not just the visible page.
 *
 * The consultations API has no search parameter, so the first search in a tab
 * loads that tab's consultations once and filters them here. The loaded list is
 * reused while you keep typing, and reloaded when the tab or `refreshKey` changes.
 */
export function useConsultationSearch(
  orgId: string | null,
  status: ConsultationStatus | "All",
  query: string,
  refreshKey: number,
): SearchState {
  const trimmed = query.trim();
  const active = trimmed.length >= MIN_QUERY_LENGTH;
  const [debounced, setDebounced] = useState(trimmed);
  const [records, setRecords] = useState<ConsultationRecord[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedFor = useRef<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(trimmed), DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [trimmed]);

  const cacheKey = `${orgId}|${status}|${refreshKey}`;

  useEffect(() => {
    if (!active || !orgId || loadedFor.current === cacheKey) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    consultationService
      .listConsultations(orgId, status === "All" ? undefined : { status_filter: status })
      .then((result) => {
        if (cancelled) return;
        loadedFor.current = cacheKey;
        setRecords(newestFirst(result ?? [], (item) => item.created_at ?? item.updated_at));
      })
      .catch((requestError) => {
        if (cancelled) return;
        console.error("Failed to search consultations", requestError);
        // Don't retry in a loop; "Try again" changes refreshKey, which reloads.
        loadedFor.current = cacheKey;
        setRecords([]);
        setError("Unable to search consultations. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [active, orgId, cacheKey, status]);

  const matches = useMemo(() => {
    if (!active || !records) return [];
    return records.filter((item) =>
      matchesQuery(
        debounced,
        item.patient?.first_name,
        item.patient?.last_name,
        item.patient?.patient_code,
        item.reason_for_visit,
        item.department?.name,
        item.priority,
        buildDisplayName(item.doctor ?? null),
      ),
    );
  }, [active, records, debounced]);

  return {
    active,
    loading: active && (loading || loadedFor.current !== cacheKey || debounced !== trimmed),
    error: active ? error : null,
    matches,
  };
}
