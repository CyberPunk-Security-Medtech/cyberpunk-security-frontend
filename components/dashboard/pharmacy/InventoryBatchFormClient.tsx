"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@context/AuthContext";
import { inventoryService } from "@services/api";
import { toast } from "react-toastify";
import BreadcrumbHeading from "./BreadcrumbHeading";
import { InventoryItem } from "./pharmacyUtils";

export default function InventoryBatchFormClient({ itemId }: { itemId: string }) {
  const { activeWorkspace } = useAuth();
  const router = useRouter();
  const orgId = activeWorkspace?.id ?? null;

  const [itemName, setItemName] = useState("Item");
  const [quantity, setQuantity] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!orgId) return;

    inventoryService
      .getInventoryItem(orgId, itemId)
      .then((response) => {
        const data =
          response && typeof response === "object" && "data" in response
            ? (response as { data: unknown }).data
            : response;

        setItemName(((data as InventoryItem) ?? {}).name ?? "Item");
      })
      .catch((error) => {
        console.error("Failed to load item for batch form", error);
      });
  }, [itemId, orgId]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!orgId) {
      toast.error("Choose a workspace before adding stock.");
      return;
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 0) {
      toast.error("Quantity must be zero or more.");
      return;
    }

    setSaving(true);
    try {
      await inventoryService.receiveStockBatch(orgId, itemId, {
        initial_quantity: parsedQuantity,
        batch_number: batchNumber.trim() || null,
        expiry_date: expiryDate || null,
      });

      toast.success("Stock batch saved.");
      router.push(`/dashboard/pharmacy/inventory/items/${itemId}`);
    } catch (error) {
      console.error("Failed to save stock batch", error);
      toast.error("Unable to save this stock batch.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-8">
      <BreadcrumbHeading
        items={["Inventory", "Items", itemName, "Add stock batch"]}
        description="Record the quantity, batch number, and expiry for a new stock delivery."
      />

      <form
        onSubmit={submit}
        className="max-w-[620px] space-y-6 rounded-md border border-[#E6EBF2] bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm text-[#2D3648] md:col-span-2">
            <span>Quantity *</span>
            <input
              required
              type="number"
              min="0"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className="h-11 w-full rounded-md border border-[#CED7E3] px-3"
              placeholder="e.g. 100"
            />
          </label>

          <label className="space-y-2 text-sm text-[#2D3648]">
            <span>Batch number</span>
            <input
              value={batchNumber}
              onChange={(event) => setBatchNumber(event.target.value)}
              className="h-11 w-full rounded-md border border-[#CED7E3] px-3"
              placeholder="e.g. B-1024"
            />
          </label>

          <label className="space-y-2 text-sm text-[#2D3648]">
            <span>Expiry date</span>
            <input
              type="date"
              value={expiryDate}
              onChange={(event) => setExpiryDate(event.target.value)}
              className="h-11 w-full rounded-md border border-[#CED7E3] px-3"
            />
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push(`/dashboard/pharmacy/inventory/items/${itemId}`)}
            className="rounded-md border border-[#CED7E3] px-7 py-3 text-xs font-medium text-[#2D3648]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-[#00796B] px-7 py-3 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save batch"}
          </button>
        </div>
      </form>
    </section>
  );
}
