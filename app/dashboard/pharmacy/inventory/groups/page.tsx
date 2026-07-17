"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Plus, Search, Trash2, X } from "lucide-react";
import BreadcrumbHeading from "@components/dashboard/pharmacy/BreadcrumbHeading";
import { pharmacyMedicineGroups } from "@components/dashboard/pharmacy/inventoryData";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";

export default function MedicineGroupsPage() {
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);

  return (
    <>
      <section className="min-w-0 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <BreadcrumbHeading
            items={["Inventory", "Medicine Groups"]}
            description="Detailed view of a medicine group."
          />

          <button
            onClick={() => setIsAddGroupModalOpen(true)}
            className="inline-flex items-center gap-1 self-start rounded-sm bg-[#00796B] px-5 py-2 text-xs font-medium text-white hover:bg-[#00695F]"
          >
            <Plus size={12} />
            <span>Add Group</span>
          </button>
        </div>

        <div className="relative w-full max-w-[320px]">
          <Search
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA3B2]"
          />
          <input
            placeholder="Search for Group"
            className="h-10 w-full rounded border border-[#CED7E3] bg-white px-3 pr-9 text-xs text-[#2D3648] outline-none"
          />
        </div>

        <ResponsiveTableRegion label="Medicine groups" className="rounded border border-[#D8DEE8] bg-white">
            <div className="min-w-[880px]">
            <table className="w-full table-auto">
            <thead className="border-b border-[#D8DEE8]">
              <tr className="text-left text-sm font-medium text-[#2D3648]">
                <th scope="col" className="whitespace-nowrap bg-white px-6 py-4">
                  <span className="inline-flex items-center gap-2">
                    Group Name
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
              {pharmacyMedicineGroups.map((group) => (
                <tr
                  key={group.id}
                  className="border-b border-[#E8EDF4] text-[13px] text-[#3A4253] last:border-b-0"
                >
                  <td className="whitespace-nowrap bg-white px-6 py-4">
                    <Link
                      href={`/dashboard/pharmacy/inventory/groups/${group.id}`}
                      className="hover:text-[#00796B]"
                    >
                      {group.name}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {group.medicineCount.toString().padStart(2, "0")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button className="inline-flex items-center gap-2 text-[#EF4444]">
                      <Trash2 size={13} />
                      Remove Group
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
            </div>
        </ResponsiveTableRegion>
      </section>

      {isAddGroupModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30 px-4">
          <div className="relative w-full max-w-[520px] rounded bg-white p-6 shadow-xl">
            <button
              onClick={() => setIsAddGroupModalOpen(false)}
              className="absolute right-3 top-3 text-[#434B5D]"
              aria-label="Close modal"
            >
              <X size={14} />
            </button>

            <h2 className="text-[32px] leading-none font-semibold text-[#1E2433]">
              Add Group
            </h2>

            <div className="mt-6 space-y-2">
              <label className="text-sm text-[#2D3648]">Group Name</label>
              <input
                placeholder="Enter Group Name"
                className="h-10 w-full rounded border border-[#CED7E3] px-3 text-xs text-[#2D3648] outline-none"
              />
            </div>

            <button
              onClick={() => setIsAddGroupModalOpen(false)}
              className="mt-4 inline-flex items-center gap-1 rounded-sm bg-[#00796B] px-4 py-2 text-xs font-medium text-white hover:bg-[#00695F]"
            >
              <Plus size={12} />
              Add Group
            </button>
          </div>
        </div>
      )}
    </>
  );
}
