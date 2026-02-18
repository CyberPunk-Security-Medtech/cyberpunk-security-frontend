"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { useEffect, useState } from "react";
import Image from "next/image";

interface HeaderProps {
  setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  showSearch?: boolean;
  desktopPaddingClassName?: string;
}

export default function Header({
  setSidebarOpen,
  showSearch = true,
  desktopPaddingClassName = "md:px-8",
}: HeaderProps) {
  const { user } = useAuth();
  const [organizationName, setOrganizationName] = useState("");

  useEffect(() => {
    const savedWorkspace = localStorage.getItem("activeWorkspace");
    if (!savedWorkspace) return;

    try {
      const workspace = JSON.parse(savedWorkspace);
      setOrganizationName(workspace?.name ?? "");
    } catch (error) {
      console.error("Failed to parse activeWorkspace", error);
    }
  }, []);

  const displayName = user
    ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "User"
    : "User";

  return (
    <header
      className={`w-full flex items-center justify-between px-4 py-4 border-b border-gray-100 bg-white sticky top-0 z-40 ${desktopPaddingClassName}`}
    >
      <div className="flex items-center gap-3">
        {setSidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden rounded-md p-2 hover:bg-gray-100 transition"
            aria-label="Open sidebar"
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
        <h2 className="text-lg font-semibold text-[#1A2380] truncate">
          {organizationName || "Sisyphus Medical Center"}
        </h2>
      </div>

      <div className="flex items-center gap-5">
        {showSearch && (
          <div className="relative hidden md:block">
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search patient or record"
              className="w-64 rounded-full border border-gray-200 pl-9 pr-3 py-2 text-sm focus:ring-1 focus:ring-[#00B8A8] focus:border-[#00B8A8] outline-none"
            />
          </div>
        )}

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
