"use client";

import { useState } from "react";
import Sidebar from "@components/SideBar";
import Header from "@components/Header";
import { LayoutDashboard, Users, Sparkles } from "lucide-react";
import { MenuItem, UserProfile } from "@/types/index";

const nurseMenu: MenuItem[] = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard/nurse-dashboard",
  },
  {
    name: "Patients Records",
    icon: Users,
    href: "/dashboard/nurse-dashboard/patient-records",
  },
  { name: "Ai Assistant", icon: Sparkles, href: "/assistant" },
];

const nurseProfile: UserProfile = {
  name: "Eleanor Pena",
  role: "Nurse",
  avatar: "/images/woman-image.png",
};

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
      <Sidebar
        sidebarMinimize={sidebarMinimize}
        setSidebarMinimize={setSidebarMinimize}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={nurseMenu}
        user={nurseProfile}
        backgroundColor="rgba(0, 37, 34, 1)"
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 bg-[#F9FAFB] overflow-hidden">
        <Header
          setSidebarOpen={setSidebarOpen}
          desktopPaddingClassName="md:px-6 lg:px-6 xl:px-12"
        />
        <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-6 xl:px-12 py-4 md:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
