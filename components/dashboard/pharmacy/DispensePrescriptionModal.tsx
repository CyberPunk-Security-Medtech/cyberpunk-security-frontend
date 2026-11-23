"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@components/Modal";
import { toast } from "react-toastify";
import { inventoryService } from "@services/api";
import { getApiErrorMessage } from "@utils/apiError";
import {
  findInventoryItemByName,
  getExpiredQuantity,
  getInventoryQuantity,
  isPlaceholderItem,
  loadInventoryWithStock,
  parseUnits,
  planStockDeduction,
  type InventoryItem,
  type Prescription,
  type StockAllocation,
} from "./pharmacyUtils";
import type { DispensePayload } from "./pharmacyStock";

type Draft = { quantity?: string; batch_number?: string | null; expiry_date?: string | null; substitution_note?: string | null; counseling_notes?: string | null };

type Props = {
  prescription: Prescription | null;
  isOpen: boolean;
  mode?: "create" | "edit";
  initialRecord?: Draft | null;
  /** Needed to load inventory so the dispense can be taken out of stock. */
  orgId?: string | null;
  onClose: () => void;
  /** `plan` is the stock to deduct; null dispenses without touching stock. */
  onConfirm: (payload: DispensePayload, plan: StockAllocation[] | null) => Promise<void>;
};

const NO_STOCK = "__none__";

const formatExpiry = (value?: string | null) => {
  if (!value) return "no expiry";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : `expires ${date.toLocaleDateString(undefined, { dateStyle: "medium" })}`;
};

const inputClass = "mt-1 h-11 w-full rounded-md border px-3 font-normal";

