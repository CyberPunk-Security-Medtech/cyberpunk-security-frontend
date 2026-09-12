import { Info } from "lucide-react";

type ConsultationWorkflow = "prescription" | "lab-test";
type DashboardRole = "doctor" | "nurse";

type ConsultationStartNoticeProps = {
  role: DashboardRole;
  workflow: ConsultationWorkflow;
};

const workflowMessages: Record<ConsultationWorkflow, string> = {
  prescription: "Start this consultation before adding prescriptions.",
  "lab-test": "Start this consultation before ordering lab tests.",
};

const roleStyles: Record<DashboardRole, string> = {
  doctor: "border-indigo-200 bg-indigo-50 text-[#1A2380]",
  nurse: "border-emerald-200 bg-emerald-50 text-[#006B5F]",
};

export function ConsultationStartNotice({
  role,
  workflow,
}: ConsultationStartNoticeProps) {
  return (
    <div
      className={`mb-4 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-5 ${roleStyles[role]}`}
      role="note"
    >
      <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <p>{workflowMessages[workflow]}</p>
    </div>
  );
}
