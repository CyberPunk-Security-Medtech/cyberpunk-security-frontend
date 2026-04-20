import { notFound } from "next/navigation";
import MedicineGroupDetailsClient from "@components/dashboard/pharmacy/MedicineGroupDetailsClient";
import { pharmacyMedicineGroups } from "@components/dashboard/pharmacy/inventoryData";

type PageProps = {
  params: Promise<{ groupId: string }>;
};

export default async function MedicineGroupDetailsPage({ params }: PageProps) {
  const { groupId } = await params;
  const group = pharmacyMedicineGroups.find((item) => item.id === groupId);

  if (!group) {
    notFound();
  }

  return <MedicineGroupDetailsClient groupName={group.name} medicines={group.medicines} />;
}
