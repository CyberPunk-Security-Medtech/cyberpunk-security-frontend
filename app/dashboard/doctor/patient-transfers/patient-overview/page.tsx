"use client";

import PatientDetails from "@components/patient-transfers/patientOverview/PatientDetail";
import PatientsList from "@components/patient-transfers/patientOverview/PatientList";
import { patients } from "@components/patient-transfers/patientOverview/PatientTransferData";
import { FilterType, Patient, PatientTab } from "@components/patient-transfers/patientOverview/PatientTransferTypes";
import SendRecordsModal from "@components/patient-transfers/patientOverview/SendRecordsModal";
import TransferSuccessScreen from "@components/patient-transfers/patientOverview/TransferSuccessScreen";
import { useMemo, useState } from "react";


export default function PatientTransfersOverviewPage() {
  const [filter, setFilter] = useState<FilterType>("All");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<PatientTab>("Overview");
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredPatients = useMemo(() => {
    if (filter === "All") return patients;
    return patients.filter((patient) => patient.status === filter);
  }, [filter]);

  const handleOpenPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveTab("Overview");
  };

  const handleBackToDashboard = () => {
    setSelectedPatient(null);
    setActiveTab("Overview");
  };

  if (showSuccess) {
    return (
      <TransferSuccessScreen
        onGoToDashboard={() => {
          setShowSuccess(false);
          setIsTransferModalOpen(false);
          setSelectedPatient(null);
        }}
      />
    );
  }

  return (
    <div className="-mx-4 -my-4 min-h-full bg-[#F4FAFA] md:-mx-12">
      {!selectedPatient ? (
        <PatientsList
          filter={filter}
          setFilter={setFilter}
          patients={filteredPatients}
          onOpenPatient={handleOpenPatient}
        />
      ) : (
        <PatientDetails
          patient={selectedPatient}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onBack={handleBackToDashboard}
          onTransfer={() => setIsTransferModalOpen(true)}
        />
      )}

      {isTransferModalOpen && selectedPatient && (
        <SendRecordsModal
          patient={selectedPatient}
          onClose={() => setIsTransferModalOpen(false)}
          onSuccess={() => {
            setIsTransferModalOpen(false);
            setShowSuccess(true);
          }}
        />
      )}
    </div>
  );
}