import { StatusBadge } from "@components/StatusBadge";


const appointments = [
  { name: "Brandon Herwitz", id: "SMC-04000B", age: 32, gender: "Male", condition: "Diabetes Type 2", status: "Active", date: "Oct-30-2025" },
  { name: "Brandon Herwitz", id: "SMC-04000B", age: 56, gender: "Female", condition: "Hypertension", status: "Discharged", date: "Oct-30-2025" },
  { name: "Brandon Herwitz", id: "SMC-04000B", age: 32, gender: "Female", condition: "Tuberculosis (TB)", status: "Pending", date: "Oct-30-2025" },
];

export default function TodayAppointments() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="font-semibold text-[#1A2380] mb-6">Today's Appointments</h3>
      <table className="w-full text-sm text-left border-collapse">
        <thead className="text-gray-600 border-b">
          <tr>
            <th className="pb-3 font-medium">Patient Name</th>
            <th className="pb-3 font-medium">Patient ID</th>
            <th className="pb-3 font-medium">Age</th>
            <th className="pb-3 font-medium">Gender</th>
            <th className="pb-3 font-medium">Condition</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Last Visit</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="py-3 font-medium text-[#1A2380]">{a.name}</td>
              <td>{a.id}</td>
              <td>{a.age}</td>
              <td>{a.gender}</td>
              <td>{a.condition}</td>
              <td><StatusBadge status={a.status as any} /></td>
              <td>{a.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
