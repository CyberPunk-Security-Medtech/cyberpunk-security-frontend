'use client'


import Button from '@components/Button'
import AddPatientModal from '@components/dashboard/doctor/AddPatientModal';
import PatientTable from '@components/dashboard/doctor/PatientTable'
import { useState } from 'react';


export default function PatientsRecords() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshVersion, setRefreshVersion] = useState(0);

  const handlePatientCreated = () => {
    setRefreshVersion((current) => current + 1);
  };

  return (
    <div className="py-2 sm:py-4">
      {/* Header Row */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#1A2380]">Patients Records</h2>
          <p className="text-gray-500 text-sm">View and manage patient information</p>
        </div>

        <Button
          type="button"
          onSubmitHandler={() => setIsModalOpen(true)}
          className="w-full rounded-md bg-[#1A2380] px-5 py-2.5 font-medium text-white transition hover:bg-[#00B8A8] sm:w-auto"
        >
          + Add New Patient Record
        </Button>

        <AddPatientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={handlePatientCreated}
        />
      </div>

      {/* Search, filters and table */}
      <PatientTable key={refreshVersion} />
    </div>
  )
}
