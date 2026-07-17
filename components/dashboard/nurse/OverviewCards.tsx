"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@context/AuthContext";
import { consultationService, patientService } from "@services/api";

type DashboardStats = {
  patientsUnderCare: number;
  awaitingNurseReview: number;
};

type ApiPatient = {
  id: string;
  created_at?: string | null;
};

type ApiConsultation = {
  id: string;
  patient_id?: string | null;
};

const INITIAL_STATS: DashboardStats = {
  patientsUnderCare: 0,
  awaitingNurseReview: 0,
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

        const consultedPatientIds = new Set(
          uniqueConsultations
            .map((consultation) => consultation.patient_id)
            .filter(Boolean)
        );
        const awaitingNurseReview = patients.filter(
          (patient) => patient.id && !consultedPatientIds.has(patient.id)
        ).length;

        if (!cancelled) {
          setStats({
            patientsUnderCare: patients.length,
            awaitingNurseReview,
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
      { title: "Awaiting nurse review", value: stats.awaitingNurseReview },
    ],
    [stats]
  );

  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <p className="mb-2 text-sm text-gray-500">{card.title}</p>
            <p className="text-2xl font-semibold text-[#003C36]">
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
