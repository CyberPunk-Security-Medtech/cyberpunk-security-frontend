'use client';

import { useState } from 'react';
import Sidebar from '@components/SideBar';
import Header from '@components/Header';
import { ClipboardList, LayoutDashboard, Users, Sparkles } from "lucide-react";
import { MenuItem, UserProfile } from '@/types/index';

const doctorMenu: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard/doctor-dashboard" },
  { name: "Patients Records", icon: Users, href: "/dashboard/doctor-dashboard/patient-records" },
  { name: "Consultations", icon: ClipboardList, href: "/dashboard/doctor-dashboard/consultations" },
  { name: "Ai Assistant", icon: Sparkles, href: "/assistant" },
];

const doctorProfile: UserProfile = {
  name: "Eleanor Pena",
  role: "Doctor",
  avatar: "/avatars/eleanor.png"
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarMinimize, setSidebarMinimize] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Kept for Header if needed, though unused in Sidebar

  return (
    <div className="font-sans h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        sidebarMinimize={sidebarMinimize}
        setSidebarMinimize={setSidebarMinimize}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={doctorMenu}
        user={doctorProfile}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 bg-[#F9FAFB]">
        <Header
          setSidebarOpen={setSidebarOpen}
          desktopPaddingClassName="md:px-12"
        />
        <main className="flex-1 overflow-y-auto px-4 py-4 md:px-12">{children}</main>
      </div>
    </div>
  );
}
