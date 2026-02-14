function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-5 bg-white rounded-2xl shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="mt-2 text-2xl font-semibold">{value}</h2>
    </div>
  );
}

export default StatCard;