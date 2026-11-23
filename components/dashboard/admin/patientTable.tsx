"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isInteractiveTarget } from "@utils/rowNavigation";
import { useAuth } from "@context/AuthContext";
import { patientService, type PatientListRecord } from "@services/api";
import { resolvePatientAge } from "@utils/patientAge";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import { TableSkeleton } from "@components/Skeletons";
import ListToolbar, { FilterSelect, SearchInput } from "@components/dashboard/ListToolbar";
import {
  DATE_RANGE_OPTIONS,
  isWithinDateRange,
  newestFirst,
  matchesOption,
  matchesQuery,
  optionsFrom,
  type DateRange,
} from "@utils/listFilters";

type AdminPatient = {
  id: string;
  patientCode: string;
  name: string;
  ageGender: string;
  gender: string;
  hospital: string;
  status: "active" | "follow-up";
  date: string;
  rawDate: string | null;
  createdAt: string | null;
};

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "follow-up", label: "Follow-up" },
];

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
  const router = useRouter();
  const { activeWorkspace } = useAuth();
  const [patients, setPatients] = useState<AdminPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");
  const [gender, setGender] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>("");

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
          patientCode: p.patient_code?.trim() || "Not recorded",
          name: `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "Unknown Patient",
          ageGender: `${resolvePatientAge(p.age, p.dob ?? p.date_of_birth)} / ${p.gender ?? "-"}`,
          gender: p.gender ?? "",
          hospital: activeWorkspace?.name ?? "Hospital",
          status: p.symptoms ? "follow-up" : "active",
          date: formatDate(p.updated_at),
          rawDate: p.updated_at ?? null,
          createdAt: p.created_at ?? null,
        }));

        setPatients(newestFirst(normalized, (p) => p.createdAt ?? p.rawDate));
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

  const genderOptions = useMemo(() => optionsFrom(patients.map((p) => p.gender)), [patients]);
  const visiblePatients = useMemo(
    () =>
      patients.filter(
        (p) =>
          matchesQuery(searchQuery, p.name, p.patientCode) &&
          matchesOption(status, p.status) &&
          matchesOption(gender, p.gender) &&
          isWithinDateRange(p.rawDate, dateRange),
      ),
    [patients, searchQuery, status, gender, dateRange],
  );
  const hasActiveFilters = !!searchQuery.trim() || !!status || !!gender || !!dateRange;

  return (
    <section className="rounded-md border bg-white p-4 shadow-sm sm:p-5">
      <h2 className="mb-4 border-b-2 border-[#051466] pb-1 text-sm font-semibold text-[#051466]">
        Patient Records
      </h2>

      <ListToolbar
        search={
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name or patient code"
            label="Search patients by name or patient code"
          />
        }
        filters={
          <>
            <FilterSelect allLabel="All statuses" label="Filter by status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
            <FilterSelect allLabel="All genders" label="Filter by gender" value={gender} onChange={setGender} options={genderOptions} />
            <FilterSelect
              allLabel="Any date"
              label="Filter by last updated date"
              value={dateRange}
              onChange={(value) => setDateRange(value as DateRange)}
              options={DATE_RANGE_OPTIONS}
            />
          </>
        }
        shown={visiblePatients.length}
        total={patients.length}
        active={hasActiveFilters && !loading}
        onClear={() => {
          setSearchQuery("");
          setStatus("");
          setGender("");
          setDateRange("");
        }}
        noun="patients"
      />

      <ResponsiveTableRegion label="Admin patient records">
        <table className="w-full min-w-[1120px] text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-400 border-b">
              <th scope="col" className="min-w-[210px] border-b bg-white px-4 py-3">Patient Name</th>
              <th scope="col" className="min-w-[180px] px-4 py-3">Patient Code</th>
              <th scope="col" className="min-w-[120px] px-4 py-3">Age/Gender</th>
              <th scope="col" className="min-w-[170px] px-4 py-3">Hospital</th>
              <th scope="col" className="min-w-[120px] px-4 py-3">Status</th>
              <th scope="col" className="min-w-[150px] px-4 py-3">Date</th>
              <th scope="col" className="min-w-[150px] px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <TableSkeleton columns={7} />
            )}

            {!loading && visiblePatients.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={7}>
                  {hasActiveFilters ? "No patients match these filters." : "No patients found."}
                </td>
              </tr>
            )}

            {!loading && visiblePatients.map((p, i) => (
              <tr key={p.id} className={`group cursor-pointer border-b hover:bg-slate-100 ${i % 2 ? "bg-slate-50/50" : "bg-white"}`} onClick={(event) => { if (!isInteractiveTarget(event.target)) router.push(`/dashboard/admin/patient/${p.id}`); }}>
                <td className="bg-inherit px-4 py-3">
                  <span>{p.name}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{p.patientCode}</td>
                <td className="whitespace-nowrap px-4 py-3">{p.ageGender}</td>
                <td className="px-4 py-3">{p.hospital}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={
                      "rounded-md px-3 py-1 text-xs capitalize " +
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
                  <Link
                    href={`/dashboard/admin/patient/${p.id}/edit`}
                    className="inline-flex min-h-10 items-center px-2 text-[#051466] hover:text-[#020B44] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466]"
                  >
                    Edit
                  </Link>
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
