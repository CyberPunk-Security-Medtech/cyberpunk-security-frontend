// "use client";

// import Link from "next/link";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { Boxes, CircleAlert, Pill, Users } from "lucide-react";
// import { inventoryService, prescriptionService } from "@services/api";
// import { useAuth } from "@context/AuthContext";
// import { toast } from "react-toastify";
// import PrescriptionTable from "@components/dashboard/pharmacy/PrescriptionTable";
// import DispensePrescriptionModal from "@components/dashboard/pharmacy/DispensePrescriptionModal";
// import {
//   collectionFromResponse,
//   getInventoryGroup,
//   getInventoryQuantity,
//   InventoryItem,
//   Prescription,
// } from "@components/dashboard/pharmacy/pharmacyUtils";
// import { buildDisplayName } from "@utils/helper";

// export default function PharmacyDashboardPage() {
//   const { activeWorkspace, user } = useAuth();
//   const orgId = activeWorkspace?.id ?? null;
//   const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
//   const [inventory, setInventory] = useState<InventoryItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [dispensingId, setDispensingId] = useState<string | null>(null);
//   const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
//   const [dispenseMode, setDispenseMode] = useState<"create" | "edit">("create");
//   const [dispenseRecord, setDispenseRecord] = useState<Record<string, string | null> | null>(null);

//   const loadDashboard = useCallback(async () => {
//     if (!orgId) {
//       setPrescriptions([]);
//       setInventory([]);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     try {
//       const [prescriptionResponse, inventoryResponse] = await Promise.all([
//         prescriptionService.listPrescriptionsByOrg(orgId),
//         inventoryService.listInventoryItems(orgId),
//       ]);
//       setPrescriptions(collectionFromResponse<Prescription>(prescriptionResponse, ["prescriptions"]));
//       const catalogue = collectionFromResponse<InventoryItem>(inventoryResponse);
//       const detailedInventory = await Promise.all(catalogue.map(async (item) => {
//         try {
//           const detailResponse = await inventoryService.getInventoryItem(orgId, item.id);
//           const detail = (detailResponse && typeof detailResponse === "object" && "data" in detailResponse ? (detailResponse as { data: InventoryItem }).data : detailResponse) as InventoryItem;
//           return { ...item, ...detail };
//         } catch (detailError) {
//           console.warn(`Unable to load stock total for ${item.id}`, detailError);
//           return item;
//         }
//       }));
//       setInventory(detailedInventory);
//     } catch (error) {
//       console.error("Failed to load pharmacy dashboard", error);
//       toast.error("Unable to load pharmacy data. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [orgId]);

//   useEffect(() => {
//     void loadDashboard();
//   }, [loadDashboard]);

//   const metrics = useMemo(() => {
//     const pending = prescriptions.filter((item) => !["dispensed", "completed"].includes(item.status?.toLowerCase() ?? "")).length;
//     const lowStock = inventory.filter((item) => getInventoryQuantity(item) <= 0).length;
//     const groups = new Set(inventory.map(getInventoryGroup).filter(Boolean));
//     return { pending, lowStock, groupCount: groups.size };
//   }, [inventory, prescriptions]);

//   const handleDispense = async (payload: { quantity: string; batch_number?: string; expiry_date?: string; substitution_note?: string; counseling_notes?: string }) => {
//     const prescriptionId = selectedPrescription?.id;
//     if (!orgId || dispensingId) return;
//     if (!prescriptionId) return;
//     setDispensingId(prescriptionId);
//     try {
//       if (dispenseMode === "edit") {
//         await prescriptionService.correctDispenseRecord(orgId, prescriptionId, payload);
//         toast.success("Dispense record corrected.");
//       } else {
//         await prescriptionService.dispensePrescription(orgId, prescriptionId, payload);
//         toast.success("Prescription marked as completed.");
//       }
//       await loadDashboard();
//     } catch (error) {
//       console.error("Failed to dispense prescription", error);
//       toast.error("Unable to dispense this prescription.");
//     } finally {
//       setDispensingId(null);
//     }
//   };

//   const openCorrection = async (prescriptionId: string) => {
//     if (!orgId) return;
//     const prescription = prescriptions.find((item) => item.id === prescriptionId) ?? null;
//     if (!prescription) return;
//     try {
//       const response = await prescriptionService.getDispenseRecord(orgId, prescriptionId);
//       const record = (response && typeof response === "object" && "data" in response ? (response as { data: Record<string, string | null> }).data : response) as Record<string, string | null>;
//       setSelectedPrescription(prescription);
//       setDispenseRecord(record);
//       setDispenseMode("edit");
//     } catch (error) { console.error("Failed to load dispense record", error); toast.error("Unable to load this dispense record for editing."); }
//   };

