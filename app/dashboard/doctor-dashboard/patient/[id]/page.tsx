'use client'

// import DashboardLayout from '@app/dashboard/layout'
import ActivityLogTab from '@components/dashboard/doctor-dashboard/ActivityLog'
import LabTestTab from '@components/dashboard/doctor-dashboard/LabTestTab'
import MedicalHistoryTab from '@components/dashboard/doctor-dashboard/MedicalHistoryTab'
import PatientHeader from '@components/dashboard/doctor-dashboard/PatientHeader'
import PatientPrescriptionTab from '@components/dashboard/doctor-dashboard/PatientPrescriptionTab'

import Tabs from '@components/Tabs'
import { ConsultationProvider } from '@components/dashboard/doctor-dashboard/ConsultationContext'
import { useParams } from 'next/navigation'

export default function PatientDetails() {
const params = useParams();
const patientId = params.id as string;

  const tabs = [
    { label: 'Medical History', content: <MedicalHistoryTab patientId={patientId} /> },
    { label: 'Prescription', content: <PatientPrescriptionTab /> },
    { label: 'Lab Test', content: <LabTestTab /> },
    { label: 'Activity Log', content: <ActivityLogTab /> },
  ]
  return (
    <ConsultationProvider>
      <PatientHeader patientId={patientId} />
      <Tabs tabs={tabs} />
    </ConsultationProvider>
  )
}