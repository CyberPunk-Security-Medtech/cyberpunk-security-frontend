// 'use client'

// const patients = [
//   { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 32, gender: 'Male', condition: 'Diabetes Type 2', status: 'Active', date: 'Oct-30-2025' },
//   { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 56, gender: 'Female', condition: 'Hypertension', status: 'Discharged', date: 'Oct-30-2025' },
//   { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 32, gender: 'Female', condition: 'Tuberculosis (TB)', status: 'Pending', date: 'Oct-30-2025' },
//   { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 56, gender: 'Female', condition: 'Hepatitis', status: 'Active', date: 'Oct-30-2025' },
//   { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 56, gender: 'Male', condition: 'Dehydration', status: 'Active', date: 'Oct-30-2025' },
//   { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 56, gender: 'Male', condition: 'Infertility', status: 'Discharged', date: 'Oct-30-2025' },
// ]

// export default function PatientTable() {
//   return (
//     <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 overflow-x-auto">
//       <table className="w-full text-sm text-left border-collapse">
//         <thead className="text-gray-600 border-b bg-gray-50">
//           <tr>
//             <th className="py-3 px-4 font-medium">Patient Name</th>
//             <th className="py-3 px-4 font-medium">Patient ID</th>
//             <th className="py-3 px-4 font-medium">Age</th>
//             <th className="py-3 px-4 font-medium">Gender</th>
//             <th className="py-3 px-4 font-medium">Condition</th>
//             <th className="py-3 px-4 font-medium">Status</th>
//             <th className="py-3 px-4 font-medium">Last Visit</th>
//             <th></th>
//           </tr>
//         </thead>
//         <tbody>
//           {patients.map((p) => (
//             <tr
//               key={p.name + p.id + p.condition}
//               className="border-b hover:bg-gray-50 cursor-pointer"
//               onClick={() => (window.location.href = `/dashboard/doctor-dashboard/patient/${p.id}`)}
//             >
//               <td className="py-3 px-4 flex items-center gap-3 font-medium text-[#1A2380]">
//                 <div className="h-8 w-8 rounded-full bg-[#E6F8F7] text-[#00B8A8] flex items-center justify-center font-semibold text-xs">
//                   {p.initials}
//                 </div>
//                 {p.name}
//               </td>
//               <td className="px-4">{p.id}</td>
//               <td className="px-4">{p.age}</td>
//               <td className="px-4">{p.gender}</td>
//               <td className="px-4">{p.condition}</td>
//               <td className="px-4">
//                 <span
//                   className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
//                     p.status === 'Active'
//                       ? 'text-[#00B8A8] bg-[#E6F8F7] border-[#A8E9E3]'
//                       : p.status === 'Pending'
//                       ? 'text-[#E0A500] bg-[#FFF7E6] border-[#F7D799]'
//                       : 'text-[#6B7280] bg-[#F3F4F6] border-[#E5E7EB]'
//                   }`}
//                 >
//                   {p.status}
//                 </span>
//               </td>
//               <td className="px-4 text-gray-500">{p.date}</td>
//               <td className="px-4 text-right text-gray-400">⋯</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
//         <span>Showing 1–6 from 15</span>
//         <div className="flex items-center gap-2">
//           <button className="p-1.5 rounded border border-gray-200 hover:bg-gray-100">‹</button>
//           <span className="px-3 py-1.5 rounded bg-[#1A2380] text-white">1</span>
//           <span className="px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer">2</span>
//           <button className="p-1.5 rounded border border-gray-200 hover:bg-gray-100">›</button>
//         </div>
//       </div>
//     </div>
//   )
// }


'use client'

import { useEffect, useState } from "react";
import { PatientService } from "@services/api";

interface Patient {
  id: string;
  initials: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  status: string;
  date: string;
}

export default function PatientTable() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);

      try {
        // Get active workspace from localStorage
        const activeWorkspaceStr = localStorage.getItem("activeWorkspace");
        if (!activeWorkspaceStr) return console.error("No active workspace found");

        const activeworkspace = JSON.parse(activeWorkspaceStr);
        const orgId = activeworkspace.id;

        // Fetch patients from API
        const res = await PatientService.getPatients(orgId);
        const data = Array.isArray(res.data) ? res.data : [];

        // Map the patients to match your table structure
        const mappedPatients = data.map((p: any) => ({
          id: p.id,
          initials: p.first_name[0] + p.last_name[0],
          name: `${p.first_name} ${p.last_name}`,
          age: p.age || "-", 
          gender: p.gender,
          condition: p.symptoms || "N/A",
          status: p.status || "Active",
          date: new Date(p.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
        }));

        setPatients(mappedPatients);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <p className="p-4 text-gray-500">Loading patients...</p>;
  if (!loading && patients.length === 0) return <p className="p-4 text-gray-500">No patients found.</p>;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="text-gray-600 border-b bg-gray-50">
          <tr>
            <th className="py-3 px-4 font-medium">Patient Name</th>
            <th className="py-3 px-4 font-medium">Patient ID</th>
            <th className="py-3 px-4 font-medium">Age</th>
            <th className="py-3 px-4 font-medium">Gender</th>
            <th className="py-3 px-4 font-medium">Condition</th>
            <th className="py-3 px-4 font-medium">Status</th>
            <th className="py-3 px-4 font-medium">Last Visit</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr
              key={p.id}
              className="border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => (window.location.href = `/dashboard/doctor-dashboard/patient/${p.id}`)}
            >
              <td className="py-3 px-4 flex items-center gap-3 font-medium text-[#1A2380]">
                <div className="h-8 w-8 rounded-full bg-[#E6F8F7] text-[#00B8A8] flex items-center justify-center font-semibold text-xs">
                  {p.initials}
                </div>
                {p.name}
              </td>
              <td className="px-4">{p.id}</td>
              <td className="px-4">{p.age}</td>
              <td className="px-4">{p.gender}</td>
              <td className="px-4">{p.condition}</td>
              <td className="px-4">
                <span
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
                    p.status === 'Active'
                      ? 'text-[#00B8A8] bg-[#E6F8F7] border-[#A8E9E3]'
                      : p.status === 'Pending'
                      ? 'text-[#E0A500] bg-[#FFF7E6] border-[#F7D799]'
                      : 'text-[#6B7280] bg-[#F3F4F6] border-[#E5E7EB]'
                  }`}
                >
                  {p.status}
                </span>
              </td>
              <td className="px-4 text-gray-500">{p.date}</td>
              <td className="px-4 text-right text-gray-400">⋯</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}