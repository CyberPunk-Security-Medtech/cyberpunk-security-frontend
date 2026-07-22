"use client";

import React from "react";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";

interface Prescription {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route?: string;
  status?: string;
  created_at?: string;
  patient?: {
    first_name: string;
    last_name: string;
  };
  patient_name?: string;
}

interface Props {
  prescriptions: Prescription[];
  onDispense?: (prescriptionId: string) => void;
  onCorrectDispense?: (prescriptionId: string) => void;
  dispensingId?: string | null;
}

export default function PrescriptionTable({
  prescriptions,
  onDispense,
  onCorrectDispense,
  dispensingId,
}: Props) {
  const isDispensed = (status?: string) => ["dispensed", "completed"].includes(status?.toLowerCase() ?? "");
  return (
    <ResponsiveTableRegion label="Patient prescriptions">

      <table className="w-full min-w-[940px] text-sm">

        <thead>
          <tr className="border-b text-left text-[#596174]">
            <th scope="col" className="min-w-[180px] bg-white px-4 py-3">
Patient
</th>

            <th className="px-4 py-3">
              Medication
            </th>

            <th className="px-4 py-3">
              Dosage
            </th>

            <th className="px-4 py-3">
              Frequency
            </th>

            <th className="px-4 py-3">
              Duration
            </th>

            <th className="px-4 py-3">
              Route
            </th>

            <th className="px-4 py-3">
              Status
            </th>

            <th className="px-4 py-3">
              Date
            </th>

            <th className="px-4 py-3 text-right">
              Action
            </th>
          </tr>
        </thead>


        <tbody>

          {
            prescriptions.length === 0 ? (

              <tr>
                <td
                  colSpan={9}
                  className="
                  py-10
                  text-center
                  text-gray-600
                  "
                >
                  No prescriptions found
                </td>
              </tr>


            ) : (


              prescriptions.map((item)=>(
                
                <tr
                  key={item.id}
                  className="
                  border-b
                  hover:bg-gray-50
                  "
                >

                   <td className="px-4 py-3">
  {`${item.patient?.first_name ?? ''} ${item.patient?.last_name ?? ''}`.trim() || item.patient_name || '-'}
</td>



                  <td className="px-4 py-3 font-medium">
                    {item.medication_name}
                  </td>


                  <td className="px-4 py-3">
                    {item.dosage}
                  </td>


                  <td className="px-4 py-3">
                    {item.frequency}
                  </td>


                  <td className="px-4 py-3">
                    {item.duration}
                  </td>


                  <td className="px-4 py-3">
                    {item.route ?? "-"}
                  </td>

                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-[#F3F4F6] px-2 py-1 text-[11px] font-semibold text-[#374151]">
                      {item.status ?? "Unknown"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {
                      item.created_at
                      ?
                      new Date(
                        item.created_at
                      ).toLocaleDateString()
                      :
                      "-"
                    }
                  </td>

                  <td className="px-4 py-3 text-right">
                    {isDispensed(item.status) && onCorrectDispense ? (
                      <button type="button" className="rounded-full border border-[#D1D5DB] bg-white px-3 py-1 text-xs font-medium text-[#1F2937] hover:bg-[#F9FAFB]" onClick={() => onCorrectDispense(item.id)}>Correct dispense</button>
                    ) : onDispense && (
                      <button
                        type="button"
                        className="rounded-full border border-[#D1D5DB] bg-white px-3 py-1 text-xs font-medium text-[#1F2937] transition hover:bg-[#F9FAFB]"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDispense(item.id);
                        }}
                        disabled={isDispensed(item.status) || dispensingId === item.id}
                      >
                        {dispensingId === item.id ? "Dispensing..." : isDispensed(item.status) ? "Dispensed" : "Dispense"}
                      </button>
                    )}
                  </td>
                </tr>

              ))

            )
          }


        </tbody>

      </table>


    </ResponsiveTableRegion>
  );
}
