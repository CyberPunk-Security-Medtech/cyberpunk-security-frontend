'use client'

import Button from '@components/Button'
import AddPatientModal from '@components/dashboard/doctor-dashboard/AddPatientModal';
import PatientTable from '@components/dashboard/doctor-dashboard/PatientTable'
import { useState } from 'react';


export default function PatientsRecords() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="px-6 py-4">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#1A2380]">Patients Records</h2>
          <p className="text-gray-500 text-sm">View and manage patient information</p>
        </div>

        <Button
          type="button"
          onSubmitHandler={() => setIsModalOpen(true)}
          className="bg-[#1A2380] text-white font-medium px-5 py-2.5 rounded-md hover:bg-[#00B8A8] transition"
        >
          + Add New Patient Record
        </Button>

        <AddPatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
        <div className="relative w-full sm:w-80">
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

        <div className="flex items-center gap-3">
          <select className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-[#00B8A8]">
            <option>Department</option>
            <option>Cardiology</option>
            <option>Neurology</option>
            <option>Pediatrics</option>
          </select>
          <select className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-[#00B8A8]">
            <option>Last Visit</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <PatientTable />
    </div>
  )
}
