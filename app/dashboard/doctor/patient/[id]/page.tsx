import DoctorPatientDetails from "@components/dashboard/doctor/DoctorPatientDetails";
import { ConsultationProvider } from "@components/dashboard/doctor/ConsultationContext";

export default async function PatientDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <ConsultationProvider patientId={id}>
      <DoctorPatientDetails />
    </ConsultationProvider>
  );
}
