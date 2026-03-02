interface StatusBadgeProps {
status:
  | "Active"
  | "In Progress"
  | "Discharged"
  | "Pending"
  | "Normal"
  | "High"
  | "Low"
  | "Abnormal"
  | "Completed";
}


export function StatusBadge({ status }: StatusBadgeProps) {
const colors: Record<string, string> = {
Active: "bg-[#D7F7F1] text-[#00B8A8]",
"In Progress": "bg-[#D7F7F1] text-[#00B8A8]",
Discharged: "bg-[#E3E7FF] text-[#1A2380]",
Pending: "bg-[#FFF6E1] text-[#D68B00]",
Normal: "bg-[#D7F7F1] text-[#00B8A8]",
High: "bg-[#FFEAEA] text-[#E62E2E]",
Low: "bg-[#E3E7FF] text-[#1A2380]",
Abnormal: "bg-[#FFEAEA] text-[#E62E2E]",
Completed: "bg-[#E8FFF6] text-[#00B885]",
};
return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${colors[status]}`}>{status}</span>;
}
