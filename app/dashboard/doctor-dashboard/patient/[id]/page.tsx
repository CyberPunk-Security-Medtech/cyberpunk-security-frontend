import ActivityLogTab from "@components/dashboard/doctor-dashboard/ActivityLog";
import LabTestTab from "@components/dashboard/doctor-dashboard/LabTestTab";
import MedicalHistoryTab from "@components/dashboard/doctor-dashboard/MedicalHistoryTab";
import PatientHeader from "@components/dashboard/doctor-dashboard/PatientHeader";
import PatientPrescriptionTab from "@components/dashboard/doctor-dashboard/PatientPrescriptionTab";
import Tabs from "@components/Tabs";
import { ConsultationProvider } from "@components/dashboard/doctor-dashboard/ConsultationContext";

export default async function PatientDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tabs = [
    { label: "Medical History", content: <MedicalHistoryTab /> },
    { label: "Prescription", content: <PatientPrescriptionTab /> },
    { label: "Lab Test", content: <LabTestTab /> },
    { label: "Activity Log", content: <ActivityLogTab /> },
  ];

  return (
    <ConsultationProvider patientId={id}>
      <PatientHeader />
      <Tabs tabs={tabs} />
    </ConsultationProvider>
  );
}
