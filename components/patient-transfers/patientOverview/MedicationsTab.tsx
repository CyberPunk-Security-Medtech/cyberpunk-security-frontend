"use client";

import { MedicationStatusBadge } from "./Badges";
import { medications } from "./PatientTransferData";


export default function MedicationsTab() {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-8 shadow-md">
      <h2 className="mb-8 text-3xl font-medium text-black">Medications</h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px]">
          <thead>
            <tr className="border-b border-gray-300 text-left text-xl font-semibold text-black">
              <th className="px-12 py-5">Medication</th>
              <th className="px-8 py-5">Dosage</th>
              <th className="px-8 py-5">Qty</th>
              <th className="px-8 py-5">Prescribed By</th>
              <th className="px-8 py-5">Date/Time</th>
              <th className="px-8 py-5">Status</th>
            </tr>
          </thead>

          <tbody>
            {medications.map((item, index) => (
              <tr key={`${item.medication}-${index}`} className="border-b border-gray-300">
                <td className="px-12 py-10 text-lg text-black">{item.medication}</td>
                <td className="px-8 py-10 text-lg text-black">{item.dosage}</td>
                <td className="px-8 py-10 text-lg text-black">{item.qty}</td>
                <td className="px-8 py-10 text-lg text-black">{item.prescribedBy}</td>
                <td className="px-8 py-10 text-lg text-black">{item.dateTime}</td>
                <td className="px-8 py-10">
                  <MedicationStatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}