"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@context/AuthContext";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import { Select } from "@components/Field";
import { PageSkeleton, TableSkeleton } from "@components/Skeletons";
import HMOViewHeader from "@components/dashboard/admin/hmo-management/HMOViewHeader";
import {
  POLICY_STATUS_STYLES,
  policyStatus,
  providerKey,
  summarizeHmos,
  useHmoDirectory,
} from "@components/dashboard/admin/hmo-management/hmoData";
import StatCard from "@components/dashboard/admin/report/StatCard";
import { MONTH_NAMES, reportYears } from "@components/dashboard/admin/report/reportPeriod";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(date);
};

function HMOView() {
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider")?.trim() ?? "";
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id ?? null;
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [query, setQuery] = useState("");
  const { patients, report, loading, error, reportUnavailable, reload } = useHmoDirectory(orgId, year);

  const key = providerKey(provider);
  const hmo = useMemo(
    () => summarizeHmos(patients, report).find((item) => item.key === key) ?? null,
    [patients, report, key],
  );

  // Every month up to now (or the whole year for past years), zero-filled.
  const months = useMemo(() => {
    const now = new Date();
    const lastMonth = year === now.getFullYear() ? now.getMonth() + 1 : 12;
    const rows = (report?.rows ?? []).filter((row) => providerKey(row.hmo_provider) === key);
    return Array.from({ length: lastMonth }, (_, index) => {
      const month = index + 1;
      const matching = rows.filter((row) => row.month === month);
      return {
        month,
        consultations: matching.reduce((sum, row) => sum + row.consultation_count, 0),
        patients: matching.reduce((sum, row) => sum + row.patient_count, 0),
      };
    }).reverse();
  }, [report, key, year]);

  const enrolled = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = [...(hmo?.patients ?? [])].sort((a, b) =>
      `${a.last_name ?? ""} ${a.first_name ?? ""}`.localeCompare(`${b.last_name ?? ""} ${b.first_name ?? ""}`),
    );
    if (!needle) return list;
    return list.filter((patient) =>
      [patient.first_name, patient.last_name, patient.patient_code, patient.hmo_number]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle)),
    );
  }, [hmo, query]);

  if (!provider) {
    return (
      <p className="rounded-md border bg-white p-5 text-sm text-slate-600">
        No HMO selected. <Link href="/dashboard/admin/hmo-management" className="text-[#051466] underline">Back to HMOs</Link>
      </p>
    );
  }

  const statuses = (hmo?.patients ?? []).map(policyStatus);
  const expiringSoon = statuses.filter((status) => status === "Expiring soon").length;
  const yearConsultations = months.reduce((sum, row) => sum + row.consultations, 0);
  const pending = loading ? "—" : null;

  return (
    <div className="space-y-6">
      <HMOViewHeader name={hmo?.name ?? provider} />

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
      ) : !loading && !hmo ? (
        <p className="rounded-md border bg-white p-5 text-sm text-slate-600">
          No patients are currently registered under {provider}. Patients may have switched HMO or
          been updated to self-pay.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Enrolled patients" value={pending ?? String(hmo?.patients.length ?? 0)} />
            <StatCard title="Current policies" value={pending ?? String(hmo?.activePolicies ?? 0)} />
            <StatCard title="Expiring within 30 days" value={pending ?? String(expiringSoon)} />
            <StatCard title="Expired policies" value={pending ?? String(hmo?.expiredPolicies ?? 0)} />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <section className="overflow-hidden rounded-md border bg-white xl:col-span-1">
              <div className="flex items-end justify-between gap-3 border-b px-4 py-3">
                <div>
                  <h2 className="text-base font-semibold">Consultations</h2>
                  <p className="text-xs text-slate-500">
                    {reportUnavailable
                      ? "Unavailable right now"
                      : `${loading ? "—" : yearConsultations.toLocaleString()} in ${year} · cancelled excluded`}
                  </p>
                </div>
                <div className="w-28">
                  <label htmlFor="hmo-view-year" className="sr-only">Year</label>
                  <Select id="hmo-view-year" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                    {reportYears().map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </Select>
                </div>
              </div>
              <ResponsiveTableRegion label={`${provider} consultations by month`}>
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-slate-600">
                    <tr>
                      <th scope="col" className="px-4 py-2.5 font-medium">Month</th>
                      <th scope="col" className="px-4 py-2.5 text-right font-medium">Consultations</th>
                      <th scope="col" className="px-4 py-2.5 text-right font-medium">Patients</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <TableSkeleton columns={3} />
                    ) : (
                      months.map((row) => (
                        <tr key={row.month} className="border-t">
                          <td className="px-4 py-2.5">{MONTH_NAMES[row.month - 1]}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums">{row.consultations}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums">{row.patients}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </ResponsiveTableRegion>
            </section>

            <section className="overflow-hidden rounded-md border bg-white xl:col-span-2">
              <div className="flex flex-col gap-2 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-base font-semibold">Enrolled patients</h2>
                <label className="block sm:w-64">
                  <span className="sr-only">Search enrolled patients</span>
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Name, patient ID or enrollee no."
                    className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#051466]"
                  />
                </label>
              </div>
              <ResponsiveTableRegion label={`Patients enrolled with ${provider}`}>
                <table className="w-full min-w-[760px] text-sm">
                  <thead className="bg-slate-50 text-left text-slate-600">
                    <tr>
                      <th scope="col" className="px-4 py-2.5 font-medium">Patient</th>
                      <th scope="col" className="px-4 py-2.5 font-medium">Plan</th>
                      <th scope="col" className="px-4 py-2.5 font-medium">Enrollee no.</th>
                      <th scope="col" className="px-4 py-2.5 font-medium">Policy period</th>
                      <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <TableSkeleton columns={5} />
                    ) : enrolled.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                          No enrolled patient matches your search.
                        </td>
                      </tr>
                    ) : (
                      enrolled.map((patient) => {
                        const status = policyStatus(patient);
                        return (
                          <tr key={patient.id} className="border-t align-top">
                            <td className="px-4 py-2.5">
                              <Link
                                href={`/dashboard/admin/patient/${patient.id}`}
                                className="font-medium text-[#051466] hover:underline"
                              >
                                {`${patient.first_name ?? ""} ${patient.last_name ?? ""}`.trim() || "Patient"}
                              </Link>
                              <p className="font-mono text-xs text-slate-500">{patient.patient_code || "-"}</p>
                            </td>
                            <td className="px-4 py-2.5">
                              {patient.hmo_plan || "-"}
                              {patient.enrollee_type ? (
                                <p className="text-xs text-slate-500">{patient.enrollee_type}</p>
                              ) : null}
                            </td>
                            <td className="px-4 py-2.5 font-mono text-xs">{patient.hmo_number || "-"}</td>
                            <td className="whitespace-nowrap px-4 py-2.5">
                              {formatDate(patient.policy_start_date)} – {formatDate(patient.policy_expiry_date)}
                            </td>
                            <td className="px-4 py-2.5">
                              <span className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium ${POLICY_STATUS_STYLES[status]}`}>
                                {status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </ResponsiveTableRegion>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default function HMOViewPage() {
  return (
    <div className="px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-[1400px]">
        {/* useSearchParams needs a Suspense boundary for static rendering. */}
        <Suspense fallback={<PageSkeleton />}>
          <HMOView />
        </Suspense>
      </div>
    </div>
  );
}
