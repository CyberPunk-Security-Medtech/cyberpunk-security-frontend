import { ArrowUpRight, ArrowDownRight, ChevronDown } from "lucide-react";

export default function TotalTransfers() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-4">
      <p className="text-xs text-slate-500 mb-4">Total Patients Transfers</p>

      <div>
        <button className="flex items-center gap-1 text-xs border rounded-full px-3 py-1 mb-2 hover:bg-slate-50">
          October 2025 <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <p className="text-3xl font-semibold">150</p>

      <div className="flex items-center gap-4 text-xs mt-3">
        <span className="flex items-center gap-1 text-emerald-600">
          <ArrowUpRight className="w-3 h-3" /> +201
        </span>
        <span className="flex items-center gap-1 text-rose-500">
          <ArrowDownRight className="w-3 h-3" /> -101
        </span>
      </div>
    </div>
  );
}
