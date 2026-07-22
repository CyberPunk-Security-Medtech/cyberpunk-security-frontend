// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import { AlertTriangle, ChevronRight, Package, Pill } from "lucide-react";
// import { inventoryService } from "@services/api";
// import { useAuth } from "@context/AuthContext";
// import { toast } from "react-toastify";
// import { collectionFromResponse, getInventoryGroup, getInventoryQuantity, InventoryItem } from "./pharmacyUtils";

// export default function InventoryOverviewClient() {
//   const { activeWorkspace } = useAuth();
//   const orgId = activeWorkspace?.id;
//   const [items, setItems] = useState<InventoryItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!orgId) { setItems([]); setLoading(false); return; }
//     const load = async () => {
//       setLoading(true);
//       try {
//         const catalogue = collectionFromResponse<InventoryItem>(await inventoryService.listInventoryItems(orgId));
//         const hydrated = await Promise.all(catalogue.map(async (item) => {
//           try {
//             const detail = await inventoryService.getInventoryItem(orgId, item.id);
//             return { ...item, ...(detail as InventoryItem), stockKnown: true };
//           } catch (error) {
//             console.warn(`Unable to load stock batches for ${item.id}`, error);
//             return { ...item, stockKnown: false };
//           }
//         }));
//         setItems(hydrated);
//       } catch (error) {
//         console.error("Failed to load inventory summary", error);
//         toast.error("Unable to load inventory.");
//       } finally { setLoading(false); }
//     };
//     void load();
//   }, [orgId]);

//   const summary = useMemo(() => ({
//     medicines: items.length,
//     groups: new Set(items.map(getInventoryGroup).filter(Boolean)).size,
//     // Catalogue records do not carry quantities. Only count an item after its batches load.
//     shortages: items.filter((item) => item.stockKnown && getInventoryQuantity(item) <= 0).length,
//   }), [items]);

//   const cards = [
//     { title: "Medicines available", value: summary.medicines, action: "View full list", href: "/dashboard/pharmacy/inventory/list", icon: Package, iconColor: "text-[#2F80ED]", iconBg: "bg-[#EBF4FF]" },
//     { title: "Medicine groups", value: summary.groups, action: "View groups", href: "/dashboard/pharmacy/inventory/groups", icon: Pill, iconColor: "text-[#00A86B]", iconBg: "bg-[#EAFBF2]" },
//     { title: "Out of stock", value: summary.shortages, action: "Review inventory", href: "/dashboard/pharmacy/inventory/list", icon: AlertTriangle, iconColor: "text-[#EF4444]", iconBg: "bg-[#FFF1F2]" },
//   ];

//   return (
//     <section className="space-y-8">
//       <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
//         <div><h1 className="text-[36px] font-semibold leading-none text-[#151D48]">Inventory</h1><p className="mt-2 text-sm text-[#737791]">Manage medicines and their available stock.</p></div>
//         <Link href="/dashboard/pharmacy/inventory/new" className="inline-flex self-start rounded-full bg-[#00796B] px-4 py-2 text-xs font-medium text-white hover:bg-[#00695F]">Add medicine</Link>
//       </div>
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-[780px] lg:grid-cols-3">
//         {cards.map(({ title, value, action, href, icon: Icon, iconColor, iconBg }) => (
//           <article key={title} className="overflow-hidden rounded border border-[#DDE3ED] bg-white">
//             <div className="px-5 py-4 text-center"><span className={`mx-auto mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full ${iconBg}`}><Icon size={15} className={iconColor} /></span><p className="text-2xl font-semibold text-[#23272E]">{loading ? "—" : value}</p><p className="mt-2 text-xs text-[#8A93A5]">{title}</p></div>
//             <Link href={href} className="flex items-center justify-center gap-1 border-t border-[#E8ECF3] px-3 py-2 text-xs font-medium text-[#00796B] hover:bg-[#F0FFFA]">{action}<ChevronRight size={12} /></Link>
//           </article>
//         ))}
//       </div>
//     </section>
//   );
// }


"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ChevronRight, Package, Pill } from "lucide-react";
import { inventoryService } from "@services/api";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-toastify";
import { collectionFromResponse, getInventoryGroup, getInventoryQuantity, InventoryItem } from "./pharmacyUtils";

export default function InventoryOverviewClient() {
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id;
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId) { setItems([]); setLoading(false); return; }
    const load = async () => {
      setLoading(true);
      try {
        const catalogue = collectionFromResponse<InventoryItem>(await inventoryService.listInventoryItems(orgId));
        const hydrated = await Promise.all(catalogue.map(async (item) => {
          try {
            const detail = await inventoryService.getInventoryItem(orgId, item.id);
            return { ...item, ...(detail as InventoryItem), stockKnown: true };
          } catch (error) {
            console.warn(`Unable to load stock batches for ${item.id}`, error);
            return { ...item, stockKnown: false };
          }
        }));
        setItems(hydrated);
      } catch (error) {
        console.error("Failed to load inventory summary", error);
        toast.error("Unable to load inventory.");
      } finally { setLoading(false); }
    };
    void load();
  }, [orgId]);

  const summary = useMemo(() => {
    // Only count actual medicines, hide the placeholders
    const realItems = items.filter(item => !item.name?.startsWith("[Group Placeholder]"));
    
    return {
      medicines: realItems.length,
      // We still use all items to calculate groups so empty groups appear in the count
      groups: new Set(items.map(getInventoryGroup).filter(Boolean)).size,
      shortages: realItems.filter((item) => item.stockKnown && getInventoryQuantity(item) <= 0).length,
    }
  }, [items]);

  const cards = [
    { title: "Medicines available", value: summary.medicines, action: "View full list", href: "/dashboard/pharmacy/inventory/list", icon: Package, iconColor: "text-[#2F80ED]", iconBg: "bg-[#EBF4FF]" },
    { title: "Medicine groups", value: summary.groups, action: "View groups", href: "/dashboard/pharmacy/inventory/groups", icon: Pill, iconColor: "text-[#00A86B]", iconBg: "bg-[#EAFBF2]" },
    { title: "Out of stock", value: summary.shortages, action: "Review inventory", href: "/dashboard/pharmacy/inventory/list", icon: AlertTriangle, iconColor: "text-[#EF4444]", iconBg: "bg-[#FFF1F2]" },
  ];

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div><h1 className="text-[36px] font-semibold leading-none text-[#151D48]">Inventory</h1><p className="mt-2 text-sm text-[#737791]">Manage medicines and their available stock.</p></div>
        <Link href="/dashboard/pharmacy/inventory/new" className="inline-flex self-start rounded-full bg-[#00796B] px-4 py-2 text-xs font-medium text-white hover:bg-[#00695F]">Add medicine</Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-[780px] lg:grid-cols-3">
        {cards.map(({ title, value, action, href, icon: Icon, iconColor, iconBg }) => (
          <article key={title} className="overflow-hidden rounded border border-[#DDE3ED] bg-white">
            <div className="px-5 py-4 text-center"><span className={`mx-auto mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full ${iconBg}`}><Icon size={15} className={iconColor} /></span><p className="text-2xl font-semibold text-[#23272E]">{loading ? "—" : value}</p><p className="mt-2 text-xs text-[#8A93A5]">{title}</p></div>
            <Link href={href} className="flex items-center justify-center gap-1 border-t border-[#E8ECF3] px-3 py-2 text-xs font-medium text-[#00796B] hover:bg-[#F0FFFA]">{action}<ChevronRight size={12} /></Link>
          </article>
        ))}
      </div>
    </section>
  );
}