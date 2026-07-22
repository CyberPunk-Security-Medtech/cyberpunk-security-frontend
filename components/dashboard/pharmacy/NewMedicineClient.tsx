// "use client";

// import { FormEvent, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@context/AuthContext";
// import { inventoryService } from "@services/api";
// import { toast } from "react-toastify";
// import BreadcrumbHeading from "./BreadcrumbHeading";

// const initialForm = { name: "", unit: "", form: "", strength: "", initial_quantity: "", batch_number: "", expiry_date: "" };

// export default function NewMedicineClient() {
//   const { activeWorkspace } = useAuth();
//   const router = useRouter();
//   const [form, setForm] = useState(initialForm);
//   const [saving, setSaving] = useState(false);
//   const update = (key: keyof typeof initialForm, value: string) => setForm((current) => ({ ...current, [key]: value }));

//   const submit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const orgId = activeWorkspace?.id;
//     const initialQuantity = form.initial_quantity ? Number(form.initial_quantity) : 0;
//     if (!orgId) return toast.error("Choose a workspace before adding inventory.");
//     if (!form.name.trim() || !form.unit.trim()) return toast.error("Medicine name and dispensing unit are required.");
//     if (!Number.isInteger(initialQuantity) || initialQuantity < 0) return toast.error("Initial stock must be a whole number of zero or more.");
//     setSaving(true);
//     try {
//       const created = await inventoryService.createInventoryItem(orgId, { name: form.name.trim(), unit: form.unit.trim(), form: form.form.trim() || null, strength: form.strength.trim() || null });
//       const item = (created && typeof created === "object" && "data" in created ? (created as { data: { id?: string } }).data : created) as { id?: string };
//       if (!item?.id) throw new Error("The inventory API did not return an item ID.");
//       if (initialQuantity > 0) {
//         await inventoryService.receiveStockBatch(orgId, item.id, { initial_quantity: initialQuantity, batch_number: form.batch_number.trim() || null, expiry_date: form.expiry_date || null });
//       }
//       toast.success(initialQuantity ? "Medicine and opening stock added." : "Medicine added to the catalog.");
//       router.push(`/dashboard/pharmacy/inventory/list/${item.id}`);
//     } catch (error) { console.error("Failed to create inventory item", error); toast.error(error instanceof Error && error.message.includes("item ID") ? error.message : "Unable to add this medicine. No changes were assumed successful."); }
//     finally { setSaving(false); }
//   };

//   return <section className="space-y-8"><BreadcrumbHeading items={["Inventory", "List of Medicines", "Add New Medicine"]} description="Create a medicine catalog entry, then optionally receive its first stock batch." />
//     <form onSubmit={submit} className="max-w-[820px] space-y-6"><div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//       <label className="space-y-2 text-sm text-[#2D3648]"><span>Medicine name *</span><input required value={form.name} onChange={(e) => update("name", e.target.value)} className="h-11 w-full rounded border border-[#CED7E3] px-3" /></label>
//       <label className="space-y-2 text-sm text-[#2D3648]"><span>Dispensing unit *</span><input required value={form.unit} onChange={(e) => update("unit", e.target.value)} placeholder="tablet, vial, bottle" className="h-11 w-full rounded border border-[#CED7E3] px-3" /></label>
//       <label className="space-y-2 text-sm text-[#2D3648]"><span>Medicine form</span><input value={form.form} onChange={(e) => update("form", e.target.value)} placeholder="tablet, capsule, syrup" className="h-11 w-full rounded border border-[#CED7E3] px-3" /></label>
//       <label className="space-y-2 text-sm text-[#2D3648]"><span>Strength</span><input value={form.strength} onChange={(e) => update("strength", e.target.value)} placeholder="500 mg" className="h-11 w-full rounded border border-[#CED7E3] px-3" /></label>
//       <label className="space-y-2 text-sm text-[#2D3648]"><span>Opening stock</span><input min="0" step="1" type="number" value={form.initial_quantity} onChange={(e) => update("initial_quantity", e.target.value)} className="h-11 w-full rounded border border-[#CED7E3] px-3" /></label>
//       <label className="space-y-2 text-sm text-[#2D3648]"><span>Batch number</span><input value={form.batch_number} onChange={(e) => update("batch_number", e.target.value)} className="h-11 w-full rounded border border-[#CED7E3] px-3" /></label>
//       <label className="space-y-2 text-sm text-[#2D3648]"><span>Expiry date</span><input type="date" value={form.expiry_date} onChange={(e) => update("expiry_date", e.target.value)} className="h-11 w-full rounded border border-[#CED7E3] px-3" /></label>
//     </div><div className="flex gap-3"><button type="button" onClick={() => router.back()} className="rounded-full border border-[#CED7E3] px-7 py-3 text-xs font-medium text-[#2D3648]">Cancel</button><button disabled={saving} className="rounded-full bg-[#00796B] px-7 py-3 text-xs font-medium text-white disabled:opacity-60">{saving ? "Saving..." : "Save medicine"}</button></div></form>
//   </section>;
// }

"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@context/AuthContext";
import { inventoryService } from "@services/api";
import { toast } from "react-toastify";
import BreadcrumbHeading from "./BreadcrumbHeading";
import { collectionFromResponse, InventoryItem } from "./pharmacyUtils";

