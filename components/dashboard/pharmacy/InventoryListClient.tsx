// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { ArrowUpDown, ChevronRight } from "lucide-react";
// import { useAuth } from "@context/AuthContext";
// import { inventoryService } from "@services/api";
// import { toast } from "react-toastify";
// import BreadcrumbHeading from "./BreadcrumbHeading";
// import { collectionFromResponse, InventoryItem } from "./pharmacyUtils";

// export default function InventoryListClient() {
//   const { activeWorkspace } = useAuth();
//   const orgId = activeWorkspace?.id;
//   const [medicines, setMedicines] = useState<InventoryItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!orgId) { setMedicines([]); setLoading(false); return; }
//     const load = async () => {
//       setLoading(true); setError(null);
//       try { setMedicines(collectionFromResponse<InventoryItem>(await inventoryService.listInventoryItems(orgId))); }
//       catch (cause) { console.error("Failed to load inventory items", cause); setError("Failed to load inventory items. Please try again."); toast.error("Failed to load inventory items"); }
//       finally { setLoading(false); }
//     };
//     void load();
//   }, [orgId]);

//   if (loading) return <section className="min-w-0 space-y-8"><BreadcrumbHeading items={["Inventory", "Loading..."]} description="Loading medicines available for dispensing." /><div className="h-64 animate-pulse rounded-md border border-[#D8DEE8] bg-gray-100" /></section>;
//   if (error) return <section className="min-w-0 space-y-8"><BreadcrumbHeading items={["Inventory", "Error"]} description="Failed to load inventory." /><div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div></section>;

//   return <section className="min-w-0 space-y-8"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><BreadcrumbHeading items={["Inventory", `List of medicines (${medicines.length})`]} description="Catalogue entries. Open an item to see its batches and on-hand quantity." /><Link href="/dashboard/pharmacy/inventory/new" className="inline-flex items-center gap-1 self-start rounded-md bg-[#00796B] px-4 py-2 text-xs font-medium text-white hover:bg-[#00695F]">+ Add Medicine</Link></div>{medicines.length === 0 ? <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">No medicines found in inventory.</div> : <div role="region" aria-label="Medicine list table" className="w-full overflow-x-auto rounded-md border border-[#D8DEE8] bg-white"><table className="min-w-[840px] w-full table-auto"><thead className="border-b border-[#D8DEE8] text-left text-sm font-medium text-[#2D3648]"><tr>{["Medicine name", "Unit", "Form", "Strength"].map((label) => <th key={label} className="whitespace-nowrap px-6 py-4"><span className="inline-flex items-center gap-2">{label}<ArrowUpDown size={13} className="text-[#8792A8]" /></span></th>)}<th className="px-6 py-4 text-right">Action</th></tr></thead><tbody>{medicines.map((medicine) => <tr key={medicine.id} className="border-b border-[#E8EDF4] text-[13px] text-[#3A4253] last:border-0"><td className="px-6 py-4 font-medium">{medicine.name || "Unnamed medicine"}</td><td className="px-6 py-4">{medicine.unit || "—"}</td><td className="px-6 py-4">{medicine.form || "—"}</td><td className="px-6 py-4">{medicine.strength || "—"}</td><td className="px-6 py-4 text-right"><Link href={`/dashboard/pharmacy/inventory/list/${medicine.id}`} className="inline-flex items-center gap-1 text-[#2D3648] hover:text-[#00796B]">View batches <ChevronRight size={13} /></Link></td></tr>)}</tbody></table></div>}</section>;
// }


"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, ChevronRight } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { inventoryService } from "@services/api";
import { toast } from "react-toastify";
import BreadcrumbHeading from "./BreadcrumbHeading";
import {
  getInventoryQuantity,
  getStockLevel,
  InventoryItem,
  isPlaceholderItem,
  loadInventoryWithStock,
  LOW_STOCK_THRESHOLD,
  STOCK_LEVEL_CLASS,
  STOCK_LEVEL_LABEL,
  type StockLevel,
} from "./pharmacyUtils";
import ListToolbar, { FilterSelect, SearchInput } from "@components/dashboard/ListToolbar";
import { matchesQuery } from "@utils/listFilters";

const STOCK_FILTER_OPTIONS: { value: StockLevel; label: string }[] = [
  { value: "out", label: STOCK_LEVEL_LABEL.out },
  { value: "low", label: `${STOCK_LEVEL_LABEL.low} (${LOW_STOCK_THRESHOLD} or fewer)` },
  { value: "ok", label: STOCK_LEVEL_LABEL.ok },
];

const STOCK_SORT_ORDER: Record<StockLevel, number> = { out: 0, low: 1, unknown: 2, ok: 3 };

