"use client";

import HMOActions from "@components/dashboard/admin/hmo-management/HMOActions";
import HMOHeader from "@components/dashboard/admin/hmo-management/HMOHeader";
import HMOTable from "@components/dashboard/admin/hmo-management/HMOTable";
import Sidebar from "@components/dashboard/admin/Sidebar";
import Pagination from "@components/dashboard/admin/staff-management/Pagination";
import Header from "@components/Header";

import { useRouter } from "next/navigation";

export default function HMOManagementPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <Header />

        <div className="p-6 space-y-6">
          <HMOHeader />

          {/* Pass redirect logic */}
          <HMOActions onAdd={() => router.push("/dashboard/admin-dashboard/hmo-management/create-hmo")} />

         <div className="bg-white rounded-xl border overflow-hidden">
                    <HMOTable />
                    <div className="border-t px-4 py-3">
                      <Pagination />
                    </div>
        </div>
        </div>
      </main>
    </div>
  );
}
