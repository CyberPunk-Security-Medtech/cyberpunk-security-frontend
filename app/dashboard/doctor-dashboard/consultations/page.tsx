"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { consultationService } from "@services/api";
import { useAuth } from "@context/AuthContext";
import { StatusBadge } from "@components/StatusBadge";

type ConsultationStatus = "Pending" | "In Progress" | "Completed" | "Cancelled";

type ConsultationRow = {
  id: string;
  patient_id: string;
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
        row.patient_id.toLowerCase().includes(text) ||
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
      router.push(`/dashboard/doctor-dashboard/patient/${row.patient_id}`);
    });
  };

  const handleComplete = async (row: ConsultationRow) => {
    if (!orgId) return;
    await withRowLoading(row.id, async () => {
      await consultationService.completeConsultation(orgId, row.id, { status: "Completed" });
      await loadConsultations();
    });
  };

  return (
    <div className="px-6 py-4 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-[#1A2380]">Consultation Queue</h2>
        <p className="text-sm text-gray-500">
          Track pending, active and completed consultations across your patients.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  isActive
                    ? "bg-[#1A2380] text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
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
          className="w-full md:w-80 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#00B8A8]"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-gray-600 border-b bg-gray-50">
            <tr>
              <th className="py-3 px-4 font-medium">Patient</th>
              <th className="py-3 px-4 font-medium">Department</th>
              <th className="py-3 px-4 font-medium">Reason</th>
              <th className="py-3 px-4 font-medium">Priority</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Updated</th>
              <th className="py-3 px-4 font-medium text-right">Action</th>
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
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#1A2380]">{row.patient_name}</div>
                      <div className="text-xs text-gray-500">{row.patient_id}</div>
                    </td>
                    <td className="px-4 py-3">{row.department_name}</td>
                    <td className="px-4 py-3 max-w-[280px] truncate">{row.reason_for_visit}</td>
                    <td className="px-4 py-3">{row.priority}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={toBadgeStatus(row.status)} />
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(row.updated_at)}</td>
                    <td className="px-4 py-3 text-right">
                      {row.status === "Pending" && (
                        <button
                          type="button"
                          onClick={() => void handleStart(row)}
                          disabled={rowLoading}
                          className="rounded-md bg-[#1A2380] px-3 py-1.5 text-white hover:bg-[#111B66] disabled:opacity-50"
                        >
                          {rowLoading ? "Starting..." : "Start"}
                        </button>
                      )}

                      {row.status === "In Progress" && (
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              router.push(`/dashboard/doctor-dashboard/patient/${row.patient_id}`)
                            }
                            className="rounded-md border border-gray-200 px-3 py-1.5 hover:bg-gray-50"
                          >
                            Continue
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleComplete(row)}
                            disabled={rowLoading}
                            className="rounded-md bg-[#00B8A8] px-3 py-1.5 text-white hover:bg-[#00A393] disabled:opacity-50"
                          >
                            {rowLoading ? "Saving..." : "Complete"}
                          </button>
                        </div>
                      )}

                      {(row.status === "Completed" || row.status === "Cancelled") && (
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/dashboard/doctor-dashboard/patient/${row.patient_id}`)
                          }
                          className="rounded-md border border-gray-200 px-3 py-1.5 hover:bg-gray-50"
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
