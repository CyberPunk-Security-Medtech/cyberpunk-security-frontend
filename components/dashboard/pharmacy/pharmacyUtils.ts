export type PharmacyMedicine = {
  name: string;
  medicineId: string;
  group: string;
  stockQty: number;
  lifetimeSupply: number;
  lifetimeSales: number;
  stockLeft: number;
  howToUse: string;
  sideEffects: string;
};

export type PharmacyMedicineGroup = {
  id: string;
  name: string;
  medicineCount: number;
  medicines: Array<{ name: string; count: number }>;
};

export type InventoryItem = {
  id: string;
  name?: string;
  unit?: string;
  form?: string | null;
  strength?: string | null;
  stock_qty?: number;
  quantity?: number;
  stockQty?: number;
  total_quantity?: number;
  stockKnown?: boolean;
  [key: string]: unknown;
};

export interface Prescription {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route?: string;
  status?: string;
  created_at?: string;
  patient?: {
    first_name: string;
    last_name: string;
  };
  patient_name?: string;
  doctor_name?: string;
}

export const collectionFromResponse = <T,>(response: unknown, keys: string[] = []): T[] => {
  if (Array.isArray(response)) return response as T[];
  if (!response || typeof response !== "object") return [];

  const record = response as Record<string, unknown>;
  for (const key of [...keys, "items", "data", "results"]) {
    if (Array.isArray(record[key])) return record[key] as T[];
  }
  return [];
};

export const getInventoryGroup = (item: InventoryItem): string =>
  String(item.form ?? "").trim();

export type StockBatch = {
  id: string;
  batch_number?: string | null;
  expiry_date?: string | null;
  /** Received minus everything taken out (dispensed, expired, adjusted), kept by the backend ledger. */
  quantity_on_hand: number;
};

const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const isBatchExpired = (batch: StockBatch): boolean => {
  if (!batch.expiry_date) return false;
  const expiry = new Date(batch.expiry_date);
  return !Number.isNaN(expiry.getTime()) && expiry < startOfToday();
};

export const getItemBatches = (item: InventoryItem): StockBatch[] => {
  if (!Array.isArray(item.batches)) return [];
  return (item.batches as unknown[])
    .filter((batch): batch is Record<string, unknown> => !!batch && typeof batch === "object" && "id" in batch)
    .map((batch) => {
      const amount = Number(batch.quantity_on_hand ?? 0);
      return {
        id: String(batch.id),
        batch_number: (batch.batch_number as string | null | undefined) ?? null,
        expiry_date: (batch.expiry_date as string | null | undefined) ?? null,
        quantity_on_hand: Number.isFinite(amount) ? amount : 0,
      };
    });
};

/**
 * Units available to dispense: what's left in each batch (the backend subtracts every
 * dispense and write-off from what was received), excluding batches past their expiry.
 */
export const getInventoryQuantity = (item: InventoryItem): number => {
  if (Array.isArray(item.batches)) {
    return getItemBatches(item)
      .filter((batch) => !isBatchExpired(batch))
      .reduce((total, batch) => total + Math.max(0, batch.quantity_on_hand), 0);
  }
  const value = item.total_quantity ?? item.stock_qty ?? item.quantity ?? item.stockQty ?? 0;
  const quantity = Number(value);
  return Number.isFinite(quantity) ? quantity : 0;
};

/** Units sitting in expired batches, which should be written off rather than dispensed. */
export const getExpiredQuantity = (item: InventoryItem): number =>
  getItemBatches(item)
    .filter(isBatchExpired)
    .reduce((total, batch) => total + Math.max(0, batch.quantity_on_hand), 0);

export type StockAllocation = { batch: StockBatch; units: number };

/**
 * Which batches to take `units` from: first-expiry-first-out, skipping expired and empty
 * batches, spilling into the next batch when one isn't enough. Returns null when the item
 * doesn't have enough unexpired stock.
 */
export const planStockDeduction = (item: InventoryItem, units: number): StockAllocation[] | null => {
  if (!Number.isInteger(units) || units < 1) return null;
  const usable = getItemBatches(item)
    .filter((batch) => !isBatchExpired(batch) && batch.quantity_on_hand > 0)
    .sort((a, b) => {
      const aTime = a.expiry_date ? new Date(a.expiry_date).getTime() : Number.POSITIVE_INFINITY;
      const bTime = b.expiry_date ? new Date(b.expiry_date).getTime() : Number.POSITIVE_INFINITY;
      return aTime - bTime;
    });

  const plan: StockAllocation[] = [];
  let remaining = units;
  for (const batch of usable) {
    if (remaining === 0) break;
    const take = Math.min(batch.quantity_on_hand, remaining);
    plan.push({ batch, units: take });
    remaining -= take;
  }
  return remaining === 0 ? plan : null;
};

/** Finds the inventory item for a medicine name, ignoring case and extra spaces. */
export const findInventoryItemByName = (items: InventoryItem[], name: string): InventoryItem | undefined => {
  const needle = name.trim().replace(/\s+/g, " ").toLowerCase();
  if (!needle) return undefined;
  return items.find((item) => (item.name ?? "").trim().replace(/\s+/g, " ").toLowerCase() === needle);
};

/** Reads a whole number of units from text like "14", "14 tablets" or "2 x 10". */
export const parseUnits = (value: string): number | null => {
  const match = value.trim().match(/^(\d+)/);
  if (!match) return null;
  const units = Number.parseInt(match[1], 10);
  return units > 0 ? units : null;
};

/**
 * Items with this many units or fewer on hand are flagged as running low.
 * The API has no per-item reorder level yet, so one threshold applies to every item.
 */
export const LOW_STOCK_THRESHOLD = 10;

export type StockLevel = "out" | "low" | "ok" | "unknown";

export const getStockLevel = (item: InventoryItem): StockLevel => {
  if (item.stockKnown === false) return "unknown";
  const quantity = getInventoryQuantity(item);
  if (quantity <= 0) return "out";
  if (quantity <= LOW_STOCK_THRESHOLD) return "low";
  return "ok";
};

export const STOCK_LEVEL_LABEL: Record<StockLevel, string> = {
  out: "Out of stock",
  low: "Running low",
  ok: "In stock",
  unknown: "Stock unknown",
};

export const STOCK_LEVEL_CLASS: Record<StockLevel, string> = {
  out: "bg-[#FFF1F2] text-[#B91C1C]",
  low: "bg-[#FFF7E6] text-[#B45309]",
  ok: "bg-[#EAFBF2] text-[#047857]",
  unknown: "bg-slate-100 text-slate-500",
};

export const isPlaceholderItem = (item: InventoryItem) => !!item.name?.startsWith("[Group Placeholder]");

/**
 * The inventory list endpoint omits batches, so stock is read from each item's detail.
 * Items whose detail fails to load are marked `stockKnown: false` rather than counted as empty.
 */
export const loadInventoryWithStock = async (
  orgId: string,
  listItems: (orgId: string) => Promise<unknown>,
  getItem: (orgId: string, itemId: string) => Promise<unknown>,
): Promise<InventoryItem[]> => {
  const catalogue = collectionFromResponse<InventoryItem>(await listItems(orgId));
  return Promise.all(
    catalogue.map(async (item) => {
      try {
        const response = await getItem(orgId, item.id);
        const detail = (response && typeof response === "object" && "data" in response
          ? (response as { data: InventoryItem }).data
          : response) as InventoryItem;
        return { ...item, ...detail, stockKnown: true };
      } catch (error) {
        console.warn(`Unable to load stock batches for ${item.id}`, error);
        return { ...item, stockKnown: false };
      }
    }),
  );
};
