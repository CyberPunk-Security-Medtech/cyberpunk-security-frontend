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
//       <label className="space-y-2 text-sm text-[#2D3648]"><span>Medicine name *</span><input required value={form.name} onChange={(e) => update("name", e.target.value)} className="h-11 w-full rounded-md border border-[#CED7E3] px-3" /></label>
//       <label className="space-y-2 text-sm text-[#2D3648]"><span>Dispensing unit *</span><input required value={form.unit} onChange={(e) => update("unit", e.target.value)} placeholder="tablet, vial, bottle" className="h-11 w-full rounded-md border border-[#CED7E3] px-3" /></label>
//       <label className="space-y-2 text-sm text-[#2D3648]"><span>Medicine form</span><input value={form.form} onChange={(e) => update("form", e.target.value)} placeholder="tablet, capsule, syrup" className="h-11 w-full rounded-md border border-[#CED7E3] px-3" /></label>
//       <label className="space-y-2 text-sm text-[#2D3648]"><span>Strength</span><input value={form.strength} onChange={(e) => update("strength", e.target.value)} placeholder="500 mg" className="h-11 w-full rounded-md border border-[#CED7E3] px-3" /></label>
//       <label className="space-y-2 text-sm text-[#2D3648]"><span>Opening stock</span><input min="0" step="1" type="number" value={form.initial_quantity} onChange={(e) => update("initial_quantity", e.target.value)} className="h-11 w-full rounded-md border border-[#CED7E3] px-3" /></label>
//       <label className="space-y-2 text-sm text-[#2D3648]"><span>Batch number</span><input value={form.batch_number} onChange={(e) => update("batch_number", e.target.value)} className="h-11 w-full rounded-md border border-[#CED7E3] px-3" /></label>
//       <label className="space-y-2 text-sm text-[#2D3648]"><span>Expiry date</span><input type="date" value={form.expiry_date} onChange={(e) => update("expiry_date", e.target.value)} className="h-11 w-full rounded-md border border-[#CED7E3] px-3" /></label>
//     </div><div className="flex gap-3"><button type="button" onClick={() => router.back()} className="rounded-md border border-[#CED7E3] px-7 py-3 text-xs font-medium text-[#2D3648]">Cancel</button><button disabled={saving} className="rounded-md bg-[#00796B] px-7 py-3 text-xs font-medium text-white disabled:opacity-60">{saving ? "Saving..." : "Save medicine"}</button></div></form>
//   </section>;
// }

"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@context/AuthContext";
import { inventoryService } from "@services/api";
import { toast } from "react-toastify";
import BreadcrumbHeading from "./BreadcrumbHeading";
import { collectionFromResponse, InventoryItem } from "./pharmacyUtils";

const initialForm = { name: "", unit: "", form: "", strength: "" };

export default function NewMedicineClient() {
  const { activeWorkspace } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [existingItems, setExistingItems] = useState<InventoryItem[]>([]);

  const update = (key: keyof typeof initialForm, value: string) => setForm((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    const orgId = activeWorkspace?.id;
    if (!orgId) return;

    inventoryService
      .listInventoryItems(orgId)
      .then((res) => {
        const allItems = collectionFromResponse<InventoryItem>(res).filter((item) => !item.name?.startsWith("[Group Placeholder]"));
        setExistingItems(allItems);
      })
      .catch((error) => {
        console.error("Failed to load inventory items for quick lookup", error);
      });
  }, [activeWorkspace?.id]);

  const matchingItems = useMemo(() => {
    const search = form.name.trim().toLowerCase();
    if (!search) return [];
    return existingItems
      .filter((item) => (item.name ?? "").toLowerCase().includes(search))
      .slice(0, 6);
  }, [existingItems, form.name]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const orgId = activeWorkspace?.id;

    if (!orgId) return toast.error("Choose a workspace before adding inventory.");
    if (!form.name.trim() || !form.unit.trim()) return toast.error("Item name and dispensing unit are required.");

    setSaving(true);
    try {
      const created = await inventoryService.createInventoryItem(orgId, {
        name: form.name.trim(),
        unit: form.unit.trim(),
        form: form.form.trim() || null,
        strength: form.strength.trim() || null,
      });

      const item = (created && typeof created === "object" && "data" in created ? (created as { data: { id?: string } }).data : created) as { id?: string };
      if (!item?.id) throw new Error("The inventory API did not return an item ID.");

      toast.success("Item created. Add the first batch to record stock.");
      router.push(`/dashboard/pharmacy/inventory/items/${item.id}/batches/new`);
    } catch (error) {
      console.error("Failed to create inventory item", error);
      toast.error(error instanceof Error && error.message.includes("item ID") ? error.message : "Unable to add this item. No changes were assumed successful.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-8">
      <BreadcrumbHeading items={["Inventory", "Items", "Add item"]} description="Create a single inventory item and add stock in the next step." />

      <form onSubmit={submit} className="max-w-[820px] space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block space-y-2 text-sm text-[#2D3648]">
              <span>Item name *</span>
              <input
                required
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="e.g. paracetamol"
                className="h-11 w-full rounded-md border border-[#CED7E3] px-3"
              />
            </label>
            <p className="mt-2 text-xs text-[#5B6478]">
              Use the name as it appears on the product label or supplier record.
            </p>

            {form.name.trim() && matchingItems.length > 0 && (
              <div className="mt-2 rounded-md border border-[#D9E7F5] bg-[#F7FAFF] p-2">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#53627C]">Matching inventory items</p>
                <div className="space-y-1">
                  {matchingItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => router.push(`/dashboard/pharmacy/inventory/items/${item.id}`)}
                      className="flex w-full items-center justify-between rounded-md border border-transparent px-2 py-2 text-left text-sm text-[#2D3648] transition hover:border-[#C4D8FF] hover:bg-white"
                    >
                      <span>{item.name}</span>
                      <span className="text-xs text-[#667085]">View item</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {form.name.trim() && matchingItems.length === 0 && (
              <p className="mt-2 text-xs text-[#5B6478]">No matching item found. You can continue and create this one.</p>
            )}
          </div>

          <label className="space-y-2 text-sm text-[#2D3648]">
            <span>Dispensing unit *</span>
            <input
              required
              value={form.unit}
              onChange={(event) => update("unit", event.target.value)}
              placeholder="tablet, vial, bottle"
              className="h-11 w-full rounded-md border border-[#CED7E3] px-3"
            />
          </label>

          <label className="space-y-2 text-sm text-[#2D3648]">
            <span>Form</span>
            <input
              list="group-options"
              value={form.form}
              onChange={(event) => update("form", event.target.value)}
              placeholder="Select or type a form"
              className="h-11 w-full rounded-md border border-[#CED7E3] px-3"
            />
            <datalist id="group-options">
              {Array.from(new Set(existingItems.map((item) => item.form).filter(Boolean))).map((group) => (
                <option key={String(group)} value={String(group)} />
              ))}
            </datalist>
          </label>

          <label className="space-y-2 text-sm text-[#2D3648]">
            <span>Strength</span>
            <input
              value={form.strength}
              onChange={(event) => update("strength", event.target.value)}
              placeholder="500 mg"
              className="h-11 w-full rounded-md border border-[#CED7E3] px-3"
            />
          </label>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="rounded-md border border-[#CED7E3] px-7 py-3 text-xs font-medium text-[#2D3648]">Cancel</button>
          <button disabled={saving} className="rounded-md bg-[#00796B] px-7 py-3 text-xs font-medium text-white disabled:opacity-60">
            {saving ? "Creating..." : "Create item"}
          </button>
        </div>
      </form>
    </section>
  );
}