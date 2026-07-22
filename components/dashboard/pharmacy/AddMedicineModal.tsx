"use client";

import { useMemo, useState } from "react";
import Modal from "@components/Modal";
import { inventoryService } from "@services/api";
import { toast } from "react-toastify";
import { getInventoryGroup, InventoryItem } from "./pharmacyUtils";

type Props = { isOpen: boolean; onClose: () => void; orgId: string | null; groupName: string; medicines: InventoryItem[]; onMedicineAdded: () => void };

export default function AddMedicineModal({ isOpen, onClose, orgId, groupName, medicines, onMedicineAdded }: Props) {
  const [query, setQuery] = useState("");
  const [medicineId, setMedicineId] = useState("");
  const [saving, setSaving] = useState(false);
  const candidates = useMemo(() => medicines.filter((item) => getInventoryGroup(item).toLowerCase() !== groupName.toLowerCase() && (item.name ?? item.id).toLowerCase().includes(query.toLowerCase())), [medicines, groupName, query]);
  const add = async () => {
    if (!orgId || !medicineId) return toast.error("Select a medicine to add.");
    setSaving(true);
    try { await inventoryService.updateInventoryItem(orgId, medicineId, { form: groupName }); toast.success("Medicine form updated."); setMedicineId(""); setQuery(""); onMedicineAdded(); onClose(); }
    catch (error) { console.error("Failed to assign medicine to group", error); toast.error("Unable to update this medicine."); }
    finally { setSaving(false); }
  };
  return <Modal title={`Add medicine to ${groupName}`} isOpen={isOpen} onClose={onClose}><div className="space-y-4 p-6"><label className="block text-sm">Search inventory<input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Medicine name" className="mt-1 h-10 w-full rounded border p-2" /></label><label className="block text-sm">Medicine<select value={medicineId} onChange={(event) => setMedicineId(event.target.value)} className="mt-1 h-10 w-full rounded border p-2"><option value="">Select medicine</option>{candidates.map((item) => <option key={item.id} value={item.id}>{item.name ?? item.id}</option>)}</select></label><div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded border px-4 py-2 text-sm">Cancel</button><button type="button" onClick={() => void add()} disabled={saving} className="rounded bg-[#00796B] px-4 py-2 text-sm text-white disabled:opacity-60">{saving ? "Adding..." : "Add medicine"}</button></div></div></Modal>;
}
