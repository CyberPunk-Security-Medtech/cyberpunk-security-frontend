interface ComplianceSummaryCardProps {
  title: string;
  icon?: React.ReactNode;
  value: string;
  subText: string;
  valueColor?: string;
}

export default function ComplianceSummaryCard({
  title,
  icon,
  value,
  subText,
  valueColor = "text-[#22C55E]", // Default green
}: ComplianceSummaryCardProps) {
  return (
    <div className="bg-white rounded-xl border px-5 py-4 flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between text-sm text-slate-700">
        <span>{title}</span>
        {icon}
      </div>
      <span className={`text-2xl font-semibold ${valueColor}`}>{value}</span>
      <span className="text-xs text-slate-400">{subText}</span>
    </div>
  );
}
