"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, FileText, Users } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@context/AuthContext";
import { patientService } from "@services/api";
import { getTimeGreeting } from "@utils/greeting";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import {
  mapRecordStaffPatient,
  statusClassName,
  wasCreatedToday,
  type RecordStaffPatientRow,
} from "./patientDisplay";

const firstName = (name: string) =>
  name.split(" ").filter(Boolean)[0] || "there";

const formatDashboardDate = (date: Date = new Date()) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

export default function RecordStaffDashboardPage() {
  const { user, activeWorkspace, hydrated } = useAuth();
  const [patients, setPatients] = useState<RecordStaffPatientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const greeting = getTimeGreeting();
  const dashboardDate = formatDashboardDate();

  const displayName =
    firstName(`${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()) ||
    firstName(user?.email?.split("@")?.[0] ?? "") ||
    "Record Staff";

  const fetchPatients = useCallback(async () => {
    if (!activeWorkspace?.id) {
      setPatients([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await patientService.getPatients(activeWorkspace.id);
      const patientList = Array.isArray(data) ? data : [];
      setPatients(patientList.map(mapRecordStaffPatient));
    } catch (fetchError) {
      console.error("Failed to fetch record staff patients", fetchError);
      setError("Unable to load patient records. Please try again.");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, [activeWorkspace?.id]);

  useEffect(() => {
    if (!hydrated) return;
    void fetchPatients();
  }, [fetchPatients, hydrated]);

  const stats = useMemo(
    () => [
      {
        title: "Total Patients",
        value: loading ? "..." : String(patients.length),
        icon: Users,
        iconClassName: "bg-sky-50 text-sky-600",
      },
      {
        title: "Records Filed Today",
        value: loading
          ? "..."
          : String(
              patients.filter((patient) => wasCreatedToday(patient.createdAt))
                .length,
            ),
        icon: FileText,
        iconClassName: "bg-emerald-50 text-emerald-600",
      },
    ],
    [loading, patients],
  );

  return (
    <div className="w-full space-y-7">
      <section>
        <h1 className="dashboard-page-title text-[#111827]">
          {greeting}, {displayName}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Ward census and records status — {dashboardDate}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {stats.map(({ title, value, icon: Icon, iconClassName }) => (
          <div key={title} className="rounded-xl bg-white p-5 shadow-sm">
            <div
              className={`mb-3 grid h-8 w-8 place-items-center rounded-lg ${iconClassName}`}
            >
              <Icon size={17} />
            </div>
            <p className="text-2xl font-bold text-[#111827]">{value}</p>
            <p className="text-xs text-slate-500">{title}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-[#111827]">
            Active Patient Records
          </h2>
          <Link
            href="/dashboard/record-staff/patient-records"
            className="text-sm font-medium text-[#006EA6] hover:text-[#005780]"
          >
            View all →
          </Link>
        </div>

        {error && (
          <div className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <ResponsiveTableRegion label="Active patient records">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#F5F7FA] text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th scope="col" className="min-w-[180px] bg-[#F5F7FA] px-5 py-3 font-semibold">Patient Code</th>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Ward</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    className="px-5 py-8 text-center text-slate-500"
                    colSpan={5}
                  >
                    Loading patient records...
                  </td>
                </tr>
              )}

              {!loading && patients.length === 0 && (
                <tr>
                  <td
                    className="px-5 py-8 text-center text-slate-500"
                    colSpan={5}
                  >
                    No patient records found yet.
                  </td>
                </tr>
              )}

              {!loading &&
                patients.map((record) => (
                  <tr key={record.id} className="border-t border-slate-100">
                    <td className="bg-white px-5 py-4 font-mono text-xs text-slate-600">
                      {record.patientCode}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#111827]">
                        {record.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {record.dateOfBirth}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-700">{record.ward}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(
                          record.status,
                        )}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {record.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {record.id ? (
                        <Link
                          href={`/dashboard/record-staff/patient/${record.id}`}
                          aria-label={`View ${record.name}`}
                          className="inline-flex text-[#0088CC] hover:text-[#006EA6]"
                        >
                          <Eye size={17} />
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-400">Unavailable</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </ResponsiveTableRegion>
      </section>
    </div>
  );
}
