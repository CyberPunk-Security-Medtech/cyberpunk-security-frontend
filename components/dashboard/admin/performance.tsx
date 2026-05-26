export default function Performance() {
  const metrics = [
    { label: "Patient Satisfaction", value: "4.8/5.0", positive: true },
    { label: "Appointment Rate", value: "94%", positive: true },
    { label: "New Patients", value: "+18%", positive: true },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-4 flex flex-col justify-between">
      <div>
        <p className="text-xs font-semibold text-emerald-600">Performance</p>
        <p className="text-xs text-slate-500 mb-4">Monthly metrics</p>

        {metrics.map((item) => (
          <div key={item.label} className="flex justify-between text-xs mb-2">
            <span className="text-slate-500">{item.label}</span>
            <span className="font-medium text-slate-700">{item.value}</span>
          </div>
        ))}
      </div>

      <div>
        <button className="mt-2 text-xs bg-[#051466] text-white rounded-full px-3 py-1 hover:bg-[#020b44]">
          View Analytics
        </button>
      </div>
    </div>
  );
}
