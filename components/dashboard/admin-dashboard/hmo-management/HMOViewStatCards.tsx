"use client";

import { Building2, Users } from "lucide-react";

export default function HMOViewStatsCards() {
  const stats = [
    { value: "260", label: "Health Providers", icon: <Building2 size={22} className="text-green-500" /> },
    { value: "12000", label: "Patients", icon: <Users size={22} className="text-yellow-500" /> },
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      {stats.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-6"
        >
          <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-full mb-3">
            {item.icon}
          </div>
          <p className="text-2xl font-semibold">{item.value}</p>
          <p className="text-sm text-gray-500">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
