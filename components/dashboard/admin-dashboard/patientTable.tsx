export default function PatientTable() {
  const patients = [
    { initials: "AT", name: "Ateeg Rafiq", id: "SMC001", age: "28 / Male", hospital: "St Mary Hospital", status: "active", date: "1/15/2025" },
    { initials: "MC", name: "Michael Chen", id: "SMC002", age: "45 / Male", hospital: "Heirs Specialist", status: "follow-up", date: "1/15/2025" },
    { initials: "EW", name: "Emma Wilson", id: "SMC003", age: "28 / Female", hospital: "Lorem Ipsum", status: "active", date: "1/15/2025" },
    { initials: "JB", name: "James Brown", id: "SMC004", age: "52 / Male", hospital: "Lorem Ipsum", status: "follow-up", date: "1/15/2025" },
  ];

  return (
    <section className="bg-white rounded-2xl shadow-sm border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-6 text-sm">
          <button className="font-semibold text-[#051466] border-b-2 border-[#051466] pb-1">
            Patient Records
          </button>
          <button className="text-slate-400 pb-1">Appointments</button>
        </div>

        <button className="text-xs border rounded-full px-3 py-1 flex items-center gap-1 hover:bg-slate-50">
          Advanced Filters
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-400 border-b">
              <th className="py-2">Patient Name</th>
              <th className="py-2">ID</th>
              <th className="py-2">Age/Gender</th>
              <th className="py-2">Hospital</th>
              <th className="py-2">Status</th>
              <th className="py-2">Date</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((p, i) => (
              <tr key={p.id} className={i % 2 ? "bg-slate-50/50 border-b" : "border-b"}>
                <td className="py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-semibold">
                    {p.initials}
                  </div>
                  <span>{p.name}</span>
                </td>
                <td>{p.id}</td>
                <td>{p.age}</td>
                <td>{p.hospital}</td>
                <td>
                  <span
                    className={
                      "rounded-full px-3 py-1 text-[11px] capitalize " +
                      (p.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700")
                    }
                  >
                    {p.status}
                  </span>
                </td>
                <td>{p.date}</td>
                <td className="text-right space-x-2 text-xs">
                  <button className="hover:text-slate-700">View</button>
                  <button className="hover:text-slate-700">Edit</button>
                  <button className="hover:text-slate-700">•••</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
