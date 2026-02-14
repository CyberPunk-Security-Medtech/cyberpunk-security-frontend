'use client'

import { useState } from 'react'
import Modal from '@components/Modal'
import { FieldLabel, Input, Textarea, Select } from '@components/Field'
import Button from '@components/Button'
import { PatientService } from '@services/api'

interface CreateConsultationModalProps {
  open: boolean
  onClose: () => void
  patientId: string
  onCreated: (consultationId: string) => void
}

export function CreateConsultationModal({ open, onClose, patientId, onCreated }: CreateConsultationModalProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    department_id: '',
    reason_for_visit: '',
    priority: 'Routine',
    vitals: ''
  })

  const handleSubmit = async () => {
    const workspace = JSON.parse(localStorage.getItem("activeWorkspace") || "{}")
    const orgId = workspace?.id
    if (!orgId || !patientId) return

    setLoading(true)
    try {
      const res = await PatientService.createConsultation(orgId, {
        patient_id: patientId,
        ...form
      })
      const consultationId = res.data.id
      onCreated(consultationId)
      setForm({ department_id: '', reason_for_visit: '', priority: 'Routine', vitals: '' })
      onClose()
    } catch (err) {
      console.error("Failed to create consultation", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Create Consultation" isOpen={open} onClose={onClose}>
      <form className="space-y-6">
        <div>
          <FieldLabel htmlFor="department">Department</FieldLabel>
          <Input
            id="department"
            placeholder="Select Department"
            value={form.department_id}
            onChange={(e) => setForm({ ...form, department_id: e.target.value })}
          />
        </div>

        <div>
          <FieldLabel htmlFor="reason">Reason for Visit</FieldLabel>
          <Textarea
            id="reason"
            rows={4}
            placeholder="Enter reason for visit"
            value={form.reason_for_visit}
            onChange={(e) => setForm({ ...form, reason_for_visit: e.target.value })}
          />
        </div>

        <div>
          <FieldLabel htmlFor="priority">Priority</FieldLabel>
          <Select
            id="priority"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="Routine">Routine</option>
            <option value="Urgent">Urgent</option>
            <option value="Emergency">Emergency</option>
          </Select>
        </div>

        <div>
          <FieldLabel htmlFor="vitals">Vitals / Notes</FieldLabel>
          <Textarea
            id="vitals"
            rows={3}
            placeholder="Enter vitals or notes"
            value={form.vitals}
            onChange={(e) => setForm({ ...form, vitals: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border px-6 py-2.5 text-sm font-medium"
          >
            Cancel
          </button>
          <Button
            type="button"
            onSubmitHandler={handleSubmit}
            disabled={loading || !form.department_id || !form.reason_for_visit}
            className="rounded-full bg-[#1A2380] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Consultation'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}




// 'use client'

// import { useState, useEffect } from 'react'
// import Modal from '@components/Modal'
// import { Input, FieldLabel, Textarea } from '@components/Field'
// import Button from '@components/Button'
// import { PatientService } from '@services/api'
// import { CreateDepartmentModal } from './CreateDepartmentModal'


// interface CreateConsultationModalProps {
//   open: boolean
//   onClose: () => void
//   patientId: string
//   onConsultationCreated: () => void
// }

// export function CreateConsultationModal({ open, onClose, patientId, onConsultationCreated }: CreateConsultationModalProps) {
//   const [departments, setDepartments] = useState<{ id: string; name: string }[]>([])
//   const [departmentId, setDepartmentId] = useState('')
//   const [reason, setReason] = useState('')
//   const [priority, setPriority] = useState('Routine')
//   const [showDeptModal, setShowDeptModal] = useState(false)
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const workspace = JSON.parse(localStorage.getItem("activeWorkspace") || "{}")
//         const orgId = workspace.id
//         const res = await PatientService.getDepartments(orgId)
//         setDepartments(res.data || [])
//       } catch (error) {
//         console.error('Failed to fetch departments', error)
//       }
//     }
//     if (open) fetchDepartments()
//   }, [open])

//   const handleDepartmentCreated = (dept: { id: string; name: string }) => {
//     setDepartments(prev => [...prev, dept])
//     setDepartmentId(dept.id) // auto-select the new department
//   }

//   const handleSubmit = async () => {
//     if (!departmentId || !reason.trim()) return
//     setLoading(true)
//     try {
//       const workspace = JSON.parse(localStorage.getItem("activeWorkspace") || "{}")
//       const orgId = workspace.id

//       await PatientService.createConsultation(orgId, {
//         patient_id: patientId,
//         department_id: departmentId,
//         reason_for_visit: reason,
//         priority
//       })

//       onClose()
//       onConsultationCreated()
//       setReason('')
//       setDepartmentId('')
//     } catch (error) {
//       console.error('Failed to create consultation', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <>
//       <Modal title="Create Consultation" isOpen={open} onClose={onClose}>
//         <div className="space-y-4">
//           <div>
//             <FieldLabel htmlFor="department">Department</FieldLabel>
//             <div className="flex gap-2">
//               <select
//                 id="department"
//                 value={departmentId}
//                 onChange={(e) => setDepartmentId(e.target.value)}
//                 className="border rounded-md p-2 w-full"
//               >
//                 <option value="">Select Department</option>
//                 {departments.map((d) => (
//                   <option key={d.id} value={d.id}>{d.name}</option>
//                 ))}
//               </select>
//               <button
//                 type="button"
//                 onClick={() => setShowDeptModal(true)}
//                 className="px-3 py-2 text-sm text-blue-600 hover:underline border rounded-md"
//               >
//                 + Create
//               </button>
//             </div>
//           </div>

//           <div>
//             <FieldLabel htmlFor="reason">Reason for Visit</FieldLabel>
//             <Textarea
//               id="reason"
//               rows={3}
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//               placeholder="Enter reason for visit"
//             />
//           </div>

//           <div>
//             <FieldLabel htmlFor="priority">Priority</FieldLabel>
//             <select
//               id="priority"
//               value={priority}
//               onChange={(e) => setPriority(e.target.value)}
//               className="border rounded-md p-2 w-full"
//             >
//               <option value="Routine">Routine</option>
//               <option value="Urgent">Urgent</option>
//               <option value="Emergency">Emergency</option>
//             </select>
//           </div>

//           <div className="flex justify-end gap-3">
//             <button onClick={onClose} className="rounded-full border px-6 py-2.5 text-sm font-medium">Cancel</button>
//             <Button
//               type="button"
//               onSubmitHandler={handleSubmit}
//               disabled={loading || !departmentId || !reason.trim()}
//               className="rounded-full bg-[#1A2380] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
//             >
//               {loading ? 'Creating...' : 'Create Consultation'}
//             </Button>
//           </div>
//         </div>
//       </Modal>

//       <CreateDepartmentModal
//         open={showDeptModal}
//         onClose={() => setShowDeptModal(false)}
//         onDepartmentCreated={handleDepartmentCreated}
//       />
//     </>
//   )
// }