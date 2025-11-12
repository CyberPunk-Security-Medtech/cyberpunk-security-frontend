const data = [
  { title: "Patients under care", value: 12 },
  { title: "Appointments today", value: 6 },
  { title: "Pending lab results", value: 3 },
];

export default function OverviewCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {data.map((card, i) => (
        <div
          key={i}
          className="bg-white shadow-sm rounded-lg p-6 border hover:shadow-md transition"
        >
          <div className="text-sm text-gray-500 mb-2">{card.title}</div>
          <div className="text-2xl font-semibold text-[#1A2380]">{card.value}</div>
        </div>
      ))}
    </div>
  );
}
