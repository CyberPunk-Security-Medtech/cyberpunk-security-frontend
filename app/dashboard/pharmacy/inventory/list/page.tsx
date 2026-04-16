import Link from "next/link";
import { ArrowUpDown, ChevronRight } from "lucide-react";
import { pharmacyMedicines } from "@components/dashboard/pharmacy/inventoryData";
import BreadcrumbHeading from "@components/dashboard/pharmacy/BreadcrumbHeading";

export default function PharmacyMedicineListPage() {
  return (
    <section className="min-w-0 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <BreadcrumbHeading
            items={["Inventory", "List of Medicines (298)"]}
            description="List of medicines available for sales."
          />
        </div>

        <Link
          href="/dashboard/pharmacy/inventory/new"
          className="inline-flex items-center gap-1 self-start rounded-full bg-[#00796B] px-4 py-2 text-xs font-medium text-white hover:bg-[#00695F]"
        >
          + New Drug Prescription
        </Link>
      </div>

      <div
        role="region"
        aria-label="Medicine list table"
        className="min-w-0 w-full max-w-full overflow-x-auto overscroll-x-contain touch-pan-x rounded border border-[#D8DEE8] bg-white [-webkit-overflow-scrolling:touch]"
      >
          <div className="min-w-[980px]">
          <table className="w-full table-auto">
          <thead className="border-b border-[#D8DEE8] bg-white">
            <tr className="text-left text-sm font-medium text-[#2D3648]">
              <th className="whitespace-nowrap px-6 py-4">
                <span className="inline-flex items-center gap-2">
                  Medicine Name
                  <ArrowUpDown size={13} className="text-[#8792A8]" />
                </span>
              </th>
              <th className="whitespace-nowrap px-6 py-4">
                <span className="inline-flex items-center gap-2">
                  Medicine ID
                  <ArrowUpDown size={13} className="text-[#8792A8]" />
                </span>
              </th>
              <th className="whitespace-nowrap px-6 py-4">
                <span className="inline-flex items-center gap-2">
                  Group Name
                  <ArrowUpDown size={13} className="text-[#8792A8]" />
                </span>
              </th>
              <th className="whitespace-nowrap px-6 py-4">
                <span className="inline-flex items-center gap-2">
                  Stock in Qty
                  <ArrowUpDown size={13} className="text-[#8792A8]" />
                </span>
              </th>
              <th className="whitespace-nowrap px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {pharmacyMedicines.map((medicine) => (
              <tr
                key={medicine.medicineId}
                className="border-b border-[#E8EDF4] text-[13px] text-[#3A4253] last:border-b-0"
              >
                <td className="whitespace-nowrap px-6 py-4">{medicine.name}</td>
                <td className="whitespace-nowrap px-6 py-4">{medicine.medicineId}</td>
                <td className="whitespace-nowrap px-6 py-4">{medicine.group}</td>
                <td className="whitespace-nowrap px-6 py-4">{medicine.stockQty}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <Link
                    href={`/dashboard/pharmacy/inventory/list/${medicine.medicineId}`}
                    className="inline-flex items-center gap-1 text-[#2D3648] hover:text-[#00796B]"
                  >
                    View Full Detail
                    <ChevronRight size={13} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
          </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[#8A93A5]">
        <p>Showing 1-9 from 15</p>
        <div className="inline-flex items-center gap-3">
          <button className="text-[#8893A8]">‹</button>
          <button className="rounded border border-[#7EC3F0] bg-[#EAF7FF] px-2 py-0.5 text-[#2D3648]">
            1
          </button>
          <button className="text-[#8893A8]">2</button>
          <button className="text-[#8893A8]">›</button>
        </div>
      </div>
    </section>
  );
}
