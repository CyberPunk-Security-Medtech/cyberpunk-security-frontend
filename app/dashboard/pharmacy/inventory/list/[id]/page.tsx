import InventoryItemDetailsClient from "@components/dashboard/pharmacy/InventoryItemDetailsClient";

export default async function PharmacyMedicineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InventoryItemDetailsClient itemId={id} />;
}
