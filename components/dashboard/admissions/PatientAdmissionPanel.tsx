"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRightLeft, BedDouble, LogOut } from "lucide-react";
import { patientService, type Admission } from "@services/api";
import { LoaderIcon } from "@components/Skeletons";
import { getApiErrorMessage } from "@utils/apiError";
import { buildDisplayName } from "@utils/helper";
import { AdmitPatientModal, DischargeModal, MoveWardModal } from "./AdmissionDialogs";

type PatientAdmissionPanelProps = {
  orgId: string | null | undefined;
  patientId: string;
  patientName: string;
  /** Called after an admit/move/discharge so the parent can refresh the patient (badge). */
  onChange?: () => void;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

const location = (admission: Admission) =>
  [admission.ward?.name, admission.bed_number ? `Bed ${admission.bed_number}` : null]
    .filter(Boolean)
    .join(" · ");

const actionButton =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold disabled:opacity-50";

export default function PatientAdmissionPanel({
  orgId,
  patientId,
  patientName,
  onChange,
}: PatientAdmissionPanelProps) {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [admitOpen, setAdmitOpen] = useState(false);
  const [moving, setMoving] = useState<Admission | null>(null);
  const [discharging, setDischarging] = useState<Admission | null>(null);

  const loadAdmissions = useCallback(async () => {
    if (!orgId || !patientId) return;
    setLoading(true);
    setError("");
    try {
      const result = await patientService.getPatientAdmissions(orgId, patientId);
      setAdmissions(Array.isArray(result) ? result : []);
    } catch (requestError) {
      console.error("Failed to load admissions", requestError);
      setError(getApiErrorMessage(requestError, "Unable to load admission history."));
    } finally {
      setLoading(false);
    }
  }, [orgId, patientId]);

  useEffect(() => {
    void loadAdmissions();
  }, [loadAdmissions]);

  const handleChanged = () => {
    void loadAdmissions();
    onChange?.();
  };

  const current = admissions.find((admission) => admission.status === "Admitted") ?? null;

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Admission</h2>
          <p className="text-sm text-slate-500">
            {current ? "Currently an in-patient." : "Not currently admitted."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {current ? (
            <>
              <button
                type="button"
                onClick={() => setMoving(current)}
                className={`${actionButton} border border-slate-300 text-slate-700 hover:bg-slate-50`}
              >
                <ArrowRightLeft size={16} aria-hidden="true" /> Move ward
              </button>
              <button
                type="button"
                onClick={() => setDischarging(current)}
                className={`${actionButton} bg-red-600 text-white hover:bg-red-700`}
              >
                <LogOut size={16} aria-hidden="true" /> Discharge
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setAdmitOpen(true)}
              disabled={loading || !orgId}
              className={`${actionButton} bg-[var(--dashboard-accent,#1A2380)] text-white hover:bg-[var(--dashboard-accent-hover,#11185F)]`}
            >
              <BedDouble size={16} aria-hidden="true" /> Admit
            </button>
          )}
        </div>
      </div>

      {current && (
        <div className="mt-4 grid gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Ward / bed</p>
            <p className="mt-1 font-medium text-slate-900">{location(current) || "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Admitted</p>
            <p className="mt-1 font-medium text-slate-900">{formatDateTime(current.admitted_at)}</p>
            {current.admitted_by_user && (
              <p className="text-xs text-slate-600">by {buildDisplayName(current.admitted_by_user)}</p>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Reason</p>
            <p className="mt-1 whitespace-pre-wrap text-slate-900">{current.reason || "-"}</p>
          </div>
        </div>
      )}

      <h3 className="mt-6 text-sm font-semibold text-slate-800">Admission history</h3>
      {loading ? (
        <div className="py-6">
          <LoaderIcon />
        </div>
      ) : error ? (
        <div className="mt-2" role="alert">
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => void loadAdmissions()}
            className="mt-1 text-sm font-medium text-[var(--dashboard-accent,#1A2380)] underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      ) : admissions.length === 0 ? (
        <p className="mt-2 rounded-md border border-dashed p-3 text-sm text-slate-500">
          This patient has never been admitted here.
        </p>
      ) : (
        <ol className="mt-3 space-y-3">
          {admissions.map((admission) => (
            <li key={admission.id} className="rounded-md border border-slate-200 p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-slate-900">{location(admission) || "Ward not recorded"}</p>
                <span
                  className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                    admission.status === "Admitted"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {admission.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Admitted {formatDateTime(admission.admitted_at)}
                {admission.admitted_by_user ? ` by ${buildDisplayName(admission.admitted_by_user)}` : ""}
                {admission.discharged_at
                  ? ` · Discharged ${formatDateTime(admission.discharged_at)}${
                      admission.discharged_by_user
                        ? ` by ${buildDisplayName(admission.discharged_by_user)}`
                        : ""
                    }`
                  : ""}
              </p>
              {admission.reason && (
                <p className="mt-2 whitespace-pre-wrap text-slate-700">
                  <span className="font-medium">Reason:</span> {admission.reason}
                </p>
              )}
              {admission.discharge_notes && (
                <p className="mt-1 whitespace-pre-wrap text-slate-700">
                  <span className="font-medium">Discharge notes:</span> {admission.discharge_notes}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}

      <AdmitPatientModal
        orgId={orgId}
        patient={admitOpen ? { id: patientId, name: patientName } : null}
        onClose={() => setAdmitOpen(false)}
        onAdmitted={handleChanged}
      />
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
    </section>
  );
}
