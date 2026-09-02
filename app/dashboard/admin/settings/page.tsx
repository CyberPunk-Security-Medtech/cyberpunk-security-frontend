"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@context/AuthContext";
import {
  organizationService,
  type Membership,
  type OrganizationMember,
} from "@services/api";
import AdminMembersSettings from "@components/dashboard/admin/settings/AdminMembersSettings";
import DangerZoneSettings from "@components/dashboard/admin/settings/DangerZoneSettings";
import ProfileSettings from "@components/dashboard/admin/settings/ProfileSettings";
import SecuritySettings from "@components/dashboard/admin/settings/SecuritySettings";

const formatRole = (role: string) =>
  role
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

export default function AdminSettingsPage() {
  const { user, activeWorkspace } = useAuth();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [membershipUnavailable, setMembershipUnavailable] = useState(false);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState("");

  const loadOrganizationSettings = useCallback(async () => {
    if (!activeWorkspace?.id) {
      setMembership(null);
      setMembershipUnavailable(false);
      setMembers([]);
      setMembersError("");
      setMembersLoading(false);
      return;
    }

    setMembersLoading(true);
    setMembersError("");
    setMembershipUnavailable(false);

    const [membershipResult, membersResult] = await Promise.allSettled([
      organizationService.getMyMembership(activeWorkspace.id),
      organizationService.getMembers(activeWorkspace.id),
    ]);

    if (membershipResult.status === "fulfilled") {
      setMembership(membershipResult.value);
    } else {
      setMembership(null);
      setMembershipUnavailable(true);
    }

    if (membersResult.status === "fulfilled") {
      setMembers(Array.isArray(membersResult.value) ? membersResult.value : []);
    } else {
      setMembers([]);
      setMembersError("Unable to load organization members. Please try again.");
    }

    setMembersLoading(false);
  }, [activeWorkspace?.id]);

  useEffect(() => {
    void loadOrganizationSettings();
  }, [loadOrganizationSettings]);

  const profile = useMemo(() => {
    const firstName = user?.first_name?.trim() ?? "";
    const lastName = user?.last_name?.trim() ?? "";
    const email = user?.email?.trim() || "Email unavailable";
    const emailName = email.includes("@") ? email.split("@")[0] : "Administrator";
    const fullName = `${firstName} ${lastName}`.trim() || emailName;
    const displayName = firstName
      ? `${firstName}${lastName ? ` ${lastName[0].toUpperCase()}.` : ""}`
      : emailName;
    const role = membership?.role || activeWorkspace?.role || "Administrator";

    return {
      fullName,
      displayName,
      email,
      jobTitle: formatRole(role),
      department: membership?.department?.name || "Not assigned",
    };
  }, [activeWorkspace?.role, membership, user]);

  return (
    <div className="min-h-full bg-[#F7F8F8] px-4 py-6 md:px-8 lg:py-8">
      <div className="w-full space-y-9 sm:space-y-10">
        <h1 className="sr-only">Admin settings</h1>

        <ProfileSettings
          {...profile}
          membershipUnavailable={membershipUnavailable}
        />
        <SecuritySettings />
        <AdminMembersSettings
          members={members}
          loading={membersLoading}
          error={membersError}
          hasWorkspace={Boolean(activeWorkspace?.id)}
          onRetry={() => void loadOrganizationSettings()}
        />
        <DangerZoneSettings />
      </div>
    </div>
  );
}
