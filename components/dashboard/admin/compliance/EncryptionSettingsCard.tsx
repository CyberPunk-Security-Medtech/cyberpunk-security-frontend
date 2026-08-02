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
    {
      id: "patient-records-backup",
      title: "Patient Records Encryption",
      desc: "AES-256 field-level encryption",
    },
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5" aria-labelledby="encryption-settings-title">
      <h2 id="encryption-settings-title" className="text-lg font-medium text-slate-900">
        Encryption Settings
      </h2>

      {encryptionItems.map((item) => (
        <div key={item.id} className="flex items-start justify-between gap-4 py-3.5 sm:items-center">
          <div>
            <p className="text-sm font-medium">{item.title}</p>
            <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
          </div>
          <span className="min-w-16 rounded-full border border-teal-400 px-3 py-0.5 text-center text-xs font-medium text-[#00796F]">
            Active
          </span>
        </div>
      ))}
    </section>
  );
}
