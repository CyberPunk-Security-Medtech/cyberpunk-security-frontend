"use client";

import { Bell, Menu } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import Image from "next/image";
import GlobalPatientSearch from "@components/GlobalPatientSearch";

interface HeaderProps {
  setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarOpen?: boolean;
  sidebarId?: string;
  showSearch?: boolean;
  desktopPaddingClassName?: string;
}

export default function Header({
  setSidebarOpen,
  sidebarOpen = false,
  sidebarId = "dashboard-sidebar",
  showSearch = true,
  desktopPaddingClassName = "md:px-8",
}: HeaderProps) {
  const { user, activeWorkspace } = useAuth();

  const displayName = user
    ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "User"
    : "User";

  return (
    <header
      className={`sticky top-0 z-40 flex w-full min-w-0 items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-4 ${desktopPaddingClassName}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        {setSidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8A8] motion-reduce:transition-none lg:hidden"
            aria-label="Open sidebar"
            aria-controls={sidebarId}
            aria-expanded={sidebarOpen}
          >
            <Menu size={20} className="text-[#1A2380]" />
          </button>
        )}
        <Image
          src="/images/Avatar.png"
          alt="Organization logo"
          width={36}
          height={36}
          className="h-9 w-9 rounded-full object-cover"
        />
        <h2 className="min-w-0 truncate text-base font-semibold text-[#1A2380] sm:text-lg">
          {activeWorkspace?.name || "Sisyphus Medical Center"}
        </h2>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-5">
        {showSearch && <GlobalPatientSearch />}

        <button
          className="relative p-2 rounded-md hover:bg-gray-100 transition"
          aria-label="Notifications"
        >
          <Bell size={20} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-[#00B8A8]" />
        </button>

        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-[#1A2380] flex items-center justify-center text-white text-sm font-semibold">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-[#1A2380]">{displayName}</p>
            <p className="text-xs text-gray-500">Staff</p>
          </div>
        </div>
      </div>
    </header>
  );
}
