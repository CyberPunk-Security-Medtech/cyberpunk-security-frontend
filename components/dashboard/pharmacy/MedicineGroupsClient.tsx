"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Plus, Search, Trash2 } from "lucide-react";
import { inventoryService } from "@services/api";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-toastify";
import BreadcrumbHeading from "./BreadcrumbHeading";
import AddGroupModal from "./AddGroupModal";
import { collectionFromResponse, getInventoryGroup, InventoryItem } from "./pharmacyUtils";

type MedicineGroup = { name: string; medicineCount: number };

export default function MedicineGroupsClient() {
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id;
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Add a showLoader flag to allow silent background refreshing
  const loadItems = useCallback(async (showLoader = true) => {
    if (!orgId) { setItems([]); setLoading(false); return; }
    if (showLoader) setLoading(true);
    try { 
      setItems(collectionFromResponse<InventoryItem>(await inventoryService.listInventoryItems(orgId))); 
    }
    catch (error) { 
      console.error("Failed to load medicine groups", error); 
      toast.error("Unable to load medicine groups."); 
    }
    finally { 
      if (showLoader) setLoading(false); 
    }
  }, [orgId]);

  useEffect(() => { void loadItems(); }, [loadItems]);
const groups = useMemo<MedicineGroup[]>(() => {
    const counts = new Map<string, number>();
    
    items.forEach((item) => { 
      const name = getInventoryGroup(item)?.trim(); 
      
      // If the group has a name AND it isn't our fallback "Uncategorized", count it
      if (name && name !== "Uncategorized") {
        if (!counts.has(name)) {
          counts.set(name, 0); 
        }
        
        const isPlaceholder = item.name?.startsWith("[Group Placeholder]");
        if (!isPlaceholder) {
          counts.set(name, counts.get(name)! + 1); 
        }
      }
    });

    return [...counts]
      .map(([name, medicineCount]) => ({ name, medicineCount }))
      .filter((group) => group.name.toLowerCase().includes(query.trim().toLowerCase()));
  }, [items, query]);

  const removeGroup = async (group: MedicineGroup) => {
    if (!orgId || !confirm(`Remove ${group.name} from all ${group.medicineCount} medicine(s)?`)) return;
    
    const affectedIds = new Set(items.filter((item) => getInventoryGroup(item) === group.name).map((item) => item.id));
    
    // 1. Optimistic Update: Set form to "Uncategorized" immediately in the UI
    setItems((current) => current.map((item) => affectedIds.has(item.id) ? { ...item, form: "Uncategorized" } : item));

    try {
      // 2. Loop through all items and update them to "Uncategorized"
      // The backend will accept this valid word perfectly without crashing
      for (const itemId of affectedIds) {
        await inventoryService.updateInventoryItem(orgId, itemId, { form: "Uncategorized" });
      }

      toast.success("Medicine group removed.");
      void loadItems(false); 
    } catch (error) { 
      console.error("Failed to remove medicine group", error); 
      toast.error("Unable to remove this group completely."); 
      void loadItems(false);
    }
  };


  return (
    <>
      <section className="min-w-0 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <BreadcrumbHeading items={["Inventory", "Medicine Groups"]} description="Groups are saved as a category on inventory items." />
          <button onClick={() => setIsModalOpen(true)} disabled={!items.length} className="inline-flex items-center gap-1 self-start rounded-sm bg-[#00796B] px-5 py-2 text-xs font-medium text-white disabled:opacity-60">
            <Plus size={12} />Create group
          </button>
        </div>
        
        <p className="-mt-5 text-xs text-[#737791]">
          {items.length ? "Select an existing medicine to create a persistent group." : "Add a medicine before creating a group."}
        </p>
        
        <div className="relative w-full max-w-[320px]">
          <Search size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA3B2]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for group" className="h-10 w-full rounded border border-[#CED7E3] bg-white px-3 pr-9 text-xs outline-none" />
        </div>
        
        {loading ? (
          <div className="h-64 animate-pulse rounded border border-[#D8DEE8] bg-gray-100" />
        ) : groups.length === 0 ? (
          <div className="rounded border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">No medicine groups found.</div>
        ) : (
          <div className="overflow-x-auto rounded border border-[#D8DEE8] bg-white">
            <table className="min-w-[700px] w-full text-left">
              <thead className="border-b border-[#D8DEE8]">
                <tr className="text-sm font-medium text-[#2D3648]">
                  <th className="px-6 py-4"><span className="inline-flex items-center gap-2">Group name<ArrowUpDown size={13} /></span></th>
                  <th className="px-6 py-4">Medicines</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <tr key={group.name} className="border-b border-[#E8EDF4] last:border-0">
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/pharmacy/inventory/groups/${encodeURIComponent(group.name)}`} className="hover:text-[#00796B] hover:underline">{group.name}</Link>
                    </td>
                    <td className="px-6 py-4">{group.medicineCount}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => void removeGroup(group)} className="inline-flex items-center gap-2 text-[#EF4444]">
                        <Trash2 size={13} />Remove group
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      
      {/* 5. Update the modal callback to refresh silently as well */}
      <AddGroupModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        orgId={orgId ?? null} 
        onGroupAdded={() => void loadItems(false)} 
      />
    </>
  );
}