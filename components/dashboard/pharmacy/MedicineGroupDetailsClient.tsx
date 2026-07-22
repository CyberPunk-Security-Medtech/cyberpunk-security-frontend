"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { inventoryService } from "@services/api";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-toastify";
import BreadcrumbHeading from "./BreadcrumbHeading";
import AddMedicineModal from "./AddMedicineModal";
import { collectionFromResponse, getInventoryGroup, getInventoryQuantity, InventoryItem } from "./pharmacyUtils";

export default function MedicineGroupDetailsClient({ groupName }: { groupName: string }) {
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id;
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadItems = useCallback(async () => {
    if (!orgId) { setItems([]); setLoading(false); return; }
    setLoading(true);
    try { setItems(collectionFromResponse<InventoryItem>(await inventoryService.listInventoryItems(orgId))); }
    catch (error) { console.error("Failed to load group", error); toast.error("Unable to load this group."); }
    finally { setLoading(false); }
  }, [orgId]);
  useEffect(() => { void loadItems(); }, [loadItems]);

  const groupItems = useMemo(() => items.filter((item) => getInventoryGroup(item).toLowerCase() === groupName.toLowerCase() && (item.name ?? "").toLowerCase().includes(query.toLowerCase())), [items, groupName, query]);
  const remove = async (item: InventoryItem) => {
    if (!orgId) return;
    try { await inventoryService.updateInventoryItem(orgId, item.id, { form: "" }); setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, form: "" } : entry)); toast.success("Medicine form cleared."); void loadItems(); }
    catch (error) { console.error("Failed to remove medicine from group", error); toast.error("Unable to update this medicine."); }
  };
  const deleteGroup = async () => {
    if (!orgId || !groupItems.length || !confirm(`Remove ${groupName} from ${groupItems.length} medicine(s)?`)) return;
    try { await Promise.all(groupItems.map((item) => inventoryService.updateInventoryItem(orgId, item.id, { form: "" }))); setItems((current) => current.map((item) => getInventoryGroup(item).toLowerCase() === groupName.toLowerCase() ? { ...item, form: "" } : item)); toast.success("Medicine form cleared."); router.push("/dashboard/pharmacy/inventory/groups"); }
    catch (error) { console.error("Failed to delete group", error); toast.error("Unable to remove this group."); }
  };

  return <><section className="min-w-0 space-y-8"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><BreadcrumbHeading items={["Inventory", "Medicine Groups", groupName]} description="Medicines assigned to this group." /><button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-1 self-start rounded-sm bg-[#00796B] px-5 py-2 text-xs font-medium text-white"><Plus size={12} />Add medicine</button></div><div className="relative w-full max-w-[320px]"><Search size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA3B2]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search medicines" className="h-10 w-full rounded border border-[#CED7E3] px-3 pr-9 text-xs outline-none" /></div>{loading ? <div className="h-64 animate-pulse rounded border bg-gray-100" /> : groupItems.length === 0 ? <div className="rounded border border-dashed p-8 text-center text-sm text-gray-500">No medicines currently belong to this group.</div> : <div className="overflow-x-auto rounded border border-[#D8DEE8] bg-white"><table className="min-w-[720px] w-full text-left"><thead className="border-b"><tr><th className="px-6 py-4 text-sm">Medicine</th><th className="px-6 py-4 text-sm">Stock</th><th className="px-6 py-4 text-right text-sm">Action</th></tr></thead><tbody>{groupItems.map((item) => <tr key={item.id} className="border-b last:border-0"><td className="px-6 py-4">{item.name ?? item.id}</td><td className="px-6 py-4">{getInventoryQuantity(item)}</td><td className="px-6 py-4 text-right"><button onClick={() => void remove(item)} className="inline-flex items-center gap-2 text-[#EF4444]"><Trash2 size={13} />Remove</button></td></tr>)}</tbody></table></div>}<button onClick={() => void deleteGroup()} disabled={!groupItems.length} className="inline-flex items-center gap-2 rounded border border-red-200 bg-red-50 px-5 py-2 text-xs text-red-600 disabled:opacity-50"><Trash2 size={12} />Remove group</button></section><AddMedicineModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} orgId={orgId ?? null} groupName={groupName} medicines={items} onMedicineAdded={() => void loadItems()} /></>;
}
