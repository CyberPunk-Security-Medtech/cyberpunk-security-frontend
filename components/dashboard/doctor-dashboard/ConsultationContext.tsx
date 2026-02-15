"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { consultationService, patientService } from "@services/api";
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
  canStartConsultation: boolean;
  refreshPatient: () => Promise<void>;
  refreshConsultations: () => Promise<void>;
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
      const result = await consultationService.listConsultations(orgId);
      const mine = (result ?? []).filter((c: any) => c.patient_id === patientId);
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
  const canStartConsultation = !!currentConsultationId && !isConsultationActive;

  const startConsultation = async () => {
    if (!orgId || !currentConsultationId) return;
    setConsultationStatus("starting");
    try {
      await consultationService.attendConsultation(orgId, currentConsultationId);
      setConsultationStatus("active");
      await refreshConsultations();
    } catch (error) {
      console.error("Failed to attend consultation", error);
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
      canStartConsultation,
      refreshPatient,
      refreshConsultations,
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
