'use client';

import { useState } from 'react';
import Sidebar from '@components/SideBar';
import Header from '@components/Header';
import { ClipboardList, LayoutDashboard, Users, Sparkles, ArrowLeftRight } from "lucide-react";
import { MenuItem, UserProfile } from '@/types/index';
import { useAuth } from '@context/AuthContext';

const doctorMenu: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard/doctor" },
  { name: "Patients Records", icon: Users, href: "/dashboard/doctor/patient-records" },
  { name: "Consultations", icon: ClipboardList, href: "/dashboard/doctor/consultations" },
  { name: "Ai Assistant", icon: Sparkles, href: "/dashboard/doctor/ai-assistant"},
  {
    name: "Patient Transfers",
    icon: ArrowLeftRight,
    href: "/dashboard/doctor/patient-transfers",
    children: [
      {
        name: "Sharing Permissions",
        href: "/dashboard/doctor/patient-transfers/sharing-permissions",
      },
      {
        name: "Incoming Records",
        href: "/dashboard/doctor/patient-transfers/incoming-records",
      },
    ],
  },
];

const formatDisplayName = (user: { first_name?: string; last_name?: string; email?: string } | null) => {
  const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  if (fullName) return fullName;
  const emailPrefix = user?.email?.split("@")?.[0]?.trim();
  return emailPrefix || "Doctor";
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, activeWorkspace } = useAuth();
  const [sidebarMinimize, setSidebarMinimize] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Kept for Header if needed, though unused in Sidebar

  const doctorProfile: UserProfile = {
    name: formatDisplayName(user),
    role: activeWorkspace?.role ?? "Doctor",
    avatar: "/avatars/eleanor.png",
  };

  return (
    <div className="flex h-[100dvh] min-w-0 overflow-hidden font-sans [--dashboard-accent:#1A2380] [--dashboard-accent-hover:#11185F]">
      {/* Sidebar */}
      <Sidebar
        sidebarMinimize={sidebarMinimize}
        setSidebarMinimize={setSidebarMinimize}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={doctorMenu}
        user={doctorProfile}
        navigationTheme={{
          accentColor: "#818CF8",
          activeBackgroundColor: "#1A2380",
          hoverBackgroundColor: "#11185F",
        }}
      />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col bg-[#F9FAFB]">
        <Header
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
          desktopPaddingClassName="md:px-12"
        />
        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-4 md:px-12">{children}</main>
      </div>
    </div>
  );
}
