// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { ArrowUpDown, ChevronRight } from "lucide-react";
// import { useAuth } from "@context/AuthContext";
// import { inventoryService } from "@services/api";
// import { toast } from "react-toastify";
// import BreadcrumbHeading from "./BreadcrumbHeading";
// import { collectionFromResponse, InventoryItem } from "./pharmacyUtils";

// export default function InventoryListClient() {
//   const { activeWorkspace } = useAuth();
//   const orgId = activeWorkspace?.id;
//   const [medicines, setMedicines] = useState<InventoryItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!orgId) { setMedicines([]); setLoading(false); return; }
//     const load = async () => {
//       setLoading(true); setError(null);
//       try { setMedicines(collectionFromResponse<InventoryItem>(await inventoryService.listInventoryItems(orgId))); }
//       catch (cause) { console.error("Failed to load inventory items", cause); setError("Failed to load inventory items. Please try again."); toast.error("Failed to load inventory items"); }
//       finally { setLoading(false); }
//     };
//     void load();
//   }, [orgId]);

//   if (loading) return <section className="min-w-0 space-y-8"><BreadcrumbHeading items={["Inventory", "Loading..."]} description="Loading medicines available for dispensing." /><div className="h-64 animate-pulse rounded border border-[#D8DEE8] bg-gray-100" /></section>;
//   if (error) return <section className="min-w-0 space-y-8"><BreadcrumbHeading items={["Inventory", "Error"]} description="Failed to load inventory." /><div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div></section>;

//   return <section className="min-w-0 space-y-8"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><BreadcrumbHeading items={["Inventory", `List of medicines (${medicines.length})`]} description="Catalogue entries. Open an item to see its batches and on-hand quantity." /><Link href="/dashboard/pharmacy/inventory/new" className="inline-flex items-center gap-1 self-start rounded-full bg-[#00796B] px-4 py-2 text-xs font-medium text-white hover:bg-[#00695F]">+ Add Medicine</Link></div>{medicines.length === 0 ? <div className="rounded border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">No medicines found in inventory.</div> : <div role="region" aria-label="Medicine list table" className="w-full overflow-x-auto rounded border border-[#D8DEE8] bg-white"><table className="min-w-[840px] w-full table-auto"><thead className="border-b border-[#D8DEE8] text-left text-sm font-medium text-[#2D3648]"><tr>{["Medicine name", "Unit", "Form", "Strength"].map((label) => <th key={label} className="whitespace-nowrap px-6 py-4"><span className="inline-flex items-center gap-2">{label}<ArrowUpDown size={13} className="text-[#8792A8]" /></span></th>)}<th className="px-6 py-4 text-right">Action</th></tr></thead><tbody>{medicines.map((medicine) => <tr key={medicine.id} className="border-b border-[#E8EDF4] text-[13px] text-[#3A4253] last:border-0"><td className="px-6 py-4 font-medium">{medicine.name || "Unnamed medicine"}</td><td className="px-6 py-4">{medicine.unit || "—"}</td><td className="px-6 py-4">{medicine.form || "—"}</td><td className="px-6 py-4">{medicine.strength || "—"}</td><td className="px-6 py-4 text-right"><Link href={`/dashboard/pharmacy/inventory/list/${medicine.id}`} className="inline-flex items-center gap-1 text-[#2D3648] hover:text-[#00796B]">View batches <ChevronRight size={13} /></Link></td></tr>)}</tbody></table></div>}</section>;
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, ChevronRight } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { inventoryService } from "@services/api";
import { toast } from "react-toastify";
import BreadcrumbHeading from "./BreadcrumbHeading";
import { collectionFromResponse, InventoryItem } from "./pharmacyUtils";

export default function InventoryListClient() {
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id;
  const [medicines, setMedicines] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId) { setMedicines([]); setLoading(false); return; }
    const load = async () => {
      setLoading(true);
      try {
        const allItems = collectionFromResponse<InventoryItem>(await inventoryService.listInventoryItems(orgId));
        // Hide placeholder items from the medicine table
        const realMedicines = allItems.filter(item => !item.name?.startsWith("[Group Placeholder]"));
        setMedicines(realMedicines);
      }
      catch (cause) { console.error("Failed to load inventory items", cause); toast.error("Failed to load inventory items"); }
      finally { setLoading(false); }
    };
    void load();
  }, [orgId]);

  if (loading) return <section className="min-w-0 space-y-8"><BreadcrumbHeading items={["Inventory", "Loading..."]} description="Loading medicines available for dispensing." /><div className="h-64 animate-pulse rounded border border-[#D8DEE8] bg-gray-100" /></section>;

  return<section className="min-w-0 space-y-8"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><BreadcrumbHeading items={["Inventory", `List of medicines (${medicines.length})`]} description="Catalogue entries. Open an item to see its batches and on-hand quantity." /><Link href="/dashboard/pharmacy/inventory/new" className="inline-flex items-center gap-1 self-start rounded-full bg-[#00796B] px-4 py-2 text-xs font-medium text-white hover:bg-[#00695F]">+ Add Medicine</Link></div>{medicines.length === 0 ? <div className="rounded border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">No medicines found in inventory.</div> : <div role="region" aria-label="Medicine list table" className="w-full overflow-x-auto rounded border border-[#D8DEE8] bg-white"><table className="min-w-[840px] w-full table-auto"><thead className="border-b border-[#D8DEE8] text-left text-sm font-medium text-[#2D3648]"><tr>{["Medicine name", "Unit", "Form", "Strength"].map((label) => <th key={label} className="whitespace-nowrap px-6 py-4"><span className="inline-flex items-center gap-2">{label}<ArrowUpDown size={13} className="text-[#8792A8]" /></span></th>)}<th className="px-6 py-4 text-right">Action</th></tr></thead><tbody>{medicines.map((medicine) => <tr key={medicine.id} className="border-b border-[#E8EDF4] text-[13px] text-[#3A4253] last:border-0"><td className="px-6 py-4 font-medium">{medicine.name || "Unnamed medicine"}</td><td className="px-6 py-4">{medicine.unit || "—"}</td><td className="px-6 py-4">{medicine.form || "—"}</td><td className="px-6 py-4">{medicine.strength || "—"}</td><td className="px-6 py-4 text-right"><Link href={`/dashboard/pharmacy/inventory/list/${medicine.id}`} className="inline-flex items-center gap-1 text-[#2D3648] hover:text-[#00796B]">View batches <ChevronRight size={13} /></Link></td></tr>)}</tbody></table></div>}</section>;
}