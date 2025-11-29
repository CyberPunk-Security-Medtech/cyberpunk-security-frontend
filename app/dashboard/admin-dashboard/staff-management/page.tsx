'use client'
import Sidebar from "@components/dashboard/admin-dashboard/Sidebar";
import Pagination from "@components/dashboard/admin-dashboard/staff-management/Pagination";
import StaffActions from "@components/dashboard/admin-dashboard/staff-management/StaffActions";
import StaffManagementHeader from "@components/dashboard/admin-dashboard/staff-management/StaffManagementHeader";
import StaffTable from "@components/dashboard/admin-dashboard/staff-management/StaffTable";
import Header from "@components/Header";
import { useState } from "react";

export default function StaffManagementPage() {
  

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <Header />

        <div className="p-6 space-y-6">
          <StaffManagementHeader />

          <StaffActions />

          <div className="bg-white rounded-xl border overflow-hidden">
            <StaffTable />
            <div className="border-t px-4 py-3">
              <Pagination />
            </div>
          </div>
        </div>

      
      </main>
    </div>
  );
}
