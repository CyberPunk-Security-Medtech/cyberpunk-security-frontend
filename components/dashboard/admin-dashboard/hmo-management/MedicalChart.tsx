"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", value: 4 },
  { month: "Feb", value: 6 },
  { month: "Mar", value: 11 },
  { month: "Apr", value: 9.5 },
  { month: "May", value: 3 },
  { month: "Jun", value: 4 },
  { month: "Jul", value: 5 },
  { month: "Aug", value: 6 },
  { month: "Sep", value: 4 },
  { month: "Oct", value: 3 },
  { month: "Nov", value: 3 },
  { month: "Dec", value: 4 },
];

export default function MedicalsChart() {
  return (
 <div>
 <div className="bg-white rounded-xl shadow-sm p-6 border">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-medium">Medicals</h2>
        <button className="border rounded-full px-4 py-1 text-xs hover:bg-gray-50">
          Year
        </button>
      </div>
       <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#0550EE"
              strokeWidth={3}
              dot={{ r: 5, stroke: "#0550EE", strokeWidth: 2, fill: "#fff" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      </div>
      </div>
  );
}
