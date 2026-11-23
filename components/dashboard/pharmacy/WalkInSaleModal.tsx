"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "@components/Modal";
import { FieldLabel, Input, Select, Textarea } from "@components/Field";
import {
  consultationService,
  organizationService,
  type ConsultationRecord,
  type Department,
} from "@services/api";
import { getApiErrorMessage } from "@utils/apiError";
import WalkInPatientPicker, { type WalkInPatient } from "@components/dashboard/lab-scientist/WalkInPatientPicker";
import {
  findInventoryItemByName,
  getInventoryQuantity,
  getStockLevel,
  isPlaceholderItem,
  parseUnits,
  planStockDeduction,
  STOCK_LEVEL_CLASS,
  STOCK_LEVEL_LABEL,
  type InventoryItem,
  type StockAllocation,
} from "./pharmacyUtils";
import { dispenseWithStock } from "./pharmacyStock";
import { buildPharmacyVisitNote, buildPharmacyVisitReason, type PharmacyVisitSource } from "./pharmacyVisit";

type Props = {
  open: boolean;
  onClose: () => void;
  orgId: string | null;
  /** Inventory with stock loaded, used for medicine suggestions and stock warnings. */
  inventory: InventoryItem[];
  onCompleted: () => void;
};

type MedicineRow = {
  key: number;
  name: string;
  quantity: string;
  dosage: string;
  frequency: string;
  duration: string;
};

const FREQUENCY_OPTIONS = [
  "As directed",
  "Once daily",
  "Twice daily",
  "Three times daily",
  "Four times daily",
  "Every 8 hours",
  "At night",
  "When needed",
];

let rowKey = 0;
const newRow = (): MedicineRow => ({
  key: ++rowKey,
  name: "",
  quantity: "",
  dosage: "",
  frequency: "As directed",
  duration: "",
});

const unwrapRecord = <T,>(value: unknown): T => ((value as { data?: unknown })?.data ?? value) as T;

const isComplete = (row: MedicineRow) =>
  Boolean(row.name.trim() && row.quantity.trim() && row.dosage.trim() && row.frequency.trim() && row.duration.trim());

