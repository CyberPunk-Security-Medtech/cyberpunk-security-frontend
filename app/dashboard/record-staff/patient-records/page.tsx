"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isInteractiveTarget } from "@utils/rowNavigation";
import { toast } from "react-toastify";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import { useAuth } from "@context/AuthContext";
import { patientService } from "@services/api";
import AddPatientModal from "@components/dashboard/doctor/AddPatientModal";
import {
  mapRecordStaffPatient,
  statusClassName,
  type RecordStaffPatientRow,
} from "../patientDisplay";
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


export default function RecordStaffPatientRecordsPage() {
  const router = useRouter();
  const { activeWorkspace, hydrated } = useAuth();
  const [patients, setPatients] = useState<RecordStaffPatientRow[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [registeredRange, setRegisteredRange] = useState<DateRange>("");

  const departmentOptions = useMemo(() => optionsFrom(patients.map((p) => p.ward)), [patients]);
  const statusOptions = useMemo(() => optionsFrom(patients.map((p) => p.status)), [patients]);
  const genderFilterOptions = useMemo(() => optionsFrom(patients.map((p) => p.gender)), [patients]);
  const visiblePatients = useMemo(
    () =>
      patients.filter(
        (p) =>
          matchesQuery(searchQuery, p.name, p.patientCode) &&
          matchesOption(departmentFilter, p.ward) &&
          matchesOption(statusFilter, p.status) &&
          matchesOption(genderFilter, p.gender) &&
          isWithinDateRange(p.createdAt, registeredRange),
      ),
    [patients, searchQuery, departmentFilter, statusFilter, genderFilter, registeredRange],
  );
  const hasActiveFilters =
    !!searchQuery.trim() || !!departmentFilter || !!statusFilter || !!genderFilter || !!registeredRange;

  const fetchPatients = useCallback(async () => {
    if (!activeWorkspace?.id) {
      setPatients([]);
      setLoadingPatients(false);
      return;
    }

    try {
      setLoadingPatients(true);
      const data = await patientService.getPatients(activeWorkspace.id);
      const patientList = Array.isArray(data) ? data : [];
      setPatients(newestFirst(patientList.map(mapRecordStaffPatient), (p) => p.createdAt));
    } catch (fetchError) {
      console.error("Failed to load record staff patients", fetchError);
      toast.error("Unable to load patient records. Please try again.");
      setPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  }, [activeWorkspace?.id]);

  useEffect(() => {
    if (!hydrated) return;
    void fetchPatients();
  }, [fetchPatients, hydrated]);

  return (
    <div className="w-full space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="dashboard-page-title text-[#111827]">Patient Records</h1>
          <p className="mt-2 text-sm text-slate-500">
            View onboarded patients and add new patient records for this organization.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#003C36] px-5 py-3 text-sm font-semibold text-white hover:bg-[#002E29]"
        >
          <Plus size={16} />
          Add New Patient Record
        </button>
      </section>

      <section className="overflow-hidden rounded-md bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-[#111827]">Patient Records</h2>
          <p className="mt-1 text-sm text-slate-500">
            Patients created in this organization and awaiting nurse review.
          </p>
        </div>

        <div className="px-5 pt-4">
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
                <FilterSelect
                  allLabel="All departments"
                  label="Filter by department"
                  value={departmentFilter}
                  onChange={setDepartmentFilter}
                  options={departmentOptions}
                />
                <FilterSelect allLabel="All statuses" label="Filter by status" value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
                <FilterSelect allLabel="All genders" label="Filter by gender" value={genderFilter} onChange={setGenderFilter} options={genderFilterOptions} />
                <FilterSelect
                  allLabel="Any registration date"
                  label="Filter by registration date"
                  value={registeredRange}
                  onChange={(value) => setRegisteredRange(value as DateRange)}
                  options={DATE_RANGE_OPTIONS}
                />
              </>
            }
            shown={visiblePatients.length}
            total={patients.length}
            active={hasActiveFilters && !loadingPatients}
            onClear={() => {
              setSearchQuery("");
              setDepartmentFilter("");
              setStatusFilter("");
              setGenderFilter("");
              setRegisteredRange("");
            }}
            noun="patients"
          />
        </div>

        <ResponsiveTableRegion label="Record Staff patient records">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-[#F5F7FA] text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th scope="col" className="min-w-[190px] bg-[#F5F7FA] px-5 py-3 font-semibold">Patient</th>
                <th className="px-5 py-3 font-semibold">Patient Code</th>
                <th className="px-5 py-3 font-semibold">Gender</th>
                <th className="px-5 py-3 font-semibold">Department</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingPatients && (
                <TableSkeleton columns={6} />
              )}

              {!loadingPatients && visiblePatients.length === 0 && (
                <tr>
                  <td className="px-5 py-8 text-center text-slate-500" colSpan={6}>
                    {hasActiveFilters ? "No patients match these filters." : "No patient records found yet."}
                  </td>
                </tr>
              )}

              {!loadingPatients &&
                visiblePatients.map((patient) => (
                  <tr key={patient.id} className={`border-t border-slate-100 ${patient.id ? "cursor-pointer hover:bg-slate-50" : ""}`} onClick={(event) => { if (patient.id && !isInteractiveTarget(event.target)) router.push(`/dashboard/record-staff/patient/${patient.id}`); }}>
                    <td className="bg-white px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700">
                          {patient.initials || "NA"}
                        </span>
                        <div>
                          <p className="font-medium text-[#111827]">{patient.name}</p>
                          <p className="text-xs text-slate-500">{patient.dateOfBirth}</p>
                        </div>
                      </div>
                    </td>
                    <td className="break-all px-5 py-4 font-mono text-xs text-slate-500">
                      {patient.patientCode}
                    </td>
                    <td className="px-5 py-4 text-slate-700">{patient.gender}</td>
                    <td className="px-5 py-4 text-slate-700">{patient.ward}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-semibold ${statusClassName(
                          patient.status,
                        )}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {patient.id ? (
                        <Link
                          href={`/dashboard/record-staff/patient/${patient.id}`}
                          aria-label={`View ${patient.name}`}
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

      <AddPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={() => void fetchPatients()}
      />
    </div>
  );
}