export default function InventoryListClient() {
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id;
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<StockLevel | "">("");

  // Cards elsewhere link here as ?stock=out or ?stock=low.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("stock");
    if (requested === "out" || requested === "low" || requested === "ok") setStockFilter(requested);
  }, []);

  useEffect(() => {
    if (!orgId) {
      setItems([]);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const allItems = await loadInventoryWithStock(
          orgId,
          (id) => inventoryService.listInventoryItems(id),
          (id, itemId) => inventoryService.getInventoryItem(id, itemId),
        );
        setItems(allItems.filter((item) => !isPlaceholderItem(item)));
      } catch (cause) {
        console.error("Failed to load inventory items", cause);
        toast.error("Failed to load inventory items");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [orgId]);

  const filteredItems = useMemo(
    () =>
      items
        .filter(
          (item) =>
            matchesQuery(query, item.name, item.form, item.strength, item.unit) &&
            (!stockFilter || getStockLevel(item) === stockFilter),
        )
        // Items that need attention come first.
        .sort((a, b) => STOCK_SORT_ORDER[getStockLevel(a)] - STOCK_SORT_ORDER[getStockLevel(b)]),
    [items, query, stockFilter],
  );

  const attention = useMemo(
    () => ({
      out: items.filter((item) => getStockLevel(item) === "out").length,
      low: items.filter((item) => getStockLevel(item) === "low").length,
    }),
    [items],
  );
  const hasActiveFilters = !!query.trim() || !!stockFilter;

  if (loading) {
    return (
      <section className="min-w-0 space-y-8" role="status" aria-label="Loading inventory">
        <BreadcrumbHeading items={["Inventory"]} description="Loading items available for dispensing." />
        <div className="h-64 animate-pulse rounded-md border border-[#D8DEE8] bg-gray-100" />
      </section>
    );
  }

  return (
    <section className="min-w-0 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <BreadcrumbHeading items={["Inventory", `Items (${filteredItems.length})`]} description="Search and open any item to review its batches and stock history." />
        <Link href="/dashboard/pharmacy/inventory/new" className="inline-flex items-center gap-1 self-start rounded-md bg-[#00796B] px-4 py-2 text-xs font-medium text-white hover:bg-[#00695F]">+ Add item</Link>
      </div>

      {(attention.out > 0 || attention.low > 0) && (
        <div role="alert" className="flex flex-col gap-2 rounded-md border border-[#F7D799] bg-[#FFF7E6] p-4 text-sm text-[#7C4A03] sm:flex-row sm:items-center sm:justify-between">
          <p>
            {attention.out > 0 && <><strong>{attention.out}</strong> item{attention.out === 1 ? " is" : "s are"} out of stock. </>}
            {attention.low > 0 && <><strong>{attention.low}</strong> item{attention.low === 1 ? " is" : "s are"} running low ({LOW_STOCK_THRESHOLD} units or fewer). </>}
            Restock before they run out.
          </p>
          <div className="flex gap-3">
            {attention.out > 0 && <button type="button" onClick={() => setStockFilter("out")} className="font-medium underline">Show out of stock</button>}
            {attention.low > 0 && <button type="button" onClick={() => setStockFilter("low")} className="font-medium underline">Show running low</button>}
          </div>
        </div>
      )}

      <div className="rounded-md border border-[#D8DEE8] bg-white p-3">
        <ListToolbar
          search={
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search by name, form or strength"
              label="Search inventory items by name, form, strength, or unit"
            />
          }
          filters={
            <FilterSelect
              allLabel="All stock levels"
              label="Filter by stock level"
              value={stockFilter}
              onChange={(value) => setStockFilter(value as StockLevel | "")}
              options={STOCK_FILTER_OPTIONS}
            />
          }
          shown={filteredItems.length}
          total={items.length}
          active={hasActiveFilters}
          onClear={() => {
            setQuery("");
            setStockFilter("");
          }}
          noun="items"
        />
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-md border border-dashed border-gray-300 bg-slate-50 p-8 text-center">
          <p className="text-lg font-medium text-[#1E2433]">
            {hasActiveFilters ? "No items match these filters." : "No inventory items yet."}
          </p>
          <p className="mt-2 text-sm text-[#5B6478]">
            {hasActiveFilters ? "Try another search or stock level." : "Add a new inventory item to get started."}
          </p>
          <div className="mt-4 flex justify-center">
            <Link
              href="/dashboard/pharmacy/inventory/new"
              className="inline-flex items-center gap-2 rounded-md bg-[#00796B] px-4 py-2 text-xs font-medium text-white hover:bg-[#00695F]"
            >
              + Add new item
            </Link>
          </div>
        </div>
      ) : (
        <div role="region" aria-label="Item list table" className="w-full overflow-x-auto rounded-md border border-[#D8DEE8] bg-white">
          <table className="min-w-[840px] w-full table-auto">
            <thead className="border-b border-[#D8DEE8] text-left text-sm font-medium text-[#2D3648]">
              <tr>
                {['Item name', 'Unit', 'Form', 'Strength', 'Stock'].map((label) => (
                  <th key={label} className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center gap-2">{label}<ArrowUpDown size={13} className="text-[#8792A8]" /></span>
                  </th>
                ))}
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b border-[#E8EDF4] text-[13px] text-[#3A4253] last:border-0">
                  <td className="px-6 py-4 font-medium">{item.name || "Unnamed item"}</td>
                  <td className="px-6 py-4">{item.unit || "—"}</td>
                  <td className="px-6 py-4">{item.form || "—"}</td>
                  <td className="px-6 py-4">{item.strength || "—"}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {(() => {
                      const level = getStockLevel(item);
                      return (
                        <span className="inline-flex items-center gap-2">
                          {level !== "unknown" && <span className="tabular-nums">{getInventoryQuantity(item)}</span>}
                          <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${STOCK_LEVEL_CLASS[level]}`}>
                            {STOCK_LEVEL_LABEL[level]}
                          </span>
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/dashboard/pharmacy/inventory/items/${item.id}`} className="inline-flex items-center gap-1 text-[#2D3648] hover:text-[#00796B]">
                      View details <ChevronRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}