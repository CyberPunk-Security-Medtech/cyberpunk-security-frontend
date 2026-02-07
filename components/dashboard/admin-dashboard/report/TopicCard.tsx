
function TopicCard({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: number; color: string }[];
}) {
  return (
    <div className="p-5 bg-white rounded-2xl shadow-sm">
      <h3 className="mb-4 font-medium">{title}</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span>{item.label}</span>
              <span>{item.value}% Correct</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full">
              <div
                className={`h-full ${item.color} rounded-full`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default TopicCard;