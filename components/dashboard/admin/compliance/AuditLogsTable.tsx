"use client";

import { useMemo, useState } from "react";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import ComplianceSearchField from "./ComplianceSearchField";

type AuditLog = {
  staffName: string;
  action: string;
};

const auditLogs: AuditLog[] = [
  { staffName: "Dr Tunde Adeola", action: "Viewed Patient Record" },
  { staffName: "Nurse Shola Opeyele", action: "Viewed Patient Record" },
  { staffName: "Sci. Femi Davis", action: "Viewed Patient Record" },
  { staffName: "Dr Segun Olawole", action: "Viewed Patient Record" },
  { staffName: "Matron Simisola Ogunleye", action: "Updated Patient Record" },
];

const initials = (name: string) =>
  name
    .replace(/^(Dr|Nurse|Sci\.|Matron)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export default function AuditLogsTable() {
  const [query, setQuery] = useState("");
  const filteredLogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return auditLogs;

    return auditLogs.filter(({ staffName, action }) =>
      `${staffName} ${action}`.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  return (
    <section aria-labelledby="audit-trail-title">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="audit-trail-title" className="text-base font-medium text-slate-900">
          Audit Trail
        </h2>
        <ComplianceSearchField
          label="Search audit logs"
          placeholder="Search audit logs..."
          value={query}
          onChange={setQuery}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white">
        <ResponsiveTableRegion label="Audit trail records">
          <table className="w-full min-w-[42rem] text-sm">
            <thead className="bg-[#FAFAFB] text-xs font-medium text-slate-500">
              <tr>
                <th scope="col" className="w-[55%] px-5 py-4 text-left">
                  Staff Name
                </th>
                <th scope="col" className="px-5 py-4 text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(({ staffName, action }) => (
                <tr key={staffName} className="border-t border-slate-200">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF8F6] text-sm font-medium text-[#006B5F]"
                      >
                        {initials(staffName)}
                      </span>
                      <span className="font-medium text-slate-900">{staffName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-900">{action}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-5 py-10 text-center text-slate-500">
                    No audit logs match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </ResponsiveTableRegion>
      </div>
    </section>
  );
}
