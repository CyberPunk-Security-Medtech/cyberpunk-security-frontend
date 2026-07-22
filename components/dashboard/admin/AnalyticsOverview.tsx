export default function AnalyticsOverview() {
  return (
    <section className="bg-white rounded-2xl shadow-sm border p-5">
      <p className="text-xs font-medium text-emerald-600">Monthly Analytics Overview</p>
      <h2 className="text-lg font-semibold">Comprehensive insights for October 2025</h2>

      <div className="grid md:grid-cols-3 gap-6 mt-4 text-sm">
        <div>
          <p className="text-slate-500 text-xs">Patient Transfers</p>
          <p className="text-xl font-semibold">+18%</p>
          <p className="text-xs text-slate-500">+42 vs last month</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">Compliance Rate</p>
          <p className="text-xl font-semibold">99%</p>
          <p className="text-xs text-slate-500">Avg compliance</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">Patient Satisfaction</p>
          <p className="text-xl font-semibold">4.8 / 5</p>
          <p className="text-xs text-slate-500">Based on reviews</p>
        </div>
      </div>
    </section>
  );
}
