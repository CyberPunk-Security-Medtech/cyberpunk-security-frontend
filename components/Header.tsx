'use client';

import { Bell, Search, Menu } from 'lucide-react';
import Image from 'next/image';

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
  title = 'Sisyphus Medical Center',
  icon,
  user = { name: 'Dr. Alex', role: 'Physician', avatar: '' },
  showSearch = true,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-4 lg:px-12 py-4 border-b border-gray-100 bg-white sticky top-0 z-40 h-[88px]">
      {/* Left Section */}
      <div className="flex items-center gap-6 flex-1">
        <div className="flex items-center gap-3">
          {setSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-md p-2 hover:bg-gray-100 transition"
            >
              <Menu size={20} className="text-[#1A2380]" />
            </button>
          )}
          <div className="flex items-center gap-2">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            <h2 className={`hidden md:block text-lg ${icon ? 'text-black font-normal' : 'font-semibold text-[#1A2380]'} truncate`}>
              {title}
            </h2>
          </div>
        </div>

        {/* Search Bar - Moved to Left */}
        {showSearch && (
          <div className="relative flex items-center max-w-md w-full ml-4">
            <div className="relative group transition-all duration-300 ease-in-out w-full">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search patient"
                className="w-full h-10 rounded-full border border-gray-200 bg-gray-50 md:bg-white pl-10 pr-4 text-sm focus:ring-1 focus:ring-[#00B8A8] focus:border-[#00B8A8] outline-none transition-all cursor-pointer focus:cursor-text"
              />
            </div>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Notification */}
        <button className="relative p-2 rounded-md hover:bg-gray-100 transition">
          <Bell size={20} className="text-gray-500" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
            99+
          </span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-2">
          {user.avatar ? (
            <div className="relative h-9 w-9">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="h-9 w-9 rounded-full bg-[#1A2380] flex items-center justify-center text-white text-sm font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="hidden md:block">
            <p className="text-sm font-medium text-[#1A2380] leading-none">{user.name}</p>
            <p className="text-xs text-gray-500 mt-1">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}