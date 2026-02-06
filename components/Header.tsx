"use client";

import { Bell, Search, Menu } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  setSidebarOpen?: (open: boolean) => void;
  title?: string;
  icon?: React.ReactNode;
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  showSearch?: boolean;
}

export default function Header({
  setSidebarOpen,
  title = "Sisyphus Medical Center",
  icon,
  user = { name: "Dr. Alex", role: "Physician", avatar: "" },
  showSearch = true,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-4 md:px-6 lg:px-6 xl:px-12 py-3 md:py-4 border-b border-gray-100 bg-white sticky top-0 z-40 min-h-[60px] md:min-h-[76px] lg:min-h-[88px]">
      {/* Left Section */}
      <div className="flex items-center gap-2 md:gap-4 lg:gap-6 flex-1 min-w-0">
        <div className="flex items-center gap-2 md:gap-3">
          {setSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-md p-2 hover:bg-gray-100 transition flex-shrink-0 h-10 w-10 flex items-center justify-center"
            >
              <Menu size={20} className="text-[#1A2380]" />
            </button>
          )}
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <Image
              src="/images/Avatar.png"
              alt="Logo"
              width={40}
              height={40}
              className="hidden md:block flex-shrink-0 w-10 h-10"
            />
            {icon && <div className="flex-shrink-0">{icon}</div>}
            <h2
              className={`hidden md:block text-base lg:text-lg ${icon ? "text-black font-normal" : "font-bold text-[#1A2380]"} truncate`}
            >
              {title}
            </h2>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4 lg:gap-5 flex-shrink-0">
        {/* Search Bar - Hidden on mobile */}
        {showSearch && (
          <div className="relative hidden sm:flex items-center max-w-xs w-full">
            <div className="relative group transition-all duration-300 ease-in-out w-full">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none flex-shrink-0"
              />
              <input
                type="text"
                placeholder="Search patient"
                className="w-full h-9 md:h-10 rounded-full border border-gray-200 bg-gray-50 md:bg-white pl-9 pr-3 text-xs md:text-sm focus:ring-1 focus:ring-[#00B8A8] focus:border-[#00B8A8] outline-none transition-all cursor-pointer focus:cursor-text"
              />
            </div>
          </div>
        )}

        {/* Notification */}
        <button className="relative p-2 rounded-md hover:bg-gray-100 transition flex-shrink-0 h-10 w-10 flex items-center justify-center">
          <Bell size={18} className="text-gray-500 flex-shrink-0" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full font-semibold">
            99+
          </span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-2 min-w-0">
          {user.avatar ? (
            <div className="relative h-8 w-8 md:h-9 md:w-9 flex-shrink-0">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-[#1A2380] flex items-center justify-center text-white text-xs md:text-sm font-semibold flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="hidden md:block min-w-0">
            <p className="text-sm font-medium text-[#1A2380] leading-tight truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 leading-tight truncate">
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
