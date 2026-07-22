"use client";

import { useEffect, useState } from "react";
import Modal from "@components/Modal";
import { Prescription } from "./pharmacyUtils";

type Draft = { quantity?: string; batch_number?: string | null; expiry_date?: string | null; substitution_note?: string | null; counseling_notes?: string | null };
type Props = { prescription: Prescription | null; isOpen: boolean; mode?: "create" | "edit"; initialRecord?: Draft | null; onClose: () => void; onConfirm: (payload: { quantity: string; batch_number?: string; expiry_date?: string; substitution_note?: string; counseling_notes?: string }) => Promise<void>; };

export default function DispensePrescriptionModal({ prescription, isOpen, mode = "create", initialRecord, onClose, onConfirm }: Props) {
  const [quantity, setQuantity] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [substitutionNote, setSubstitutionNote] = useState("");
  const [counselingNotes, setCounselingNotes] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (isOpen) { setQuantity(initialRecord?.quantity ?? ""); setBatchNumber(initialRecord?.batch_number ?? ""); setExpiryDate(initialRecord?.expiry_date ?? ""); setSubstitutionNote(initialRecord?.substitution_note ?? ""); setCounselingNotes(initialRecord?.counseling_notes ?? ""); } }, [initialRecord, isOpen]);
  const resetAndClose = () => { setQuantity(""); setBatchNumber(""); setExpiryDate(""); setSubstitutionNote(""); setCounselingNotes(""); onClose(); };
  const close = () => { if (!saving) resetAndClose(); };
  const submit = async () => { if (!quantity.trim()) return; setSaving(true); try { await onConfirm({ quantity: quantity.trim(), batch_number: batchNumber.trim() || undefined, expiry_date: expiryDate || undefined, substitution_note: substitutionNote.trim() || undefined, counseling_notes: counselingNotes.trim() || undefined }); resetAndClose(); } finally { setSaving(false); } };
  return <Modal title={mode === "edit" ? "Correct dispense record" : "Dispense prescription"} isOpen={isOpen} onClose={close} header={prescription ? `${prescription.medication_name} — ${prescription.dosage}` : undefined}><div className="space-y-4 p-2"><label className="block text-sm font-medium">Quantity dispensed *<input required value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="e.g. 14 tablets" className="mt-1 h-11 w-full rounded border px-3 font-normal" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Batch number<input value={batchNumber} onChange={(event) => setBatchNumber(event.target.value)} className="mt-1 h-11 w-full rounded border px-3 font-normal" /></label><label className="block text-sm font-medium">Expiry date<input type="date" value={expiryDate} onChange={(event) => setExpiryDate(event.target.value)} className="mt-1 h-11 w-full rounded border px-3 font-normal" /></label></div><label className="block text-sm font-medium">Substitution note<textarea value={substitutionNote} onChange={(event) => setSubstitutionNote(event.target.value)} className="mt-1 min-h-20 w-full rounded border p-3 font-normal" /></label><label className="block text-sm font-medium">Counselling notes<textarea value={counselingNotes} onChange={(event) => setCounselingNotes(event.target.value)} className="mt-1 min-h-20 w-full rounded border p-3 font-normal" /></label><div className="flex justify-end gap-3"><button type="button" onClick={close} className="rounded border px-4 py-2 text-sm">Cancel</button><button type="button" onClick={() => void submit()} disabled={saving || !quantity.trim()} className="rounded bg-[#00796B] px-4 py-2 text-sm text-white disabled:opacity-60">{saving ? "Saving..." : mode === "edit" ? "Save correction" : "Confirm dispense"}</button></div></div></Modal>;
}
