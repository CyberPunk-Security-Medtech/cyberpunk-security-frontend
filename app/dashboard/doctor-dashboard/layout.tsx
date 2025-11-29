
'use client';

import { useState } from 'react';
import Sidebar from '@components/SideBar';
import Header from '@components/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarMinimize, setSidebarMinimize] = useState(false);
const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="font-sans h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarMinimize={sidebarMinimize} setSidebarMinimize={setSidebarMinimize} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 bg-[#F9FAFB]">
       <Header setSidebarOpen={setSidebarOpen} /> 
        <main className="flex-1 overflow-y-auto px-6 py-4">{children}</main>
      </div>
    </div>
  );
}
