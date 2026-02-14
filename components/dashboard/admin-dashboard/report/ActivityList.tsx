
function ActivityList({ title }: { title: string }) {
  const users = [
    { name: "Jesse Thomas", role: "Doctor", active: "98%", up: true },
    { name: "Thisal Mathiyazhagan", role: "Nurse", active: "19%", up: false },
    { name: "Helen Chuang", role: "Doctor", active: "88%", up: true },
  ];

  return (
    <div className="p-5 bg-white rounded-2xl shadow-sm">
      <h3 className="mb-4 font-medium">{title}</h3>
      <div className="space-y-4">
        {users.map((u, i) => (
          <div key={i} className="flex justify-between items-center">
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-xs text-slate-500">
                {u.active} Active / {u.role}
              </p>
            </div>
            <span className={u.up ? "text-green-500" : "text-red-500"}>
              {u.up ? "▲" : "▼"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ActivityList