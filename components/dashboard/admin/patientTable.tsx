"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@context/AuthContext";
import { patientService } from "@services/api";

type AdminPatient = {
  id: string;
  initials: string;
  name: string;
  ageGender: string;
  hospital: string;
  status: "active" | "follow-up";
  date: string;
};

const calculateAge = (dob?: string | null): number => {
  if (!dob) return 0;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
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

        const normalized: AdminPatient[] = (result ?? []).map((p: any) => ({
          id: p.id,
          initials: `${p.first_name?.[0] ?? ""}${p.last_name?.[0] ?? ""}`.toUpperCase() || "NA",
          name: `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "Unknown Patient",
          ageGender: `${calculateAge(p.dob)} / ${p.gender ?? "-"}`,
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
    <section className="bg-white rounded-2xl shadow-sm border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-6 text-sm">
          <button className="font-semibold text-[#051466] border-b-2 border-[#051466] pb-1">
            Patient Records
          </button>
          <button className="text-slate-400 pb-1">Appointments</button>
        </div>

        <button className="text-xs border rounded-full px-3 py-1 flex items-center gap-1 hover:bg-slate-50">
          Advanced Filters
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-400 border-b">
              <th className="py-2">Patient Name</th>
              <th className="py-2">ID</th>
              <th className="py-2">Age/Gender</th>
              <th className="py-2">Hospital</th>
              <th className="py-2">Status</th>
              <th className="py-2">Date</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td className="py-6 text-center text-slate-500" colSpan={7}>
                  Loading patients...
                </td>
              </tr>
            )}

            {!loading && patients.length === 0 && (
              <tr>
                <td className="py-6 text-center text-slate-500" colSpan={7}>
                  No patients found.
                </td>
              </tr>
            )}

            {patients.map((p, i) => (
              <tr key={p.id} className={i % 2 ? "bg-slate-50/50 border-b" : "border-b"}>
                <td className="py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-semibold">
                    {p.initials}
                  </div>
                  <span>{p.name}</span>
                </td>
                <td>{p.id}</td>
                <td>{p.ageGender}</td>
                <td>{p.hospital}</td>
                <td>
                  <span
                    className={
                      "rounded-full px-3 py-1 text-[11px] capitalize " +
                      (p.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700")
                    }
                  >
                    {p.status}
                  </span>
                </td>
                <td>{p.date}</td>
                <td className="text-right space-x-2 text-xs">
                  <button className="hover:text-slate-700">View</button>
                  <button className="hover:text-slate-700">Edit</button>
                  <button className="hover:text-slate-700">...</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
