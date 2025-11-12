'use client';

import { Bell, Search, Menu } from 'lucide-react';
import Image from 'next/image';

interface HeaderProps {
  setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
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
  user = { name: 'Dr. Alex', role: 'Physician', avatar: '' },
  showSearch = true,
}: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-4 md:px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-40">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle */}
        {setSidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden rounded-md p-2 hover:bg-gray-100 transition"
          >
            <Menu size={20} className="text-[#1A2380]" />
          </button>
        )}
        <h2 className="text-lg font-semibold text-[#1A2380] truncate">{title}</h2>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Search Bar */}
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

        {/* Notification */}
        <button className="relative p-2 rounded-md hover:bg-gray-100 transition">
          <Bell size={20} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-[#00B8A8]" />
        </button>

        {/* User Info */}
        <div className="flex items-center gap-2">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={36}
              height={36}
              className="rounded-full"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-[#1A2380] flex items-center justify-center text-white text-sm font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="hidden md:block">
            <p className="text-sm font-medium text-[#1A2380]">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
