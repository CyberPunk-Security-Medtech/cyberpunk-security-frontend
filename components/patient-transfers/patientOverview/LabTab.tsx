"use client";

import { LabStatusBadge } from "./Badges";
import { labResults } from "./PatientTransferData";


export default function LabsTab() {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-8 shadow-md">
      <h2 className="mb-8 text-3xl font-medium text-black">Laboratory Results</h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead>
            <tr className="bg-[#F5F5F5] text-left text-sm text-gray-500">
              <th className="px-5 py-4">Test Parameter</th>
              <th className="px-5 py-4">Result</th>
              <th className="px-5 py-4">Unit</th>
              <th className="px-5 py-4">Reference Range</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {labResults.map((item, index) => (
              <tr key={`${item.parameter}-${index}`} className="border-b border-gray-200">
                <td className="px-5 py-5 text-black">{item.parameter}</td>
                <td className="px-5 py-5 text-black">{item.result}</td>
                <td className="px-5 py-5 text-black">{item.unit}</td>
                <td className="px-5 py-5 text-black">{item.range}</td>
                <td className="px-5 py-5">
                  <LabStatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}