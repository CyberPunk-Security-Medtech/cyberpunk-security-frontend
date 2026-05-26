"use client";

import Sidebar from "@components/dashboard/admin/Sidebar";
import Header from "@components/Header";
import { useRouter } from "next/navigation";
import Image from 'next/image'

export default function InviteSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <Header />

        <div className="flex justify-center items-center py-10 px-6">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm px-10 py-14 text-center">

            <Image
              src="/icons/staffOnboarding_successicon.svg" 
              alt="Success"
              width={208}
              height={208}
              className="mx-auto mb-6"
            />

            <h1 className="text-2xl font-semibold mb-2">
              Staff Invitation Link Sent Successfully!
            </h1>

            <p className="text-gray-500 mb-8">
              Staff Invitation Link successful and automatically added to dashboard...
              To learn more refer to dashboard.
            </p>

            <button
              onClick={() =>
                router.push("/dashboard/admin-dashboard/staff-management")
              }
              className="w-full py-3 rounded-full bg-[#1A2380] text-white font-medium hover:opacity-90"
            >
              Go To Staff Management
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
