"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  patientService,
  type PatientListRecord,
  type PatientSearchResult,
} from "@services/api";
import { useAuth } from "@context/AuthContext";
import { resolvePatientAge } from "@utils/patientAge";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";

interface Patient {
  id: string;
  initials: string;
  name: string;
  age: number | string;
  gender: string;
  condition: string;
  status: string;
  date: string;
}

const statusClassName = (status: string) => {
  if (status === "Active") {
    return "text-[#00B8A8] bg-[#E6F8F7] border-[#A8E9E3]";
  }
  if (status === "Pending") {
    return "text-[#E0A500] bg-[#FFF7E6] border-[#F7D799]";
  }
  return "text-[#6B7280] bg-[#F3F4F6] border-[#E5E7EB]";
};

type PatientTableProps = {
  searchQuery?: string;
};

export default function PatientTable({ searchQuery = "" }: PatientTableProps) {
  const router = useRouter();
  const { activeWorkspace } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const patientCacheRef = useRef<{ orgId: string; records: PatientListRecord[] } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const normalizedQuery = searchQuery.trim();

    const fetchPatients = async () => {
      setLoading(true);
      setError("");

      try {
        if (!activeWorkspace?.id) {
          if (!cancelled) setPatients([]);
          return;
        }

        let data: Array<PatientListRecord | PatientSearchResult>;

        if (normalizedQuery.length >= 2) {
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
          initials: `${p.first_name?.[0] ?? ""}${p.last_name?.[0] ?? ""}`.toUpperCase(),
          name: `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "Unknown Patient",
          age: resolvePatientAge(p.age, p.dob ?? p.date_of_birth),
          gender: p.gender || "-",
          condition: p.symptoms || "N/A",
          status: p.status || "Active",
          date: p.created_at
            ? new Date(p.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })
            : "-",
        }));

        if (!cancelled) setPatients(mappedPatients);
      } catch (requestError) {
        console.error("Failed to fetch patients:", requestError);
        if (!cancelled) {
          setPatients([]);
          setError("Unable to load patient records. Please try again.");
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

  if (loading) return <p className="p-4 text-gray-500">Loading patients...</p>;
  if (error) return <p role="alert" className="p-4 text-red-700">{error}</p>;
  if (!loading && patients.length === 0) {
    return (
      <p className="p-4 text-gray-500">
        {searchQuery.trim().length >= 2 ? `No patients found for “${searchQuery.trim()}”.` : "No patients found."}
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
      <ResponsiveTableRegion label="Doctor patient records">
        <table className="w-full min-w-[920px] border-collapse text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th scope="col" className="min-w-[190px] bg-gray-50 px-4 py-3 font-medium">Patient Name</th>
              <th className="px-4 py-3 font-medium">Patient ID</th>
              <th className="px-4 py-3 font-medium">Age</th>
              <th className="px-4 py-3 font-medium">Gender</th>
              <th className="px-4 py-3 font-medium">Condition</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last Visit</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="group cursor-pointer border-b bg-white hover:bg-gray-50"
                onClick={() => router.push(`/dashboard/doctor/patient/${patient.id}`)}
              >
                <td className="bg-white px-4 py-3 group-hover:bg-gray-50">
                  <div className="flex items-center gap-3 font-medium text-[#1A2380]">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-[#E6F8F7] text-xs font-semibold text-[#00B8A8]">
                      {patient.initials || "NA"}
                    </div>
                    <span className="break-words">{patient.name}</span>
                  </div>
                </td>
                <td className="break-all px-4 py-3">{patient.id}</td>
                <td className="px-4 py-3">{patient.age}</td>
                <td className="px-4 py-3">{patient.gender}</td>
                <td className="px-4 py-3">
                  <span className="line-clamp-1">{patient.condition}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusClassName(
                      patient.status
                    )}`}
                  >
                    {patient.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{patient.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ResponsiveTableRegion>

      <div className="hidden">
        {patients.map((patient) => (
          <button
            key={`mobile-${patient.id}`}
            type="button"
            onClick={() => router.push(`/dashboard/doctor/patient/${patient.id}`)}
            className="w-full rounded-lg border border-gray-200 p-4 text-left shadow-sm transition hover:bg-gray-50"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#E6F8F7] text-xs font-semibold text-[#00B8A8]">
                  {patient.initials || "NA"}
                </div>
                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold text-[#1A2380]">{patient.name}</p>
                  <p className="break-all text-xs text-gray-500">{patient.id}</p>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2 py-1 text-xs font-medium ${statusClassName(
                  patient.status
                )}`}
              >
                {patient.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              <p className="text-gray-500">
                Age: <span className="text-gray-800">{patient.age}</span>
              </p>
              <p className="text-gray-500">
                Gender: <span className="text-gray-800">{patient.gender}</span>
              </p>
              <p className="col-span-2 text-gray-500">
                Condition: <span className="break-words text-gray-800">{patient.condition}</span>
              </p>
              <p className="col-span-2 text-gray-500">
                Last Visit: <span className="text-gray-800">{patient.date}</span>
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
