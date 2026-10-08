import PrescriptionDetailsClient from "@components/dashboard/pharmacy/PrescriptionDetailsClient";

export default async function PharmacyPrescriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PrescriptionDetailsClient prescriptionId={id} />;
}
