// "use client";

// import { useState } from "react";
// import Sidebar from "@components/SideBar";
// import { LayoutDashboard, Users, Sparkles } from "lucide-react";
// import { MenuItem, UserProfile } from "@/types/index";
// import Header from "@components/Header";

// const nurseMenu: MenuItem[] = [
//   {
//     name: "Dashboard",
//     icon: LayoutDashboard,
//     href: "/dashboard/nurse-dashboard",
//   },
//   {
//     name: "Patients Records",
//     icon: Users,
//     href: "/dashboard/nurse-dashboard/patient-records",
//   },
//   { name: "Ai Assistant", icon: Sparkles, href: "/assistant" },
// ];

// const nurseProfile: UserProfile = {
//   name: "Eleanor Pena",
//   role: "Nurse",
//   avatar: "/images/woman-image.png",
// };

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [sidebarMinimize, setSidebarMinimize] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   return (
//     <div className="font-sans h-screen flex overflow-hidden">
//       {/* Sidebar */}
//       <Sidebar
//         sidebarMinimize={sidebarMinimize}
//         setSidebarMinimize={setSidebarMinimize}
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//         menuItems={nurseMenu}
//         user={nurseProfile}
//         backgroundColor="rgba(0, 37, 34, 1)"
//       />

//       {/* Main Content */}
//       <div className="flex flex-col flex-1 bg-[#F9FAFB] overflow-hidden">
//         <Header
//           setSidebarOpen={setSidebarOpen}
//           desktopPaddingClassName="md:px-6 lg:px-6 xl:px-12"
//         />
//         <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-6 xl:px-12 py-4 md:py-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import Sidebar from '@components/SideBar';
import Header from '@components/Header';
import { ClipboardList, LayoutDashboard, Users, Sparkles } from "lucide-react";
import { MenuItem, UserProfile } from '@/types/index';
import { useAuth } from '@context/AuthContext';

const nurseMenu: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard/nurse" },
  { name: "Patients Records", icon: Users, href: "/dashboard/nurse/patient-records" },
  { name: "Consultations", icon: ClipboardList, href: "/dashboard/nurse/consultations" },
  { name: "Ai Assistant", icon: Sparkles, href: "/assistant" },
];

const formatDisplayName = (user: { first_name?: string; last_name?: string; email?: string } | null) => {
  const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  if (fullName) return fullName;
  const emailPrefix = user?.email?.split("@")?.[0]?.trim();
  return emailPrefix || "Nurse";
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, activeWorkspace } = useAuth();
  const [sidebarMinimize, setSidebarMinimize] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Kept for Header if needed, though unused in Sidebar

  const nurseProfile: UserProfile = {
    name: formatDisplayName(user),
    role: activeWorkspace?.role ?? "Nurse",
    avatar: "/avatars/eleanor.png",
  };

  return (
    <div className="flex h-[100dvh] min-w-0 overflow-hidden font-sans [--dashboard-accent:#006B5F] [--dashboard-accent-hover:#005249]">
      {/* Sidebar */}
      <Sidebar
        sidebarMinimize={sidebarMinimize}
        setSidebarMinimize={setSidebarMinimize}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={nurseMenu}
        user={nurseProfile}
        backgroundColor="rgba(0, 37, 34, 1)"
        navigationTheme={{
          accentColor: "#00B8A8",
          activeBackgroundColor: "#00534B",
          hoverBackgroundColor: "#003E38",
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
