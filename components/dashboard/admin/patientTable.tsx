"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@context/AuthContext";
import { patientService, type PatientListRecord } from "@services/api";
import { resolvePatientAge } from "@utils/patientAge";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";

type AdminPatient = {
  id: string;
  initials: string;
  name: string;
  ageGender: string;
  hospital: string;
  status: "active" | "follow-up";
  date: string;
};

const formatDate = (value?: string | null): string => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
};

type PatientTableProps = {
  refreshVersion?: number;
};

export default function PatientTable({ refreshVersion = 0 }: PatientTableProps) {
  const { activeWorkspace } = useAuth();
  const [patients, setPatients] = useState<AdminPatient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orgId = activeWorkspace?.id;
    if (!orgId) return;

    let ignore = false;
    const load = async () => {
      setLoading(true);
      try {
        const result = await patientService.getPatients(orgId);
        if (ignore) return;

        const normalized: AdminPatient[] = ((result ?? []) as PatientListRecord[]).map((p) => ({
          id: p.id,
          initials: `${p.first_name?.[0] ?? ""}${p.last_name?.[0] ?? ""}`.toUpperCase() || "NA",
          name: `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "Unknown Patient",
          ageGender: `${resolvePatientAge(p.age, p.dob ?? p.date_of_birth)} / ${p.gender ?? "-"}`,
          hospital: activeWorkspace?.name ?? "Hospital",
          status: p.symptoms ? "follow-up" : "active",
          date: formatDate(p.updated_at),
        }));

        setPatients(normalized);
      } catch (error) {
        console.error("Failed to load admin patients", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [activeWorkspace?.id, activeWorkspace?.name, refreshVersion]);

  return (
    <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-5 text-sm sm:gap-6">
          <button className="min-h-10 border-b-2 border-[#051466] pb-1 font-semibold text-[#051466] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466]">
            Patient Records
          </button>
          <button className="min-h-10 pb-1 text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466]">Appointments</button>
        </div>

        <button className="dashboard-button min-h-10 border px-4 text-sm hover:bg-slate-50">
          Advanced Filters
        </button>
      </div>

      <ResponsiveTableRegion label="Admin patient records">
        <table className="w-full min-w-[1120px] text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-400 border-b">
              <th scope="col" className="min-w-[210px] border-b bg-white px-4 py-3">Patient Name</th>
              <th scope="col" className="min-w-[290px] px-4 py-3">ID</th>
              <th scope="col" className="min-w-[120px] px-4 py-3">Age/Gender</th>
              <th scope="col" className="min-w-[170px] px-4 py-3">Hospital</th>
              <th scope="col" className="min-w-[120px] px-4 py-3">Status</th>
              <th scope="col" className="min-w-[110px] px-4 py-3">Date</th>
              <th scope="col" className="min-w-[150px] px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={7}>
                  Loading patients...
                </td>
              </tr>
            )}

            {!loading && patients.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={7}>
                  No patients found.
                </td>
              </tr>
            )}

            {patients.map((p, i) => (
              <tr key={p.id} className={`group border-b ${i % 2 ? "bg-slate-50/50" : "bg-white"}`}>
                <td className="flex items-center gap-3 bg-inherit px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-semibold">
                    {p.initials}
                  </div>
                  <span>{p.name}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3">{p.id}</td>
                <td className="whitespace-nowrap px-4 py-3">{p.ageGender}</td>
                <td className="px-4 py-3">{p.hospital}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={
                      "rounded-full px-3 py-1 text-xs capitalize " +
                      (p.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700")
                    }
                  >
                    {p.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 tabular-nums">{p.date}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-xs">
                  <button className="min-h-10 px-2 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466]">View</button>
                  <button className="min-h-10 px-2 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466]">Edit</button>
                  <button aria-label={`More actions for ${p.name}`} className="min-h-10 min-w-10 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466]">...</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ResponsiveTableRegion>
    </section>
  );
}
