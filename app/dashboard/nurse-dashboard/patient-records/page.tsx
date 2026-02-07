"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

type PatientStatus = "Active" | "Discharged" | "Pending";

type Patient = {
  initials: string;
  name: string;
  id: string;
  age: number;
  gender: string;
  condition: string;
  status: PatientStatus;
  date: string;
};

const patients: Patient[] = [
  {
    initials: "BH",
    name: "Brandon Herwitz",
    id: "SMC-04000B",
    age: 32,
    gender: "Male",
    condition: "Diabetes Type 2",
    status: "Active",
    date: "Oct-30-2025",
  },
  {
    initials: "BH",
    name: "Brandon Herwitz",
    id: "SMC-04000B",
    age: 56,
    gender: "Female",
    condition: "Hypertension",
    status: "Discharged",
    date: "Oct-30-2025",
  },
  {
    initials: "BH",
    name: "Brandon Herwitz",
    id: "SMC-04000B",
    age: 32,
    gender: "Female",
    condition: "Tuberculosis (TB)",
    status: "Pending",
    date: "Oct-30-2025",
  },
  {
    initials: "BH",
    name: "Brandon Herwitz",
    id: "SMC-04000B",
    age: 56,
    gender: "Female",
    condition: "Hepatitis",
    status: "Active",
    date: "Oct-30-2025",
  },
  {
    initials: "BH",
    name: "Brandon Herwitz",
    id: "SMC-04000B",
    age: 56,
    gender: "Male",
    condition: "Dehydration",
    status: "Active",
    date: "Oct-30-2025",
  },
  {
    initials: "BH",
    name: "Brandon Herwitz",
    id: "SMC-04000B",
    age: 56,
    gender: "Male",
    condition: "Dehydration",
    status: "Active",
    date: "Oct-30-2025",
  },
  {
    initials: "BH",
    name: "Brandon Herwitz",
    id: "SMC-04000B",
    age: 56,
    gender: "Male",
    condition: "Dehydration",
    status: "Active",
    date: "Oct-30-2025",
  },
  {
    initials: "BH",
    name: "Brandon Herwitz",
    id: "SMC-04000B",
    age: 56,
    gender: "Male",
    condition: "Dehydration",
    status: "Active",
    date: "Oct-30-2025",
  },
  {
    initials: "BH",
    name: "Brandon Herwitz",
    id: "SMC-04000B",
    age: 56,
    gender: "Male",
    condition: "Infertility",
    status: "Discharged",
    date: "Oct-30-2025",
  },
];

const statusClassMap: Record<PatientStatus, string> = {
  Active: "bg-[#E0F2F1] text-[#00B8A8]",
  Discharged: "bg-[#EDE7F6] text-[#673AB7]",
  Pending: "bg-[#FFF8E1] text-[#FFA000]",
};

const getStatusClass = (status: string) =>
  statusClassMap[status] ?? "bg-gray-100 text-gray-600";

export default function PatientsRecords() {
  const router = useRouter();

  const handleRowClick = (id: Patient["id"]) => {
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
              <select className="w-full sm:w-auto appearance-none bg-[#F9FAFB] border border-gray-200 rounded-full px-4 py-2 md:py-2.5 pr-8 text-sm md:text-base text-gray-600 outline-none cursor-pointer hover:border-gray-300 h-11 md:h-12 transition">
                <option>Department</option>
                <option>Cardiology</option>
                <option>Neurology</option>
              </select>
              <ChevronLeft className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 rotate-[-90deg] text-gray-400 pointer-events-none" />
            </div>

            <div className="relative w-full sm:w-auto">
              <select className="w-full sm:w-auto appearance-none bg-[#F9FAFB] border border-gray-200 rounded-full px-4 py-2 md:py-2.5 pr-8 text-sm md:text-base text-gray-600 outline-none cursor-pointer hover:border-gray-300 h-11 md:h-12 transition">
                <option>Last Visit</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
              <ChevronLeft className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 rotate-[-90deg] text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 w-full sm:w-auto flex-wrap">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded-full px-3 py-2 md:py-2.5 pr-7 text-sm md:text-base text-gray-600 outline-none cursor-pointer h-11 md:h-12 transition">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
              <ChevronLeft className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 rotate-[-90deg] text-gray-400 pointer-events-none" />
            </div>
            <span className="text-xs md:text-sm whitespace-nowrap">
              Entries per page
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
              {patients.map((p, index) => (
                <tr
                  key={`${p.id}-${index}`}
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
          <span className="text-xs md:text-sm">Showing 1-9 from 15</span>
          <div className="flex items-center gap-1 md:gap-2">
            <button className="h-10 w-10 md:h-10 md:w-10 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 text-gray-400 transition">
              <ChevronLeft size={16} />
            </button>
            <button className="h-10 w-10 md:h-10 md:w-10 flex items-center justify-center rounded bg-[#E8EAF6] text-[#1A2380] font-medium border border-[#E8EAF6] text-sm">
              1
            </button>
            <button className="h-10 w-10 md:h-10 md:w-10 flex items-center justify-center rounded border border-gray-100 hover:bg-gray-50 text-gray-600 font-medium transition text-sm">
              2
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
