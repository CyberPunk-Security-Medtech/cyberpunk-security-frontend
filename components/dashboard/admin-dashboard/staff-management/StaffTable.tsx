export default function StaffTable() {
  const staff = [
    { initials: "BH", name: "Dr Tunde Adeola", id: "SMC-04000B", role: "Doctor" },
    { initials: "BH", name: "Nurse Shola Opeyele", id: "SMC-04000B", role: "Nurse" },
    { initials: "BH", name: "Sci. Femi Davis", id: "SMC-04000B", role: "Lab Scientist" },
  ];

  return (
    <table className="w-full table-fixed text-sm">
      <thead>
        <tr className="bg-slate-50 text-xs font-medium text-slate-600">
          <th className="px-4 py-3 text-left w-[40%]">Staff Name</th>
          <th className="px-4 py-3 text-left w-[25%]">Staff ID</th>
          <th className="px-4 py-3 text-left w-[20%]">Role</th>
          <th className="px-4 py-3 text-right w-[15%]">Actions</th>
        </tr>
      </thead>
      <tbody>
        {staff.map((s, i) => (
          <tr key={s.name} className={`${i % 2 ? "bg-slate-50/50" : ""}`}>
            <td className="px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-semibold">
                {s.initials}
              </div>
              {s.name}
            </td>
            <td className="px-4 py-3">{s.id}</td>
            <td className="px-4 py-3">{s.role}</td>
            <td className="px-4 py-3 text-right">
              <button className="px-4 py-1 border rounded-full text-xs hover:bg-slate-50">
                Actions
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
