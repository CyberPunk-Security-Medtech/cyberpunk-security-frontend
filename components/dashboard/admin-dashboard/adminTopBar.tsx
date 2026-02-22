'use client'

import { ChevronDown, Search, Download, Plus, Bell } from "lucide-react";
import Button from "@components/Button"
import { useAuth } from "@context/AuthContext";

export default function Topbar() {
  const { user } = useAuth();
  const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  const displayName = fullName || user?.email?.split("@")?.[0] || "Administrator";

  return (
    <header className="px-8 py-4 border-b bg-white flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold">Dashboard Overview</h1>
        <p className="text-sm text-slate-500">Welcome back, {displayName}.</p>
      </div>

      <div className="flex items-center gap-2">
        
        <button className="flex items-center gap-1 border rounded-full px-3 py-1.5 text-xs">
          Today <ChevronDown className="w-3 h-3" />
        </button>

        <Button
          type="button"
          className="bg-[#E1E7EF] w-[100px] h-[43px] rounded-full flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>

        <Button
          type="button"
          className="bg-[#1A2380] w-[133px] h-[43px] text-white rounded-full flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Patient
        </Button>

      </div>
    </header>
  );
}
