export default function RecentActivity() {
  const activity = [
    { title: "Lab results uploaded", time: "2 minutes ago" },
    { title: "Appointment cancelled", time: "15 minutes ago" },
    { title: "New patient registered", time: "1 hour ago" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-4">
      <p className="text-xs font-semibold text-emerald-600 mb-1">Recent Activity</p>
      <p className="text-xs text-slate-500 mb-4">Latest updates</p>

      <div className="space-y-3 text-sm">
        {activity.map((item) => (
          <div key={item.title} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-500" />
            <div>
              <p className="text-slate-800">{item.title}</p>
              <p className="text-[11px] text-slate-500">{item.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <button className="text-xs border rounded-full px-3 py-1 hover:bg-slate-50">
          View all
        </button>
      </div>
    </div>
  );
}
