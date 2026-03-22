import PatientConsultationList from "@components/dashboard/nurse-dashboard/PatientConsultationList";
import PatientHeader from "@components/dashboard/nurse-dashboard/PatientHeader";
import { ConsultationProvider } from "@components/dashboard/nurse-dashboard/ConsultationContext";

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
