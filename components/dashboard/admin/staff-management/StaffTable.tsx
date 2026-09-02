"use client";

import { useEffect, useState } from "react";
import { invitationService } from "@services/api";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import Pagination from "@components/dashboard/admin/staff-management/Pagination";

const PAGE_SIZE = 10;

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
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!activeWorkspace?.id) return;

    invitationService
      .getOrganizationInvitations(activeWorkspace.id)
      .then((rows) => {
        setInvitations(rows);
        setPage(1);
      })
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

  const totalPages = Math.max(1, Math.ceil(invitations.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedInvitations = invitations.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return (
    <ResponsiveTableRegion label="Staff invitations">
    <table className="w-full min-w-[760px] text-sm">
      <thead>
        <tr className="bg-slate-50 text-xs font-medium text-slate-600">
          <th scope="col" className="w-[40%] min-w-[280px] bg-slate-50 px-4 py-3 text-left">Email</th>
          <th scope="col" className="w-[20%] min-w-[140px] px-4 py-3 text-left">Role</th>
          <th scope="col" className="w-[20%] min-w-[130px] px-4 py-3 text-right">Status</th>
          <th scope="col" className="w-[20%] min-w-[150px] px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        {pagedInvitations.map((inv, i) => (
          <tr key={inv.email} className={i % 2 ? "bg-slate-50/50" : "bg-white"}>
            <td className="bg-inherit px-4 py-3">{inv.email}</td>
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
            <td className="px-4 py-3 text-right">
              <Menu>
                <MenuButton className="min-h-10 rounded-full border px-4 text-xs hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466]">
                  Actions
                </MenuButton>
                <MenuItems
                  anchor="bottom end"
                  className="z-dropdown mt-2 w-40 rounded-lg border bg-white p-1 shadow-lg focus:outline-none"
                >
                  <MenuItem>
                    <button
                      disabled={inv.status === "accepted"}
                      onClick={() => handleResend(inv)}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-50 focus:bg-slate-50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Resend Invite
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={() => handleRevoke(inv.id)}
                      className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none"
                    >
                      Revoke Invite
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {invitations.length === 0 && (
      <p className="px-4 py-8 text-center text-sm text-slate-500">
        No staff invitations yet.
      </p>
    )}

    {totalPages > 1 && (
      <div className="border-t px-4 py-3">
        <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
      </div>
    )}
    </ResponsiveTableRegion>
  );
}
