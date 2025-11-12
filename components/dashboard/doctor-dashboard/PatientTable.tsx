// 'use client'
// const patients=[
// {name:'Brandon Herwitz', id:'SMC-04000B', age:32, gender:'Male'},
// {name:'Brandon Herwitz', id:'SMC-04000B', age:56, gender:'Female'},
// {name:'Brandon Herwitz', id:'SMC-04000B', age:32, gender:'Female'},
// {name:'Brandon Herwitz', id:'SMC-04000B', age:56, gender:'Female'},
// ]
// export default function PatientTable(){
// return(
// <div className="bg-white rounded-lg border shadow-sm p-6">
// <div className="overflow-x-auto">
// <table className="w-full text-sm text-left border-collapse">
// <thead className="text-gray-600 border-b">
// <tr>
// <th className="pb-3 font-medium">Patient Name</th>
// <th className="pb-3 font-medium">Patient ID</th>
// <th className="pb-3 font-medium">Age</th>
// <th className="pb-3 font-medium">Gender</th>
// </tr>
// </thead>
// <tbody>
// {patients.map((p)=> (
// <tr key={p.name+p.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={()=>{window.location.href=`/dashboard/doctor-dashboard/patient/${p.id}`}}>
// <td className="py-3 font-medium text-brand-navy">{p.name}</td>
// <td>{p.id}</td>
// <td>{p.age}</td>
// <td>{p.gender}</td>
// </tr>
// ))}
// </tbody>
// </table>
// </div>
// </div>
// )
// }



'use client'

const patients = [
  { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 32, gender: 'Male', condition: 'Diabetes Type 2', status: 'Active', date: 'Oct-30-2025' },
  { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 56, gender: 'Female', condition: 'Hypertension', status: 'Discharged', date: 'Oct-30-2025' },
  { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 32, gender: 'Female', condition: 'Tuberculosis (TB)', status: 'Pending', date: 'Oct-30-2025' },
  { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 56, gender: 'Female', condition: 'Hepatitis', status: 'Active', date: 'Oct-30-2025' },
  { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 56, gender: 'Male', condition: 'Dehydration', status: 'Active', date: 'Oct-30-2025' },
  { initials: 'BH', name: 'Brandon Herwitz', id: 'SMC-04000B', age: 56, gender: 'Male', condition: 'Infertility', status: 'Discharged', date: 'Oct-30-2025' },
]

export default function PatientTable() {
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
              key={p.name + p.id + p.condition}
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

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
        <span>Showing 1–6 from 15</span>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded border border-gray-200 hover:bg-gray-100">‹</button>
          <span className="px-3 py-1.5 rounded bg-[#1A2380] text-white">1</span>
          <span className="px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer">2</span>
          <button className="p-1.5 rounded border border-gray-200 hover:bg-gray-100">›</button>
        </div>
      </div>
    </div>
  )
}