export default function DispensePrescriptionModal({ prescription, isOpen, mode = "create", initialRecord, orgId, onClose, onConfirm }: Props) {
  const [quantity, setQuantity] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [substitutionNote, setSubstitutionNote] = useState("");
  const [counselingNotes, setCounselingNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Stock deduction (new dispenses only; the backend makes the stock link permanent).
  const deductsStock = mode === "create" && !!orgId;
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [itemId, setItemId] = useState("");
  const [units, setUnits] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setQuantity(initialRecord?.quantity ?? "");
    setBatchNumber(initialRecord?.batch_number ?? "");
    setExpiryDate(initialRecord?.expiry_date ?? "");
    setSubstitutionNote(initialRecord?.substitution_note ?? "");
    setCounselingNotes(initialRecord?.counseling_notes ?? "");
    setUnits("");
  }, [initialRecord, isOpen]);

  useEffect(() => {
    if (!isOpen || !deductsStock || !orgId) return;
    let cancelled = false;
    setInventoryLoading(true);
    loadInventoryWithStock(
      orgId,
      (id) => inventoryService.listInventoryItems(id),
      (id, item) => inventoryService.getInventoryItem(id, item),
    )
      .then((items) => {
        if (cancelled) return;
        const real = items.filter((item) => !isPlaceholderItem(item));
        setInventory(real);
        // Pre-pick the item matching the prescribed medicine.
        const match = prescription ? findInventoryItemByName(real, prescription.medication_name) : undefined;
        setItemId(match?.id ?? "");
      })
      .catch((error) => {
        console.error("Failed to load inventory for dispensing", error);
        if (!cancelled) setInventory([]);
      })
      .finally(() => {
        if (!cancelled) setInventoryLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, deductsStock, orgId, prescription]);

  const selectedItem = useMemo(
    () => (itemId && itemId !== NO_STOCK ? inventory.find((item) => item.id === itemId) : undefined),
    [inventory, itemId],
  );
  const unitCount = parseUnits(units);
  const plan = selectedItem && unitCount ? planStockDeduction(selectedItem, unitCount) : null;
  const available = selectedItem ? getInventoryQuantity(selectedItem) : 0;
  const expired = selectedItem ? getExpiredQuantity(selectedItem) : 0;

  // With an item chosen, a whole number of units that stock can cover is required.
  const stockProblem = !deductsStock || itemId === NO_STOCK || !selectedItem
    ? null
    : !unitCount
      ? "Enter how many units to take from stock."
      : !plan
        ? `Only ${available} ${selectedItem.unit ?? "units"} in stock${expired ? ` (${expired} more expired)` : ""}.`
        : null;
  const needsItemChoice = deductsStock && !inventoryLoading && inventory.length > 0 && !itemId;

  const resetAndClose = () => {
    setQuantity("");
    setBatchNumber("");
    setExpiryDate("");
    setSubstitutionNote("");
    setCounselingNotes("");
    setItemId("");
    setUnits("");
    onClose();
  };
  const close = () => {
    if (!saving) resetAndClose();
  };

  const quantityText = quantity.trim() || (unitCount && selectedItem ? `${unitCount} ${selectedItem.unit ?? "units"}` : "");
  const canSubmit = !saving && !!quantityText && !stockProblem && !needsItemChoice;

  const submit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    try {
      // Batch number and expiry are optional: omit them rather than sending empty strings.
      await onConfirm(
        {
          quantity: quantityText,
          batch_number: batchNumber.trim() || undefined,
          expiry_date: expiryDate || undefined,
          substitution_note: substitutionNote.trim() || undefined,
          counseling_notes: counselingNotes.trim() || undefined,
        },
        deductsStock && selectedItem ? plan : null,
      );
      resetAndClose();
    } catch (error) {
      console.error("Failed to save dispense record", error);
      toast.error(getApiErrorMessage(error, "Unable to save the dispense record. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={mode === "edit" ? "Correct dispense record" : "Dispense prescription"}
      isOpen={isOpen}
      onClose={close}
      header={prescription ? `${prescription.medication_name} — ${prescription.dosage}` : undefined}
    >
      <div className="space-y-4 p-2">
        {deductsStock && (
          <fieldset className="space-y-3 rounded-md border border-gray-200 p-4">
            <legend className="px-1 text-sm font-semibold text-gray-900">Take from stock</legend>
            {inventoryLoading ? (
              <p className="text-sm text-gray-500">Loading inventory…</p>
            ) : inventory.length === 0 ? (
              <p className="text-sm text-gray-500">No inventory items yet, so this dispense won&apos;t change stock.</p>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                  <label className="block text-sm font-medium">
                    Inventory item *
                    <select value={itemId} onChange={(event) => setItemId(event.target.value)} className={`${inputClass} bg-white`}>
                      <option value="">Select the item being dispensed</option>
                      {inventory.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                          {item.strength ? ` ${item.strength}` : ""} — {getInventoryQuantity(item)} {item.unit ?? "units"} in stock
                        </option>
                      ))}
                      <option value={NO_STOCK}>Not kept in inventory (don&apos;t change stock)</option>
                    </select>
                  </label>
                  {selectedItem && (
                    <label className="block text-sm font-medium">
                      Units to deduct *
                      <input
                        inputMode="numeric"
                        value={units}
                        onChange={(event) => setUnits(event.target.value.replace(/[^\d]/g, ""))}
                        placeholder={`e.g. 14 ${selectedItem.unit ?? ""}`.trim()}
                        className={inputClass}
                      />
                    </label>
                  )}
                </div>
                {stockProblem && <p className="text-sm text-[#B91C1C]">{stockProblem}</p>}
                {plan && (
                  <ul className="space-y-1 text-xs text-gray-600" aria-label="Stock to deduct">
                    {plan.map(({ batch, units: taken }) => (
                      <li key={batch.id}>
                        From batch <span className="font-medium">{batch.batch_number || "without number"}</span> ({formatExpiry(batch.expiry_date)}): {taken} of {batch.quantity_on_hand}
                      </li>
                    ))}
                    <li className="font-medium text-gray-800">
                      {available - (unitCount ?? 0)} {selectedItem?.unit ?? "units"} left after this dispense
                    </li>
                  </ul>
                )}
              </>
            )}
          </fieldset>
        )}

        <label className="block text-sm font-medium">
          Quantity dispensed {deductsStock && selectedItem ? <span className="font-normal text-gray-500">(defaults to the units above)</span> : "*"}
          <input value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="e.g. 14 tablets" className={inputClass} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Batch number <span className="font-normal text-gray-500">(optional{plan ? ", filled from stock" : ""})</span>
            <input value={batchNumber} placeholder="Leave blank if unknown" onChange={(event) => setBatchNumber(event.target.value)} className={inputClass} />
          </label>
          <label className="block text-sm font-medium">
            Expiry date <span className="font-normal text-gray-500">(optional)</span>
            <input type="date" value={expiryDate} onChange={(event) => setExpiryDate(event.target.value)} className={inputClass} />
          </label>
        </div>
        <label className="block text-sm font-medium">
          Substitution note
          <textarea value={substitutionNote} onChange={(event) => setSubstitutionNote(event.target.value)} className="mt-1 min-h-20 w-full rounded-md border p-3 font-normal" />
        </label>
        <label className="block text-sm font-medium">
          Counselling notes
          <textarea value={counselingNotes} onChange={(event) => setCounselingNotes(event.target.value)} className="mt-1 min-h-20 w-full rounded-md border p-3 font-normal" />
        </label>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={close} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
          <button
            type="button"
            onClick={() => void submit()}
            disabled={!canSubmit}
            className="rounded-md bg-[#00796B] px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : mode === "edit" ? "Save correction" : "Confirm dispense"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
