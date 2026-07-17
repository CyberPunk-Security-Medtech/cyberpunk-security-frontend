"use client";

import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";
import { useRouter } from "next/navigation";

const statusStyles: Record<string, string> = {
  Approved: "bg-green-100 text-green-700",
  Restricted: "bg-yellow-100 text-yellow-700",
  Received: "bg-blue-100 text-blue-700",
};

const hmos = [
  { id: 2879, name: "Verve HMO", providers: 10, date: "10/10/2020", status: "Received" },
  { id: 2879, name: "Avon HMO", providers: 25, date: "10/10/2020", status: "Received" },
];

export default function HMOTable() {
  const router = useRouter();

  return (
    <ResponsiveTableRegion label="HMO providers">
      <table className="w-full min-w-[880px] text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th scope="col" className="min-w-[130px] bg-slate-100 px-4 py-3 text-left">Patient ID</th>
            <th scope="col" className="min-w-[180px] px-4 py-3 text-left">HMO&apos;s Name</th>
            <th scope="col" className="min-w-[210px] px-4 py-3 text-left">No. of Health Providers</th>
            <th scope="col" className="min-w-[170px] px-4 py-3 text-left">Date Registered</th>
            <th scope="col" className="min-w-[130px] px-4 py-3 text-left">Status</th>
            <th scope="col" className="min-w-[72px] px-4 py-3 text-right"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>

        <tbody>
          {hmos.map((hmo, index) => (
            <tr
              key={`${hmo.name}-${index}`}
              onClick={() => router.push("/dashboard/admin/hmo-management/view-hmo")}
              className="group cursor-pointer border-t bg-white hover:bg-slate-50"
            >
              <td className="bg-white px-4 py-3 group-hover:bg-slate-50">{hmo.id}</td>
              <td className="px-4 py-3">{hmo.name}</td>
              <td className="px-4 py-3">{hmo.providers}</td>
              <td className="whitespace-nowrap px-4 py-3">{hmo.date}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[hmo.status]}`}>
                  {hmo.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right" onClick={(event) => event.stopPropagation()}>
                <button
                  type="button"
                  aria-label={`Open actions for ${hmo.name}`}
                  className="dashboard-button min-h-10 min-w-10 rounded-lg p-2 hover:bg-slate-100"
                >
                  <span aria-hidden="true">⋮</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ResponsiveTableRegion>
  );
}
