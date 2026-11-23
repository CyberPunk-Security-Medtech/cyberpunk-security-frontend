// Walk-in pharmacy sales (a standalone pharmacy, or a hospital pharmacy serving
// someone without a consultation here) have no in-house prescriber. The backend
// has no sales endpoint, so a walk-in is recorded the same way as a walk-in lab
// request (see lab-scientist/labRequest.ts):
//   - a "pharmacy visit" consultation whose reason_for_visit is a short,
//     parseable summary of where the request came from,
//   - one prescription per medicine on that visit, dispensed straight away, and
//   - a consultation note with the full details.
// These helpers keep that format in one place.

export const PHARMACY_VISIT_PREFIX = "Pharmacy visit";

export type PharmacyVisitSource =
  | { kind: "prescription"; doctorName: string; facility?: string }
  | { kind: "otc" };

const formatDoctor = (name: string) => {
  const trimmed = name.trim();
  return /^dr\.?\s/i.test(trimmed) ? trimmed : `Dr. ${trimmed}`;
};

/** "Pharmacy visit · Prescribed by Dr. Ada Obi (Hope Clinic)" / "Pharmacy visit · Over the counter" */
export function buildPharmacyVisitReason(source: PharmacyVisitSource) {
  if (source.kind === "otc") return `${PHARMACY_VISIT_PREFIX} · Over the counter`;
  const facility = source.facility?.trim();
  return `${PHARMACY_VISIT_PREFIX} · Prescribed by ${formatDoctor(source.doctorName)}${
    facility ? ` (${facility})` : ""
  }`;
}

export function buildPharmacyVisitNote(
  source: PharmacyVisitSource,
  medicines: string[],
  notes?: string,
) {
  const lines = ["Walk-in pharmacy sale."];
  if (source.kind === "prescription") {
    lines.push(`Prescribing doctor: ${formatDoctor(source.doctorName)}`);
    if (source.facility?.trim()) lines.push(`Prescribing facility: ${source.facility.trim()}`);
  } else {
    lines.push("Sold over the counter (no prescription).");
  }
  if (medicines.length) lines.push(`Dispensed: ${medicines.join(", ")}`);
  if (notes?.trim()) lines.push("", `Notes: ${notes.trim()}`);
  return lines.join("\n");
}

export function isPharmacyVisitReason(reason?: string | null) {
  return Boolean(reason?.startsWith(PHARMACY_VISIT_PREFIX));
}
