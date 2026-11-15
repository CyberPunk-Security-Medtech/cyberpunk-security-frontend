"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import HMOHeader from "@components/dashboard/admin/hmo-management/HMOHeader";
import AddHmoModal from "@components/dashboard/admin/hmo-management/AddHmoModal";
import HMOTable from "@components/dashboard/admin/hmo-management/HMOTable";
import { summarizeHmos, useHmoDirectory } from "@components/dashboard/admin/hmo-management/hmoData";
import StatCard from "@components/dashboard/admin/report/StatCard";

export default function HMOManagementPage() {
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id ?? null;
  const year = new Date().getFullYear();
  const { patients, report, registry, loading, error, reportUnavailable, reload, addToRegistry } =
    useHmoDirectory(orgId, year);
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const hmos = useMemo(() => summarizeHmos(patients, report, registry), [patients, report, registry]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? hmos.filter((hmo) => hmo.key.includes(needle)) : hmos;
  }, [hmos, query]);

  const hmoPatients = hmos.reduce((sum, hmo) => sum + hmo.patients.length, 0);
  const pending = loading ? "—" : null;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <HMOHeader />
        <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href="/dashboard/admin/reports"
          className="dashboard-button inline-flex min-h-10 items-center justify-center rounded-md border border-[#051466] px-4 text-sm font-medium text-[#051466] hover:bg-indigo-50"
        >
          Monthly HMO report
        </Link>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="dashboard-button inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#051466] px-4 text-sm font-semibold text-white hover:bg-[#020B44]"
        >
          <Plus size={16} aria-hidden="true" />
          Add an HMO
        </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="HMOs" value={pending ?? hmos.length.toLocaleString()} />
        <StatCard title="Patients on an HMO" value={pending ?? hmoPatients.toLocaleString()} />
        <StatCard title="Self-pay patients" value={pending ?? (patients.length - hmoPatients).toLocaleString()} />
        <StatCard
          title={`HMO consultations (${year})`}
          value={pending ?? (report ? report.total_consultations.toLocaleString() : "—")}
        />
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-white p-5" role="alert">
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={reload}
            className="mt-3 min-h-10 rounded-md bg-[#051466] px-4 text-sm font-semibold text-white hover:bg-[#020B44]"
          >
            Retry
          </button>
        </div>
      ) : (
        <section className="overflow-hidden rounded-md border bg-white">
          <div className="flex flex-col gap-2 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block sm:w-72">
              <span className="sr-only">Search HMOs</span>
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search HMOs"
                className="w-full rounded-md border px-3 py-2 pl-9 text-sm outline-none focus:border-[#051466]"
              />
            </label>
            {reportUnavailable && (
              <p className="text-xs text-amber-700">Consultation counts are unavailable right now.</p>
            )}
          </div>
          <HMOTable
            hmos={filtered}
            loading={loading}
            year={year}
            emptyMessage={
              query
                ? "No HMO matches your search."
                : "No HMOs yet. Add one with the Add an HMO button, or register a patient with HMO coverage."
            }
          />
        </section>
      )}

      <AddHmoModal isOpen={addOpen} onClose={() => setAddOpen(false)} orgId={orgId} onCreated={addToRegistry} />
    </div>
  );
}
