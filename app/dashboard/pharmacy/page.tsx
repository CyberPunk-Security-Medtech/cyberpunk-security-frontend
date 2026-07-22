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
//         <Link href="/dashboard/pharmacy/inventory/new" className="self-start rounded-full bg-[#00796B] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#00695F]">
//           Add inventory item
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         {cards.map(({ label, value, detail, icon: Icon, color, bg }) => (
//           <article key={label} className="rounded-xl border border-[#ECEFF5] bg-white p-5">
//             <div className="flex items-center justify-between">
//               <p className="text-sm text-[#737791]">{label}</p>
//               <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${bg}`}><Icon size={18} className={color} /></span>
//             </div>
//             <p className="mt-4 text-3xl font-semibold text-[#151D48]">{loading ? "—" : value}</p>
//             <p className="mt-2 text-xs text-[#737791]">{detail}</p>
//           </article>
//         ))}
//       </div>

//       <article className="rounded-xl border border-[#ECEFF5] bg-white p-5">
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { Boxes, CircleAlert, Pill, Users } from "lucide-react";
import { inventoryService, prescriptionService } from "@services/api";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-toastify";
import PrescriptionTable from "@components/dashboard/pharmacy/PrescriptionTable";
import DispensePrescriptionModal from "@components/dashboard/pharmacy/DispensePrescriptionModal";
import {
  collectionFromResponse,
  getInventoryGroup,
  getInventoryQuantity,
  InventoryItem,
  Prescription,
} from "@components/dashboard/pharmacy/pharmacyUtils";
import { buildDisplayName } from "@utils/helper";

export default function PharmacyDashboardPage() {
  const { activeWorkspace, user } = useAuth();
  const orgId = activeWorkspace?.id ?? null;
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dispensingId, setDispensingId] = useState<string | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [dispenseMode, setDispenseMode] = useState<"create" | "edit">("create");
  const [dispenseRecord, setDispenseRecord] = useState<Record<string, string | null> | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!orgId) {
      setPrescriptions([]);
      setInventory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [prescriptionResponse, inventoryResponse] = await Promise.all([
        prescriptionService.listPrescriptionsByOrg(orgId),
        inventoryService.listInventoryItems(orgId),
      ]);
      setPrescriptions(collectionFromResponse<Prescription>(prescriptionResponse, ["prescriptions"]));
      const catalogue = collectionFromResponse<InventoryItem>(inventoryResponse);
      const detailedInventory = await Promise.all(catalogue.map(async (item) => {
        try {
          const detailResponse = await inventoryService.getInventoryItem(orgId, item.id);
          const detail = (detailResponse && typeof detailResponse === "object" && "data" in detailResponse ? (detailResponse as { data: InventoryItem }).data : detailResponse) as InventoryItem;
          return { ...item, ...detail };
        } catch (detailError) {
          console.warn(`Unable to load stock total for ${item.id}`, detailError);
          return item;
        }
      }));
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
    const pending = prescriptions.filter((item) => !["dispensed", "completed"].includes(item.status?.toLowerCase() ?? "")).length;
    
    // Calculate metrics excluding placeholders
    const realInventory = inventory.filter(item => !item.name?.startsWith("[Group Placeholder]"));
    const lowStock = realInventory.filter((item) => getInventoryQuantity(item) <= 0).length;
    const groups = new Set(inventory.map(getInventoryGroup).filter(Boolean));
    
    return { pending, lowStock, groupCount: groups.size, realMedicineCount: realInventory.length };
  }, [inventory, prescriptions]);

  const handleDispense = async (payload: { quantity: string; batch_number?: string; expiry_date?: string; substitution_note?: string; counseling_notes?: string }) => {
    const prescriptionId = selectedPrescription?.id;
    if (!orgId || dispensingId) return;
    if (!prescriptionId) return;
    setDispensingId(prescriptionId);
    try {
      if (dispenseMode === "edit") {
        await prescriptionService.correctDispenseRecord(orgId, prescriptionId, payload);
        toast.success("Dispense record corrected.");
      } else {
        await prescriptionService.dispensePrescription(orgId, prescriptionId, payload);
        toast.success("Prescription marked as completed.");
      }
      await loadDashboard();
    } catch (error) {
      console.error("Failed to dispense prescription", error);
      toast.error("Unable to dispense this prescription.");
    } finally {
      setDispensingId(null);
    }
  };

  const openCorrection = async (prescriptionId: string) => {
    if (!orgId) return;
    const prescription = prescriptions.find((item) => item.id === prescriptionId) ?? null;
    if (!prescription) return;
    try {
      const response = await prescriptionService.getDispenseRecord(orgId, prescriptionId);
      const record = (response && typeof response === "object" && "data" in response ? (response as { data: Record<string, string | null> }).data : response) as Record<string, string | null>;
      setSelectedPrescription(prescription);
      setDispenseRecord(record);
      setDispenseMode("edit");
    } catch (error) { console.error("Failed to load dispense record", error); toast.error("Unable to load this dispense record for editing."); }
  };

  const cards = [
    { label: "Prescription queue", value: prescriptions.length, detail: `${metrics.pending} awaiting dispensing`, icon: Users, color: "text-[#7E8FE5]", bg: "bg-[#EEF0FF]" },
    // Use metrics.realMedicineCount here instead of inventory.length
    { label: "Inventory items", value: metrics.realMedicineCount, detail: `${metrics.groupCount} medicine groups`, icon: Boxes, color: "text-[#E5B648]", bg: "bg-[#FFF5DD]" },
    { label: "Dispensed", value: prescriptions.length - metrics.pending, detail: "Current prescription records", icon: Pill, color: "text-[#51C493]", bg: "bg-[#E8FBF1]" },
    { label: "Out of stock", value: metrics.lowStock, detail: "Items needing restock", icon: CircleAlert, color: "text-[#F08B66]", bg: "bg-[#FFF1EC]" },
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
        <Link href="/dashboard/pharmacy/inventory/new" className="self-start rounded-full bg-[#00796B] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#00695F]">
          Add inventory item
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, detail, icon: Icon, color, bg }) => (
          <article key={label} className="rounded-xl border border-[#ECEFF5] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#737791]">{label}</p>
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${bg}`}><Icon size={18} className={color} /></span>
            </div>
            <p className="mt-4 text-3xl font-semibold text-[#151D48]">{loading ? "—" : value}</p>
            <p className="mt-2 text-xs text-[#737791]">{detail}</p>
          </article>
        ))}
      </div>

      <article className="rounded-xl border border-[#ECEFF5] bg-white p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#151D48]">Prescription queue</h2>
            <p className="text-sm text-[#737791]">Prescriptions are issued by clinicians and dispensed here.</p>
          </div>
          <Link href="/dashboard/pharmacy/inventory/list" className="text-sm font-medium text-[#00796B] hover:underline">View inventory</Link>
        </div>
        <PrescriptionTable prescriptions={prescriptions} onDispense={(id) => { setDispenseMode("create"); setDispenseRecord(null); setSelectedPrescription(prescriptions.find((item) => item.id === id) ?? null); }} onCorrectDispense={openCorrection} dispensingId={dispensingId} />
      </article>
      <DispensePrescriptionModal prescription={selectedPrescription} isOpen={Boolean(selectedPrescription)} mode={dispenseMode} initialRecord={dispenseRecord} onClose={() => { setSelectedPrescription(null); setDispenseRecord(null); }} onConfirm={handleDispense} />
    </section>
  );
}