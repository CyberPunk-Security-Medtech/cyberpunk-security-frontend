import PatientConsultationList from "@components/dashboard/doctor/PatientConsultationList";
import PatientHeader from "@components/dashboard/doctor/PatientHeader";
import { ConsultationProvider } from "@components/dashboard/doctor/ConsultationContext";

export default async function PatientDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <ConsultationProvider patientId={id}>
      <PatientHeader />
      <PatientConsultationList />
    </ConsultationProvider>
  );
}
