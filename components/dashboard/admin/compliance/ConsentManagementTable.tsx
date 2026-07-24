"use client";

import { useMemo, useState } from "react";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import ComplianceSearchField from "./ComplianceSearchField";

type ConsentRecord = {
  patient: string;
  action: string;
  facility: string;
  duration: string;
  timestamp: string;
};

const consentRecords: ConsentRecord[] = [
  {
    patient: "John Doe",
    action: "Granted consent",
    facility: "General Hospital B",
    duration: "48 hours",
    timestamp: "2024-01-15 14:30:22",
  },
  {
    patient: "John Doe",
    action: "Revoked emergency access",
    facility: "Emergency Center",
    duration: "N/A",
    timestamp: "2024-01-15 14:30:22",
  },
  {
    patient: "John Doe",
    action: "Extended sharing consent",
    facility: "Specialist Clinic",
    duration: "72 hours",
    timestamp: "2024-01-15 14:30:22",
  },
];

export function ConsentManagementTable() {
  const [query, setQuery] = useState("");
  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return consentRecords;

    return consentRecords.filter((record) =>
      Object.values(record).some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [query]);

  return (
    <section aria-labelledby="consent-management-title">
      <div className="mb-5 flex justify-end">
        <h2 id="consent-management-title" className="sr-only">
          Consent Management
        </h2>
        <ComplianceSearchField
          label="Search consent management records"
          placeholder="Search Consent Management..."
          value={query}
          onChange={setQuery}
        />
      </div>

      <ResponsiveTableRegion label="Consent management records">
        <table className="w-full min-w-[62rem] text-sm">
          <thead className="text-slate-950">
            <tr>
              <th scope="col" className="min-w-[9rem] px-5 py-4 text-left font-semibold">
                Patient
              </th>
              <th scope="col" className="min-w-[17rem] px-5 py-4 text-left font-semibold">
                Action
              </th>
              <th scope="col" className="min-w-[13rem] px-5 py-4 text-left font-semibold">
                Facility
              </th>
              <th scope="col" className="min-w-[10rem] px-5 py-4 text-left font-semibold">
                Duration
              </th>
              <th scope="col" className="min-w-[13rem] px-5 py-4 text-left font-semibold">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map(({ patient, action, facility, duration, timestamp }) => (
              <tr key={`${patient}-${action}`}>
                <td className="px-5 py-4">{patient}</td>
                <td className="px-5 py-4">{action}</td>
                <td className="px-5 py-4">{facility}</td>
                <td className="px-5 py-4">{duration}</td>
                <td className="px-5 py-4 tabular-nums">{timestamp}</td>
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                  No consent records match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ResponsiveTableRegion>
    </section>
  );
}