export default function WalkInSaleModal({ open, onClose, orgId, inventory, onCompleted }: Props) {
  const [patient, setPatient] = useState<WalkInPatient | null>(null);
  const [sourceKind, setSourceKind] = useState<PharmacyVisitSource["kind"]>("otc");
  const [doctorName, setDoctorName] = useState("");
  const [facility, setFacility] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentId, setDepartmentId] = useState("");
  const [rows, setRows] = useState<MedicineRow[]>(() => [newRow()]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const departmentsLoadedFor = useRef<string | null>(null);

  // The visit needs a department; pre-pick the pharmacy if there is one.
  useEffect(() => {
    if (!open || !orgId || departmentsLoadedFor.current === orgId) return;
    departmentsLoadedFor.current = orgId;
    organizationService
      .getDepartments(orgId)
      .then((list) => {
        const items = Array.isArray(list) ? list : [];
        setDepartments(items);
        setDepartmentId((current) => {
          if (current && items.some((item) => item.id === current)) return current;
          const pharmacy = items.find((item) => /pharm|dispens|drug/i.test(item.name));
          return pharmacy?.id ?? (items.length === 1 ? items[0].id : "");
        });
      })
      .catch(() => {
        departmentsLoadedFor.current = null;
        setDepartments([]);
      });
  }, [open, orgId]);

  const stockItems = useMemo(() => inventory.filter((item) => !isPlaceholderItem(item)), [inventory]);
  const findItem = (name: string) => findInventoryItemByName(stockItems, name);

  /** Stock to deduct for a row: null when the medicine isn't kept in inventory. */
  const stockFor = (row: MedicineRow): { item?: InventoryItem; plan: StockAllocation[] | null; ok: boolean } => {
    const item = findItem(row.name);
    if (!item) return { plan: null, ok: true };
    const units = parseUnits(row.quantity);
    const plan = units ? planStockDeduction(item, units) : null;
    return { item, plan, ok: !!plan };
  };

  const source: PharmacyVisitSource =
    sourceKind === "otc" ? { kind: "otc" } : { kind: "prescription", doctorName, facility };
  const filledRows = rows.filter((row) => row.name.trim());
  const ready =
    Boolean(patient && departmentId) &&
    filledRows.length > 0 &&
    filledRows.every((row) => isComplete(row) && stockFor(row).ok) &&
    (sourceKind === "otc" || Boolean(doctorName.trim()));

  const updateRow = (key: number, patch: Partial<MedicineRow>) =>
    setRows((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)));

  const reset = () => {
    setPatient(null);
    setSourceKind("otc");
    setDoctorName("");
    setFacility("");
    setRows([newRow()]);
    setNotes("");
  };

  const close = () => {
    if (saving) return;
    reset();
    onClose();
  };

  const submit = async () => {
    if (!orgId || !patient || !ready || saving) return;
    setSaving(true);

    // 1. Open and start the pharmacy visit.
    let visit: ConsultationRecord;
    try {
      visit = unwrapRecord<ConsultationRecord>(
        await consultationService.createConsultation(orgId, {
          patient_id: patient.id,
          department_id: departmentId,
          reason_for_visit: buildPharmacyVisitReason(source),
        }),
      );
      if (!visit?.id) throw new Error("The visit could not be created.");
      await consultationService.attendConsultation(orgId, visit.id);
    } catch (error) {
      console.error("Failed to open pharmacy visit", error);
      const status = (error as { response?: { status?: number } })?.response?.status;
      toast.error(
        status === 403
          ? "Your role can't open a pharmacy visit. Ask an administrator for consultation access."
          : getApiErrorMessage(error, "Couldn't open the pharmacy visit. Please try again."),
      );
      setSaving(false);
      return;
    }

    // 2. Record where the sale came from.
    try {
      await consultationService.addConsultationNote(
        orgId,
        visit.id,
        buildPharmacyVisitNote(source, filledRows.map((row) => `${row.name.trim()} × ${row.quantity.trim()}`), notes),
      );
    } catch (error) {
      console.warn("Failed to save pharmacy visit note", error);
    }

    // 3. One prescription per medicine, dispensed straight away.
    const failed: string[] = [];
    let dispensed = 0;
    for (const row of filledRows) {
      try {
        const prescription = unwrapRecord<{ id?: string }>(
          await consultationService.createPrescription(orgId, visit.id, {
            medication_name: row.name.trim(),
            dosage: row.dosage.trim(),
            frequency: row.frequency.trim(),
            duration: row.duration.trim(),
            instructions:
              source.kind === "otc" ? "Over-the-counter sale" : `Outside prescription from ${source.doctorName.trim()}`,
          }),
        );
        if (!prescription?.id) throw new Error("No prescription returned");
        const { failedBatches } = await dispenseWithStock(
          orgId,
          prescription.id,
          { quantity: row.quantity.trim(), counseling_notes: notes.trim() || undefined },
          stockFor(row).plan,
        );
        if (failedBatches.length > 0) {
          toast.warn(`${row.name.trim()} was dispensed, but part of it couldn't be taken from stock. Adjust that batch in inventory.`);
        }
        dispensed += 1;
      } catch (error) {
        console.error("Failed to dispense walk-in medicine", row.name, error);
        failed.push(row.name.trim());
      }
    }

    // 4. Close the visit so it doesn't sit in anyone's consultation queue.
    if (dispensed > 0) {
      try {
        await consultationService.completeConsultation(orgId, visit.id);
      } catch (error) {
        console.warn("Failed to complete pharmacy visit", error);
      }
    }

    setSaving(false);
    if (dispensed > 0) onCompleted();

    if (failed.length === 0) {
      toast.success(dispensed === 1 ? `${filledRows[0].name.trim()} dispensed.` : `${dispensed} medicines dispensed.`);
      reset();
      onClose();
      return;
    }

    toast.error(
      `${failed.length === filledRows.length ? "Nothing was" : `${failed.length} medicine(s) were not`} dispensed: ${failed.join(", ")}. Check the prescription queue and try again.`,
    );
    setRows((current) => {
      const left = current.filter((row) => failed.includes(row.name.trim()));
      return left.length ? left : [newRow()];
    });
  };

  return (
    <Modal
      title="Walk-in sale"
      header="For customers without a consultation here: over the counter, or with an outside prescription."
      isOpen={open}
      onClose={close}
      className="w-full max-w-4xl"
      headerClassName="bg-[var(--dashboard-accent,#00796B)]"
    >
      <div className="space-y-8">
        <section aria-labelledby="walk-in-customer-heading" className="space-y-3">
          <h4 id="walk-in-customer-heading" className="text-sm font-semibold text-gray-900">
            1. Customer
          </h4>
          {orgId && <WalkInPatientPicker orgId={orgId} value={patient} onChange={setPatient} />}
        </section>

        <fieldset disabled={!patient} className="space-y-8 disabled:opacity-50">
          <section aria-labelledby="walk-in-source-heading" className="space-y-3">
            <h4 id="walk-in-source-heading" className="text-sm font-semibold text-gray-900">
              2. Where is this from?
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {([
                ["otc", "Over the counter", "No prescription needed"],
                ["prescription", "Outside prescription", "Written by a doctor elsewhere"],
              ] as const).map(([value, label, hint]) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3 text-sm ${
                    sourceKind === value
                      ? "border-[var(--dashboard-accent,#00796B)] bg-emerald-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="walk-in-source"
                    value={value}
                    checked={sourceKind === value}
                    onChange={() => setSourceKind(value)}
                    className="mt-1 accent-[var(--dashboard-accent,#00796B)]"
                  />
                  <span>
                    <span className="block font-medium text-gray-900">{label}</span>
                    <span className="text-xs text-gray-500">{hint}</span>
                  </span>
                </label>
              ))}
            </div>
            {sourceKind === "prescription" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="walk-in-doctor">Prescribing doctor *</FieldLabel>
                  <Input id="walk-in-doctor" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="e.g. Dr. Ada Obi" />
                </div>
                <div>
                  <FieldLabel htmlFor="walk-in-facility">Facility</FieldLabel>
                  <Input id="walk-in-facility" value={facility} onChange={(e) => setFacility(e.target.value)} placeholder="e.g. Hope Clinic" />
                </div>
              </div>
            )}
            {departments.length !== 1 && (
              <div className="sm:max-w-xs">
                <FieldLabel htmlFor="walk-in-department">Department *</FieldLabel>
                <Select id="walk-in-department" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
                  <option value="">Select department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </Select>
                {departments.length === 0 && (
                  <p className="mt-1 text-xs text-gray-500">
                    No departments found. An admin needs to create one (e.g. Pharmacy) before walk-in sales can be recorded.
                  </p>
                )}
              </div>
            )}
          </section>

          <section aria-labelledby="walk-in-medicines-heading" className="space-y-3">
            <h4 id="walk-in-medicines-heading" className="text-sm font-semibold text-gray-900">
              3. Medicines
            </h4>
            <datalist id="walk-in-inventory">
              {stockItems.map((item) => (
                <option key={item.id} value={item.name ?? ""} />
              ))}
            </datalist>

            {rows.map((row, index) => {
              const { item, plan } = stockFor(row);
              const level = item ? getStockLevel(item) : null;
              const onHand = item ? getInventoryQuantity(item) : null;
              const requested = parseUnits(row.quantity);
              const quantityProblem = !item || !row.quantity.trim()
                ? null
                : !requested
                  ? "Enter a whole number of units, e.g. 14."
                  : !plan
                    ? `More than the ${onHand} in stock.`
                    : null;
              return (
                <div key={row.key} className="space-y-3 rounded-md border border-gray-200 p-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr]">
                    <div>
                      <FieldLabel htmlFor={`walk-in-name-${row.key}`}>Medicine *</FieldLabel>
                      <Input
                        id={`walk-in-name-${row.key}`}
                        list="walk-in-inventory"
                        value={row.name}
                        onChange={(e) => updateRow(row.key, { name: e.target.value })}
                        placeholder="Start typing to pick from inventory"
                      />
                      {row.name.trim() && (
                        <p className="mt-1 text-xs">
                          {item && level ? (
                            <span className={`rounded px-1.5 py-0.5 font-medium ${STOCK_LEVEL_CLASS[level]}`}>
                              {STOCK_LEVEL_LABEL[level]}
                              {level !== "unknown" ? ` · ${onHand} on hand` : ""}
                            </span>
                          ) : (
                            <span className="text-gray-500">Not in inventory, so stock can't be checked.</span>
                          )}
                        </p>
                      )}
                    </div>
                    <div>
                      <FieldLabel htmlFor={`walk-in-qty-${row.key}`}>Quantity *</FieldLabel>
                      <Input
                        id={`walk-in-qty-${row.key}`}
                        value={row.quantity}
                        onChange={(e) => updateRow(row.key, { quantity: e.target.value })}
                        placeholder="e.g. 14 tablets"
                      />
                      {quantityProblem ? (
                        <p className="mt-1 text-xs text-[#B91C1C]">{quantityProblem}</p>
                      ) : plan && onHand !== null && requested ? (
                        <p className="mt-1 text-xs text-gray-500">{onHand - requested} left after this sale</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div>
                      <FieldLabel htmlFor={`walk-in-dosage-${row.key}`}>Dosage *</FieldLabel>
                      <Input
                        id={`walk-in-dosage-${row.key}`}
                        value={row.dosage}
                        onChange={(e) => updateRow(row.key, { dosage: e.target.value })}
                        placeholder="e.g. 500mg"
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor={`walk-in-frequency-${row.key}`}>Frequency *</FieldLabel>
                      <Select
                        id={`walk-in-frequency-${row.key}`}
                        value={row.frequency}
                        onChange={(e) => updateRow(row.key, { frequency: e.target.value })}
                      >
                        {FREQUENCY_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <FieldLabel htmlFor={`walk-in-duration-${row.key}`}>Duration *</FieldLabel>
                      <Input
                        id={`walk-in-duration-${row.key}`}
                        value={row.duration}
                        onChange={(e) => updateRow(row.key, { duration: e.target.value })}
                        placeholder="e.g. 7 days"
                      />
                    </div>
                  </div>
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setRows((current) => current.filter((r) => r.key !== row.key))}
                      className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
                      aria-label={`Remove medicine ${index + 1}`}
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => setRows((current) => [...current, newRow()])}
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--dashboard-accent,#00796B)] hover:underline"
            >
              <Plus size={15} /> Add another medicine
            </button>
          </section>

          <section className="space-y-2">
            <FieldLabel htmlFor="walk-in-notes">Counselling notes</FieldLabel>
            <Textarea
              id="walk-in-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Advice given to the customer"
            />
          </section>
        </fieldset>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={close} className="rounded-md border px-6 py-2.5 text-sm font-medium hover:bg-gray-50">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void submit()}
            disabled={!ready || saving}
            className="rounded-md bg-[var(--dashboard-accent,#00796B)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--dashboard-accent-hover,#00695F)] disabled:opacity-50"
          >
            {saving ? "Dispensing…" : "Dispense"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
