"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  patientService,
  type PatientListRecord,
  type PatientSearchResult,
} from "@services/api";
import { useAuth } from "@context/AuthContext";
import { resolvePatientAge } from "@utils/patientAge";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import { LoaderIcon } from "@components/Skeletons";
import ListToolbar, { FilterSelect, SearchInput } from "@components/dashboard/ListToolbar";
import {
  DATE_RANGE_OPTIONS,
  isWithinDateRange,
  newestFirst,
  matchesOption,
  optionsFrom,
  type DateRange,
} from "@utils/listFilters";

interface Patient {
  id: string;
  patientCode: string;
  initials: string;
  name: string;
  age: number | string;
  gender: string;
  department: string;
  date: string;
  rawDate: string | null;
}

export default function PatientTable() {
  const router = useRouter();
  const { activeWorkspace } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [gender, setGender] = useState("");
  const [lastVisit, setLastVisit] = useState<DateRange>("");
  const patientCacheRef = useRef<{ orgId: string; records: PatientListRecord[] } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const normalizedQuery = searchQuery.trim();

    const fetchPatients = async () => {
      setLoading(true);

      try {
        if (!activeWorkspace?.id) {
          if (!cancelled) setPatients([]);
          return;
        }

        let data: Array<PatientListRecord | PatientSearchResult>;

        if (normalizedQuery.length >= 2) {
          // Server search covers name, phone, email and NIN; merge in list fields it may omit.
          const searchResults = await patientService.searchPatients(activeWorkspace.id, {
            q: normalizedQuery,
            limit: 100,
          });
          const cachedRecords = patientCacheRef.current?.orgId === activeWorkspace.id
            ? patientCacheRef.current.records
            : [];
          const cachedById = new Map(cachedRecords.map((record) => [record.id, record]));
          data = searchResults.map((result) => ({
            ...result,
            ...cachedById.get(result.id),
          }));
        } else {
          const response = await patientService.getPatients(activeWorkspace.id);
          data = Array.isArray(response) ? response as PatientListRecord[] : [];
          patientCacheRef.current = { orgId: activeWorkspace.id, records: data };
        }

        const mappedPatients = data.map((p) => ({
          id: p.id,
          patientCode: p.patient_code?.trim() || "Not recorded",
          initials: `${p.first_name?.[0] ?? ""}${p.last_name?.[0] ?? ""}`.toUpperCase(),
          name: `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "Unknown Patient",
          age: resolvePatientAge(p.age, p.dob ?? p.date_of_birth),
          gender: p.gender || "-",
          department: p.department?.trim() || "",
          rawDate: p.created_at ?? null,
          date: p.created_at
            ? new Date(p.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })
            : "-",
        }));

        if (!cancelled) setPatients(newestFirst(mappedPatients, (p) => p.rawDate));
      } catch (requestError) {
        console.error("Failed to fetch patients:", requestError);
        if (!cancelled) {
          setPatients([]);
          toast.error("Unable to load patient records. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const timer = window.setTimeout(
      () => void fetchPatients(),
      normalizedQuery.length >= 2 ? 300 : 0,
    );

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [activeWorkspace?.id, searchQuery]);

  const departmentOptions = useMemo(() => optionsFrom(patients.map((p) => p.department)), [patients]);
  const genderOptions = useMemo(() => optionsFrom(patients.map((p) => p.gender)), [patients]);

  const visiblePatients = useMemo(
    () =>
      patients.filter(
        (p) =>
          matchesOption(department, p.department) &&
          matchesOption(gender, p.gender) &&
          isWithinDateRange(p.rawDate, lastVisit),
      ),
    [patients, department, gender, lastVisit],
  );

  const hasSearch = searchQuery.trim().length >= 2;
  const hasActiveFilters = hasSearch || !!department || !!gender || !!lastVisit;
  const clearFilters = () => {
    setSearchQuery("");
    setDepartment("");
    setGender("");
    setLastVisit("");
  };

  const toolbar = (
    <ListToolbar
      search={
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, phone, email or NIN"
          label="Search patients by name, phone number, email, or NIN"
        />
      }
      filters={
        <>
          {departmentOptions.length > 0 && (
            <FilterSelect
              allLabel="All departments"
              label="Filter by department"
              value={department}
              onChange={setDepartment}
              options={departmentOptions}
            />
          )}
          <FilterSelect allLabel="All genders" label="Filter by gender" value={gender} onChange={setGender} options={genderOptions} />
          <FilterSelect
            allLabel="Any visit date"
            label="Filter by last visit"
            value={lastVisit}
            onChange={(value) => setLastVisit(value as DateRange)}
            options={DATE_RANGE_OPTIONS}
          />
        </>
      }
      shown={visiblePatients.length}
      total={hasSearch ? undefined : patients.length}
      active={hasActiveFilters && !loading}
      onClear={clearFilters}
      noun="patients"
    />
  );

  if (loading) {
    return (
      <>
        {toolbar}
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
          <LoaderIcon />
        </div>
      </>
    );
  }
  if (visiblePatients.length === 0) {
    return (
      <>
        {toolbar}
        <p className="p-4 text-gray-500">
          {hasActiveFilters
            ? hasSearch
              ? `No patients found for “${searchQuery.trim()}” with these filters.`
              : "No patients match these filters."
            : "No patients found."}
        </p>
      </>
    );
  }

  return (
    <>
    {toolbar}
    <div className="rounded-md border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
      <ResponsiveTableRegion label="Nurse patient records">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th scope="col" className="min-w-[190px] bg-gray-50 px-4 py-3 font-medium">Patient Name</th>
              <th className="px-4 py-3 font-medium">Patient Code</th>
              <th className="px-4 py-3 font-medium">Age</th>
              <th className="px-4 py-3 font-medium">Gender</th>
              <th className="px-4 py-3 font-medium">Last Visit</th>
            </tr>
          </thead>
          <tbody>
            {visiblePatients.map((patient) => (
              <tr
                key={patient.id}
                className="group cursor-pointer border-b bg-white hover:bg-gray-50"
                onClick={() => router.push(`/dashboard/nurse/patient/${patient.id}`)}
              >
                <td className="bg-white px-4 py-3 group-hover:bg-gray-50">
                  <div className="flex items-center gap-3 font-medium text-[#003C36]">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-[#E6F8F7] text-xs font-semibold text-[#00B8A8]">
                      {patient.initials || "NA"}
                    </div>
                    <span className="break-words">{patient.name}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{patient.patientCode}</td>
                <td className="px-4 py-3">{patient.age}</td>
                <td className="px-4 py-3">{patient.gender}</td>
                <td className="px-4 py-3 text-gray-500">{patient.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ResponsiveTableRegion>

      <div className="hidden">
        {visiblePatients.map((patient) => (
          <button
            key={`mobile-${patient.id}`}
            type="button"
            onClick={() => router.push(`/dashboard/nurse/patient/${patient.id}`)}
            className="w-full rounded-md border border-gray-200 p-4 text-left shadow-sm transition hover:bg-gray-50"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#E6F8F7] text-xs font-semibold text-[#00B8A8]">
                  {patient.initials || "NA"}
                </div>
                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold text-[#003C36]">{patient.name}</p>
                  <p className="break-all text-xs text-gray-500">{patient.patientCode}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              <p className="text-gray-500">
                Age: <span className="text-gray-800">{patient.age}</span>
              </p>
              <p className="text-gray-500">
                Gender: <span className="text-gray-800">{patient.gender}</span>
              </p>
              <p className="col-span-2 text-gray-500">
                Last Visit: <span className="text-gray-800">{patient.date}</span>
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
    </>
  );
}
