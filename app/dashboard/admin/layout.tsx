"use client";

import { useState } from "react";
import Sidebar from "@components/dashboard/admin/Sidebar";
import Header from "@components/Header";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] min-w-0 overflow-hidden bg-slate-50 text-slate-900 [--dashboard-accent:#051466] [--dashboard-accent-hover:#020B44]">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
          sidebarId="admin-sidebar"
        />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain [contain:paint]">
          {children}
        </main>
      </div>
    </div>
  );
}
