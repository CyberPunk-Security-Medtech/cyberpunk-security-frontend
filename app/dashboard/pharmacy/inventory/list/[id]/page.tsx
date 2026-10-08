import { redirect } from "next/navigation";

export default async function PharmacyMedicineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/pharmacy/inventory/items/${id}`);
}
