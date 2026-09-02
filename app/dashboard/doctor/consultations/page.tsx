"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { consultationService } from "@services/api";
import { useAuth } from "@context/AuthContext";
import { StatusBadge } from "@components/StatusBadge";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";

type ConsultationStatus = "Pending" | "In Progress" | "Completed" | "Cancelled";

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

const STATUS_TABS: Array<"All" | ConsultationStatus> = [
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
  status: ConsultationStatus
): "Active" | "Pending" | "Completed" => {
  if (status === "In Progress") return "Active";
  if (status === "Completed") return "Completed";
  return "Pending";
};

export default function ConsultationsPage() {
  const router = useRouter();
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id ?? null;

  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<ConsultationRow[]>([]);
  const [activeTab, setActiveTab] = useState<"All" | ConsultationStatus>("All");
  const [actionLoadingById, setActionLoadingById] = useState<Record<string, boolean>>({});

  const loadConsultations = async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const [pending, inProgress, completed, cancelled] = await Promise.all([
        consultationService.listConsultations(orgId, { status_filter: "Pending" }),
        consultationService.listConsultations(orgId, { status_filter: "In Progress" }),
        consultationService.listConsultations(orgId, { status_filter: "Completed" }),
        consultationService.listConsultations(orgId, { status_filter: "Cancelled" }),
      ]);

      const merged = [
        ...(pending ?? []),
        ...(inProgress ?? []),
        ...(completed ?? []),
        ...(cancelled ?? []),
      ];

      const unique = Array.from(new Map(merged.map((item: any) => [item.id, item])).values());

      const normalized: ConsultationRow[] = unique
        .map((item: any) => ({
          id: item.id,
          patient_id: item.patient_id,
          patient_code: item.patient?.patient_code?.trim() || item.patient_id,
          patient_name:
            `${item.patient?.first_name ?? ""} ${item.patient?.last_name ?? ""}`.trim() ||
            "Unknown Patient",
          department_name: item.department?.name ?? "-",
          priority: item.priority ?? "-",
          reason_for_visit: item.reason_for_visit ?? "-",
          status: item.status as ConsultationStatus,
          updated_at: item.updated_at ?? item.created_at ?? null,
        }))
        .sort((a, b) => {
          const aTime = new Date(a.updated_at ?? 0).getTime();
          const bTime = new Date(b.updated_at ?? 0).getTime();
          return bTime - aTime;
        });

      setRows(normalized);
    } catch (error) {
      console.error("Failed to load consultations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadConsultations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  const filteredRows = useMemo(() => {
    const text = query.trim().toLowerCase();
    return rows.filter((row) => {
      const tabPass = activeTab === "All" || row.status === activeTab;
      const searchPass =
        text.length === 0 ||
        row.patient_name.toLowerCase().includes(text) ||
        row.patient_code.toLowerCase().includes(text) ||
        row.reason_for_visit.toLowerCase().includes(text);
      return tabPass && searchPass;
    });
  }, [rows, query, activeTab]);

  const counts = useMemo(() => {
    const base: Record<string, number> = {
      All: rows.length,
      Pending: 0,
      "In Progress": 0,
      Completed: 0,
      Cancelled: 0,
    };
    for (const row of rows) {
      base[row.status] += 1;
    }
    return base;
  }, [rows]);

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
      await loadConsultations();
      router.push(
        `/dashboard/doctor/consultations/${row.id}?patient_id=${row.patient_id}`
      );
    });
  };

  const handleComplete = async (row: ConsultationRow) => {
    if (!orgId) return;
    await withRowLoading(row.id, async () => {
      await consultationService.completeConsultation(orgId, row.id, { status: "Completed" });
      await loadConsultations();
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
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition ${
                  isActive
                    ? "bg-[#1A2380] text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab} ({counts[tab] ?? 0})
              </button>
            );
          })}
        </div>

        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by patient, reason or ID"
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
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={7}>
                    Loading consultations...
                  </td>
                </tr>
              )}

              {!loading && filteredRows.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={7}>
                    No consultations found.
                  </td>
                </tr>
              )}

              {!loading &&
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

        <div className="hidden">
          {loading && (
            <div className="rounded-lg border p-4 text-sm text-gray-500">
              Loading consultations...
            </div>
          )}

          {!loading && filteredRows.length === 0 && (
            <div className="rounded-lg border p-4 text-sm text-gray-500">
              No consultations found.
            </div>
          )}

          {!loading &&
            filteredRows.map((row) => {
              const rowLoading = !!actionLoadingById[row.id];
              return (
                <div key={row.id} className="overflow-hidden rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words font-medium text-[#1A2380]">{row.patient_name}</p>
                      <p className="break-all text-xs text-gray-500">{row.patient_code}</p>
                    </div>
                    <StatusBadge status={toBadgeStatus(row.status)} />
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs text-gray-600 sm:grid-cols-2">
                    <p>
                      Department: <span className="font-medium text-gray-800">{row.department_name}</span>
                    </p>
                    <p>
                      Priority: <span className="font-medium text-gray-800">{row.priority}</span>
                    </p>
                    <p className="sm:col-span-2">
                      Reason: <span className="break-words font-medium text-gray-800">{row.reason_for_visit}</span>
                    </p>
                    <p className="sm:col-span-2">
                      Updated: <span className="font-medium text-gray-800">{formatDate(row.updated_at)}</span>
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {renderActionButtons(row, rowLoading)}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
