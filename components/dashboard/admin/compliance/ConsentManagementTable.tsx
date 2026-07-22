import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";

export function ConsentManagementTable() {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border bg-white">
    <ResponsiveTableRegion label="Consent management records">
    <table className="w-full min-w-[980px] text-sm">
      <thead className="bg-gray-50 text-slate-500">
        <tr>
          <th scope="col" className="min-w-[170px] bg-gray-50 p-4 text-left">Patient</th>
          <th scope="col" className="min-w-[220px] p-4 text-left">Action</th>
          <th scope="col" className="min-w-[190px] p-4 text-left">Hospital/Entity</th>
          <th scope="col" className="min-w-[120px] p-4 text-left">Duration</th>
          <th scope="col" className="min-w-[200px] p-4 text-left">Timestamp</th>
          <th scope="col" className="min-w-[120px] p-4 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {[
          ["John Doe", "Granted data sharing consent", "General Hospital B", "48 hours", "2024-01-15 14:30:22", "active"],
          ["John Doe", "Revoked emergency access", "Emergency Center", "N/A", "2024-01-15 14:30:22", "revoked"],
          ["John Doe", "Extended sharing consent", "Specialist Clinic", "72 hours", "2024-01-15 14:30:22", "active"],
        ].map(([patient, action, entity, duration, time, status], i) => (
          <tr key={i} className="group border-t bg-white hover:bg-gray-50">
            <td className="bg-white p-4 group-hover:bg-gray-50">{patient}</td>
            <td className="p-4">{action}</td>
            <td className="p-4">{entity}</td>
            <td className="p-4">{duration}</td>
            <td className="p-4">{time}</td>
            <td className="p-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                }`}
              >
                {status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </ResponsiveTableRegion>
    </div>
  );
}
