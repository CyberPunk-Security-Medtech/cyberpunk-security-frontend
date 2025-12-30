'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Activity,
  ShieldCheck,
  BarChart2,
  Settings,
  HelpCircle,
} from "lucide-react";
import Image from "next/image";



export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/admin-dashboard" },
    { label: "Staff management", icon: Users, href: "/dashboard/admin-dashboard/staff-management" },
    { label: "Patients Transfers", icon: Activity, href: "/dashboard/admin-dashboard/patients-transfers" },
    { label: "HMO management", icon: ShieldCheck, href: "/dashboard/admin-dashboard/hmo-management" },
    { label: "Compliance", icon: ShieldCheck, href: "/dashboard/admin-dashboard/compliance" },
    { label: "Reports & Analytics", icon: BarChart2, href: "/dashboard/admin-dashboard/reports" },
    { label: "Settings", icon: Settings, href: "/dashboard/admin-dashboard/settings" },
    { label: "Help", icon: HelpCircle, href: "/dashboard/admin-dashboard/help" },
  ];

  return (
    <aside className="w-72 bg-[#051466] text-slate-100 flex flex-col min-h-screen">
      {/* Logo Area */}
      <div className="px-6 py-6 border-b border-white/10">
        <Image src="/sidebar_logo.svg" alt="PrivaCure" width={110} height={70} />
      </div>

      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-y-1 px-3 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition
                ${
                  isActive
                    ? "bg-white text-[#051466] font-semibold"
                    : "text-slate-200 hover:bg-white/10"
                }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Bottom Card */}
      <div className="px-3 pb-6">
        <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-3 py-3">
          <div className="w-9 h-9 rounded-full bg-emerald-400 flex items-center justify-center text-sm font-semibold text-[#051466]">
            EP
          </div>
          <div>
            <p className="text-sm font-medium">Eleanor Pena</p>
            <p className="text-[11px] text-slate-300">Hospital Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
