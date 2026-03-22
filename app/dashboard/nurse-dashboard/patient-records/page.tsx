'use client'

import Button from '@components/Button'
import PatientTable from '@components/dashboard/nurse-dashboard/PatientTable'
import AddPatientRecordModal from '@components/dashboard/nurse-dashboard/AddPatientRecords';
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

        <AddPatientRecordModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={handlePatientCreated}
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <input
            type="text"
            placeholder="Search patient"
            className="w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#00B8A8]"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 absolute left-4 top-2.5 text-gray-400"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.2-5.2M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
          </svg>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-2">
          <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-[#00B8A8]">
            <option>Department</option>
            <option>Cardiology</option>
            <option>Neurology</option>
            <option>Pediatrics</option>
          </select>
          <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-[#00B8A8]">
            <option>Last Visit</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <PatientTable key={refreshVersion} />
    </div>
  )
}
