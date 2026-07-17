"use client";

import { useRouter } from "next/navigation";
import Image from 'next/image'

export default function InviteSuccessPage() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center py-10 px-6">
          <div className="w-full max-w-3xl rounded-2xl bg-white px-5 py-10 text-center shadow-sm sm:px-10 sm:py-14">

            <Image
              src="/icons/staffOnboarding_successicon.svg" 
              alt="Success"
              width={208}
              height={208}
              className="mx-auto mb-6"
            />

            <h1 className="dashboard-page-title mb-2">
              Staff Invitation Link Sent Successfully!
            </h1>

            <p className="text-gray-500 mb-8">
              Staff Invitation Link successful and automatically added to dashboard...
              To learn more refer to dashboard.
            </p>

            <button
              onClick={() =>
                router.push("/dashboard/admin/staff-management")
              }
              className="w-full py-3 rounded-full bg-[#1A2380] text-white font-medium hover:opacity-90"
            >
              Go To Staff Management
            </button>
          </div>
    </div>
  );
}
