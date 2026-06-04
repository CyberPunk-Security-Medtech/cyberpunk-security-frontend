"use client";

import { useRouter } from "next/navigation";

const statusStyles: Record<string, string> = {
  Approved: "bg-green-100 text-green-600",
  Restricted: "bg-yellow-100 text-yellow-600",
  Received: "bg-blue-100 text-blue-600",
};

export default function HMOTable() {
  const router = useRouter();

  const data = [
    { id: 2879, name: "Verve HMO", providers: 10, date: "10/10/2020", status: "Received" },
    { id: 2879, name: "Avon HMO", providers: 25, date: "10/10/2020", status: "Received" },
  ];

  const handleRowClick = (id: number) => {
    router.push("/dashboard/admin/hmo-management/view-hmo"); 
  };

  return (
    <table className="w-full text-sm">
      <thead className="bg-slate-100 text-slate-600">
        <tr>
          <th className="px-4 py-3 text-left">Patient ID</th>
          <th className="px-4 py-3 text-left">HMO's Name</th>
          <th className="px-4 py-3 text-left">No. of Health Providers</th>
          <th className="px-4 py-3 text-left">Date Registered</th>
          <th className="px-4 py-3 text-left">Status</th>
          <th className="px-4 py-3 text-right"></th>
        </tr>
      </thead>

      <tbody>
        {data.map((hmo, i) => (
          <tr
            key={i}
            onClick={() => handleRowClick(hmo.id)}
            className="border-t hover:bg-slate-50 cursor-pointer"
          >
            <td className="px-4 py-3">{hmo.id}</td>
            <td className="px-4 py-3">{hmo.name}</td>
            <td className="px-4 py-3">{hmo.providers}</td>
            <td className="px-4 py-3">{hmo.date}</td>

            <td className="px-4 py-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusStyles[hmo.status]
                }`}
              >
                {hmo.status}
              </span>
            </td>

            <td
              className="px-4 py-3 text-right"
              onClick={(e) => e.stopPropagation()} // prevents click from triggering row redirect
            >
              <button className="p-2 rounded-lg hover:bg-slate-100">⋮</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
