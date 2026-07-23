"use client";

import { useMemo, useState } from "react";
import ComplianceSearchField from "./ComplianceSearchField";

type RoleAccess = {
  role: string;
  users: string;
  permissions: string[];
};

const roles: RoleAccess[] = [
  {
    role: "Admin",
    users: "2 active users",
    permissions: ["Full Access", "User Management", "Audit Logs"],
  },
  {
    role: "Doctor",
    users: "8 active users",
    permissions: ["Reports", "Patient Records", "Lab Results"],
  },
  {
    role: "Nurse",
    users: "6 active users",
    permissions: ["Patient Records", "Consultations", "Triage"],
  },
];

export function RoleAccessCard() {
  const [query, setQuery] = useState("");
  const filteredRoles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return roles;
    return roles.filter(
      ({ role, permissions }) =>
        role.toLowerCase().includes(normalizedQuery) ||
        permissions.some((permission) =>
          permission.toLowerCase().includes(normalizedQuery),
        ),
    );
  }, [query]);

  return (
    <section aria-labelledby="access-control-title">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="access-control-title" className="text-base font-medium text-slate-900">
          Access control
        </h2>
        <ComplianceSearchField
          label="Search role management"
          placeholder="Search Role Management..."
          value={query}
          onChange={setQuery}
        />
      </div>

      <div className="space-y-3">
        {filteredRoles.map(({ role, users, permissions }) => (
          <article
            key={role}
            className="rounded border border-slate-200 bg-white p-4 sm:p-5"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium text-slate-900">{role}</h3>
                <p className="mt-1 text-xs text-slate-500">{users}</p>
              </div>
              <button
                type="button"
                disabled
                title="Permission editing is not connected yet"
                className="dashboard-button min-h-10 w-full bg-[#EEEFFF] px-5 text-[#21178C] disabled:opacity-100 sm:w-auto"
              >
                Edit Permissions
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {permissions.map((permission) => (
                <span
                  key={permission}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700"
                >
                  {permission}
                </span>
              ))}
            </div>
          </article>
        ))}

        {filteredRoles.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500">
            No roles match your search.
          </div>
        )}
      </div>
    </section>
  );
}
