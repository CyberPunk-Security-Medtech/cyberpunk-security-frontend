
function ActivityChart() {
  return (
    <div className="p-5 bg-white rounded-2xl shadow-sm col-span-1 md:col-span-2">
      <div className="flex justify-between mb-4">
        <p className="font-medium">Activity</p>
        <select className="text-sm border rounded px-2 py-1">
          <option>Month</option>
        </select>
      </div>

      <div className="flex items-end gap-3 h-40">
        {[100, 150, 130, 220, 260, 200, 240, 100, 260, 300, 340, 380].map(
          (val, i) => (
            <div
              key={i}
              className="w-4 bg-blue-500 rounded-md"
              style={{ height: `${val / 4}px` }}
            />
          )
        )}
      </div>

      <div className="flex justify-between mt-2 text-xs text-slate-400">
        {["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"].map(m => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}
export default ActivityChart