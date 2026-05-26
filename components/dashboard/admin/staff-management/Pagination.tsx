export default function Pagination() {
  return (
    <div className="flex justify-between items-center text-xs">
      <div>
        Showing{" "}
        <select className="border rounded px-2 py-1 text-xs">
          <option>10</option>
        </select>{" "}
        Results
      </div>

      <div className="flex gap-1">
        {["Prev", "1", "2", "3", "Next"].map((label, i) => (
          <button
            key={i}
            className={`px-3 py-1 border rounded ${
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
