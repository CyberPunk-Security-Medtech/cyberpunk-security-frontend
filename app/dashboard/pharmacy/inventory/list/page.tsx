import { redirect } from "next/navigation";

export default function PharmacyMedicineListPage() {
  redirect("/dashboard/pharmacy/inventory/items");
}
