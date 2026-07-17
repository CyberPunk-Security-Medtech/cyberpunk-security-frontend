import React from "react";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";

export default function AuditLogsTable() {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border bg-white">
      <div className="px-4 py-3">
        <input
          type="text"
          placeholder="Search audit logs..."
          className="w-full rounded-full border px-4 py-2 text-sm focus:ring-2 focus:ring-[#1A2380]"
        />
      </div>

      <ResponsiveTableRegion label="Audit logs">
      <table className="w-full min-w-[920px] text-sm">
        <thead className="bg-gray-50 text-slate-500">
          <tr>
            <th scope="col" className="min-w-[210px] bg-gray-50 p-4 text-left">Staff Name</th>
            <th scope="col" className="min-w-[190px] p-4 text-left">Action</th>
            <th scope="col" className="min-w-[190px] p-4 text-left">Patients/Resources</th>
            <th scope="col" className="min-w-[200px] p-4 text-left">Timestamp</th>
            <th scope="col" className="min-w-[120px] p-4 text-left">Device</th>
          </tr>
        </thead>  
        <tbody>
          {[
            ["Dr Tunde Adeola", "Viewed Patient Record", "John Doe#1234", "2024-01-15 14:30:22", "Desktop"],
            ["Nurse Shola Opeyele", "Viewed Patient Record", "John Doe#1234", "2025-11-15 14:30:22", "Desktop"],
            ["Sci. Femi Davis", "Viewed Patient Record", "John Doe#1234", "2025-11-15 14:30:22", "Desktop"],
            ["Dr Segun Olawole", "Viewed Patient Record", "John Doe#1234", "2025-11-15 14:30:22", "Mobile"],
          ].map(([name, action, patient, time, device], i) => (
            <tr key={i} className="group border-t bg-white hover:bg-gray-50">
              <td className="flex items-center gap-3 bg-white p-4 group-hover:bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-[#E8F0FE] flex items-center justify-center font-semibold text-[#1A2380]">
                  {name.split(" ")[0].charAt(0)}
                  {name.split(" ")[1]?.charAt(0)}
                </div>
                {name}
              </td>
              <td className="p-4">{action}</td>
              <td className="p-4">{patient}</td>
              <td className="p-4">{time}</td>
              <td className="p-4 font-medium">{device}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </ResponsiveTableRegion>
    </div>
  );
}
