export default function EncryptionSettingsCard() {
  const encryptionItems = [
    {
      id: "patient-records",
      title: "Patient Records Encryption",
      desc: "AES-256 field-level encryption",
    },
    {
      id: "database",
      title: "Database Encryption",
      desc: "TDE with automated key rotation",
    },
    {
      id: "transport",
      title: "Transport Layer Security",
      desc: "TLS 1.3 for all communication",
    },
  ];

  return (
    <div className="bg-white rounded-xl border p-6 flex-1">
      <h3 className="font-semibold text-lg mb-4">Encryption Settings</h3>

      {encryptionItems.map((item) => (
        <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-none">
          <div>
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-xs text-slate-500">{item.desc}</p>
          </div>
          <span className="px-3 py-1 text-xs font-medium text-emerald-600 border border-emerald-400 rounded-full">
            Active
          </span>
        </div>
      ))}
    </div>
  );
}
