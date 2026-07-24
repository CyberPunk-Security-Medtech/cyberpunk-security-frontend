interface ComplianceSummaryCardProps {
  title: string;
  icon?: React.ReactNode;
  value: string;
  subText?: string;
  valueColor?: string;
}

export default function ComplianceSummaryCard({
  title,
  icon,
  value,
  subText,
  valueColor = "text-[#22C55E]",
}: ComplianceSummaryCardProps) {
  return (
    <div className="flex min-h-32 w-full flex-col rounded-xl border border-slate-200 bg-white px-4 py-4 sm:min-h-36">
      <div className="flex items-center justify-between gap-3 text-sm font-medium text-slate-800">
        <span>{title}</span>
        <span className="text-slate-500" aria-hidden="true">{icon}</span>
      </div>
      <span className={`mt-7 text-base font-medium leading-6 ${valueColor}`}>
        {value}
      </span>
      {subText && <span className="mt-1 text-xs text-slate-400">{subText}</span>}
    </div>
  );
}
