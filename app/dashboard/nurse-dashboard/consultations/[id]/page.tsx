import ConsultationDetailsClient from "@components/dashboard/nurse-dashboard/ConsultationDetailsClient";

export default async function ConsultationDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ patient_id?: string }>;
}) {
  const { id } = await params;
  const { patient_id } = await searchParams;

  return <ConsultationDetailsClient consultationId={id} patientId={patient_id ?? null} />;
}
