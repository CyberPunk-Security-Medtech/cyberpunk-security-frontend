"use client";

import Link from "next/link";
import type { OrganizationMember } from "@services/api";
import SettingsSection from "./SettingsSection";

type AdminMembersSettingsProps = {
  members: OrganizationMember[];
  loading: boolean;
  error: string;
  hasWorkspace: boolean;
  onRetry: () => void;
};

const formatRole = (role: string) =>
  role
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const formatJoinedDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Organization member";
  return `Joined ${date.toLocaleDateString(undefined, { month: "short", year: "numeric" })}`;
};

export default function AdminMembersSettings({
  members,
  loading,
  error,
  hasWorkspace,
  onRetry,
}: AdminMembersSettingsProps) {
  const countLabel = `${members.length} ${members.length === 1 ? "member" : "members"}`;

  return (
    <SettingsSection id="admin-members-settings" title="Admin">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500" aria-live="polite">
          {loading ? "Loading members..." : countLabel}
        </p>
        {hasWorkspace ? (
          <Link
            href="/dashboard/admin/staff-management/StaffOnboarding"
            className="dashboard-button min-h-11 rounded-lg bg-[#1A2380] px-5 text-sm font-semibold text-white hover:bg-[#11185F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466] focus-visible:ring-offset-2 sm:min-h-10"
          >
            + Invite Member
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="dashboard-button min-h-11 rounded-lg bg-[#1A2380] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-10"
          >
            + Invite Member
          </button>
        )}
      </div>

      {!hasWorkspace && (
        <p role="status" className="mt-5 rounded-lg bg-amber-50 px-3 py-3 text-sm text-amber-800">
          Select an organization workspace to view and invite members.
        </p>
      )}

      {hasWorkspace && loading && (
        <div className="mt-4 space-y-2" aria-label="Loading organization members">
          {[0, 1, 2].map((item) => (
            <div key={item} className="flex animate-pulse items-center gap-4 border-t border-slate-200 py-5 first:border-t-0">
              <div className="h-12 w-12 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-slate-200" />
                <div className="h-3 w-28 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {hasWorkspace && !loading && error && (
        <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="dashboard-button mt-3 min-h-10 rounded-lg border border-red-300 px-4 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      )}

      {hasWorkspace && !loading && !error && members.length === 0 && (
        <p className="mt-5 rounded-lg bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          No organization members were found.
        </p>
      )}

      {hasWorkspace && !loading && !error && members.length > 0 && (
        <ul className="mt-3" aria-label="Organization members">
          {members.map((member, index) => {
            const fullName = `${member.user.first_name} ${member.user.last_name}`.trim();
            const initials = `${member.user.first_name?.[0] ?? ""}${member.user.last_name?.[0] ?? ""}`.toUpperCase() || "M";
            const detail = member.department?.name || formatJoinedDate(member.joined_at);

            return (
              <li
                key={member.user.id}
                className={`flex flex-col gap-4 py-5 sm:flex-row sm:items-center ${index > 0 ? "border-t border-slate-300" : ""}`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1A2380] text-base font-medium text-white">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="break-words text-base font-medium text-slate-900">{fullName || "Organization member"}</p>
                    <p className="mt-1 break-words text-xs text-slate-500">{detail}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <span className="rounded-full border border-slate-300 bg-slate-100 px-4 py-1 text-xs text-slate-700">
                    {formatRole(member.role)}
                  </span>
                  <span className="rounded-full border border-[#00B8A8] bg-cyan-50 px-4 py-1 text-xs text-[#00796B]">
                    Active
                  </span>
                  <button
                    type="button"
                    disabled
                    aria-describedby="member-removal-unavailable"
                    className="min-h-11 rounded-full border border-red-300 bg-red-100 px-4 text-xs text-red-600 disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-10"
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p id="member-removal-unavailable" className="mt-3 text-xs leading-5 text-slate-500">
        Member removal and status changes are not available yet.
      </p>
    </SettingsSection>
  );
}
