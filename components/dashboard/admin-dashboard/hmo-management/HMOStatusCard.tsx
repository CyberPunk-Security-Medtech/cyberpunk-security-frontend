"use client";

interface HMOStatusCardProps {
  status: "Active" | "Restricted" | "Suspended";
}

export default function HMOStatusCard({ status }: HMOStatusCardProps) {
  const colorMap = {
    Active: "bg-green-100 text-green-600",
    Restricted: "bg-yellow-100 text-yellow-600",
    Suspended: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border flex items-center justify-center">
      <div className="text-center">
        <p className="text-sm mb-2">HMO's Status</p>
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center font-medium ${colorMap[status]}`}
        >
          {status}
        </div>
      </div>
    </div>
  );
}
