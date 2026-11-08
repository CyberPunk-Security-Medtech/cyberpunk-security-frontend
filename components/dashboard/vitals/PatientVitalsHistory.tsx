"use client";

import { useCallback, useEffect, useState } from "react";
import { patientService, type VitalRecord } from "@services/api";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import { TableSkeleton } from "@components/Skeletons";
import { getApiErrorMessage } from "@utils/apiError";
import { buildDisplayName } from "@utils/helper";

type PatientVitalsHistoryProps = {
  orgId: string | null | undefined;
  patientId: string;
};

type Range = "7d" | "all";

const RANGES: Array<{ value: Range; label: string }> = [
  { value: "7d", label: "Last 7 days" },
  { value: "all", label: "All readings" },
];

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

const withUnit = (value: number | null | undefined, unit: string) =>
  value === null || value === undefined ? "-" : `${value} ${unit}`;

const bloodPressure = (record: VitalRecord) =>
  record.systolic_bp == null && record.diastolic_bp == null
    ? "-"
    : `${record.systolic_bp ?? "-"}/${record.diastolic_bp ?? "-"} mmHg`;

// Vital signs across all of a patient's consultations, newest first. Defaults
// to the past week, which is what ward rounds usually need.
export default function PatientVitalsHistory({ orgId, patientId }: PatientVitalsHistoryProps) {
  const [range, setRange] = useState<Range>("7d");
  const [vitals, setVitals] = useState<VitalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadVitals = useCallback(async () => {
    if (!orgId || !patientId) return;
    setLoading(true);
    setError("");
    try {
      const result = await patientService.getPatientVitals(
        orgId,
        patientId,
        range === "7d" ? { days: 7 } : undefined,
      );
      const records = Array.isArray(result) ? result : [];
      setVitals(
        [...records].sort(
          (a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime(),
        ),
      );
    } catch (requestError) {
      console.error("Failed to load patient vitals", requestError);
      setVitals([]);
      setError(getApiErrorMessage(requestError, "Unable to load vitals. Please try again."));
    } finally {
      setLoading(false);
    }
  }, [orgId, patientId, range]);

  useEffect(() => {
    void loadVitals();
  }, [loadVitals]);

  return (
    <section className="rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Vitals</h2>
          <p className="text-sm text-slate-500">Readings from every consultation, newest first.</p>
        </div>
        <div role="group" aria-label="Vitals period" className="inline-flex w-fit rounded-md border border-slate-200 p-0.5">
          {RANGES.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={range === option.value}
              onClick={() => setRange(option.value)}
              className={`min-h-9 rounded px-3 text-sm font-medium transition-colors ${
                range === option.value
                  ? "bg-[var(--dashboard-accent,#1A2380)] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="p-4 sm:p-5" role="alert">
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => void loadVitals()}
            className="mt-2 text-sm font-medium text-[var(--dashboard-accent,#1A2380)] underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      ) : (
        <ResponsiveTableRegion label="Patient vitals">
          <table className="w-full min-w-[880px] text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Recorded</th>
                <th scope="col" className="px-4 py-3 font-medium">Temp</th>
                <th scope="col" className="px-4 py-3 font-medium">Heart rate</th>
                <th scope="col" className="px-4 py-3 font-medium">Blood pressure</th>
                <th scope="col" className="px-4 py-3 font-medium">Resp. rate</th>
                <th scope="col" className="px-4 py-3 font-medium">SpO₂</th>
                <th scope="col" className="px-4 py-3 font-medium">Weight</th>
                <th scope="col" className="px-4 py-3 font-medium">Recorded by</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton columns={8} />
              ) : vitals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-slate-500">
                    {range === "7d"
                      ? "No vitals recorded in the last 7 days."
                      : "No vitals recorded for this patient yet."}
                  </td>
                </tr>
              ) : (
                vitals.map((record) => (
                  <tr key={record.id} className="border-t border-slate-100 align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-800">
                      {formatDateTime(record.recorded_at)}
                      {record.notes ? (
                        <p className="mt-1 max-w-[220px] whitespace-pre-wrap text-xs text-slate-500">
                          {record.notes}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">{withUnit(record.temperature, "°C")}</td>
                    <td className="px-4 py-3">{withUnit(record.heart_rate, "bpm")}</td>
                    <td className="whitespace-nowrap px-4 py-3">{bloodPressure(record)}</td>
                    <td className="px-4 py-3">{withUnit(record.respiratory_rate, "/min")}</td>
                    <td className="px-4 py-3">{withUnit(record.oxygen_saturation, "%")}</td>
                    <td className="px-4 py-3">{withUnit(record.weight, "kg")}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {buildDisplayName(record.creator ?? null) || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </ResponsiveTableRegion>
      )}
    </section>
  );
}
