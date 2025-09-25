"use client";

import { useState } from "react";
import PatientCard from "@components/dashboard/patients/PatientCard";
import PatientDetails from "@components/dashboard/patients/PatientDetails";
import AddPatientModal from "@components/dashboard/patients/AddPatientModal";
import { Patient } from "@/types/forms";

const mockPatients: Patient[] = [
    {
        id: "1233",
        name: "Sarah Johnson",
        age: 34,
        gender: "Female",
        phone: "+234 901 664 0950",
        email: "oluwaferanmi@gmail.com",
        address: "16, Onipakala street, Ketu, Lagos",
        condition: "Hyperventilation",
        lastVisit: "2025-10-15",
        status: "Active",
    },
];

export default function PatientManagementPage() {
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [openModal, setOpenModal] = useState(false);

    const handleAddPatient = (data: any) => {
        console.log("New patient:", data);
        setOpenModal(false);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Patient Management</h1>
                    <p className="text-gray-500">Manage patient records and information</p>
                </div>
                <button
                    onClick={() => setOpenModal(true)}
                    className="px-4 py-2 bg-indigo-700 text-white rounded-lg"
                >
                    + Add Patient
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {mockPatients.map((patient) => (
                    <PatientCard
                        key={patient.id}
                        patient={patient}
                        onViewDetails={(p) => setSelectedPatient(p)}
                    />
                ))}
            </div>

            {selectedPatient && (
                <PatientDetails
                    patient={selectedPatient}
                    onClose={() => setSelectedPatient(null)}
                    open={!!selectedPatient}
                    setOpen={(val: any) => {
                        if (!val) setSelectedPatient(null);
                    }}
                />
            )}
            <AddPatientModal open={openModal} setOpen={setOpenModal} onSubmit={handleAddPatient} />
        </div>
    );
}
