interface HMOActionsProps {
  onAdd?: () => void; 
}

export default function HMOActions({ onAdd }: HMOActionsProps) {
  return (
    <div className="flex flex-col gap-3 xs:flex-row xs:flex-wrap xs:justify-end">
      <button
        className="dashboard-button min-h-11 border px-4 text-slate-600 hover:bg-slate-50 sm:min-h-10"
      >
        {/* Filter Icon Placeholder */}
        <span>🔍</span> Advanced Filters
      </button>

      <button
        onClick={onAdd}
        className="dashboard-button min-h-11 bg-[#051466] px-6 text-white hover:bg-[#020b44] sm:min-h-10"
      >
        + Add HMO
      </button>
    </div>
  );
}
