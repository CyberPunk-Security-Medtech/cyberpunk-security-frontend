"use client";

interface PaymentsChartProps {
  payments: number;
  premium: number;
  claims: number;
}

export default function PaymentsChart({
  payments,
  premium,
  claims,
}: PaymentsChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border">
      <h3 className="text-sm font-medium mb-2">Payments</h3>

      <div className="flex items-center justify-between">
        <div className="w-[90px] h-[90px] rounded-full border flex items-center justify-center text-xs">
          {payments}
          <br /> Payments
        </div>

        <ul className="text-xs space-y-1">
          <li>Premium: {premium}</li>
          <li>Claims: {claims}</li>
        </ul>
      </div>
    </div>
  );
}
