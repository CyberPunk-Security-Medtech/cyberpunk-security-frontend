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

export const getInventoryQuantity = (item: InventoryItem): number => {
  const batches = item.batches;
  if (Array.isArray(batches)) {
    return batches.reduce((total, batch) => {
      if (!batch || typeof batch !== "object") return total;
      const amount = Number((batch as Record<string, unknown>).quantity_on_hand ?? 0);
      return total + (Number.isFinite(amount) ? amount : 0);
    }, 0);
  }
  const value = item.total_quantity ?? item.stock_qty ?? item.quantity ?? item.stockQty ?? 0;
  const quantity = Number(value);
  return Number.isFinite(quantity) ? quantity : 0;
};
