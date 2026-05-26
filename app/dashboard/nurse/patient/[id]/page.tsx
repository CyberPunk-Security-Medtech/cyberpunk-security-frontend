import PatientConsultationList from "@components/dashboard/nurse/PatientConsultationList";
import PatientHeader from "@components/dashboard/nurse/PatientHeader";
import { ConsultationProvider } from "@components/dashboard/nurse/ConsultationContext";

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
