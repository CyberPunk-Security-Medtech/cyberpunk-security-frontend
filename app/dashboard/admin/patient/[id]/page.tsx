import PatientDetails from "@components/dashboard/admin/PatientDetails";

export default async function AdminPatientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PatientDetails patientId={id} />;
}
