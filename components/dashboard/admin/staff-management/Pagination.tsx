export default function Pagination() {
  return (
    <div className="flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
      <div>
        Showing{" "}
        <select aria-label="Results per page" className="min-h-10 rounded border px-2 text-xs">
          <option>10</option>
        </select>{" "}
        Results
      </div>

      <div className="flex flex-wrap gap-1">
        {["Prev", "1", "2", "3", "Next"].map((label, i) => (
          <button
            key={i}
            className={`min-h-10 min-w-10 rounded border px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466] ${
              label === "1" ? "bg-blue-50 text-blue-600" : "hover:bg-slate-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
