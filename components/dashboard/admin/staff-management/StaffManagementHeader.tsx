"use client";

import { useEffect, useState } from "react";
import { invitationService } from "@services/api";
import { useAuth } from "@context/AuthContext";

export default function StaffManagementHeader() {
  const { activeWorkspace } = useAuth();
  const [activeStaff, setActiveStaff] = useState<number | null>(null);

  useEffect(() => {
    if (!activeWorkspace?.id) return;

    let cancelled = false;

    invitationService
      .getOrganizationInvitations(activeWorkspace.id)
      .then((rows) => {
        if (cancelled) return;
        // Only staff who accepted their invitation are active — pending,
        // expired, and revoked invitations are excluded.
        setActiveStaff(
          rows.filter((row) => row.status === "accepted").length,
        );
      })
      .catch(() => {
        if (!cancelled) setActiveStaff(null);
      });

    return () => {
      cancelled = true;
    };
  }, [activeWorkspace?.id]);

  return (
    <div className="space-y-1">
      <h1 className="dashboard-page-title">Staff Management</h1>
      <p className="text-sm text-slate-500">
        Monitor staffs approve and suspended, add new staffs
      </p>
      {activeStaff !== null ? (
        <p className="text-sm font-medium text-emerald-700">
          {activeStaff} active {activeStaff === 1 ? "staff" : "staffs"}
        </p>
      ) : null}
    </div>
  );
}
