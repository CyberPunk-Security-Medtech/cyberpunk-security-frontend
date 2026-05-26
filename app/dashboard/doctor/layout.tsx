'use client';

import { useState } from 'react';
import Sidebar from '@components/SideBar';
import Header from '@components/Header';
import { ClipboardList, LayoutDashboard, Users, Sparkles, ArrowLeftRight, UserCheck, ShieldAlert, FileInput } from "lucide-react";
import { MenuItem, UserProfile } from '@/types/index';
import { useAuth } from '@context/AuthContext';

const doctorMenu: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard/doctor" },
  { name: "Patients Records", icon: Users, href: "/dashboard/doctor/patient-records" },
  { name: "Consultations", icon: ClipboardList, href: "/dashboard/doctor/consultations" },
  { name: "Ai Assistant", icon: Sparkles, href: "/assistant"},
  {
    name: "Patient Transfers",
    icon: ArrowLeftRight,
    href: "/dashboard/doctor/patient-transfers",
    children: [
      {
        name: "Patient Consent",
        // icon: UserCheck,
        href: "/dashboard/doctor/patient-transfers/patient-consent",
      },
      {
        name: "Patients Overview",
        // icon: Users,
        href: "/dashboard/doctor/patient-transfers/patient-overview",
      },
      // {
      //   name: "Emergency Override",
      //   icon: ShieldAlert,
      //   href: "/dashboard/doctor-dashboard/patient-transfers/emergency-override",
      // },
      {
        name: "Incoming Records",
        // icon: FileInput,
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
