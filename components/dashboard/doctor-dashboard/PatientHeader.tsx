// 'use client'

// import { StatusBadge } from "@components/StatusBadge"
// import Button from "@components/Button"
// import { useConsultation } from "./ConsultationContext"
// import { useEffect, useState } from "react"
// import { PatientService } from "@services/api"

// const vitals = [
//     { label: 'Blood Pressure', value: '120/80 mmHg', status: 'Normal' },
//     { label: 'Temperature', value: '36.8 °C', status: 'High' },
//     { label: 'Heart Rate', value: '72 bpm', status: 'Low' },
//     { label: 'Weight', value: '70 kg', status: 'High' },
//     { label: 'Sugar Level', value: '96 mmol/L', status: 'High' }
// ]

// export default function PatientHeader({patientId}: {patientId: string}) {
//   const [patient, setPatient] = useState<any>(null)
//     const { isConsultationActive, startConsultation, consultationStatus } = useConsultation()

//     useEffect(() => {
//       const fetchPatient =  async () => {
//         try{
//           const workspace = JSON.parse(localStorage.getItem("activeWorkspace") || "{}");
//           const orgId = workspace.id;
//           const res = await PatientService.getPatient(orgId, patientId)
//           setPatient(res.data)
//         } catch(e){
//           console.error("Failed to fetch patient", e)
//         }
//       }
//       fetchPatient()
//     }, [patientId])

//     const handleStart = async () => {
//         try {
//             // In a real app, this ID would come from a selected appointment or created visit
//             await startConsultation('visit-123')
//         } catch (e) {
//             console.error(e)
//         }
//     }

    

//     return (
//         <div className="bg-white rounded-lg border shadow-sm p-6 mb-8">
//             <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
//                 <button onClick={() => history.back()} className="text-sm w-fit bg-[#ECEEFD] font-medium rounded-full text-brand-navy hover:underline px-4 py-1">← Back to Patients List</button>

//                 <div className="flex items-center gap-3">
//                     {consultationStatus === 'active' ? (
//                         <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
//                             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
//                             In Consultation
//                         </span>
//                     ) : (
//                         <Button
//                             type="button"
//                             onSubmitHandler={handleStart}
//                             disabled={consultationStatus === 'starting'}
//                             className="bg-[#1A2380] text-white px-6 py-2 rounded-md hover:bg-[#00B8A8] transition disabled:opacity-50"
//                         >
//                             {consultationStatus === 'starting' ? 'Starting...' : 'Start Consultation'}
//                         </Button>
//                     )}
//                 </div>
//             </div>

//             <div className="flex items-center gap-4 mb-6">
//                 <div className="h-14 w-14 rounded-full bg-[#E3F7F5] grid place-items-center text-brand-teal font-semibold">{patient?.first_name[0] + patient?.last_name[0]}</div>
//                 <div>
//                     <h3 className="text-lg font-semibold text-brand-navy">{patient?.first_name} {patient?.last_name}</h3>
//                     <p> <span className="text-sm text-[#00B8A8]">PID:</span> <span>{patient?.id}</span></p>
//                 </div>
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//                 {vitals.map((v) => (
//                     <div key={v.label} className="border rounded-lg p-4 text-center">
//                         <p className="font-semibold text-brand-navy">{v.value}</p>
//                         <p className="text-sm text-gray-500">{v.label}</p>
//                         <div className="mt-2"><StatusBadge status={v.status as any} /></div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     )
// }



'use client'

import { useState, useEffect } from 'react'
import { StatusBadge } from '@components/StatusBadge'
import Button from '@components/Button'
import { useConsultation } from './ConsultationContext'
import { PatientService } from '@services/api'
import { CreateConsultationModal } from './ConsultationModal'


const vitalsTemplate = [
  { label: 'Blood Pressure', value: '120/80 mmHg', status: 'Normal' },
  { label: 'Temperature', value: '36.8 °C', status: 'High' },
  { label: 'Heart Rate', value: '72 bpm', status: 'Low' },
  { label: 'Weight', value: '70 kg', status: 'High' },
  { label: 'Sugar Level', value: '96 mmol/L', status: 'High' }
]

interface PatientHeaderProps {
  patientId: string
}

export default function PatientHeader({ patientId }: PatientHeaderProps) {
  const [patient, setPatient] = useState<any>(null)
  const [openConsultationModal, setOpenConsultationModal] = useState(false)
  const { startConsultation, consultationStatus, currentVisitId } = useConsultation()

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const workspace = JSON.parse(localStorage.getItem('activeWorkspace') || '{}')
        const orgId = workspace.id
        const res = await PatientService.getPatient(orgId, patientId)
        setPatient(res.data)
      } catch (err) {
        console.error('Failed to fetch patient', err)
      }
    }
    fetchPatient()
  }, [patientId])

  // Callback when a new consultation is created
  const handleConsultationCreated = (consultationId: string) => {
    startConsultation(consultationId) // store in context
    setOpenConsultationModal(false)
  }

  if (!patient) return <p className="p-4 text-gray-500">Loading patient...</p>

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 mb-8">
      {/* Top Row: Back Button + Consultation Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <button
          onClick={() => history.back()}
          className="text-sm w-fit bg-[#ECEEFD] font-medium rounded-full text-brand-navy hover:underline px-4 py-1"
        >
          ← Back to Patients List
        </button>

        <div className="flex items-center gap-3">
          {consultationStatus === 'active' ? (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              In Consultation
            </span>
          ) : (
            <Button
              type="button"
              onSubmitHandler={() => setOpenConsultationModal(true)}
              disabled={consultationStatus === 'starting'}
              className="bg-[#1A2380] text-white px-6 py-2 rounded-md hover:bg-[#00B8A8] transition disabled:opacity-50"
            >
              {consultationStatus === 'starting' ? 'Starting...' : 'Start Consultation'}
            </Button>
          )}
        </div>
      </div>

      {/* Patient Info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-14 w-14 rounded-full bg-[#E3F7F5] grid place-items-center text-brand-teal font-semibold text-xl">
          {patient.first_name[0]}{patient.last_name[0]}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-brand-navy">{patient.first_name} {patient.last_name}</h3>
          <p>
            <span className="text-sm text-[#00B8A8]">PID:</span> <span>{patient.id}</span>
          </p>
        </div>
      </div>

      {/* Vitals */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {vitalsTemplate.map((v) => (
          <div key={v.label} className="border rounded-lg p-4 text-center">
            <p className="font-semibold text-brand-navy">{v.value}</p>
            <p className="text-sm text-gray-500">{v.label}</p>
            <div className="mt-2">
              <StatusBadge status={v.status as any} />
            </div>
          </div>
        ))}
      </div>

      {/* Create Consultation Modal */}
      <CreateConsultationModal
        open={openConsultationModal}
        onClose={() => setOpenConsultationModal(false)}
        patientId={patientId}
        onCreated={handleConsultationCreated}
      />
    </div>
  )
}