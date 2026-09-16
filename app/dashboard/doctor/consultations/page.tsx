"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  consultationService,
  type ConsultationPage,
  type ConsultationStatus,
} from "@services/api";
import { useAuth } from "@context/AuthContext";
import { StatusBadge } from "@components/StatusBadge";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import { TableSkeleton } from "@components/Skeletons";

type StatusFilter = ConsultationStatus | "All";
type QueueQuery = { status: StatusFilter; page: number; pageSize: number };

type ConsultationRow = {
  id: string;
  patient_id: string;
  patient_code: string;
  patient_name: string;
  department_name: string;
  priority: string;
  reason_for_visit: string;
  status: ConsultationStatus;
  updated_at: string | null;
};

const STATUS_TABS: StatusFilter[] = [
  "All",
  "Pending",
  "In Progress",
  "Completed",
  "Cancelled",
];

const formatDate = (value?: string | null): string => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
};

const toBadgeStatus = (
  status: ConsultationStatus,
): "Active" | "Pending" | "Completed" | "Cancelled" => {
  if (status === "In Progress") return "Active";
  if (status === "Completed") return "Completed";
  if (status === "Cancelled") return "Cancelled";
  return "Pending";
};

export default function ConsultationsPage() {
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id ?? null;

  return <ConsultationQueue key={orgId ?? "no-workspace"} orgId={orgId} />;
}

