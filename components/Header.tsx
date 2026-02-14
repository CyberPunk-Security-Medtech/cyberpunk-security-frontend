'use client';

import { Bell, Search, Menu } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';


interface HeaderProps {
  setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  showSearch?: boolean;
  user?: any;
}

export default function Header({ setSidebarOpen, showSearch = true }: HeaderProps) {

  const { user } = useAuth();

  const [doctorName, setDoctorName] = useState('');
  const [organizationName, setOrganizationName] = useState('');

  useEffect(() => {
    // 1️⃣ Set doctor name
    if (user) setDoctorName(`${user.first_name} ${user.last_name}`);

    // 2️⃣ Get workspace from localStorage
    const savedWorkspace = localStorage.getItem('activeWorkspace');
    if (savedWorkspace) {
      try {
        const ws = JSON.parse(savedWorkspace);
        setOrganizationName(ws.name);
      } catch (err) {
        console.error('Failed to parse activeWorkspace', err);
      }
    }
  }, [user]);

  return (
    <header className="w-full flex items-center justify-between px-4 md:px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-40">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        {setSidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden rounded-md p-2 hover:bg-gray-100 transition"
          >
            <Menu size={20} className="text-[#1A2380]" />
          </button>
        )}

        <h2 className="text-lg font-semibold text-[#1A2380] truncate">
          {organizationName || 'Loading organization...'}
        </h2>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button className="relative p-2 rounded-md hover:bg-gray-100 transition">
          <Bell size={20} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-[#00B8A8]" />
        </button>

        {/* User Info */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-[#1A2380] flex items-center justify-center text-white text-sm font-semibold">
            {doctorName ? doctorName.charAt(0).toUpperCase() : 'D'}
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-medium text-[#1A2380]">{doctorName || 'Loading...'}</p>
            <p className="text-xs text-gray-500">Doctor</p>
          </div>
        </div>
      </div>
    </header>
  );
}