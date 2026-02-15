"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { organizationService, patientService } from "@services/api";

type PatientStatus = "Active" | "Discharged" | "Pending";

type PatientRow = {
  initials: string;
  name: string;
  id: string;
  age: number;
  gender: string;
  condition: string;
  status: PatientStatus;
  date: string;
};

type Department = {
  id: string;
  name: string;
};

const statusClassMap: Record<PatientStatus, string> = {
  Active: "bg-[#E0F2F1] text-[#00B8A8]",
  Discharged: "bg-[#EDE7F6] text-[#673AB7]",
  Pending: "bg-[#FFF8E1] text-[#FFA000]",
};

const getStatusClass = (status: PatientStatus) =>
  statusClassMap[status] ?? "bg-gray-100 text-gray-600";

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

  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

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

        const normalizedPatients: PatientRow[] = (patientsRes ?? []).map((p: any) => ({
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

        setPatients(normalizedPatients);
        setDepartments(departmentsRes ?? []);
      } catch (error) {
        console.error("Failed to load patients/departments", error);
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

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();
    return patients.filter((p) => {
      const searchPass =
        query.length === 0 ||
        p.name.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query);
      const departmentPass =
        selectedDepartment === "all" || selectedDepartment.length > 0;
      return searchPass && departmentPass;
    });
  }, [patients, search, selectedDepartment]);

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/nurse-dashboard/patient-records/${id}`);
  };

  return (
    <div className="w-full space-y-4 md:space-y-6 font-sans py-2 md:py-4">
      <div className="flex flex-col gap-4 md:gap-6 w-full">
        <h2 className="text-xl md:text-2xl font-bold text-black text-left">
          Patients Records
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full items-start sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient"
              className="w-full h-11 md:h-12 pl-12 pr-4 rounded-full bg-white border border-gray-200 text-sm md:text-base text-gray-700 outline-none focus:ring-1 focus:ring-[#00B8A8] focus:border-[#00B8A8] placeholder-gray-400 transition"
            />
          </div>

          <Link
            href="/dashboard/nurse-dashboard/patient-records/new"
            className="w-full sm:w-auto sm:ml-auto bg-[#00B8A8] hover:bg-[#00A899] text-white font-medium px-4 md:px-6 h-11 md:h-12 rounded-full transition flex items-center justify-center gap-2 whitespace-nowrap text-sm md:text-base flex-shrink-0"
          >
            <span className="text-lg leading-none">+</span> Add New Patient
            Record
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:gap-4 w-full">
        <span className="font-medium text-gray-400 text-sm">Filter:</span>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full items-start sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-[#F9FAFB] border border-gray-200 rounded-full px-4 py-2 md:py-2.5 pr-8 text-sm md:text-base text-gray-600 outline-none cursor-pointer hover:border-gray-300 h-11 md:h-12 transition"
              >
                <option value="all">Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <ChevronLeft className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 rotate-[-90deg] text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 w-full sm:w-auto flex-wrap">
            <span className="text-xs md:text-sm whitespace-nowrap">
              {loading ? "Loading..." : `${filteredPatients.length} patients`}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <div className="w-full lg:max-w-none lg:mx-0 xl:max-w-[95%] xl:mx-auto overflow-x-auto border border-gray-200 rounded-lg md:rounded-xl bg-white">
          <table className="min-w-[900px] w-full text-left text-sm md:text-base">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
                <th className="py-3 md:py-4 px-3 md:px-4 font-medium whitespace-nowrap">
                  Patient Name
                </th>
                <th className="py-3 md:py-4 px-3 md:px-4 font-medium whitespace-nowrap">
                  Patient ID
                </th>
                <th className="py-3 md:py-4 px-3 md:px-4 font-medium whitespace-nowrap">
                  Age
                </th>
                <th className="py-3 md:py-4 px-3 md:px-4 font-medium whitespace-nowrap">
                  Gender
                </th>
                <th className="py-3 md:py-4 px-3 md:px-4 font-medium whitespace-nowrap">
                  Condition
                </th>
                <th className="py-3 md:py-4 px-3 md:px-4 font-medium whitespace-nowrap">
                  Status
                </th>
                <th className="py-3 md:py-4 px-3 md:px-4 font-medium whitespace-nowrap">
                  Last Visit
                </th>
                <th className="py-3 md:py-4 px-3 md:px-4 font-medium whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {!loading && filteredPatients.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={8}>
                    No patients found.
                  </td>
                </tr>
              )}

              {filteredPatients.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => handleRowClick(p.id)}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors h-16 md:h-20 cursor-pointer"
                >
                  <td className="px-3 md:px-4 py-3 md:py-4">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#E0F2F1] text-[#00B8A8] flex items-center justify-center font-semibold text-xs md:text-sm flex-shrink-0">
                        {p.initials}
                      </div>
                      <Link
                        href={`/dashboard/nurse-dashboard/patient-records/${p.id}`}
                        onClick={(event) => event.stopPropagation()}
                        className="font-semibold text-gray-900 text-sm truncate hover:underline"
                      >
                        {p.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4 text-gray-900 font-medium text-sm whitespace-nowrap">
                    {p.id}
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4 text-gray-900 font-medium text-sm whitespace-nowrap">
                    {p.age}
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4 text-gray-900 font-medium text-sm whitespace-nowrap">
                    {p.gender}
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4 text-gray-900 font-medium text-sm whitespace-nowrap">
                    {p.condition}
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap">
                    <span
                      className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold inline-block ${getStatusClass(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4 text-gray-900 font-medium text-sm whitespace-nowrap">
                    {p.date}
                  </td>
                  <td className="px-3 md:px-4 py-3 md:py-4 text-gray-400 sticky right-0 bg-white hover:bg-gray-50 whitespace-nowrap">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 hover:bg-gray-100 rounded-full transition inline-flex items-center justify-center h-10 w-10 flex-shrink-0"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 mt-4 md:mt-6 text-sm text-gray-400 w-full">
          <span className="text-xs md:text-sm">
            Showing {filteredPatients.length > 0 ? "1-" : "0"}
            {filteredPatients.length} from {filteredPatients.length}
          </span>
          <div className="flex items-center gap-1 md:gap-2">
            <button className="h-10 w-10 md:h-10 md:w-10 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 text-gray-400 transition">
              <ChevronLeft size={16} />
            </button>
            <button className="h-10 w-10 md:h-10 md:w-10 flex items-center justify-center rounded bg-[#E8EAF6] text-[#1A2380] font-medium border border-[#E8EAF6] text-sm">
              1
            </button>
            <button className="h-10 w-10 md:h-10 md:w-10 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 text-gray-400 transition">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
