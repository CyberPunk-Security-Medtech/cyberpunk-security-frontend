"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { consultationService, patientService } from "@services/api";
import { isAxiosError } from "axios";
import { useAuth } from "@context/AuthContext";

type ConsultationStatus = "idle" | "starting" | "active";

type ConsultationContextType = {
  patientId: string;
  orgId: string | null;
  patient: any | null;
  patientLoading: boolean;
  consultations: any[];
  consultationLoading: boolean;
  consultationStatus: ConsultationStatus;
  isConsultationActive: boolean;
  currentConsultationId: string | null;
  hasConsultation: boolean;
  canStartConsultation: boolean;
  refreshPatient: () => Promise<void>;
  refreshConsultations: () => Promise<void>;
  createConsultation: (payload: {
    department_id: string;
    reason_for_visit: string;
    priority?: "Routine" | "Urgent" | "Emergency";
    vitals?: string | null;
  }) => Promise<string | null>;
  startConsultation: () => Promise<void>;
};

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined);

export function ConsultationProvider({
  children,
  patientId,
}: {
  children: React.ReactNode;
  patientId: string;
}) {
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id ?? null;

  const [patient, setPatient] = useState<any | null>(null);
  const [patientLoading, setPatientLoading] = useState(false);

  const [consultations, setConsultations] = useState<any[]>([]);
  const [consultationLoading, setConsultationLoading] = useState(false);
  const [consultationStatus, setConsultationStatus] = useState<ConsultationStatus>("idle");
  const [currentConsultationId, setCurrentConsultationId] = useState<string | null>(null);

  const refreshPatient = async () => {
    if (!orgId || !patientId) return;
    setPatientLoading(true);
    try {
      const result = await patientService.getPatient(orgId, patientId);
      setPatient(result);
    } catch (error) {
      console.error("Failed to load patient", error);
    } finally {
      setPatientLoading(false);
    }
  };

  const refreshConsultations = async () => {
    if (!orgId) return;
    setConsultationLoading(true);
    try {
      // Backend defaults listConsultations to "Pending", so fetch both states
      // to preserve active consultation state across reloads.
      const [inProgressResult, pendingResult] = await Promise.all([
        consultationService.listConsultations(orgId, { status_filter: "In Progress" }),
        consultationService.listConsultations(orgId, { status_filter: "Pending" }),
      ]);

      const merged = [...(inProgressResult ?? []), ...(pendingResult ?? [])];
      const uniqueById = Array.from(
        new Map(merged.map((c: any) => [c.id, c])).values()
      );

      const mine = uniqueById
        .filter((c: any) => c.patient_id === patientId)
        .sort((a: any, b: any) => {
          const aTime = new Date(a.updated_at ?? a.created_at ?? 0).getTime();
          const bTime = new Date(b.updated_at ?? b.created_at ?? 0).getTime();
          return bTime - aTime;
        });
      setConsultations(mine);

      const active = mine.find((c: any) => String(c.status).toLowerCase() === "in progress");
      const pending = mine.find((c: any) => String(c.status).toLowerCase() === "pending");
      const selected = active ?? pending ?? null;

      setCurrentConsultationId(selected?.id ?? null);
      setConsultationStatus(active ? "active" : "idle");
    } catch (error) {
      console.error("Failed to load consultations", error);
    } finally {
      setConsultationLoading(false);
    }
  };

  useEffect(() => {
    refreshPatient();
    refreshConsultations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, patientId]);

  const isConsultationActive = consultationStatus === "active";
  const hasConsultation = !!currentConsultationId;
  const canStartConsultation = !!currentConsultationId && !isConsultationActive;

  const createConsultation = async (payload: {
    department_id: string;
    reason_for_visit: string;
    priority?: "Routine" | "Urgent" | "Emergency";
    vitals?: string | null;
  }) => {
    if (!orgId || !patientId) return null;
    try {
      const created = await consultationService.createConsultation(orgId, {
        patient_id: patientId,
        department_id: payload.department_id,
        reason_for_visit: payload.reason_for_visit,
        priority: payload.priority ?? "Routine",
        vitals: payload.vitals ?? null,
      });

      await refreshConsultations();
      return created?.id ?? null;
    } catch (error) {
      console.error("Failed to create consultation", error);
      return null;
    }
  };

  const startConsultation = async () => {
    if (!orgId || !currentConsultationId) return;
    setConsultationStatus("starting");
    try {
      await consultationService.attendConsultation(orgId, currentConsultationId);
      setConsultationStatus("active");
      await refreshConsultations();
    } catch (error) {
      if (isAxiosError(error)) {
        const method = error.config?.method?.toUpperCase() ?? "UNKNOWN";
        const url = error.config?.url ?? "UNKNOWN_URL";
        const status = error.response?.status;
        const responseData = error.response?.data;
        console.error("Failed to attend consultation", {
          message: error.message,
          method,
          url,
          status,
          responseData,
        });
      } else {
        console.error("Failed to attend consultation", error);
      }
      setConsultationStatus("idle");
    }
  };

  const value = useMemo(
    () => ({
      patientId,
      orgId,
      patient,
      patientLoading,
      consultations,
      consultationLoading,
      consultationStatus,
      isConsultationActive,
      currentConsultationId,
      hasConsultation,
      canStartConsultation,
      refreshPatient,
      refreshConsultations,
      createConsultation,
      startConsultation,
    }),
    [
      patientId,
      orgId,
      patient,
      patientLoading,
      consultations,
      consultationLoading,
      consultationStatus,
      isConsultationActive,
      currentConsultationId,
      hasConsultation,
      canStartConsultation,
    ]
  );

  return (
    <ConsultationContext.Provider value={value}>
      {children}
    </ConsultationContext.Provider>
  );
}

export function useConsultation() {
  const context = useContext(ConsultationContext);
  if (context === undefined) {
    throw new Error("useConsultation must be used within a ConsultationProvider");
  }
  return context;
}
