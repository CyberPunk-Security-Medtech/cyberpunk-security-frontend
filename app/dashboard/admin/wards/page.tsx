"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@context/AuthContext";
import { wardService, type Ward } from "@services/api";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import Button from "@components/Button";
import { TableSkeleton } from "@components/Skeletons";
import { getApiErrorMessage } from "@utils/apiError";

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString();
};

function Occupancy({ ward }: { ward: Ward }) {
  const occupied = ward.occupied ?? 0;
  if (ward.capacity == null) {
    return <span>{occupied} occupied · no bed limit</span>;
  }
  const ratio = ward.capacity > 0 ? Math.min(occupied / ward.capacity, 1) : 1;
  const full = occupied >= ward.capacity;
  return (
    <div className="min-w-[160px]">
      <div className="flex justify-between text-xs">
        <span className={full ? "font-semibold text-red-700" : "text-slate-700"}>
          {occupied}/{ward.capacity} beds
        </span>
        <span className="text-slate-500">{full ? "Full" : `${ward.capacity - occupied} free`}</span>
      </div>
      <div
        className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
        role="meter"
        aria-label={`${ward.name} occupancy`}
        aria-valuemin={0}
        aria-valuemax={ward.capacity}
        aria-valuenow={occupied}
      >
        <div
          className={`h-full rounded-full ${full ? "bg-red-500" : ratio >= 0.8 ? "bg-amber-500" : "bg-[#051466]"}`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function WardManagementPage() {
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id ?? null;

  const [wards, setWards] = useState<Ward[]>([]);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWards = async () => {
    if (!orgId) {
      setWards([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await wardService.listWards(orgId);
      setWards(Array.isArray(res) ? res : []);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Failed to load wards."));
      setWards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWards();
    // orgId is the actual dependency; loadWards is recreated on render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!orgId || !trimmedName) return;

    const capacityValue = capacity.trim() ? Number(capacity) : null;
    if (
      capacityValue !== null &&
      (!Number.isInteger(capacityValue) || capacityValue < 1 || capacityValue > 10000)
    ) {
      setError("Capacity must be a whole number between 1 and 10,000, or left blank.");
      return;
    }

    setCreating(true);
    setError(null);
    try {
      const created = await wardService.createWard(orgId, {
        name: trimmedName,
        capacity: capacityValue,
      });
      setWards((prev) => {
        if (prev.some((item) => item.id === created.id)) return prev;
        return [created, ...prev];
      });
      setName("");
      setCapacity("");
      toast.success(`${created.name} created`);
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "Failed to create ward. Ensure your account has admin access.",
        ),
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <section>
        <h1 className="dashboard-page-title">Wards</h1>
        <p className="mt-1 text-sm text-slate-600">
          Set up in-patient wards and see how many beds are in use.
        </p>
      </section>

      {!orgId ? (
        <div className="rounded-md border bg-white p-5 text-sm text-slate-600">
          No active organization selected.
        </div>
      ) : (
        <>
          <section className="rounded-md border bg-white p-5">
            <h2 className="text-base font-semibold">Create Ward</h2>
            <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleCreate}>
              <label className="sr-only" htmlFor="ward-name">Ward name</label>
              <input
                id="ward-name"
                type="text"
                maxLength={255}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ward name (e.g., Male Medical)"
                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#051466]"
              />
              <label className="sr-only" htmlFor="ward-capacity">Capacity (beds, optional)</label>
              <input
                id="ward-capacity"
                type="number"
                inputMode="numeric"
                min={1}
                max={10000}
                step={1}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Beds (optional)"
                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#051466] sm:w-44"
              />
              <Button
                type="submit"
                disabled={!name.trim() || creating}
                className="rounded-md !bg-[#051466] text-sm"
              >
                {creating ? "Creating..." : "Create Ward"}
              </Button>
            </form>
            <p className="mt-2 text-xs text-slate-500">
              With a bed capacity set, admissions into a full ward are refused.
            </p>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </section>

          <section className="rounded-md border bg-white overflow-hidden">
            <div className="border-b px-5 py-3">
              <h2 className="text-base font-semibold">Wards</h2>
            </div>
            <ResponsiveTableRegion label="Wards">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th scope="col" className="min-w-[180px] bg-slate-50 px-5 py-3 font-medium">Name</th>
                    <th scope="col" className="px-5 py-3 font-medium">Occupancy</th>
                    <th scope="col" className="px-5 py-3 font-medium">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <TableSkeleton columns={3} />
                  ) : wards.length === 0 ? (
                    <tr>
                      <td className="px-5 py-4 text-slate-600" colSpan={3}>
                        No wards yet. Create one above to start admitting patients.
                      </td>
                    </tr>
                  ) : (
                    wards.map((ward) => (
                      <tr key={ward.id} className="border-t">
                        <td className="bg-white px-5 py-4 font-medium">{ward.name}</td>
                        <td className="px-5 py-4">
                          <Occupancy ward={ward} />
                        </td>
                        <td className="px-5 py-4">{formatDateTime(ward.created_at)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </ResponsiveTableRegion>
          </section>
        </>
      )}
    </div>
  );
}
