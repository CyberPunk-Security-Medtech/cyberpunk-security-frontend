import PatientEditForm from "@components/dashboard/admin/PatientEditForm";

export default async function AdminPatientEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PatientEditForm patientId={id} />;
}
