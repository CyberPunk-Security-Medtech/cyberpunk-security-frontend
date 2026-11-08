"use client";

import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useAuth } from "@context/AuthContext";
import { reportService, type HmoConsultationReport as Report } from "@services/api";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import { Input } from "@components/Field";
import { TableSkeleton } from "@components/Skeletons";
import StatCard from "./StatCard";
import { PeriodFilters, isAbortError, monthLabel, reportErrorMessage } from "./reportPeriod";

// Consultations by patients under each HMO, per month. Patients without an
// HMO and cancelled consultations are excluded server-side.
export default function HmoConsultationReport() {
  const { activeWorkspace, hydrated } = useAuth();
  const orgId = activeWorkspace?.id ?? null;

  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState<number | null>(null);
  const [provider, setProvider] = useState("");
  const [debouncedProvider] = useDebounce(provider.trim(), 400);
  const [report, setReport] = useState<Report | null>(null);
  const [knownProviders, setKnownProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hydrated || !orgId) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    reportService
      .getHmoConsultationReport(
        orgId,
        { year, month: month ?? undefined, hmo_provider: debouncedProvider || undefined },
        controller.signal,
      )
      .then((result) => {
        setReport(result);
        // Remember providers seen so far to suggest them in the filter.
        setKnownProviders((current) =>
          Array.from(new Set([...current, ...result.rows.map((row) => row.hmo_provider)])).sort(),
        );
      })
      .catch((requestError) => {
        if (isAbortError(requestError)) return;
        console.error("Failed to load HMO consultation report", requestError);
        setReport(null);
        setError(reportErrorMessage(requestError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [hydrated, orgId, year, month, debouncedProvider]);

  const rows = useMemo(
    () =>
      [...(report?.rows ?? [])].sort(
        (a, b) => a.month - b.month || b.consultation_count - a.consultation_count,
      ),
    [report],
  );
  const providerCount = new Set(rows.map((row) => row.hmo_provider.toLowerCase())).size;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <PeriodFilters
          idPrefix="hmo-report"
          year={year}
          month={month}
          onYearChange={setYear}
          onMonthChange={setMonth}
        />
        <div className="sm:w-64">
          <label htmlFor="hmo-report-provider" className="mb-1 block text-xs font-medium text-slate-600">
            HMO provider
          </label>
          <Input
            id="hmo-report-provider"
            list="hmo-report-providers"
            placeholder="All HMOs"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          />
          <datalist id="hmo-report-providers">
            {knownProviders.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          title="Total consultations"
          value={loading || !report ? "—" : report.total_consultations.toLocaleString()}
        />
        <StatCard title="HMO providers" value={loading || !report ? "—" : providerCount.toLocaleString()} />
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : (
        <section className="overflow-hidden rounded-md border bg-white">
          <ResponsiveTableRegion label="HMO consultations by month">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Month</th>
                  <th scope="col" className="px-5 py-3 font-medium">HMO provider</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Consultations</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Patients</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton columns={4} />
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-6 text-center text-slate-500">
                      No HMO consultations for this period.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={`${row.year}-${row.month}-${row.hmo_provider}`} className="border-t">
                      <td className="whitespace-nowrap px-5 py-3">{monthLabel(row.month, row.year)}</td>
                      <td className="px-5 py-3 font-medium text-slate-800">{row.hmo_provider}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{row.consultation_count.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{row.patient_count.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </ResponsiveTableRegion>
        </section>
      )}
    </div>
  );
}
