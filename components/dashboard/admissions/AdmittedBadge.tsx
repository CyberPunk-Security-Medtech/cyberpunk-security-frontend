import { BedDouble } from "lucide-react";
import type { CurrentAdmission } from "@services/api";

type AdmittedBadgeProps = {
  isAdmitted?: boolean;
  admission?: CurrentAdmission | null;
  className?: string;
};

export const describeAdmissionLocation = (admission?: CurrentAdmission | null) =>
  [admission?.ward?.name, admission?.bed_number ? `Bed ${admission.bed_number}` : null]
    .filter(Boolean)
    .join(" · ");

// "Admitted · Male Medical · Bed 4" — rendered only while the patient is an
// in-patient, driven by is_admitted/current_admission on the patient record.
export default function AdmittedBadge({ isAdmitted, admission, className = "" }: AdmittedBadgeProps) {
  if (!isAdmitted && !admission) return null;
  const location = describeAdmissionLocation(admission);

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-md bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-200 ${className}`}
    >
      <BedDouble size={14} aria-hidden="true" />
      Admitted{location ? ` · ${location}` : ""}
    </span>
  );
}
