"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@context/AuthContext";
import { prescriptionService } from "@services/api";
import { toast } from "react-toastify";
import DispensePrescriptionModal from "@components/dashboard/pharmacy/DispensePrescriptionModal";
import BreadcrumbHeading from "./BreadcrumbHeading";
import { collectionFromResponse, Prescription } from "./pharmacyUtils";

export default function PrescriptionDetailsClient({
  prescriptionId,
}: {
  prescriptionId: string;
}) {
  const { activeWorkspace } = useAuth();
  const orgId = activeWorkspace?.id ?? null;

  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [initialRecord, setInitialRecord] = useState<Record<string, string | null> | null>(null);

  const loadPrescription = async () => {
    if (!orgId) return;

    setLoading(true);
    try {
      const response = await prescriptionService.listPrescriptionsByOrg(orgId);
      const list = collectionFromResponse<Prescription>(response, ["prescriptions"]);
      const next = list.find((item) => item.id === prescriptionId) ?? null;
      setPrescription(next);
    } catch (error) {
      console.error("Failed to load prescription", error);
      toast.error("Unable to load this prescription.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPrescription();
  }, [orgId, prescriptionId]);

  const isDispensed = useMemo(
    () =>
      (prescription?.status ?? "").toLowerCase() === "dispensed" ||
      (prescription?.status ?? "").toLowerCase() === "completed",
    [prescription?.status],
  );

  const openDispenseModal = async () => {
    if (!orgId || !prescription) return;

    setModalMode(isDispensed ? "edit" : "create");

    if (isDispensed) {
      try {
        const response = await prescriptionService.getDispenseRecord(orgId, prescription.id);
        const record =
          response && typeof response === "object" && "data" in response
            ? (response as { data: Record<string, string | null> }).data
            : response;

        setInitialRecord(record as Record<string, string | null>);
      } catch (error) {
        console.error("Failed to load dispense record", error);
        toast.error("Unable to load the dispense record.");
        setInitialRecord(null);
      }
    } else {
      setInitialRecord(null);
    }

    setModalOpen(true);
  };

  const handleConfirmDispense = async (payload: {
    quantity: string;
    batch_number?: string;
    expiry_date?: string;
    substitution_note?: string;
    counseling_notes?: string;
  }) => {
    if (!orgId || !prescription) return;

    if (modalMode === "edit") {
      await prescriptionService.correctDispenseRecord(orgId, prescription.id, payload);
      toast.success("Dispense record corrected.");
    } else {
      await prescriptionService.dispensePrescription(orgId, prescription.id, payload);
      toast.success("Prescription marked as completed.");
    }

    setModalOpen(false);
    await loadPrescription();
  };

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="h-12 w-64 animate-pulse rounded bg-gray-200" />
        <div className="h-64 animate-pulse rounded-md border border-[#E6EBF2] bg-gray-100" />
      </section>
    );
  }

  if (!prescription) {
    return (
      <section className="rounded-md border border-dashed border-gray-300 bg-white p-8 text-sm text-gray-500">
        Prescription details are unavailable.
      </section>
    );
  }

  const patientName =
    `${prescription.patient?.first_name ?? ""} ${prescription.patient?.last_name ?? ""}`.trim() ||
    prescription.patient_name ||
    "-";

  return (
    <section className="space-y-8">
      <BreadcrumbHeading
        items={["Pharmacy", "Prescriptions", prescription.medication_name || "Prescription details"]}
        description="Review the prescription and complete the dispense action."
      />

      <article className="rounded-md border border-[#E6EBF2] bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#737791]">
              Prescription summary
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-[#151D48]">
              {prescription.medication_name}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => void openDispenseModal()}
            className="rounded-md bg-[#00796B] px-5 py-2 text-sm font-medium text-white"
          >
            {isDispensed ? "Correct dispense" : "Dispense"}
          </button>
        </div>

        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-md border border-[#E6EBF2] bg-[#F7F9FB] p-3">
            <dt className="text-xs uppercase tracking-[0.08em] text-[#737791]">Patient</dt>
            <dd className="mt-2 font-medium text-[#151D48]">{patientName}</dd>
          </div>
          <div className="rounded-md border border-[#E6EBF2] bg-[#F7F9FB] p-3">
            <dt className="text-xs uppercase tracking-[0.08em] text-[#737791]">Status</dt>
            <dd className="mt-2 font-medium text-[#151D48]">{prescription.status ?? "Unknown"}</dd>
          </div>
          <div className="rounded-md border border-[#E6EBF2] bg-[#F7F9FB] p-3">
            <dt className="text-xs uppercase tracking-[0.08em] text-[#737791]">Date</dt>
            <dd className="mt-2 font-medium text-[#151D48]">
              {prescription.created_at ? new Date(prescription.created_at).toLocaleDateString() : "-"}
            </dd>
          </div>
          <div className="rounded-md border border-[#E6EBF2] bg-[#F7F9FB] p-3">
            <dt className="text-xs uppercase tracking-[0.08em] text-[#737791]">Dosage</dt>
            <dd className="mt-2 font-medium text-[#151D48]">{prescription.dosage || "-"}</dd>
          </div>
        </dl>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-md border border-[#E6EBF2] p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-[#737791]">Frequency</p>
            <p className="mt-2 font-medium text-[#151D48]">{prescription.frequency || "-"}</p>
          </div>
          <div className="rounded-md border border-[#E6EBF2] p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-[#737791]">Duration</p>
            <p className="mt-2 font-medium text-[#151D48]">{prescription.duration || "-"}</p>
          </div>
          <div className="rounded-md border border-[#E6EBF2] p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-[#737791]">Route</p>
            <p className="mt-2 font-medium text-[#151D48]">{prescription.route || "-"}</p>
          </div>
          <div className="rounded-md border border-[#E6EBF2] p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-[#737791]">Doctor</p>
            <p className="mt-2 font-medium text-[#151D48]">{prescription.doctor_name || "-"}</p>
          </div>
        </div>
      </article>

      <DispensePrescriptionModal
        prescription={prescription}
        isOpen={modalOpen}
        mode={modalMode}
        initialRecord={initialRecord}
        onClose={() => {
          setModalOpen(false);
          setInitialRecord(null);
        }}
        onConfirm={handleConfirmDispense}
      />
    </section>
  );
}
