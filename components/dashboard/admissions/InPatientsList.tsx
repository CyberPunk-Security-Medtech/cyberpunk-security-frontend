"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@context/AuthContext";
import {
  admissionService,
  wardService,
  type Admission,
  type AdmissionStatus,
  type Ward,
} from "@services/api";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import { Select } from "@components/Field";
import { TableSkeleton } from "@components/Skeletons";
import { getApiErrorMessage } from "@utils/apiError";
import { buildDisplayName } from "@utils/helper";
import { DischargeModal, MoveWardModal, describeWardOccupancy } from "./AdmissionDialogs";

type InPatientsListProps = {
  /** Where a patient's name links to, e.g. the role's patient detail page. */
  patientHref: (patientId: string) => string;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

export default function InPatientsList({ patientHref }: InPatientsListProps) {
  const { activeWorkspace, hydrated } = useAuth();
  const orgId = activeWorkspace?.id ?? null;

  const [status, setStatus] = useState<AdmissionStatus>("Admitted");
  const [wardId, setWardId] = useState("");
  const [wards, setWards] = useState<Ward[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [moving, setMoving] = useState<Admission | null>(null);
  const [discharging, setDischarging] = useState<Admission | null>(null);

  const loadWards = useCallback(async () => {
    if (!orgId) return;
    try {
      const result = await wardService.listWards(orgId);
      setWards(Array.isArray(result) ? result : []);
    } catch (requestError) {
      console.error("Failed to load wards", requestError);
    }
  }, [orgId]);

  const loadAdmissions = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    setError("");
    try {
      const result = await admissionService.listAdmissions(orgId, {
        status_filter: status,
        ward_id: wardId || undefined,
      });
      setAdmissions(Array.isArray(result) ? result : []);
    } catch (requestError) {
      console.error("Failed to load admissions", requestError);
      setAdmissions([]);
      setError(getApiErrorMessage(requestError, "Unable to load in-patients. Please try again."));
    } finally {
      setLoading(false);
    }
  }, [orgId, status, wardId]);

  useEffect(() => {
    if (hydrated) void loadWards();
  }, [hydrated, loadWards]);

  useEffect(() => {
    if (hydrated) void loadAdmissions();
  }, [hydrated, loadAdmissions]);

  // Moves and discharges change both the list and ward occupancy.
  const handleChanged = () => {
    void loadAdmissions();
    void loadWards();
  };

  const isAdmittedView = status === "Admitted";
  const columns = 6;

  return (
    <div className="space-y-6 py-2 sm:py-4">
      <section>
        <h1 className="dashboard-page-title">In-patients</h1>
        <p className="mt-1 text-sm text-slate-600">
          Patients currently on a ward, and past admissions.
        </p>
      </section>

      {!orgId && hydrated ? (
        <div className="rounded-md border bg-white p-5 text-sm text-slate-600">
          No active organization selected.
        </div>
      ) : (
        <section className="overflow-hidden rounded-md border bg-white">
          <div className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-end">
            <div className="sm:w-48">
              <label htmlFor="inpatients-status" className="mb-1 block text-xs font-medium text-slate-600">
                Status
              </label>
              <Select
                id="inpatients-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as AdmissionStatus)}
              >
                <option value="Admitted">Admitted</option>
                <option value="Discharged">Discharged</option>
              </Select>
            </div>
            <div className="sm:w-72">
              <label htmlFor="inpatients-ward" className="mb-1 block text-xs font-medium text-slate-600">
                Ward
              </label>
              <Select id="inpatients-ward" value={wardId} onChange={(e) => setWardId(e.target.value)}>
                <option value="">All wards</option>
                {wards.map((ward) => (
                  <option key={ward.id} value={ward.id}>
                    {ward.name} — {describeWardOccupancy(ward)}
                  </option>
                ))}
              </Select>
            </div>
            <p className="text-sm text-slate-500 sm:ml-auto" aria-live="polite">
              {loading ? "" : `${admissions.length} ${admissions.length === 1 ? "patient" : "patients"}`}
            </p>
          </div>

          {error ? (
            <div className="p-5" role="alert">
              <p className="text-sm text-red-700">{error}</p>
              <button
                type="button"
                onClick={() => void loadAdmissions()}
                className="mt-2 text-sm font-medium text-[var(--dashboard-accent,#1A2380)] underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          ) : (
            <ResponsiveTableRegion label="In-patients">
              <table className="w-full min-w-[860px] text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">Patient</th>
                    <th scope="col" className="px-5 py-3 font-medium">Ward / bed</th>
                    <th scope="col" className="px-5 py-3 font-medium">Admitted</th>
                    <th scope="col" className="px-5 py-3 font-medium">Reason</th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      {isAdmittedView ? "Admitted by" : "Discharged"}
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      <span className={isAdmittedView ? "" : "sr-only"}>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <TableSkeleton columns={columns} />
                  ) : admissions.length === 0 ? (
                    <tr>
                      <td colSpan={columns} className="px-5 py-6 text-center text-slate-500">
                        {isAdmittedView
                          ? "No patients are currently admitted."
                          : "No discharged admissions found."}
                      </td>
                    </tr>
                  ) : (
                    admissions.map((admission) => {
                      const name =
                        `${admission.patient?.first_name ?? ""} ${admission.patient?.last_name ?? ""}`.trim() ||
                        "Patient";
                      return (
                        <tr key={admission.id} className="border-t align-top">
                          <td className="px-5 py-4">
                            <Link
                              href={patientHref(admission.patient_id)}
                              className="font-medium text-[var(--dashboard-accent,#1A2380)] hover:underline"
                            >
                              {name}
                            </Link>
                            <p className="font-mono text-xs text-slate-500">
                              {admission.patient?.patient_code || "-"}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-medium text-slate-800">{admission.ward?.name || "-"}</p>
                            <p className="text-xs text-slate-500">
                              {admission.bed_number ? `Bed ${admission.bed_number}` : "No bed assigned"}
                            </p>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4">{formatDateTime(admission.admitted_at)}</td>
                          <td className="max-w-[240px] px-5 py-4 text-slate-700">
                            <p className="line-clamp-2" title={admission.reason ?? undefined}>
                              {admission.reason || "-"}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-slate-700">
                            {isAdmittedView ? (
                              buildDisplayName(admission.admitted_by_user ?? null) || "-"
                            ) : (
                              <>
                                <p className="whitespace-nowrap">{formatDateTime(admission.discharged_at)}</p>
                                {admission.discharged_by_user && (
                                  <p className="text-xs text-slate-500">
                                    by {buildDisplayName(admission.discharged_by_user)}
                                  </p>
                                )}
                              </>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            {isAdmittedView && (
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setMoving(admission)}
                                  className="whitespace-nowrap rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                  Move ward
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDischarging(admission)}
                                  className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                                >
                                  Discharge
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </ResponsiveTableRegion>
          )}
        </section>
      )}

      <MoveWardModal
        orgId={orgId}
        admission={moving}
        onClose={() => setMoving(null)}
        onMoved={handleChanged}
      />
      <DischargeModal
        orgId={orgId}
        admission={discharging}
        onClose={() => setDischarging(null)}
        onDischarged={handleChanged}
      />
    </div>
  );
}
