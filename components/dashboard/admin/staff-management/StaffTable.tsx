"use client";

import { useEffect, useState, useRef } from "react";
import { invitationService } from "@services/api";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
  department_id?: string | null;
}

export default function StaffTable() {
  const { activeWorkspace } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    if (!activeWorkspace?.id) return;

    invitationService
      .getOrganizationInvitations(activeWorkspace.id)
      .then(setInvitations)
      .catch(console.error);
  }, [activeWorkspace?.id]);
const handleRevoke = async (invId: string) => {
  if (!activeWorkspace?.id) return;

  try {
    await invitationService.revokeInvitation(
      activeWorkspace.id,
      invId
    );

    setInvitations((prev) =>
      prev.filter((inv) => inv.id !== invId)
    );

    toast.success("Invitation revoked successfully");
    setOpenMenu(null);
  } catch (error) {
    let message = "Failed to revoke invitation";

    if (axios.isAxiosError(error)) {
      message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        message;
    }

    toast.error(message);
  }
};



const handleResend = async (inv: Invitation) => {
  if (!activeWorkspace?.id) return;

  try {
    await invitationService.sendInvitation(
      inv.email,
      inv.role,
      activeWorkspace.id,
      inv.department_id ?? null,
    );

    toast.success(`Invitation resent to ${inv.email}`);
    setOpenMenu(null);
  } catch (error) {
    let message = "Unable to resend invitation";

    if (axios.isAxiosError(error)) {
      message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        message;
    }

    toast.error(message);
  }
};

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-slate-50 text-xs font-medium text-slate-600">
          <th className="px-4 py-3 text-left w-[40%]">Email</th>
          <th className="px-4 py-3 text-left w-[20%]">Role</th>
          <th className="px-4 py-3 text-right w-[20%]">Status</th>
          <th className="px-4 py-3 text-right w-[20%]">Actions</th>
        </tr>
      </thead>

      <tbody>
        {invitations.map((inv, i) => (
          <tr key={inv.email} className={i % 2 ? "bg-slate-50/50" : ""}>
            <td className="px-4 py-3">{inv.email}</td>
            <td className="px-4 py-3 capitalize">{inv.role}</td>

            <td className="px-4 py-3 text-right">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium
                  ${
                    inv.status === "accepted"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
              >
                {inv.status}
              </span>
            </td>

            {/* ACTIONS */}
            <td className="px-4 py-3 text-right relative">
              <button
                onClick={() =>
                  setOpenMenu(
                    openMenu === inv.email ? null : inv.email
                  )
                }
                className="px-4 py-1 border rounded-full text-xs hover:bg-slate-50"
              >
                Actions
              </button>

              {openMenu === inv.email && (
                <div className="absolute right-4 mt-2 w-40 bg-white border rounded-lg shadow-lg z-20">
                 <button
  disabled={inv.status === "accepted"}
  onClick={() => handleResend(inv)}
  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
>
  Resend Invite
</button>

                  <button
                    onClick={() => handleRevoke(inv.id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Revoke Invite
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
