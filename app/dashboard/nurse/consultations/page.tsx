"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  consultationService,
  type ConsultationPage,
  type ConsultationStatus,
} from "@services/api";
import { useAuth } from "@context/AuthContext";
import { StatusBadge } from "@components/StatusBadge";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import { CreateConsultationModal } from "@components/dashboard/nurse/ConsultationModal";
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
  "Pending",
  "In Progress",
  "Completed",
  "Cancelled",
  "All",
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

  // A different workspace starts a fresh Pending queue at page one.
  return <ConsultationQueue key={orgId ?? "no-workspace"} orgId={orgId} />;
}

function ConsultationQueue({ orgId }: { orgId: string | null }) {
  const router = useRouter();
  const [query, setQuery] = useState<QueueQuery>({ status: "Pending", page: 1, pageSize: 20 });
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ConsultationRow[]>([]);
  const [pagination, setPagination] = useState<Omit<ConsultationPage, "data"> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const activeTab = query.status;

  const changeQuery = (next: QueueQuery) => {
    setLoading(true);
    setQuery(next);
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
            ...(query.status === "All" ? {} : { status_filter: query.status }),
            page: query.page,
            page_size: query.pageSize,
          },
          controller.signal,
        );
        if (controller.signal.aborted) return;

        // Records can leave the filtered queue while a user is on its last page.
        if (query.page > Math.max(1, result.total_pages)) {
          setQuery((current) => ({ ...current, page: Math.max(1, result.total_pages) }));
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
        // Preserve the API's oldest-first order across every page.
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
  }, [orgId, query, refreshVersion]);

  const renderActionButtons = (row: ConsultationRow) => {
    const detailHref = `/dashboard/nurse/consultations/${row.id}?patient_id=${row.patient_id}`;

    return (
      <button
        type="button"
        onClick={() => router.push(detailHref)}
        className="w-full rounded-md border border-gray-200 px-3 py-1.5 hover:bg-gray-50 sm:w-auto"
      >
        Details
      </button>
    );
  };

  return (
    <div className="min-w-0 space-y-6 py-2 sm:py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-[#003C36] sm:text-2xl">Consultation Queue</h2>
          <p className="text-sm text-gray-500">
            Track pending, active and completed consultations across your patients.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          disabled={!orgId}
          className="w-full rounded-md bg-[#006B5F] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#005249] sm:w-auto"
        >
          + New Consultation
        </button>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  if (tab !== activeTab) changeQuery({ ...query, status: tab, page: 1 });
                }}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition ${
                  isActive
                    ? "bg-[#006B5F] text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-w-0 rounded-lg border border-gray-200 bg-white shadow-sm">
        <ResponsiveTableRegion label="Nurse consultations">
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
                        className="rounded-md border border-[#006B5F] px-3 py-1.5 font-medium text-[#006B5F] transition-colors hover:bg-[#E6F8F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8A8] focus-visible:ring-offset-2"
                      >
                        Try again
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && !loadError && rows.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={7}>
                    {!orgId
                      ? "Select an organization workspace to view consultations."
                      : activeTab === "All"
                        ? "No consultations found."
                        : `No ${activeTab.toLowerCase()} consultations found.`}
                  </td>
                </tr>
              )}

              {!loading && !loadError &&
                rows.map((row) => {
                  return (
                    <tr key={row.id} className="border-b hover:bg-gray-50">
                      <td className="bg-white px-4 py-3">
                        <div className="font-medium text-[#003C36]">{row.patient_name}</div>
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
                      <td className="px-4 py-3 text-right">{renderActionButtons(row)}</td>
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
                value={query.pageSize}
                onChange={(event) => changeQuery({ ...query, pageSize: Number(event.target.value), page: 1 })}
                className="min-h-10 rounded-md border bg-white px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006B5F]"
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
                disabled={loading || query.page <= 1}
                onClick={() => changeQuery({ ...query, page: query.page - 1 })}
                className="min-h-10 rounded-md border px-3 font-medium text-[#006B5F] hover:bg-[#E6F8F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006B5F] disabled:cursor-not-allowed disabled:opacity-50"
              >Previous</button>
              <button
                type="button"
                disabled={loading || !!loadError || !pagination || query.page >= pagination.total_pages}
                onClick={() => changeQuery({ ...query, page: query.page + 1 })}
                className="min-h-10 rounded-md border px-3 font-medium text-[#006B5F] hover:bg-[#E6F8F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006B5F] disabled:cursor-not-allowed disabled:opacity-50"
              >Next</button>
            </div>
          </nav>
        )}
      </div>

      <CreateConsultationModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={() => {
          changeQuery({ ...query, status: "Pending", page: 1 });
          setRefreshVersion((current) => current + 1);
        }}
      />
    </div>
  );
}
