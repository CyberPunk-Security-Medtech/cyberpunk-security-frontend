"use client";

import React from "react";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";

interface Prescription {

id:string;

medication_name:string;

dosage:string;

frequency:string;

duration:string;

route?:string;

created_at?:string;

patient?:{
 first_name:string;
 last_name:string;
}

}

interface Props {
  prescriptions: Prescription[];
}

export default function PrescriptionTable({
  prescriptions,
}: Props) {
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
              Date
            </th>

          </tr>
        </thead>


        <tbody>

          {
            prescriptions.length === 0 ? (

              <tr>

                <td
                  colSpan={7}
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

                   <td className="bg-white px-4 py-3">

{
item.patient
?
`${item.patient.first_name} ${item.patient.last_name}`
:
"-"
}


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


                </tr>

              ))

            )
          }


        </tbody>

      </table>


    </ResponsiveTableRegion>
  );
}
