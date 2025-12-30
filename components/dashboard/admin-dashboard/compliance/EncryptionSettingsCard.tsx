export default function EncryptionSettingsCard() {
  return (
    <div className="bg-white rounded-xl border p-6 flex-1">
      <h3 className="font-semibold text-lg mb-4">Encryption Settings</h3>

      {[
        ["Patient Records Encryption", "AES-256 field-level encryption"],
        ["Database Encryption", "TDE with automated key rotation"],
        ["Transport Layer Security", "TLS 1.3 for all communication"],
        ["Patient Records Encryption", "AES-256 field-level encryption"],
      ].map(([title, desc]) => (
        <div key={title} className="flex justify-between items-center py-3 border-b last:border-none">
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-slate-500">{desc}</p>
          </div>
          <span className="px-3 py-1 text-xs font-medium text-emerald-600 border border-emerald-400 rounded-full">
            Active
          </span>
        </div>
      ))}
    </div>
  );
}
