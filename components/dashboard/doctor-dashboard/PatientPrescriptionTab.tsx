'use client'

import { useState } from 'react'
import { PatientPrescriptionModal } from './PatientPrescriptionModal'
import { useConsultation } from './ConsultationContext'


export default function PatientPrescriptionTab() {
  const [open, setOpen] = useState(false)
  const { isConsultationActive, currentVisitId } = useConsultation()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
      {/* Left: Medical History */}
      <section className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#1A2380]">Prescription</h3>
          <button
            onClick={() => setOpen(true)}
            disabled={!isConsultationActive}
            className={`rounded-md px-4 py-2.5 text-sm font-medium text-white transition ${isConsultationActive
                ? 'bg-[#1A2380] hover:bg-[#00B8A8]'
                : 'bg-gray-300 cursor-not-allowed'
              }`}
          >
            + Add Prescription
          </button>
        </div>


        <PatientPrescriptionModal
          open={open}
          onClose={() => setOpen(false)}
          visitId={currentVisitId}
        />
      </section>
    </div>
  )
}
