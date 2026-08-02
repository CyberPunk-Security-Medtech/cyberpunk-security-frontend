"use client";

import { useState } from "react";
import { FlaskConical, LayoutDashboard, Sparkles } from "lucide-react";
import Sidebar from "@components/SideBar";
import Header from "@components/Header";
import { MenuItem, UserProfile, User } from "@/types/index";
import { buildDisplayName } from "@utils/helper";
import { useAuth } from "@context/AuthContext";

const labScientistMenu: MenuItem[] = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard/lab-scientist",
  },
  {
    name: "Test Orders",
    icon: FlaskConical,
    href: "/dashboard/lab-scientist/test-orders",
  },
  {
    name: "Ai Assistant",
    icon: Sparkles,
    href: "/dashboard/lab-scientist/ai-assistant",
  },
];

export default function LabScientistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, activeWorkspace } = useAuth();
  const [sidebarMinimize, setSidebarMinimize] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const profile: UserProfile = {
    name: buildDisplayName(user as User),
    role: activeWorkspace?.role ?? "Lab Scientist",
    avatar: "/avatars/eleanor.png",
  };

  return (
    <div className="flex h-[100dvh] min-w-0 overflow-hidden font-sans [--dashboard-accent:#007F73] [--dashboard-accent-hover:#006E64]">
      <Sidebar
        sidebarMinimize={sidebarMinimize}
        setSidebarMinimize={setSidebarMinimize}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={labScientistMenu}
        user={profile}
        backgroundColor="rgba(0, 37, 34, 1)"
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#F9FAFB]">
        <Header
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
          desktopPaddingClassName="md:px-6 lg:px-6 xl:px-12"
        />
        <main className="flex-1 overflow-y-auto px-4 py-4 md:px-6 lg:px-6 xl:px-12 md:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
