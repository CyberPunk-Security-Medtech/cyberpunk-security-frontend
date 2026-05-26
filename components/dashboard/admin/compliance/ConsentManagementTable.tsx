export function ConsentManagementTable() {
  return (
    <table className="w-full text-sm mt-6">
      <thead className="bg-gray-50 text-slate-500">
        <tr>
          <th className="p-4 text-left">Patient</th>
          <th className="p-4 text-left">Action</th>
          <th className="p-4 text-left">Hospital/Entity</th>
          <th className="p-4 text-left">Duration</th>
          <th className="p-4 text-left">Timestamp</th>
          <th className="p-4 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {[
          ["John Doe", "Granted data sharing consent", "General Hospital B", "48 hours", "2024-01-15 14:30:22", "active"],
          ["John Doe", "Revoked emergency access", "Emergency Center", "N/A", "2024-01-15 14:30:22", "revoked"],
          ["John Doe", "Extended sharing consent", "Specialist Clinic", "72 hours", "2024-01-15 14:30:22", "active"],
        ].map(([patient, action, entity, duration, time, status], i) => (
          <tr key={i} className="border-t hover:bg-gray-50">
            <td className="p-4">{patient}</td>
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
  );
}
