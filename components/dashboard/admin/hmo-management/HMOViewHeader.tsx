"use client";

import { useRouter } from "next/navigation";

export default function HMOViewHeader() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="dashboard-page-title">HMO’s Management</h1>
        <p className="text-sm text-gray-500">
          HMOS <span className="mx-1">›</span> Verve HMO
        </p>
      </div>

      <button
        onClick={() => router.push("/dashboard/admin")}
        className="inline-flex items-center justify-center px-5 h-10 rounded-full border border-gray-300 text-sm hover:bg-gray-50"
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}
