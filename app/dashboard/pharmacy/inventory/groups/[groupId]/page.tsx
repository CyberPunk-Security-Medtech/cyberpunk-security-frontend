import MedicineGroupDetailsClient from "@components/dashboard/pharmacy/MedicineGroupDetailsClient";

export default async function MedicineGroupDetailsPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;
  return <MedicineGroupDetailsClient groupName={decodeURIComponent(groupId)} />;
}