function ConsultationQueue({ orgId }: { orgId: string | null }) {
  const router = useRouter();
  const [queueQuery, setQueueQuery] = useState<QueueQuery>({ status: "All", page: 1, pageSize: 20 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<ConsultationRow[]>([]);
  const [pagination, setPagination] = useState<Omit<ConsultationPage, "data"> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [actionLoadingById, setActionLoadingById] = useState<Record<string, boolean>>({});
  const activeTab = queueQuery.status;

  const changeQueueQuery = (next: QueueQuery) => {
    setLoading(true);
    setSearch("");
    setQueueQuery(next);
  };

  useEffect(() => {
    const controller = new AbortController();

    const loadConsultations = async () => {
      if (!orgId) {
        setRows([]);
        setPagination(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setLoadError(null);
      try {
        const result = await consultationService.listConsultationsPage(
          orgId,
          {
            ...(queueQuery.status === "All" ? {} : { status_filter: queueQuery.status }),
            page: queueQuery.page,
            page_size: queueQuery.pageSize,
          },
          controller.signal,
        );
        if (controller.signal.aborted) return;

        if (queueQuery.page > Math.max(1, result.total_pages)) {
          setQueueQuery((current) => ({ ...current, page: Math.max(1, result.total_pages) }));
          return;
        }
        setRows(result.data.map((item) => ({
          id: item.id,
          patient_id: item.patient_id,
          patient_code: item.patient?.patient_code?.trim() || item.patient_id,
          patient_name:
            `${item.patient?.first_name ?? ""} ${item.patient?.last_name ?? ""}`.trim() ||
            "Unknown Patient",
          department_name: item.department?.name ?? "-",
          priority: item.priority ?? "-",
          reason_for_visit: item.reason_for_visit ?? "-",
          status: item.status,
          updated_at: item.updated_at ?? item.created_at ?? null,
        })));
        setPagination({
          page: result.page,
          page_size: result.page_size,
          total: result.total,
          total_pages: result.total_pages,
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to load consultations", error);
        setRows([]);
        setPagination(null);
        setLoadError("Unable to load consultations. Please try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void loadConsultations();
    return () => controller.abort();
  }, [orgId, queueQuery, refreshVersion]);

  const filteredRows = useMemo(() => {
    const text = search.trim().toLowerCase();
    return rows.filter((row) => {
      const searchPass =
        text.length === 0 ||
        row.patient_name.toLowerCase().includes(text) ||
        row.patient_code.toLowerCase().includes(text) ||
        row.reason_for_visit.toLowerCase().includes(text);
      return searchPass;
    });
  }, [rows, search]);

  const withRowLoading = async (id: string, fn: () => Promise<void>) => {
    setActionLoadingById((prev) => ({ ...prev, [id]: true }));
    try {
      await fn();
    } finally {
      setActionLoadingById((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleStart = async (row: ConsultationRow) => {
    if (!orgId) return;
    await withRowLoading(row.id, async () => {
      await consultationService.attendConsultation(orgId, row.id);
      router.push(
        `/dashboard/doctor/consultations/${row.id}?patient_id=${row.patient_id}`
      );
    });
  };

  const handleComplete = async (row: ConsultationRow) => {
    if (!orgId) return;
    await withRowLoading(row.id, async () => {
      await consultationService.completeConsultation(orgId, row.id);
      setRefreshVersion((current) => current + 1);
    });
  };

  const renderActionButtons = (row: ConsultationRow, rowLoading: boolean) => {
    const detailHref = `/dashboard/doctor/consultations/${row.id}?patient_id=${row.patient_id}`;

    if (row.status === "Pending") {
      return (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={() => void handleStart(row)}
            disabled={rowLoading}
            className="w-full rounded-md bg-[#1A2380] px-3 py-1.5 text-white hover:bg-[#111B66] disabled:opacity-50 sm:w-auto"
          >
            {rowLoading ? "Starting..." : "Start"}
          </button>
          <button
            type="button"
            onClick={() => router.push(detailHref)}
            className="w-full rounded-md border border-gray-200 px-3 py-1.5 hover:bg-gray-50 sm:w-auto"
          >
            Details
          </button>
        </div>
      );
    }

    if (row.status === "In Progress") {
      return (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={() => router.push(detailHref)}
            className="w-full rounded-md border border-gray-200 px-3 py-1.5 hover:bg-gray-50 sm:w-auto"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={() => void handleComplete(row)}
            disabled={rowLoading}
            className="w-full rounded-md bg-[#00B8A8] px-3 py-1.5 text-white hover:bg-[#00A393] disabled:opacity-50 sm:w-auto"
          >
            {rowLoading ? "Saving..." : "Complete"}
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => router.push(detailHref)}
        className="w-full rounded-md border border-gray-200 px-3 py-1.5 hover:bg-gray-50 sm:w-auto"
      >
        View
      </button>
    );
  };

  return (
    <div className="min-w-0 space-y-6 py-2 sm:py-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-[#1A2380] sm:text-2xl">Consultation Queue</h2>
        <p className="text-sm text-gray-500">
          Track pending, active and completed consultations across your patients.
        </p>
      </div>

      <div className="min-w-0 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  if (tab !== activeTab) changeQueueQuery({ ...queueQuery, status: tab, page: 1 });
                }}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition ${
                  isActive
                    ? "bg-[#1A2380] text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <input
          type="text"
          aria-label="Search consultations on this page"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search this page by patient, reason or ID"
          className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#00B8A8] lg:max-w-sm"
        />
      </div>

      <div className="min-w-0 rounded-lg border border-gray-200 bg-white shadow-sm">
        <ResponsiveTableRegion label="Doctor consultations">
          <table className="w-full min-w-[980px] border-collapse text-left text-sm">
            <thead className="border-b bg-gray-50 text-gray-600">
              <tr>
                <th scope="col" className="min-w-[190px] bg-gray-50 px-4 py-3 font-medium">Patient</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Reason</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <TableSkeleton columns={7} />
              )}

              {!loading && loadError && (
                <tr>
                  <td className="px-4 py-6 text-gray-600" colSpan={7}>
                    <div className="flex flex-wrap items-center gap-3" role="alert">
                      <span>{loadError}</span>
                      <button
                        type="button"
                        onClick={() => setRefreshVersion((current) => current + 1)}
                        className="rounded-md border border-[#1A2380] px-3 py-1.5 font-medium text-[#1A2380] hover:bg-[#E3E7FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A2380]"
                      >
                        Try again
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && !loadError && filteredRows.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={7}>
                    {!orgId
                      ? "Select an organization workspace to view consultations."
                      : search.trim()
                        ? "No matches on this page. Try another page or clear the search."
                        : activeTab === "All"
                          ? "No consultations found."
                          : `No ${activeTab.toLowerCase()} consultations found.`}
                  </td>
                </tr>
              )}

              {!loading && !loadError &&
                filteredRows.map((row) => {
                  const rowLoading = !!actionLoadingById[row.id];
                  return (
                    <tr key={row.id} className="border-b hover:bg-gray-50">
                      <td className="bg-white px-4 py-3">
                        <div className="font-medium text-[#1A2380]">{row.patient_name}</div>
                        <div className="break-all text-xs text-gray-500">{row.patient_code}</div>
                      </td>
                      <td className="px-4 py-3">{row.department_name}</td>
                      <td className="px-4 py-3">
                        <span className="line-clamp-1">{row.reason_for_visit}</span>
                      </td>
                      <td className="px-4 py-3">{row.priority}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={toBadgeStatus(row.status)} />
                      </td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(row.updated_at)}</td>
                      <td className="px-4 py-3 text-right">{renderActionButtons(row, rowLoading)}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </ResponsiveTableRegion>

        {orgId && (
          <nav aria-label="Consultation pagination" className="flex flex-col gap-3 border-t p-4 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 text-gray-600">
              Rows per page
              <select
                aria-label="Rows per page"
                value={queueQuery.pageSize}
                onChange={(event) => changeQueueQuery({ ...queueQuery, pageSize: Number(event.target.value), page: 1 })}
                className="min-h-10 rounded-md border bg-white px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A2380]"
              >
                {[10, 20, 50].map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </label>
            <p role="status" aria-live="polite" className="text-gray-600">
              {loading ? "Loading consultations..." : loadError ? "Page unavailable" : pagination && pagination.total > 0
                ? `Showing ${(pagination.page - 1) * pagination.page_size + 1}–${Math.min(pagination.page * pagination.page_size, pagination.total)} of ${pagination.total} · Page ${pagination.page} of ${pagination.total_pages}`
                : "0 consultations"}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={loading || queueQuery.page <= 1}
                onClick={() => changeQueueQuery({ ...queueQuery, page: queueQuery.page - 1 })}
                className="min-h-10 rounded-md border px-3 font-medium text-[#1A2380] hover:bg-[#E3E7FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A2380] disabled:cursor-not-allowed disabled:opacity-50"
              >Previous</button>
              <button
                type="button"
                disabled={loading || !!loadError || !pagination || queueQuery.page >= pagination.total_pages}
                onClick={() => changeQueueQuery({ ...queueQuery, page: queueQuery.page + 1 })}
                className="min-h-10 rounded-md border px-3 font-medium text-[#1A2380] hover:bg-[#E3E7FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A2380] disabled:cursor-not-allowed disabled:opacity-50"
              >Next</button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
