import { useRouter } from "next/navigation";

export default function StaffActions() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 xs:flex-row xs:flex-wrap xs:justify-end">
      <button
        onClick={() => router.push("/dashboard/admin/staff-management/StaffOnboarding")}
        className="dashboard-button min-h-11 bg-[#051466] px-6 text-white hover:bg-[#020b44] sm:min-h-10"
      >
        + Add Staff
      </button>

      <button
        onClick={() => router.push("/dashboard/admin")}
        className="dashboard-button min-h-11 border border-[#051466] px-6 text-[#051466] hover:bg-slate-50 sm:min-h-10"
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}
