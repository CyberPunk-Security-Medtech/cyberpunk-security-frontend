"use client";

import HMOActions from "@components/dashboard/admin/hmo-management/HMOActions";
import HMOHeader from "@components/dashboard/admin/hmo-management/HMOHeader";
import HMOSetupModal from "@components/dashboard/admin/hmo-management/HMOSetupModal";
import HMOTable from "@components/dashboard/admin/hmo-management/HMOTable";
import Sidebar from "@components/dashboard/admin/Sidebar";
import Pagination from "@components/dashboard/admin/staff-management/Pagination";
import Header from "@components/Header";
import { useState } from "react";

export default function HMOManagementPage() {
  const [isAddHmoModalOpen, setIsAddHmoModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <Header />

        <div className="p-6 space-y-6">
          <HMOHeader />

          <HMOActions onAdd={() => setIsAddHmoModalOpen(true)} />

          <HMOSetupModal
            isOpen={isAddHmoModalOpen}
            onClose={() => setIsAddHmoModalOpen(false)}
          />

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
