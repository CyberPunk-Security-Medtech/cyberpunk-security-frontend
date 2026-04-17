"use client";

import { useEffect, useState } from "react";
import { ArrowUpDown, Plus, Search, Trash2, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import BreadcrumbHeading from "./BreadcrumbHeading";

type MedicineGroupDetailsClientProps = {
  groupName: string;
  medicines: Array<{ name: string; count: number }>;
};

export default function MedicineGroupDetailsClient({
  groupName,
  medicines,
}: MedicineGroupDetailsClientProps) {
  const searchParams = useSearchParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("addMedicine") === "true") {
      setIsAddModalOpen(true);
    }
  }, [searchParams]);

  return (
    <>
      <section className="min-w-0 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <BreadcrumbHeading
            items={["Inventory", "Medicine Groups", groupName]}
            description="Detailed view of a medicine group."
          />

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1 self-start rounded-sm bg-[#00796B] px-5 py-2 text-xs font-medium text-white hover:bg-[#00695F]"
          >
            <Plus size={12} />
            <span>Add Medicine</span>
          </button>
        </div>

        <div className="relative w-full max-w-[320px]">
          <Search
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA3B2]"
          />
          <input
            placeholder="Search for Medicine"
            className="h-10 w-full rounded border border-[#CED7E3] bg-white px-3 pr-9 text-xs text-[#2D3648] outline-none"
          />
        </div>

        <div
          role="region"
          aria-label="Group medicines table"
          className="min-w-0 w-full max-w-full overflow-x-auto overscroll-x-contain touch-pan-x rounded border border-[#D8DEE8] bg-white [-webkit-overflow-scrolling:touch]"
        >
            <div className="min-w-[880px]">
            <table className="w-full table-auto">
            <thead className="border-b border-[#D8DEE8]">
              <tr className="text-left text-sm font-medium text-[#2D3648]">
                <th className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex items-center gap-2">
                    Medicine Name
                    <ArrowUpDown size={13} className="text-[#8792A8]" />
                  </span>
                </th>
                <th className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex items-center gap-2">
                    No of Medicines
                    <ArrowUpDown size={13} className="text-[#8792A8]" />
                  </span>
                </th>
                <th className="whitespace-nowrap px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((medicine) => (
                <tr
                  key={medicine.name}
                  className="border-b border-[#E8EDF4] text-[13px] text-[#3A4253] last:border-b-0"
                >
                  <td className="whitespace-nowrap px-6 py-4">{medicine.name}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {medicine.count.toString().padStart(2, "0")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button className="inline-flex items-center gap-2 text-[#EF4444]">
                      <Trash2 size={13} />
                      Remove from Group
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
            </div>
        </div>

        <button className="inline-flex items-center gap-2 rounded border border-[#9FD0E2] bg-[#EFFBFF] px-5 py-2 text-xs text-[#00796B]">
          <Trash2 size={12} />
          Delete Group
        </button>
      </section>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 px-4">
          <div className="relative w-full max-w-[520px] rounded bg-white p-6 shadow-xl">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-3 top-3 text-[#434B5D]"
              aria-label="Close modal"
            >
              <X size={14} />
            </button>

            <h2 className="text-[36px] leading-none font-semibold text-[#1E2433]">
              Add Medicine
            </h2>

            <div className="mt-6 space-y-2">
              <label className="text-sm text-[#2D3648]">Medicine</label>
              <div className="relative">
                <input
                  placeholder="Enter Medicine Name or Medicine ID"
                  className="h-10 w-full rounded border border-[#CED7E3] px-3 pr-9 text-xs text-[#2D3648] outline-none"
                />
                <Search
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA3B2]"
                />
              </div>
            </div>

            <button
              onClick={() => setIsAddModalOpen(false)}
              className="mt-4 inline-flex items-center gap-1 rounded-sm bg-[#00796B] px-4 py-2 text-xs font-medium text-white hover:bg-[#00695F]"
            >
              <Plus size={12} />
              Add Medicine to Group
            </button>
          </div>
        </div>
      )}
    </>
  );
}
