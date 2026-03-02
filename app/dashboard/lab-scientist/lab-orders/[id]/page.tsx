import LabOrderDetailsClient from "@components/dashboard/lab-scientist/LabOrderDetailsClient";

export default async function LabOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LabOrderDetailsClient id={id} />;
}