const initialForm = { name: "", unit: "", form: "", strength: "", initial_quantity: "", batch_number: "", expiry_date: "" };

export default function NewMedicineClient() {
  const { activeWorkspace } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [existingGroups, setExistingGroups] = useState<string[]>([]);
  
  const update = (key: keyof typeof initialForm, value: string) => setForm((current) => ({ ...current, [key]: value }));

  // Fetch existing groups to populate the dropdown
  useEffect(() => {
    const orgId = activeWorkspace?.id;
    if (!orgId) return;
    inventoryService.listInventoryItems(orgId).then((res) => {
      const allItems = collectionFromResponse<InventoryItem>(res);
      const uniqueGroups = Array.from(new Set(allItems.map(i => i.form).filter(Boolean))) as string[];
      setExistingGroups(uniqueGroups);
    }).catch(console.error);
  }, [activeWorkspace?.id]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const orgId = activeWorkspace?.id;
    const initialQuantity = form.initial_quantity ? Number(form.initial_quantity) : 0;
    if (!orgId) return toast.error("Choose a workspace before adding inventory.");
    if (!form.name.trim() || !form.unit.trim()) return toast.error("Medicine name and dispensing unit are required.");
    if (!Number.isInteger(initialQuantity) || initialQuantity < 0) return toast.error("Initial stock must be a whole number of zero or more.");
    setSaving(true);
    try {
      const created = await inventoryService.createInventoryItem(orgId, { name: form.name.trim(), unit: form.unit.trim(), form: form.form.trim() || null, strength: form.strength.trim() || null });
      const item = (created && typeof created === "object" && "data" in created ? (created as { data: { id?: string } }).data : created) as { id?: string };
      if (!item?.id) throw new Error("The inventory API did not return an item ID.");
      if (initialQuantity > 0) {
        await inventoryService.receiveStockBatch(orgId, item.id, { initial_quantity: initialQuantity, batch_number: form.batch_number.trim() || null, expiry_date: form.expiry_date || null });
      }
      toast.success(initialQuantity ? "Medicine and opening stock added." : "Medicine added to the catalog.");
      router.push(`/dashboard/pharmacy/inventory/list/${item.id}`);
    } catch (error) { console.error("Failed to create inventory item", error); toast.error(error instanceof Error && error.message.includes("item ID") ? error.message : "Unable to add this medicine. No changes were assumed successful."); }
    finally { setSaving(false); }
  };

  return <section className="space-y-8"><BreadcrumbHeading items={["Inventory", "List of Medicines", "Add New Medicine"]} description="Create a medicine catalog entry, then optionally receive its first stock batch." />
    <form onSubmit={submit} className="max-w-[820px] space-y-6"><div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <label className="space-y-2 text-sm text-[#2D3648]"><span>Medicine name *</span><input required value={form.name} onChange={(e) => update("name", e.target.value)} className="h-11 w-full rounded border border-[#CED7E3] px-3" /></label>
      <label className="space-y-2 text-sm text-[#2D3648]"><span>Dispensing unit *</span><input required value={form.unit} onChange={(e) => update("unit", e.target.value)} placeholder="tablet, vial, bottle" className="h-11 w-full rounded border border-[#CED7E3] px-3" /></label>
      
      {/* Modified this field to include the datalist dropdown for groups */}
      <label className="space-y-2 text-sm text-[#2D3648]">
        <span>Medicine group (Form)</span>
        <input list="group-options" value={form.form} onChange={(e) => update("form", e.target.value)} placeholder="Select or type a group..." className="h-11 w-full rounded border border-[#CED7E3] px-3" />
        <datalist id="group-options">
          {existingGroups.map(group => <option key={group} value={group} />)}
        </datalist>
      </label>

      <label className="space-y-2 text-sm text-[#2D3648]"><span>Strength</span><input value={form.strength} onChange={(e) => update("strength", e.target.value)} placeholder="500 mg" className="h-11 w-full rounded border border-[#CED7E3] px-3" /></label>
      <label className="space-y-2 text-sm text-[#2D3648]"><span>Opening stock</span><input min="0" step="1" type="number" value={form.initial_quantity} onChange={(e) => update("initial_quantity", e.target.value)} className="h-11 w-full rounded border border-[#CED7E3] px-3" /></label>
      <label className="space-y-2 text-sm text-[#2D3648]"><span>Batch number</span><input value={form.batch_number} onChange={(e) => update("batch_number", e.target.value)} className="h-11 w-full rounded border border-[#CED7E3] px-3" /></label>
      <label className="space-y-2 text-sm text-[#2D3648]"><span>Expiry date</span><input type="date" value={form.expiry_date} onChange={(e) => update("expiry_date", e.target.value)} className="h-11 w-full rounded border border-[#CED7E3] px-3" /></label>
    </div><div className="flex gap-3"><button type="button" onClick={() => router.back()} className="rounded-full border border-[#CED7E3] px-7 py-3 text-xs font-medium text-[#2D3648]">Cancel</button><button disabled={saving} className="rounded-full bg-[#00796B] px-7 py-3 text-xs font-medium text-white disabled:opacity-60">{saving ? "Saving..." : "Save medicine"}</button></div></form>
  </section>;
}