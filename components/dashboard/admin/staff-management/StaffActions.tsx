import { useRouter } from "next/navigation";

export default function StaffActions() {
  const router = useRouter();

  return (
    <div className="flex justify-end items-center gap-4">
      <button
        onClick={() => router.push("/dashboard/admin-dashboard/staff-management/StaffOnboarding")}
        className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-[#051466] text-white hover:bg-[#020b44] text-sm font-medium"
      >
        + Add Staff
      </button>

      <button
        onClick={() => router.push("/dashboard/admin-dashboard")}
        className="inline-flex items-center justify-center h-10 px-6 rounded-full border border-[#051466] text-[#051466] hover:bg-slate-50 text-sm font-medium"
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}
