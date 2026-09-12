'use client'

import Button from '@components/Button'
import PatientTable from '@components/dashboard/nurse/PatientTable'
import AddPatientRecordModal from '@components/dashboard/nurse/AddPatientRecords';
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
          <h2 className="text-2xl font-semibold text-[#003C36]">Patients Records</h2>
          <p className="text-gray-500 text-sm">View and manage patient information</p>
        </div>

        <Button
          type="button"
          onSubmitHandler={() => setIsModalOpen(true)}
          className="w-full rounded-md !bg-[#006B5F] px-5 py-2.5 font-medium text-white transition-colors hover:!bg-[#005249] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8A8] focus-visible:ring-offset-2 motion-reduce:transition-none sm:w-auto"
        >
          + Add New Patient Record
        </Button>

        <AddPatientRecordModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={handlePatientCreated}
        />
      </div>

      {/* Table */}
      <PatientTable key={refreshVersion} />
    </div>
  )
}
