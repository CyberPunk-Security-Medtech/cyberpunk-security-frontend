// Walk-in / external lab requests (standalone labs, or outside referrals to a
// hospital lab) have no doctor inside the organization. The backend has no
// referrer fields, so the request is recorded as a "lab visit" consultation:
//   - reason_for_visit carries a short, parseable summary of the request, and
//   - a consultation note carries the full referral details + clinical notes.
// These helpers keep that format in one place.

export const LAB_REQUEST_PREFIX = "Lab request";

export type LabRequestSource =
  | { kind: "referral"; doctorName: string; facility?: string }
  | { kind: "self" };

const formatDoctor = (name: string) => {
  const trimmed = name.trim();
  return /^dr\.?\s/i.test(trimmed) ? trimmed : `Dr. ${trimmed}`;
};

/** "Lab request · Referred by Dr. Ada Obi (Hope Clinic)" / "Lab request · Self-requested" */
export function buildLabRequestReason(source: LabRequestSource) {
  if (source.kind === "self") return `${LAB_REQUEST_PREFIX} · Self-requested`;
  const facility = source.facility?.trim();
  return `${LAB_REQUEST_PREFIX} · Referred by ${formatDoctor(source.doctorName)}${
    facility ? ` (${facility})` : ""
  }`;
}

export function buildLabRequestNote(
  source: LabRequestSource,
  tests: string[],
  clinicalNotes?: string,
) {
  const lines = ["Walk-in laboratory request."];
  if (source.kind === "referral") {
    lines.push(`Referring doctor: ${formatDoctor(source.doctorName)}`);
    if (source.facility?.trim()) lines.push(`Referring facility: ${source.facility.trim()}`);
  } else {
    lines.push("Requested by the patient (no referring doctor).");
  }
  if (tests.length) lines.push(`Tests requested: ${tests.join(", ")}`);
  if (clinicalNotes?.trim()) lines.push("", `Clinical notes: ${clinicalNotes.trim()}`);
  return lines.join("\n");
}

export function isLabRequestReason(reason?: string | null) {
  return Boolean(reason?.startsWith(LAB_REQUEST_PREFIX));
}

/**
 * Who asked for the tests on a lab-request consultation, for display in place
 * of an in-house doctor. Returns null for regular consultations.
 */
export function labRequestReferrer(reason?: string | null): string | null {
  if (!isLabRequestReason(reason)) return null;
  const referred = reason!.match(/Referred by (.+)$/);
  if (referred) return referred[1].trim();
  if (/Self-requested/i.test(reason!)) return "Self-requested";
  return "External request";
}
