"use client";

interface ReferralsChartProps {
  total: number;
  approved: number;
  pending: number;
}

export default function ReferralsChart({
  total,
  approved,
  pending,
}: ReferralsChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border">
      <h3 className="text-sm font-medium mb-2">Referrals</h3>

      <div className="flex items-center justify-between">
        <div className="w-[90px] h-[90px] rounded-full border flex items-center justify-center text-xs">
          {total}
          <br /> Referrals
        </div>

        <ul className="text-xs space-y-1">
          <li className="text-blue-600">Approved: {approved}</li>
          <li className="text-red-600">Pending: {pending}</li>
        </ul>
      </div>
    </div>
  );
}
