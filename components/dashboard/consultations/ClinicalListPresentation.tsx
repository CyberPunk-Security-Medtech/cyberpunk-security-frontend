import { ClipboardX, FlaskConical, Stethoscope } from "lucide-react";

type ClinicalListTone = "doctor" | "nurse";
type ClinicalListKind = "diagnosis" | "lab-test";

const TONE_STYLES: Record<
  ClinicalListTone,
  { border: string; background: string; icon: string }
> = {
  doctor: {
    border: "border-[#DADDFE]",
    background: "bg-[#EEF2FF]",
    icon: "text-[#1A2380]",
  },
  nurse: {
    border: "border-[#B7DED8]",
    background: "bg-[#ECFDF8]",
    icon: "text-[#006B5F]",
  },
};

type ClinicalListThumbnailProps = {
  kind: ClinicalListKind;
  tone: ClinicalListTone;
};

export function ClinicalListThumbnail({ kind, tone }: ClinicalListThumbnailProps) {
  const Icon = kind === "diagnosis" ? Stethoscope : FlaskConical;
  const styles = TONE_STYLES[tone];

  return (
    <span
      aria-hidden="true"
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${styles.border} ${styles.background}`}
    >
      <Icon className={`h-5 w-5 ${styles.icon}`} strokeWidth={1.8} />
    </span>
  );
}

type DiagnosisEmptyStateProps = {
  tone: ClinicalListTone;
};

export function DiagnosisEmptyState({ tone }: DiagnosisEmptyStateProps) {
  const styles = TONE_STYLES[tone];

  return (
    <div className="rounded-xl border border-dashed border-gray-300 px-4 py-10 text-center">
      <span
        aria-hidden="true"
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full border ${styles.border} ${styles.background}`}
      >
        <ClipboardX className={`h-7 w-7 ${styles.icon}`} strokeWidth={1.6} />
      </span>
      <h4 className="mt-4 text-sm font-semibold text-gray-900">No diagnosis records found</h4>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-5 text-gray-500">
        Diagnoses recorded for this consultation will appear here.
      </p>
    </div>
  );
}
