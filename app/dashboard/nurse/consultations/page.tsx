"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { consultationService } from "@services/api";
import { useAuth } from "@context/AuthContext";
import { StatusBadge } from "@components/StatusBadge";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import { CreateConsultationModal } from "@components/dashboard/nurse/ConsultationModal";
import { TableSkeleton } from "@components/Skeletons";

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

type ConsultationApiRecord = {
  id: string;
  patient_id: string;
  patient?: {
    patient_code?: string | null;
    first_name?: string | null;
    last_name?: string | null;
  } | null;
  department?: { name?: string | null } | null;
  priority?: string | null;
  reason_for_visit?: string | null;
  status: ConsultationStatus;
  updated_at?: string | null;
  created_at?: string | null;
};

const STATUS_TABS: ConsultationStatus[] = [
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
  const [rows, setRows] = useState<ConsultationRow[]>([]);
  const [activeTab, setActiveTab] = useState<ConsultationStatus>("Pending");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadConsultations = async () => {
      if (!orgId) {
        setRows([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError(null);

      try {
        const result = await consultationService.listConsultations(orgId, {
          status_filter: activeTab,
        });
        const consultations = (Array.isArray(result) ? result : []) as ConsultationApiRecord[];
        const normalized: ConsultationRow[] = consultations
          .map((item) => ({
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
          }))
          .sort((a, b) => {
            const aTime = new Date(a.updated_at ?? 0).getTime();
            const bTime = new Date(b.updated_at ?? 0).getTime();
            return bTime - aTime;
          });

        if (!cancelled) setRows(normalized);
      } catch (error) {
        console.error("Failed to load consultations", error);
        if (!cancelled) {
          setRows([]);
          setLoadError("Unable to load consultations. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadConsultations();

    return () => {
      cancelled = true;
    };
  }, [activeTab, orgId, refreshVersion]);

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
                onClick={() => setActiveTab(tab)}
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
                    No {activeTab.toLowerCase()} consultations found.
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

        <div className="hidden">
          {loading && (
            <div className="rounded-lg border p-4 text-sm text-gray-500">
              Loading consultations...
            </div>
          )}

          {!loading && rows.length === 0 && (
            <div className="rounded-lg border p-4 text-sm text-gray-500">
              No consultations found.
            </div>
          )}

          {!loading &&
            rows.map((row) => {
              return (
                <div key={row.id} className="overflow-hidden rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words font-medium text-[#003C36]">{row.patient_name}</p>
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
                    {renderActionButtons(row)}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <CreateConsultationModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={() => {
          setRefreshVersion((current) => current + 1);
        }}
      />
    </div>
  );
}
