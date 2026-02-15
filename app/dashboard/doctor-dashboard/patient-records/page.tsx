"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@components/Button";
import PatientTable from "@components/shared/PatientTable";
import { Patient } from "@/types/index";
import { useAuth } from "@context/AuthContext";
import { organizationService, patientService } from "@services/api";

type Department = {
  id: string;
  name: string;
};

const calculateAge = (dob?: string | null): number => {
  if (!dob) return 0;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
};

const formatDate = (value?: string | null): string => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
};

export default function PatientsRecords() {
  const router = useRouter();
  const { activeWorkspace } = useAuth();

  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orgId = activeWorkspace?.id;
    if (!orgId) return;

    let ignore = false;
    const load = async () => {
      setLoading(true);
      try {
        const [patientsRes, departmentsRes] = await Promise.all([
          patientService.getPatients(orgId),
          organizationService.getDepartments(orgId),
        ]);

        if (ignore) return;

        const normalized: Patient[] = (patientsRes ?? []).map((p: any) => ({
          initials: `${p.first_name?.[0] ?? ""}${p.last_name?.[0] ?? ""}`.toUpperCase() || "NA",
          name: `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "Unknown Patient",
          id: p.id,
          age: calculateAge(p.dob),
          gender: p.gender ?? "-",
          condition:
            p.symptoms ||
            p.past_medical_history ||
            p.family_medical_history ||
            "No condition recorded",
          status: "Active",
          date: formatDate(p.updated_at),
        }));

        setPatients(normalized);
        setDepartments(departmentsRes ?? []);
      } catch (error) {
        console.error("Failed to load doctor patient records", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [activeWorkspace?.id]);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return patients.filter((p) => {
      const searchPass =
        text.length === 0 ||
        p.name.toLowerCase().includes(text) ||
        p.id.toLowerCase().includes(text);
      const deptPass = department === "all" || department.length > 0;
      return searchPass && deptPass;
    });
  }, [patients, query, department]);

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/doctor-dashboard/patient/${id}`);
  };

  return (
    <div className="px-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#1A2380]">Patients Records</h2>
          <p className="text-gray-500 text-sm">View and manage patient information</p>
        </div>

        <Button
          type="button"
          onSubmitHandler={() => router.push("/dashboard/doctor-dashboard/patient-records/new")}
          className="bg-[#1A2380] text-white font-medium px-5 py-2.5 rounded-md hover:bg-[#00B8A8] transition"
        >
          + Add New Patient Record
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient"
            className="w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#00B8A8]"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 absolute left-4 top-2.5 text-gray-400"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.2-5.2M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
          </svg>
        </div>

        <div className="flex items-center gap-3">
          <select
            className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-[#00B8A8]"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="all">Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border shadow-sm p-6 text-sm text-gray-500">
          Loading patients...
        </div>
      ) : (
        <PatientTable data={filtered} onRowClick={handleRowClick} />
      )}
    </div>
  );
}