//   const cards = [
//     { label: "Prescription queue", value: prescriptions.length, detail: `${metrics.pending} awaiting dispensing`, icon: Users, color: "text-[#7E8FE5]", bg: "bg-[#EEF0FF]" },
//     { label: "Inventory items", value: inventory.length, detail: `${metrics.groupCount} medicine groups`, icon: Boxes, color: "text-[#E5B648]", bg: "bg-[#FFF5DD]" },
//     { label: "Dispensed", value: prescriptions.length - metrics.pending, detail: "Current prescription records", icon: Pill, color: "text-[#51C493]", bg: "bg-[#E8FBF1]" },
//     { label: "Out of stock", value: metrics.lowStock, detail: "Items needing restock", icon: CircleAlert, color: "text-[#F08B66]", bg: "bg-[#FFF1EC]" },
//   ];

//   return (
//     <section className="space-y-6">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
//         <div>
//           <h1 className="text-[30px] font-semibold leading-tight text-[#151D48]">
//             Welcome back, Pharm. {buildDisplayName(user)}
//           </h1>
//           <p className="mt-1 text-sm text-[#737791]">Review prescriptions, dispense medicines, and monitor stock.</p>
//         </div>
//         <Link href="/dashboard/pharmacy/inventory/new" className="self-start rounded-md bg-[#00796B] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#00695F]">
//           Add inventory item
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         {cards.map(({ label, value, detail, icon: Icon, color, bg }) => (
//           <article key={label} className="rounded-md border border-[#ECEFF5] bg-white p-5">
//             <div className="flex items-center justify-between">
//               <p className="text-sm text-[#737791]">{label}</p>
//               <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${bg}`}><Icon size={18} className={color} /></span>
//             </div>
//             <p className="mt-4 text-3xl font-semibold text-[#151D48]">{loading ? "—" : value}</p>
//             <p className="mt-2 text-xs text-[#737791]">{detail}</p>
//           </article>
//         ))}
//       </div>

//       <article className="rounded-md border border-[#ECEFF5] bg-white p-5">
//         <div className="mb-5 flex items-center justify-between gap-4">
//           <div>
//             <h2 className="text-xl font-semibold text-[#151D48]">Prescription queue</h2>
//             <p className="text-sm text-[#737791]">Prescriptions are issued by clinicians and dispensed here.</p>
//           </div>
//           <Link href="/dashboard/pharmacy/inventory/list" className="text-sm font-medium text-[#00796B] hover:underline">View inventory</Link>
//         </div>
//         <PrescriptionTable prescriptions={prescriptions} onDispense={(id) => { setDispenseMode("create"); setDispenseRecord(null); setSelectedPrescription(prescriptions.find((item) => item.id === id) ?? null); }} onCorrectDispense={openCorrection} dispensingId={dispensingId} />
//       </article>
//       <DispensePrescriptionModal prescription={selectedPrescription} isOpen={Boolean(selectedPrescription)} mode={dispenseMode} initialRecord={dispenseRecord} onClose={() => { setSelectedPrescription(null); setDispenseRecord(null); }} onConfirm={handleDispense} />
//     </section>
//   );
// }


"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Boxes, CircleAlert, Pill, Users } from "lucide-react";
import { inventoryService, prescriptionService } from "@services/api";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-toastify";
import PrescriptionTable from "@components/dashboard/pharmacy/PrescriptionTable";
import {
  collectionFromResponse,
  getInventoryGroup,
  getInventoryQuantity,
  getStockLevel,
  InventoryItem,
  isPlaceholderItem,
  loadInventoryWithStock,
  LOW_STOCK_THRESHOLD,
  Prescription,
} from "@components/dashboard/pharmacy/pharmacyUtils";
import { buildDisplayName } from "@utils/helper";
import ListToolbar, { FilterSelect, SearchInput } from "@components/dashboard/ListToolbar";
import WalkInSaleModal from "@components/dashboard/pharmacy/WalkInSaleModal";
import {
  DATE_RANGE_OPTIONS,
  isWithinDateRange,
  matchesOption,
  matchesQuery,
  newestFirst,
  optionsFrom,
  type DateRange,
} from "@utils/listFilters";

const AWAITING_VIEW = "__awaiting";
const DISPENSED_VIEW = "__dispensed";
const isDispensedStatus = (status?: string) => ["dispensed", "completed"].includes(status?.toLowerCase() ?? "");

const prescriptionPatientName = (item: Prescription) =>
  item.patient_name || [item.patient?.first_name, item.patient?.last_name].filter(Boolean).join(" ");

export default function PharmacyDashboardPage() {
  const { activeWorkspace, user } = useAuth();
  const orgId = activeWorkspace?.id ?? null;
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [walkInOpen, setWalkInOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>("");

  // Two grouped views first (matching the summary cards), then each exact status.
  const statusOptions = useMemo(
    () => [
      { value: AWAITING_VIEW, label: "Awaiting dispensing" },
      { value: DISPENSED_VIEW, label: "Dispensed" },
      ...optionsFrom(prescriptions.map((item) => item.status)),
    ],
    [prescriptions],
  );
  const queueRef = useRef<HTMLElement>(null);
  const showQueue = (view: string) => {
    setSearchQuery("");
    setDateRange("");
    setStatusFilter(view);
    queueRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const visiblePrescriptions = useMemo(
    () =>
      newestFirst(
        prescriptions.filter(
          (item) =>
            matchesQuery(searchQuery, prescriptionPatientName(item), item.medication_name, item.dosage, item.doctor_name) &&
            (statusFilter === AWAITING_VIEW
              ? !isDispensedStatus(item.status)
              : statusFilter === DISPENSED_VIEW
                ? isDispensedStatus(item.status)
                : matchesOption(statusFilter, item.status)) &&
            isWithinDateRange(item.created_at, dateRange),
        ),
        (item) => item.created_at,
      ),
    [prescriptions, searchQuery, statusFilter, dateRange],
  );
  const hasActiveFilters = !!searchQuery.trim() || !!statusFilter || !!dateRange;

  const loadDashboard = useCallback(async () => {
    if (!orgId) {
      setPrescriptions([]);
      setInventory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [prescriptionResponse, detailedInventory] = await Promise.all([
        prescriptionService.listPrescriptionsByOrg(orgId),
        loadInventoryWithStock(
          orgId,
          (id) => inventoryService.listInventoryItems(id),
          (id, itemId) => inventoryService.getInventoryItem(id, itemId),
        ),
      ]);
      setPrescriptions(collectionFromResponse<Prescription>(prescriptionResponse, ["prescriptions"]));
      setInventory(detailedInventory);
    } catch (error) {
      console.error("Failed to load pharmacy dashboard", error);
      toast.error("Unable to load pharmacy data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const metrics = useMemo(() => {
    const pending = prescriptions.filter((item) => !isDispensedStatus(item.status)).length;
    
    // Calculate metrics excluding placeholders
    const realInventory = inventory.filter((item) => !isPlaceholderItem(item));
    const lowStock = realInventory.filter((item) => getStockLevel(item) === "out").length;
    const runningLowItems = realInventory.filter((item) => getStockLevel(item) === "low");
    const groups = new Set(inventory.map(getInventoryGroup).filter(Boolean));

    return { pending, lowStock, runningLowItems, groupCount: groups.size, realMedicineCount: realInventory.length };
  }, [inventory, prescriptions]);

  const openPrescriptionDetails = (prescriptionId: string) => {
    router.push(`/dashboard/pharmacy/prescriptions/${prescriptionId}`);
  };

  // Each card opens what it counts: a page (href) or a view of the queue below (onSelect).
  const cards: Array<{
    label: string;
    value: number;
    detail: string;
    icon: typeof Users;
    color: string;
    bg: string;
    href?: string;
    onSelect?: () => void;
    actionLabel: string;
  }> = [
    {
      label: "Prescription queue",
      value: prescriptions.length,
      detail: `${metrics.pending} awaiting dispensing`,
      icon: Users,
      color: "text-[#7E8FE5]",
      bg: "bg-[#EEF0FF]",
      onSelect: () => showQueue(AWAITING_VIEW),
      actionLabel: "Show prescriptions awaiting dispensing",
    },
    // Use metrics.realMedicineCount here instead of inventory.length
    {
      label: "Inventory items",
      value: metrics.realMedicineCount,
      detail: `${metrics.groupCount} medicine groups`,
      icon: Boxes,
      color: "text-[#E5B648]",
      bg: "bg-[#FFF5DD]",
      href: "/dashboard/pharmacy/inventory/items",
      actionLabel: "Open inventory items",
    },
    {
      label: "Dispensed",
      value: prescriptions.length - metrics.pending,
      detail: "Current prescription records",
      icon: Pill,
      color: "text-[#51C493]",
      bg: "bg-[#E8FBF1]",
      onSelect: () => showQueue(DISPENSED_VIEW),
      actionLabel: "Show dispensed prescriptions",
    },
    {
      actionLabel: "Open out-of-stock items",
      label: "Out of stock",
      value: metrics.lowStock,
      detail: metrics.runningLowItems.length > 0
        ? `${metrics.runningLowItems.length} more running low`
        : "Items needing restock",
      icon: CircleAlert,
      color: "text-[#F08B66]",
      bg: "bg-[#FFF1EC]",
      href: "/dashboard/pharmacy/inventory/items?stock=out",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[30px] font-semibold leading-tight text-[#151D48]">
            Welcome back, Pharm. {buildDisplayName(user)}
          </h1>
          <p className="mt-1 text-sm text-[#737791]">Review prescriptions, dispense medicines, and monitor stock.</p>
        </div>
        <div className="flex flex-wrap gap-3 self-start">
          <button
            type="button"
            onClick={() => setWalkInOpen(true)}
            className="rounded-md bg-[#00796B] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#00695F]"
          >
            Walk-in sale
          </button>
          <Link href="/dashboard/pharmacy/inventory/new" className="rounded-md border border-[#00796B] px-5 py-2.5 text-sm font-medium text-[#00796B] hover:bg-[#F0FFFA]">
            Add inventory item
          </Link>
        </div>
      </div>

      <WalkInSaleModal
        open={walkInOpen}
        onClose={() => setWalkInOpen(false)}
        orgId={orgId}
        inventory={inventory}
        onCompleted={() => void loadDashboard()}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const { label, value, detail, icon: Icon, color, bg, href, onSelect, actionLabel } = card;
          const cardClass =
            "rounded-md border border-[#ECEFF5] bg-white p-5 text-left transition hover:border-[#00796B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00796B]";
          const body = (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#737791]">{label}</p>
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${bg}`}><Icon size={18} className={color} /></span>
              </div>
              {loading ? (
                <div className="mt-4 h-10 w-20 animate-pulse rounded-md bg-slate-200" />
              ) : (
                <p className="mt-4 text-3xl font-semibold text-[#151D48]">{value}</p>
              )}
              <p className="mt-2 text-xs text-[#737791]">{detail}</p>
            </>
          );
          return href ? (
            <Link key={label} href={href} aria-label={`${label}: ${actionLabel}`} className={cardClass}>
              {body}
            </Link>
          ) : (
            <button key={label} type="button" onClick={onSelect} aria-label={`${label}: ${actionLabel}`} className={cardClass}>
              {body}
            </button>
          );
        })}
      </div>

      {!loading && metrics.runningLowItems.length > 0 && (
        <div role="alert" className="rounded-md border border-[#F7D799] bg-[#FFF7E6] p-4 text-sm text-[#7C4A03]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              <strong>{metrics.runningLowItems.length}</strong> item{metrics.runningLowItems.length === 1 ? " is" : "s are"} running low
              ({LOW_STOCK_THRESHOLD} units or fewer):{" "}
              {metrics.runningLowItems
                .slice(0, 4)
                .map((item) => `${item.name ?? "Unnamed item"} (${getInventoryQuantity(item)} left)`)
                .join(", ")}
              {metrics.runningLowItems.length > 4 ? ` and ${metrics.runningLowItems.length - 4} more` : ""}.
            </p>
            <Link href="/dashboard/pharmacy/inventory/items?stock=low" className="shrink-0 font-medium underline">
              Review and restock
            </Link>
          </div>
        </div>
      )}

      <article ref={queueRef} id="prescription-queue" className="scroll-mt-6 rounded-md border border-[#ECEFF5] bg-white p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#151D48]">Prescription queue</h2>
            <p className="text-sm text-[#737791]">Prescriptions are issued by clinicians and dispensed here.</p>
          </div>
          <Link href="/dashboard/pharmacy/inventory/list" className="text-sm font-medium text-[#00796B] hover:underline">View inventory</Link>
        </div>
        <ListToolbar
          search={
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search patient, medication or doctor"
              label="Search prescriptions by patient, medication, or prescribing doctor"
            />
          }
          filters={
            <>
              <FilterSelect allLabel="All statuses" label="Filter by status" value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
              <FilterSelect
                allLabel="Any date"
                label="Filter by prescription date"
                value={dateRange}
                onChange={(value) => setDateRange(value as DateRange)}
                options={DATE_RANGE_OPTIONS}
              />
            </>
          }
          shown={visiblePrescriptions.length}
          total={prescriptions.length}
          active={hasActiveFilters && !loading}
          onClear={() => {
            setSearchQuery("");
            setStatusFilter("");
            setDateRange("");
          }}
          noun="prescriptions"
        />
        <PrescriptionTable prescriptions={visiblePrescriptions} loading={loading} onView={openPrescriptionDetails} />
      </article>
    </section>
  );
}