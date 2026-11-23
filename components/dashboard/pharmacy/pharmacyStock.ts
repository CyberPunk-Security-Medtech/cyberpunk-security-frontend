import { inventoryService, prescriptionService } from "@services/api";
import type { StockAllocation } from "./pharmacyUtils";

export type DispensePayload = {
  quantity: string;
  batch_number?: string;
  expiry_date?: string;
  substitution_note?: string;
  counseling_notes?: string;
};

/**
 * Dispenses a prescription and takes the units out of stock.
 *
 * The first batch is linked on the dispense record itself (`stock_batch_id` +
 * `stock_quantity`), so the backend deducts it atomically and refuses if the batch
 * no longer has enough. When the units span more batches, each extra batch gets its
 * own "Dispensed" ledger movement noting the prescription. With no plan, the
 * prescription is dispensed without touching stock (e.g. an item not kept in inventory).
 *
 * Returns the extra batches that could not be deducted, so the caller can warn.
 */
export async function dispenseWithStock(
  orgId: string,
  prescriptionId: string,
  payload: DispensePayload,
  plan: StockAllocation[] | null,
): Promise<{ failedBatches: StockAllocation[] }> {
  if (!plan || plan.length === 0) {
    await prescriptionService.dispensePrescription(orgId, prescriptionId, payload);
    return { failedBatches: [] };
  }

  const [linked, ...extra] = plan;
  await prescriptionService.dispensePrescription(orgId, prescriptionId, {
    ...payload,
    // Record which batch the medicine came from unless the pharmacist typed one.
    batch_number: payload.batch_number || linked.batch.batch_number || undefined,
    expiry_date: payload.expiry_date || linked.batch.expiry_date?.slice(0, 10) || undefined,
    stock_batch_id: linked.batch.id,
    stock_quantity: linked.units,
  });

  const failedBatches: StockAllocation[] = [];
  for (const allocation of extra) {
    try {
      await inventoryService.recordStockMovement(orgId, allocation.batch.id, {
        movement_type: "Dispensed",
        quantity_change: -allocation.units,
        note: `Dispensed for prescription ${prescriptionId} (continued from batch ${
          linked.batch.batch_number || linked.batch.id
        })`,
      });
    } catch (error) {
      console.error("Failed to deduct stock from additional batch", allocation.batch.id, error);
      failedBatches.push(allocation);
    }
  }
  return { failedBatches };
}
