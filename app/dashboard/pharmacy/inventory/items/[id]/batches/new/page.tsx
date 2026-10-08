import InventoryBatchFormClient from "@components/dashboard/pharmacy/InventoryBatchFormClient";

export default async function PharmacyInventoryBatchNewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InventoryBatchFormClient itemId={id} />;
}
