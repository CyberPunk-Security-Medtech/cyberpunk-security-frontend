function MiniStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-5 bg-white rounded-2xl shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="mt-2 text-xl font-semibold text-blue-600">
        {value}
      </h2>
      <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full w-3/4 bg-blue-500 rounded-full" />
      </div>
    </div>
  );
}
export default MiniStat;