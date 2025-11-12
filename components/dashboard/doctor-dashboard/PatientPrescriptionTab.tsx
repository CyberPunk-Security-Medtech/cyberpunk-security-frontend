'use client'

import { useState } from 'react'
import {PatientPrescriptionModal} from './PatientPrescriptionModal'


export default function PatientPrescriptionTab() {
  const [open, setOpen] = useState(false)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
      {/* Left: Medical History */}
      <section className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#1A2380]">Prescription</h3>
          <button
            onClick={() => setOpen(true)}
            className="rounded-md bg-[#1A2380] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#00B8A8]"
          >
            + Add Prescription
          </button>
        </div>
         
        
                <PatientPrescriptionModal open={open} onClose={() => setOpen(false)} />
              </section>
              </div>
  )
}
        