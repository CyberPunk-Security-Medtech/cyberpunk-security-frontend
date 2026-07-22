"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { inventoryService } from "@services/api";
import { toast } from "react-toastify";
import BreadcrumbHeading from "./BreadcrumbHeading";
import { getInventoryQuantity, InventoryItem } from "./pharmacyUtils";

type CatalogForm = { name: string; unit: string; form: string; strength: string };
const toRecord = (value: unknown): Record<string, unknown> => value && typeof value === "object" ? value as Record<string, unknown> : {};

export default function InventoryItemDetailsClient({ itemId }: { itemId: string }) {
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id;
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState<CatalogForm | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!orgId) { setLoading(false); return; }
    setLoading(true);
    try {
      const response = await inventoryService.getInventoryItem(orgId, itemId);
      const data = (response && typeof response === "object" && "data" in response ? (response as { data: unknown }).data : response) as InventoryItem;
      setItem(data);
      setForm({ name: data.name ?? "", unit: data.unit ?? "", form: data.form ?? "", strength: data.strength ?? "" });
    } catch (error) { console.error("Failed to load inventory item", error); toast.error("Unable to load this medicine."); }
    finally { setLoading(false); }
  }, [itemId, orgId]);
  useEffect(() => { void load(); }, [load]);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!orgId || !form || !form.name.trim() || !form.unit.trim()) return toast.error("Medicine name and dispensing unit are required.");
    setSaving(true);
    try { await inventoryService.updateInventoryItem(orgId, itemId, { name: form.name.trim(), unit: form.unit.trim(), form: form.form.trim() || null, strength: form.strength.trim() || null }); toast.success("Medicine catalog details updated."); setEditing(false); await load(); }
    catch (error) { console.error("Failed to update inventory item", error); toast.error("Unable to update this medicine."); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="h-64 animate-pulse rounded border bg-gray-100" />;
  if (!item || !form) return <section className="rounded border border-dashed p-8 text-sm text-gray-500">Medicine details are unavailable.</section>;
  const details = toRecord(item);
  const batches = Array.isArray(details.batches) ? details.batches as Array<Record<string, unknown>> : [];
  return <section className="space-y-8"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><BreadcrumbHeading items={["Inventory", "List of Medicines", item.name ?? itemId]} description="Catalog details and current stock batches." /><button onClick={() => setEditing((value) => !value)} className="inline-flex items-center gap-1 self-start rounded-full bg-[#00796B] px-5 py-2 text-xs font-medium text-white"><Pencil size={12} />{editing ? "Cancel editing" : "Edit details"}</button></div>{editing ? <form onSubmit={save} className="max-w-[820px] space-y-5"><div className="grid grid-cols-1 gap-5 md:grid-cols-2">{([['name','Medicine name'],['unit','Dispensing unit'],['form','Medicine form'],['strength','Strength']] as Array<[keyof CatalogForm,string]>).map(([key,label]) => <label key={key} className="space-y-2 text-sm"><span>{label}{(key === 'name' || key === 'unit') ? ' *' : ''}</span><input required={key === 'name' || key === 'unit'} value={form[key]} onChange={(event) => setForm((current) => current ? { ...current, [key]: event.target.value } : current)} className="h-11 w-full rounded border px-3" /></label>)}</div><button disabled={saving} className="rounded-full bg-[#00796B] px-7 py-3 text-xs font-medium text-white disabled:opacity-60">{saving ? "Saving..." : "Save changes"}</button></form> : <><article className="rounded border bg-white"><div className="border-b px-5 py-3 font-semibold">Medicine catalog</div><dl className="grid grid-cols-1 gap-5 px-5 py-4 text-sm sm:grid-cols-2 lg:grid-cols-4"><div><dt className="text-gray-500">Item ID</dt><dd className="mt-1 font-medium break-all">{item.id}</dd></div><div><dt className="text-gray-500">Dispensing unit</dt><dd className="mt-1 font-medium">{item.unit}</dd></div><div><dt className="text-gray-500">Form</dt><dd className="mt-1 font-medium">{item.form ?? "Not recorded"}</dd></div><div><dt className="text-gray-500">Strength</dt><dd className="mt-1 font-medium">{item.strength ?? "Not recorded"}</dd></div><div><dt className="text-gray-500">Quantity on hand</dt><dd className="mt-1 text-2xl font-semibold">{getInventoryQuantity(item)}</dd></div></dl></article><article className="rounded border bg-white"><div className="border-b px-5 py-3 font-semibold">Stock batches</div>{batches.length ? <div className="overflow-x-auto"><table className="min-w-[600px] w-full text-left text-sm"><thead className="border-b bg-gray-50"><tr><th className="px-5 py-3">Batch</th><th className="px-5 py-3">Expiry</th><th className="px-5 py-3">On hand</th></tr></thead><tbody>{batches.map((batch) => <tr key={String(batch.id)} className="border-b"><td className="px-5 py-3">{String(batch.batch_number ?? "—")}</td><td className="px-5 py-3">{String(batch.expiry_date ?? "—")}</td><td className="px-5 py-3">{String(batch.quantity_on_hand ?? "0")}</td></tr>)}</tbody></table></div> : <p className="px-5 py-4 text-sm text-gray-500">No stock batches have been received for this medicine.</p>}</article></>}</section>;
}
