"use client";

import { useState } from "react";
import { LayoutDashboard, Sparkles, Users } from "lucide-react";
import Header from "@components/Header";
import Sidebar from "@components/SideBar";
import { useAuth } from "@context/AuthContext";
import { MenuItem, UserProfile } from "@/types/index";

const recordStaffMenu: MenuItem[] = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard/record-staff",
  },
  {
    name: "Patient Records",
    icon: Users,
    href: "/dashboard/record-staff/patient-records",
  },
  {
    name: "Ai Assistant",
    icon: Sparkles,
    href: "/assistant",
  },
];

const buildDisplayName = (user: {
  first_name?: string;
  last_name?: string;
  email?: string;
} | null) => {
  const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  if (fullName) return fullName;
  return user?.email?.split("@")?.[0] || "Record Staff";
};

export default function RecordStaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, activeWorkspace } = useAuth();
  const [sidebarMinimize, setSidebarMinimize] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const profile: UserProfile = {
    name: buildDisplayName(user),
    role: activeWorkspace?.role ?? "Record Staff",
    avatar: "/avatars/eleanor.png",
  };

  return (
    <div className="flex h-[100dvh] min-w-0 overflow-hidden font-sans [--dashboard-accent:#003C36] [--dashboard-accent-hover:#002E29]">
      <Sidebar
        sidebarMinimize={sidebarMinimize}
        setSidebarMinimize={setSidebarMinimize}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={recordStaffMenu}
        user={profile}
        backgroundColor="rgba(0, 37, 34, 1)"
      />

      <div className="flex min-w-0 flex-1 flex-col bg-[#EEF2F6]">
        <Header
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
          desktopPaddingClassName="md:px-8"
        />
        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
