"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@context/AuthContext";
import { organizationService, type Membership } from "@services/api";
import DangerZoneSettings from "@components/dashboard/admin/settings/DangerZoneSettings";
import ProfileSettings from "@components/dashboard/admin/settings/ProfileSettings";
import SecuritySettings from "@components/dashboard/admin/settings/SecuritySettings";

const formatRole = (role: string) =>
  role
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

// Shared settings page for non-admin roles (doctor, nurse, lab
// scientist, pharmacist, record staff). It mirrors the admin settings
// structure — profile, security (password + two-factor), and danger
// zone — but omits the admin-only organization members section.
type RoleSettingsPageProps = {
  // The role key, e.g. "doctor" — used for the sr-only heading and the
  // job-title fallback.
  role: string;
  roleLabel: string;
};

export default function RoleSettingsPage({
  role,
  roleLabel,
}: RoleSettingsPageProps) {
  const { user, activeWorkspace } = useAuth();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [membershipUnavailable, setMembershipUnavailable] = useState(false);

  const loadMembership = useCallback(async () => {
    if (!activeWorkspace?.id) {
      setMembership(null);
      setMembershipUnavailable(false);
      return;
    }

    try {
      const result = await organizationService.getMyMembership(
        activeWorkspace.id,
      );
      setMembership(result);
      setMembershipUnavailable(false);
    } catch {
      setMembership(null);
      setMembershipUnavailable(true);
    }
  }, [activeWorkspace?.id]);

  useEffect(() => {
    void loadMembership();
  }, [loadMembership]);

  const profile = useMemo(() => {
    const firstName = user?.first_name?.trim() ?? "";
    const lastName = user?.last_name?.trim() ?? "";
    const email = user?.email?.trim() || "Email unavailable";
    const emailName = email.includes("@") ? email.split("@")[0] : roleLabel;
    const fullName = `${firstName} ${lastName}`.trim() || emailName;
    const displayName = firstName
      ? `${firstName}${lastName ? ` ${lastName[0].toUpperCase()}.` : ""}`
      : emailName;
    const fallbackRole =
      activeWorkspace?.role || membership?.role || role;
    const jobTitle = formatRole(fallbackRole);
    const department = membership?.department?.name || "Not assigned";

    return {
      fullName,
      displayName,
      email,
      jobTitle,
      department,
    };
  }, [activeWorkspace?.role, membership, role, roleLabel, user]);

  return (
    <div className="min-h-full bg-[#F7F8F8] px-4 py-6 md:px-8 lg:py-8">
      <div className="w-full space-y-9 sm:space-y-10">
        <h1 className="sr-only">{roleLabel} settings</h1>

        <ProfileSettings {...profile} membershipUnavailable={membershipUnavailable} />
        <SecuritySettings />
        <DangerZoneSettings />
      </div>
    </div>
  );
}
