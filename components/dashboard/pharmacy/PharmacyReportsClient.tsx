"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Boxes, FileText, Pill } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { inventoryService, prescriptionService } from "@services/api";
import { collectionFromResponse, getInventoryQuantity, InventoryItem, Prescription } from "./pharmacyUtils";

export default function PharmacyReportsClient() {
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id ?? null;

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId) {
      setItems([]);
      setPrescriptions([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);

      try {
        const [inventoryResponse, prescriptionResponse] = await Promise.all([
          inventoryService.listInventoryItems(orgId),
          prescriptionService.listPrescriptionsByOrg(orgId),
        ]);

        if (cancelled) return;

        const nextItems = collectionFromResponse<InventoryItem>(inventoryResponse).filter(
          (item) => !item.name?.startsWith("[Group Placeholder]"),
        );
        const nextPrescriptions = collectionFromResponse<Prescription>(prescriptionResponse, ["prescriptions"]);

        setItems(nextItems);
        setPrescriptions(nextPrescriptions);
      } catch (error) {
        console.error("Failed to load pharmacy reports", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [orgId]);

  const report = useMemo(() => {
    const pending = prescriptions.filter(
      (prescription) => !["dispensed", "completed"].includes((prescription.status ?? "").toLowerCase()),
    ).length;
    const lowStock = items.filter((item) => getInventoryQuantity(item) <= 0).length;
    const todayCount = prescriptions.filter((prescription) => {
      if (!prescription.created_at) return false;
      const date = new Date(prescription.created_at);
      const now = new Date();
      return date.toDateString() === now.toDateString();
    }).length;

    return {
      totalItems: items.length,
      lowStock,
      pending,
      todayCount,
    };
  }, [items, prescriptions]);

  const cards = [
    { label: "Inventory items", value: report.totalItems, icon: Boxes },
    { label: "Low stock", value: report.lowStock, icon: AlertTriangle },
    { label: "Pending prescriptions", value: report.pending, icon: FileText },
    { label: "Dispensed today", value: report.todayCount, icon: Pill },
  ];

  const recentPrescriptions = prescriptions
    .slice()
    .sort((left, right) => (right.created_at ?? "").localeCompare(left.created_at ?? ""))
    .slice(0, 5);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="dashboard-page-title text-[#151D48]">Pharmacy reports</h1>
        <p className="mt-2 text-sm text-[#737791]">
          A practical snapshot of stock health, prescription volume, and current dispensing workload.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <article key={label} className="rounded-md border border-[#E6EBF2] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#737791]">{label}</p>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF7F6] text-[#00796B]">
                <Icon size={18} />
              </span>
            </div>

            {loading ? (
              <div className="mt-4 h-8 w-16 animate-pulse rounded-md bg-slate-200" />
            ) : (
              <p className="mt-4 text-3xl font-semibold text-[#151D48]">{value}</p>
            )}
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <article className="rounded-md border border-[#E6EBF2] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#151D48]">Recent prescriptions</h2>
          <div className="mt-4 space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-12 animate-pulse rounded-md bg-slate-100" />
              ))
            ) : recentPrescriptions.length === 0 ? (
              <p className="text-sm text-[#737791]">No recent prescription activity found.</p>
            ) : (
              recentPrescriptions.map((prescription) => (
                <div key={prescription.id} className="flex items-center justify-between rounded-md border border-[#EEF1F5] px-3 py-2">
                  <div>
                    <p className="font-medium text-[#151D48]">{prescription.medication_name}</p>
                    <p className="text-xs text-[#737791]">
                      {prescription.patient_name || "Patient"} · {prescription.status ?? "Unknown"}
                    </p>
                  </div>
                  <span className="text-xs text-[#737791]">
                    {prescription.created_at ? new Date(prescription.created_at).toLocaleDateString() : "-"}
                  </span>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-md border border-[#E6EBF2] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#151D48]">Operational notes</h2>
          <ul className="mt-4 space-y-3 text-sm text-[#475467]">
            <li className="rounded-md bg-[#F7F9FB] p-3">
              {report.lowStock > 0
                ? `${report.lowStock} inventory item(s) are currently low or out of stock.`
                : "No low-stock items are currently flagged."}
            </li>
            <li className="rounded-md bg-[#F7F9FB] p-3">
              {report.pending > 0
                ? `${report.pending} prescription(s) are still awaiting dispensing.`
                : "No prescriptions are waiting for dispensing."}
            </li>
            <li className="rounded-md bg-[#F7F9FB] p-3">
              {report.todayCount > 0
                ? `${report.todayCount} prescription(s) were created today.`
                : "No prescriptions were created today yet."}
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
}
