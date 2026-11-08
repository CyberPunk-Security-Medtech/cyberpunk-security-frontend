"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@context/AuthContext";
import {
  organizationService,
  reportService,
  type DoctorMonthlyReport,
  type Membership,
} from "@services/api";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import { Select } from "@components/Field";
import { TableSkeleton } from "@components/Skeletons";
import { buildDisplayName } from "@utils/helper";
import StatCard from "./StatCard";
import { PeriodFilters, isAbortError, monthLabel, reportErrorMessage } from "./reportPeriod";

const isDoctor = (member: Membership) => member.role?.toLowerCase().includes("doctor");

// Patients each doctor treated per month. A consultation counts in the month
// the doctor attended it; cancelled ones are excluded server-side.
export default function DoctorPatientsReport() {
  const { activeWorkspace, hydrated } = useAuth();
  const orgId = activeWorkspace?.id ?? null;

  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState<number | null>(null);
  const [doctorId, setDoctorId] = useState("");
  const [doctors, setDoctors] = useState<Membership[]>([]);
  const [report, setReport] = useState<DoctorMonthlyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hydrated || !orgId) return;
    organizationService
      .getMembers(orgId)
      .then((members) => setDoctors((Array.isArray(members) ? members : []).filter(isDoctor)))
      .catch((requestError) => console.error("Failed to load doctors", requestError));
  }, [hydrated, orgId]);

  useEffect(() => {
    if (!hydrated || !orgId) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    reportService
      .getDoctorPatientsReport(
        orgId,
        { year, month: month ?? undefined, doctor_id: doctorId || undefined },
        controller.signal,
      )
      .then(setReport)
      .catch((requestError) => {
        if (isAbortError(requestError)) return;
        console.error("Failed to load doctor patients report", requestError);
        setReport(null);
        setError(reportErrorMessage(requestError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [hydrated, orgId, year, month, doctorId]);

  const rows = useMemo(
    () =>
      [...(report?.rows ?? [])].sort(
        (a, b) => a.month - b.month || b.patients_treated - a.patients_treated,
      ),
    [report],
  );

  const totals = useMemo(
    () =>
      rows.reduce(
        (sum, row) => ({
          consultations: sum.consultations + row.consultations,
          completed: sum.completed + row.completed_consultations,
        }),
        { consultations: 0, completed: 0 },
      ),
    [rows],
  );
  const doctorCount = new Set(rows.map((row) => row.doctor_id)).size;
  const pending = loading || !report;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <PeriodFilters
          idPrefix="doctor-report"
          year={year}
          month={month}
          onYearChange={setYear}
          onMonthChange={setMonth}
        />
        <div className="sm:w-64">
          <label htmlFor="doctor-report-doctor" className="mb-1 block text-xs font-medium text-slate-600">
            Doctor
          </label>
          <Select id="doctor-report-doctor" value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
            <option value="">All doctors</option>
            {doctors.map((member) => (
              <option key={member.user.id} value={member.user.id}>
                {buildDisplayName(member.user) || "Unnamed doctor"}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Doctors" value={pending ? "—" : doctorCount.toLocaleString()} />
        <StatCard title="Consultations attended" value={pending ? "—" : totals.consultations.toLocaleString()} />
        <StatCard title="Completed" value={pending ? "—" : totals.completed.toLocaleString()} />
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : (
        <section className="overflow-hidden rounded-md border bg-white">
          <ResponsiveTableRegion label="Patients treated per doctor by month">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Month</th>
                  <th scope="col" className="px-5 py-3 font-medium">Doctor</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Patients treated</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Consultations</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Completed</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton columns={5} />
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-6 text-center text-slate-500">
                      No consultations were attended in this period.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={`${row.year}-${row.month}-${row.doctor_id}`} className="border-t">
                      <td className="whitespace-nowrap px-5 py-3">{monthLabel(row.month, row.year)}</td>
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {buildDisplayName(row.doctor) || "Unknown doctor"}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums">{row.patients_treated.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{row.consultations.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right tabular-nums">
                        {row.completed_consultations.toLocaleString()}
                      </td>
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
