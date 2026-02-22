"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@context/AuthContext";
import { consultationService, patientService } from "@services/api";

type DashboardStats = {
  patientsUnderCare: number;
  appointmentsToday: number;
  pendingLabResults: number;
};

type ApiPatient = {
  id: string;
};

type ApiConsultation = {
  id: string;
  created_at?: string | null;
  updated_at?: string | null;
};

type ApiLabTest = {
  status?: string | null;
  result_status?: string | null;
};

const INITIAL_STATS: DashboardStats = {
  patientsUnderCare: 0,
  appointmentsToday: 0,
  pendingLabResults: 0,
};

const chunk = <T,>(items: T[], size: number): T[][] => {
  const output: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    output.push(items.slice(i, i + size));
  }
  return output;
};

const isSameLocalDay = (isoDate: string | null | undefined, now: Date): boolean => {
  if (!isoDate) return false;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return false;
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

const isPendingLabStatus = (rawStatus: unknown): boolean => {
  const normalized = String(rawStatus ?? "").trim().toLowerCase();
  if (!normalized) return true;
  return !["completed", "normal", "cancelled"].includes(normalized);
};

export default function OverviewCards() {
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id ?? null;

  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!orgId) {
      setStats(INITIAL_STATS);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadStats = async () => {
      setLoading(true);
      setHasError(false);

      try {
        const patientsResponse = await patientService.getPatients(orgId);
        const patients = Array.isArray(patientsResponse)
          ? (patientsResponse as ApiPatient[])
          : [];
        const patientIds = patients.map((patient) => patient.id).filter(Boolean);

        const [pending, inProgress, completed, cancelledConsultations] = await Promise.all([
          consultationService.listConsultations(orgId, { status_filter: "Pending" }),
          consultationService.listConsultations(orgId, { status_filter: "In Progress" }),
          consultationService.listConsultations(orgId, { status_filter: "Completed" }),
          consultationService.listConsultations(orgId, { status_filter: "Cancelled" }),
        ]);

        const consultations = [
          ...(pending ?? []),
          ...(inProgress ?? []),
          ...(completed ?? []),
          ...(cancelledConsultations ?? []),
        ] as ApiConsultation[];

        const uniqueConsultations = Array.from(
          new Map(
            consultations
              .filter((consultation) => consultation?.id)
              .map((consultation) => [consultation.id, consultation])
          ).values()
        );

        const now = new Date();
        const appointmentsToday = uniqueConsultations.filter((consultation) =>
          isSameLocalDay(consultation.created_at ?? consultation.updated_at, now)
        ).length;

        let pendingLabResults = 0;
        const patientIdBatches = chunk(patientIds, 10);

        for (const patientIdBatch of patientIdBatches) {
          const batchResults = await Promise.all(
            patientIdBatch.map(async (patientId) => {
              try {
                const labResponse = await patientService.getPatientLabTests(orgId, patientId);
                return Array.isArray(labResponse) ? (labResponse as ApiLabTest[]) : [];
              } catch (error) {
                console.error(`Failed to fetch lab tests for patient ${patientId}`, error);
                return [];
              }
            })
          );

          for (const tests of batchResults) {
            pendingLabResults += tests.filter((test) =>
              isPendingLabStatus(test.status ?? test.result_status)
            ).length;
          }
        }

        if (!cancelled) {
          setStats({
            patientsUnderCare: patients.length,
            appointmentsToday,
            pendingLabResults,
          });
        }
      } catch (error) {
        console.error("Failed to load overview stats", error);
        if (!cancelled) {
          setStats(INITIAL_STATS);
          setHasError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadStats();

    return () => {
      cancelled = true;
    };
  }, [orgId]);

  const cards = useMemo(
    () => [
      { title: "Patients under care", value: stats.patientsUnderCare },
      { title: "Appointments today", value: stats.appointmentsToday },
      { title: "Pending lab results", value: stats.pendingLabResults },
    ],
    [stats]
  );

  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <p className="mb-2 text-sm text-gray-500">{card.title}</p>
            <p className="text-2xl font-semibold text-[#1A2380]">
              {loading ? "..." : card.value}
            </p>
          </div>
        ))}
      </div>
      {hasError && (
        <p className="mt-3 text-xs text-amber-700">
          Some dashboard metrics could not be loaded. Please refresh.
        </p>
      )}
    </section>
  );
}
