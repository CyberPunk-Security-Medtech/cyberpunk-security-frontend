// 'use client'

// import { useState } from 'react'
// import Modal from '@components/Modal'
// import { FieldLabel, Input, Select, Textarea } from '@components/Field'

// export function PatientPrescriptionModal() {
//   const [open, setOpen] = useState(false)

//   return (
//     <section className="bg-white rounded-lg border shadow-sm p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-lg font-semibold text-[#1A2380]">Prescription</h3>
//         <button
//           onClick={() => setOpen(true)}
//           className="rounded-md bg-[#1A2380] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#141a66] transition"
//         >
//           + New Prescription
//         </button>
//       </div>

//       {/* Empty State */}
//       <div className="rounded-xl border border-dashed p-10 text-center text-gray-400">
//         No prescriptions yet.
//       </div>

//       {/* Modal */}
//       <Modal title="Create New Prescription" isOpen={open} onClose={() => setOpen(false)}>
//         <form className="space-y-6">
//           {/* Medication Name */}
//           <div>
//             <FieldLabel>Medication Name</FieldLabel>
//             <Input placeholder="Search Medication Name" />
//           </div>

//           {/* Dosage + Frequency */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <FieldLabel>Dosage</FieldLabel>
//               <Input placeholder="Enter Dosage (500mg)" />
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <FieldLabel>Frequency</FieldLabel>
//                 <Select defaultValue="">
//                   <option value="" disabled>
//                     Select Frequency
//                   </option>
//                   <option>Daily</option>
//                   <option>Twice Daily</option>
//                   <option>Weekly</option>
//                 </Select>
//               </div>
//               <div className="pt-6">
//                 <Input defaultValue="Daily" readOnly />
//               </div>
//             </div>
//           </div>

//           {/* Duration + Route + Date */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <FieldLabel>Duration</FieldLabel>
//                 <Input placeholder="Enter Duration" />
//               </div>
//               <div className="pt-6">
//                 <Select defaultValue="Month">
//                   <option>Day</option>
//                   <option>Week</option>
//                   <option>Month</option>
//                 </Select>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <FieldLabel>Route</FieldLabel>
//                 <Select defaultValue="">
//                   <option value="" disabled>
//                     Select Route
//                   </option>
//                   <option>Oral</option>
//                   <option>IM</option>
//                   <option>IV</option>
//                 </Select>
//               </div>
//               <div>
//                 <FieldLabel>Start Date</FieldLabel>
//                 <Input type="date" />
//               </div>
//             </div>
//           </div>

//           {/* Special Instructions */}
//           <div>
//             <FieldLabel>Special Instructions</FieldLabel>
//             <Textarea rows={5} placeholder="Write Special Instructions" />
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
//             <button
//               type="button"
//               className="rounded-full border px-6 py-2.5 text-sm font-medium"
//             >
//               + Add Another Medication
//             </button>
//             <div className="flex gap-3">
//               <button
//                 type="button"
//                 onClick={() => setOpen(false)}
//                 className="rounded-full border px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
//               >
//                 Cancel
//               </button>
//               <button className="rounded-full bg-[#1A2380] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#00B8A8] transition">
//                 Save & Send to Pharmacist
//               </button>
//             </div>
//           </div>
//         </form>
//       </Modal>
//     </section>
//   )
// }
'use client'

import React, { useState } from 'react'
import Modal from '@components/Modal'
import { FieldLabel, Input, Textarea } from '@components/Field'
import { Plus } from 'lucide-react'
import { consultationService } from '@services/api'
import Button from '@components/Button'

interface PatientPrescriptionModalProps {
  open: boolean
  onClose: () => void
  visitId: string | null
}

export function PatientPrescriptionModal({
  open,
  onClose,
  visitId
}: PatientPrescriptionModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    frequency: '',
    interval: '',
    duration: '',
    durationType: 'Days',
    route: '',
    startDate: '',
    instructions: ''
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async () => {
    if (!visitId) return
    setLoading(true)
    try {
      await consultationService.createPrescription(visitId, formData)
      onClose()
      // Reset form
      setFormData({
        medicationName: '',
        dosage: '',
        frequency: '',
        interval: '',
        duration: '',
        durationType: 'Days',
        route: '',
        startDate: '',
        instructions: ''
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Create New Prescription" isOpen={open} onClose={onClose}>
      <div className="relative flex flex-col max-h-[95vh]">
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            {/* Medication Name */}
            <div>
              <FieldLabel htmlFor="medicationName">Medication Name</FieldLabel>
              <Input
                id="medicationName"
                placeholder="Search Medication Name"
                type="text"
                value={formData.medicationName}
                onChange={handleChange}
              />
            </div>

            {/* Dosage */}
            <div>
              <FieldLabel htmlFor="dosage">Dosage</FieldLabel>
              <Input
                id="dosage"
                placeholder="Enter Dosage (500mg)"
                type="text"
                value={formData.dosage}
                onChange={handleChange}
              />
            </div>

            {/* Frequency & Interval */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="frequency">Frequency</FieldLabel>
                <select
                  id="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#00B8A8]"
                >
                  <option value="">Select Frequency</option>
                  <option value="Once">Once</option>
                  <option value="Twice">Twice</option>
                  <option value="Thrice">Thrice</option>
                </select>
              </div>

              <div>
                <FieldLabel htmlFor="interval">Interval</FieldLabel>
                <Input
                  id="interval"
                  placeholder="Daily"
                  value={formData.interval}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="duration">Duration</FieldLabel>
                <Input
                  id="duration"
                  placeholder="Enter Duration"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>
              <div>
                <FieldLabel htmlFor="durationType">Duration Type</FieldLabel>
                <select
                  id="durationType"
                  value={formData.durationType}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#00B8A8]"
                >
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Month">Month</option>
                </select>
              </div>
            </div>

            {/* Route & Start Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="route">Route</FieldLabel>
                <select
                  id="route"
                  value={formData.route}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#00B8A8]"
                >
                  <option value="">Select Route</option>
                  <option value="Oral">Oral</option>
                  <option value="Injection">Injection</option>
                  <option value="Topical">Topical</option>
                </select>
              </div>

              <div>
                <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <FieldLabel htmlFor="instructions">Special Instructions</FieldLabel>
              <Textarea
                id="instructions"
                rows={4}
                placeholder="Write Special Instructions"
                value={formData.instructions}
                onChange={handleChange}
              />
            </div>

            {/* Add Another Medication */}
            <div>
              <button
                type="button"
                className="flex items-center justify-center gap-2 w-full md:w-auto border border-[#1A2380] text-[#1A2380] font-medium rounded-full px-5 py-2.5 text-sm hover:bg-[#F4F5FF]"
              >
                <Plus size={16} />
                Add Another Medication
              </button>
            </div>

            {/* Sticky Footer Buttons inside form to handle submit properly */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3 -mx-6 -mb-6 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <Button
                type="submit"
                disabled={loading || !visitId}
                className="rounded-full bg-[#1A2380] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#00B8A8] transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Save & Send to Pharmacist'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}
