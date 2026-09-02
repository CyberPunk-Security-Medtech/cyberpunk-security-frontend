"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Search } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import {
  auditService,
  type CrossTenantAccessLog,
  type CrossTenantAccessParams,
} from "@services/api";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";

const PAGE_SIZE = 10;

type AuditFilters = {
  patientId: string;
  accessScope: CrossTenantAccessParams["as"] | "";
};

const initialFilters: AuditFilters = {
  patientId: "",
  accessScope: "",
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const formatResourceType = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const shortId = (value: string) =>
  value.length > 18 ? `${value.slice(0, 8)}…${value.slice(-6)}` : value;

export default function AuditLogsTable() {
  const { activeWorkspace } = useAuth();
  const [draftFilters, setDraftFilters] = useState<AuditFilters>(initialFilters);
  const [filters, setFilters] = useState<AuditFilters>(initialFilters);
  const [page, setPage] = useState(0);
  const [logs, setLogs] = useState<CrossTenantAccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestVersionRef = useRef(0);

  const loadLogs = useCallback(async () => {
    const requestVersion = ++requestVersionRef.current;

    if (!activeWorkspace?.id) {
      if (requestVersion === requestVersionRef.current) {
        setLogs([]);
        setError("");
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params: CrossTenantAccessParams = {
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      };

      if (filters.patientId.trim()) {
        params.patient_id = filters.patientId.trim();
      }
      if (filters.accessScope) {
        params.as = filters.accessScope;
      }

      const result = await auditService.listCrossTenantAccess(
        activeWorkspace.id,
        params,
      );
      if (requestVersion === requestVersionRef.current) {
        setLogs(Array.isArray(result) ? result : []);
      }
    } catch (loadError) {
      console.error("Failed to load audit logs", loadError);
      if (requestVersion === requestVersionRef.current) {
        setLogs([]);
        setError("Unable to load audit logs. Please try again.");
      }
    } finally {
      if (requestVersion === requestVersionRef.current) {
        setLoading(false);
      }
    }
  }, [activeWorkspace?.id, filters, page]);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  const hasNextPage = logs.length === PAGE_SIZE;
  const pageLabel = page + 1;

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(0);
    setFilters({ ...draftFilters });
  };

  const clearFilters = () => {
    setDraftFilters(initialFilters);
    setFilters(initialFilters);
    setPage(0);
  };

  return (
    <section aria-labelledby="audit-log-title">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 id="audit-log-title" className="text-lg font-semibold text-slate-900">
            Audit Logs
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review cross-organization access to patient information.
          </p>
        </div>

        <form
          className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end lg:justify-end"
          onSubmit={applyFilters}
        >
          <label className="block sm:w-56">
            <span className="mb-1 block text-xs font-medium text-slate-600">Patient ID</span>
            <span className="relative block">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={draftFilters.patientId}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    patientId: event.target.value,
                  }))
                }
                placeholder="Filter by patient ID"
                className="min-h-11 w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-[#051466] focus:ring-2 focus:ring-[#051466]/20"
              />
            </span>
          </label>

          <label className="block sm:w-48">
            <span className="mb-1 block text-xs font-medium text-slate-600">Access scope</span>
            <select
              value={draftFilters.accessScope}
              onChange={(event) =>
                setDraftFilters((current) => ({
                  ...current,
                  accessScope: event.target.value as AuditFilters["accessScope"],
                }))
              }
              className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#051466] focus:ring-2 focus:ring-[#051466]/20"
            >
              <option value="">All access</option>
              <option value="viewer">Access by this organization</option>
              <option value="source">Access to this organization&apos;s records</option>
            </select>
          </label>

          <button
            type="submit"
            className="min-h-11 rounded-lg bg-[#051466] px-4 text-sm font-semibold text-white hover:bg-[#020B44] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466] focus-visible:ring-offset-2"
          >
            Apply filters
          </button>
          {(filters.patientId || filters.accessScope || draftFilters.patientId || draftFilters.accessScope) && (
            <button
              type="button"
              onClick={clearFilters}
              className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466] focus-visible:ring-offset-2"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {!activeWorkspace?.id ? (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-600">
          Select an organization workspace to view audit logs.
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ResponsiveTableRegion label="Activity log records">
              <table className="w-full min-w-[56rem] text-sm" aria-busy={loading}>
                <thead className="border-b bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th scope="col" className="min-w-[190px] px-5 py-4">User ID</th>
                    <th scope="col" className="min-w-[220px] px-5 py-4">Patient ID</th>
                    <th scope="col" className="min-w-[180px] px-5 py-4">Resource</th>
                    <th scope="col" className="min-w-[210px] px-5 py-4">Accessed</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center text-slate-600" role="status">
                        Loading audit logs...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center">
                        <p className="text-sm text-red-700">{error}</p>
                        <button
                          type="button"
                          onClick={() => void loadLogs()}
                          className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466]"
                        >
                          <RotateCcw className="size-4" aria-hidden="true" />
                          Retry
                        </button>
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center text-slate-600">
                        No audit logs match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="border-b border-slate-100 last:border-b-0">
                        <td className="px-5 py-4 font-medium text-slate-900" title={log.user_id}>
                          {shortId(log.user_id)}
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-slate-700" title={log.patient_id}>
                          {shortId(log.patient_id)}
                        </td>
                        <td className="px-5 py-4 text-slate-800">
                          <span className="font-medium">{formatResourceType(log.resource_type)}</span>
                          {log.resource_id && (
                            <span className="mt-1 block font-mono text-xs text-slate-500" title={log.resource_id}>
                              {shortId(log.resource_id)}
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                          {formatDateTime(log.accessed_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </ResponsiveTableRegion>
          </div>

          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p aria-live="polite">
              {loading ? "Loading page…" : `Page ${pageLabel}`}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={loading || page === 0}
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466]"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
                Previous
              </button>
              <button
                type="button"
                disabled={loading || !hasNextPage}
                onClick={() => setPage((current) => current + 1)}
                className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466]"
              >
                Next
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
