import { Building2 } from "lucide-react";

export default function TransferDetails() {
  return (
    <section className="mb-8 rounded-xl bg-white px-8 py-9 shadow-sm">
      <div className="flex items-center gap-4">
        <Building2 className="h-6 w-6 text-gray-900" />
        <h3 className="text-2xl font-bold text-gray-900">Transfer Details</h3>
      </div>

      <div className="mt-8 space-y-6">
        <div className="flex justify-between border-b border-gray-300 pb-6">
          <span className="text-gray-500">From:</span>
          <span className="font-bold text-gray-900">UCH, Ilorin</span>
        </div>

        <div className="flex justify-between border-b border-gray-300 pb-6">
          <span className="text-gray-500">From:</span>
          <span className="font-bold text-gray-900">April 17, 2026</span>
        </div>
      </div>
    </section>
  );
}