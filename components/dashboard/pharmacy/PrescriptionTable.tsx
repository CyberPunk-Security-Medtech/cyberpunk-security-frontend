"use client";

import React from "react";

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
    <div className="overflow-x-auto">

      <table className="w-full text-sm">

        <thead>
          <tr className="border-b text-left text-[#737791]">
            <th className="px-4 py-3">
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
                  colSpan={6}
                  className="
                  py-10
                  text-center
                  text-gray-400
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


    </div>
  );
}