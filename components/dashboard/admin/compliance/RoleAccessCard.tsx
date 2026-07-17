export function RoleAccessCard() {
  type RoleAccessEntry = [role: string, users: string, permissions: string[]];

  const roles: RoleAccessEntry[] = [
    ["Admin", "2 active users", ["Full Access", "User Management", "Audit Logs"]],
    ["Senior Physician", "8 active users", ["Reports", "Patient Records", "Lab Results"]],
  ];

  return (
    <div className="mt-6 space-y-6 rounded-xl border bg-white p-4 sm:p-5">
      {roles.map(([role, users, permissions], i) => (
        <div key={i} className="border-b last:border-none pb-5">
          <p className="font-semibold">{role}</p>
          <p className="text-xs text-slate-500">{users}</p>

          <div className="flex gap-2 flex-wrap mt-3">
            {permissions.map((p) => (
              <span key={p} className="px-3 py-1 rounded-full bg-slate-100 text-xs">
                {p}
              </span>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 rounded-full text-sm bg-[#EFEFFF] text-[#0808B5] hover:bg-[#e3e3ff]">
              Edit Permissions
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
