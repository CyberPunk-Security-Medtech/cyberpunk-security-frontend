"use client";

import { useState } from "react";
import Button from "@components/Button";
import SharedPatientDetails from "@components/dashboard/SharedPatientDetails";
import { CreateConsultationModal } from "./ConsultationModal";
import { useConsultation } from "./ConsultationContext";
import PatientConsultationList from "./PatientConsultationList";

export default function DoctorPatientDetails() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    patient,
    patientError,
    patientId,
    patientLoading,
    consultationLoading,
    consultationStatus,
    isConsultationActive,
    hasConsultation,
    canStartConsultation,
    refreshPatient,
    refreshConsultations,
    startConsultation,
  } = useConsultation();

  const handleStart = async () => {
    try {
      await startConsultation();
    } catch (error) {
      console.error("Failed to start consultation", error);
    }
  };

  const consultationAction = isConsultationActive ? (
    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700">
      <span className="size-2 rounded-full bg-green-500 motion-safe:animate-pulse" />
      In Consultation
    </span>
  ) : (
    <Button
      type="button"
      onSubmitHandler={hasConsultation ? handleStart : () => setIsCreateModalOpen(true)}
      disabled={
        consultationLoading ||
        consultationStatus === "starting" ||
        (hasConsultation && !canStartConsultation)
      }
      className="w-full rounded-md bg-[#1A2380] px-4 py-2 text-white transition hover:bg-[#00B8A8] disabled:opacity-50 sm:w-auto sm:px-6"
    >
      {consultationStatus === "starting"
        ? "Starting..."
        : consultationLoading
          ? "Loading..."
          : !hasConsultation
            ? "Create Consultation"
            : canStartConsultation
              ? "Start Consultation"
              : "No Consultation Ready"}
    </Button>
  );

  return (
    <>
      <SharedPatientDetails
        actions={consultationAction}
        backHref="/dashboard/doctor/patient-records"
        backLabel="Back to Patients List"
        error={patientError}
        loading={patientLoading}
        onRetry={() => void refreshPatient()}
        patient={patient}
        patientId={patientId}
      >
        <PatientConsultationList />
      </SharedPatientDetails>

      <CreateConsultationModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        patientId={patientId}
        onCreated={() => {
          void refreshConsultations();
        }}
      />
    </>
  );
}
