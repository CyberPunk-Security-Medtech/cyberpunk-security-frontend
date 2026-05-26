"use client";

interface ClaimsChartProps {
  pending: number;
  approved: number;
  rejected: number;
}

export default function ClaimsChart({
  pending,
  approved,
  rejected,
}: ClaimsChartProps) {
  const data = [
    { label: "Pending", value: pending },
    { label: "Approved", value: approved },
    { label: "Rejected", value: rejected },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium">Claims</h2>
        <button className="border rounded-full px-4 py-1 text-xs text-[#051466] hover:bg-slate-50">
          View Claims
        </button>
      </div>

      <div className="h-[260px] flex items-end justify-around">
        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className="w-4 rounded-full bg-[#051466]"
              style={{ height: `${item.value * 15}px` }}
            />
            <p className="text-xs mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 text-center mt-2">
        Total Claims: {pending + approved + rejected}
      </p>
    </div>
  );
}
