"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@context/AuthContext";
import { patientService, type PatientListRecord } from "@services/api";
import { resolvePatientAge } from "@utils/patientAge";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";

type AdminPatient = {
  id: string;
  patientCode: string;
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
          patientCode: p.patient_code?.trim() || p.id,
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
      <h2 className="mb-4 border-b-2 border-[#051466] pb-1 text-sm font-semibold text-[#051466]">
        Patient Records
      </h2>

      <ResponsiveTableRegion label="Admin patient records">
        <table className="w-full min-w-[1120px] text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-400 border-b">
              <th scope="col" className="min-w-[210px] border-b bg-white px-4 py-3">Patient Name</th>
              <th scope="col" className="min-w-[180px] px-4 py-3">Patient Code</th>
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
                <td className="bg-inherit px-4 py-3">
                  <span>{p.name}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{p.patientCode}</td>
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
                  <Link
                    href={`/dashboard/admin/patient/${p.id}`}
                    className="inline-flex min-h-10 items-center px-2 text-[#051466] hover:text-[#020B44] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466]"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    disabled
                    title="Patient editing is unavailable until the server provides a patient update endpoint."
                    className="min-h-10 cursor-not-allowed px-2 text-slate-400"
                  >
                    Edit
                  </button>
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
