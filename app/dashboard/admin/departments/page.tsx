"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@components/dashboard/admin/Sidebar";
import Header from "@components/Header";
import { useAuth } from "@context/AuthContext";
import { organizationService } from "@services/api";

type Department = {
  id: string;
  name: string;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
};

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString();
};

export default function DepartmentManagementPage() {
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id ?? null;

  const [departments, setDepartments] = useState<Department[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCreate = useMemo(() => name.trim().length > 0 && !creating, [name, creating]);

  const loadDepartments = async () => {
    if (!orgId) {
      setDepartments([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await organizationService.getDepartments(orgId);
      setDepartments(Array.isArray(res) ? res : []);
    } catch {
      setError("Failed to load departments.");
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
    // orgId is the actual dependency; loadDepartments is recreated on render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!orgId || !trimmedName) return;

    setCreating(true);
    setError(null);
    try {
      const created = await organizationService.createDepartment(orgId, { name: trimmedName });
      setDepartments((prev) => {
        if (prev.some((item) => item.id === created.id)) return prev;
        return [created, ...prev];
      });
      setName("");
    } catch {
      setError("Failed to create department. Ensure your account has admin access.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <Header />

        <div className="p-6 space-y-6">
          <section>
            <h1 className="text-2xl font-semibold">Department Management</h1>
            <p className="mt-1 text-sm text-slate-600">
              Create and review departments for the selected organization.
            </p>
          </section>

          {!orgId ? (
            <div className="rounded-xl border bg-white p-5 text-sm text-slate-600">
              No active organization selected.
            </div>
          ) : (
            <>
              <section className="rounded-xl border bg-white p-5">
                <h2 className="text-base font-semibold">Create Department</h2>
                <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleCreate}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Department name (e.g., Cardiology)"
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#051466]"
                  />
                  <button
                    type="submit"
                    disabled={!canCreate}
                    className="rounded-lg bg-[#051466] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {creating ? "Creating..." : "Create Department"}
                  </button>
                </form>
                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              </section>

              <section className="rounded-xl border bg-white overflow-hidden">
                <div className="border-b px-5 py-3">
                  <h2 className="text-base font-semibold">Departments</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-sm">
                    <thead className="bg-slate-50 text-left text-slate-600">
                      <tr>
                        <th className="px-5 py-3 font-medium">Name</th>
                        <th className="px-5 py-3 font-medium">Department ID</th>
                        <th className="px-5 py-3 font-medium">Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td className="px-5 py-4 text-slate-600" colSpan={3}>
                            Loading departments...
                          </td>
                        </tr>
                      ) : departments.length === 0 ? (
                        <tr>
                          <td className="px-5 py-4 text-slate-600" colSpan={3}>
                            No departments found.
                          </td>
                        </tr>
                      ) : (
                        departments.map((department) => (
                          <tr key={department.id} className="border-t">
                            <td className="px-5 py-4">{department.name}</td>
                            <td className="px-5 py-4 font-mono text-xs">{department.id}</td>
                            <td className="px-5 py-4">{formatDateTime(department.created_at)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
