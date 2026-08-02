"use client";

import { useState } from "react";
import { LayoutDashboard, Package2, Sparkles, BarChart3 } from "lucide-react";
import Sidebar from "@components/SideBar";
import Header from "@components/Header";
import { MenuItem, UserProfile } from "@/types/index";
import { useAuth } from "@context/AuthContext";
import { User } from "@/types/index";
import { buildDisplayName } from "@utils/helper";

const pharmacyMenu: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard/pharmacy" },
  { name: "Inventory", icon: Package2, href: "/dashboard/pharmacy/inventory" },
  { name: "Reports", icon: BarChart3, href: "/dashboard/pharmacy/reports" },
  { name: "Ai Assistant", icon: Sparkles, href: "/dashboard/pharmacy/ai-assistant" },
];

export default function PharmacyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, activeWorkspace } = useAuth();
  const [sidebarMinimize, setSidebarMinimize] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const profile: UserProfile = {
    name: buildDisplayName(user as User),
    role: activeWorkspace?.role ?? "Pharmacist",
    avatar: "/avatars/eleanor.png",
  };

  return (
    <div className="flex h-[100dvh] min-w-0 overflow-hidden font-sans [--dashboard-accent:#00796B] [--dashboard-accent-hover:#00695F]">
      <Sidebar
        sidebarMinimize={sidebarMinimize}
        setSidebarMinimize={setSidebarMinimize}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={pharmacyMenu}
        user={profile}
        backgroundColor="rgba(0, 37, 34, 1)"
      />

      <div className="flex min-w-0 flex-1 flex-col bg-[#F9FAFB]">
        <Header
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
          desktopPaddingClassName="md:px-8"
        />
        <main className="min-w-0 flex-1 overflow-auto px-4 py-5 md:px-8">{children}</main>
      </div>
    </div>
  );
}
