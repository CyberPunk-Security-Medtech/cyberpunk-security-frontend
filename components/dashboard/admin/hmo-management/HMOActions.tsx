interface HMOActionsProps {
  onAdd?: () => void; 
}

export default function HMOActions({ onAdd }: HMOActionsProps) {
  return (
    <div className="flex items-center justify-end gap-4">
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm text-slate-600 hover:bg-slate-50"
      >
        {/* Filter Icon Placeholder */}
        <span>🔍</span> Advanced Filters
      </button>

      <button
        onClick={onAdd}
        className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-[#051466] text-white text-sm font-medium hover:bg-[#020b44]"
      >
        + Add HMO
      </button>
    </div>
  );
}
