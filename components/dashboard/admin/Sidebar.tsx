'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Activity,
  Building2,
  ShieldCheck,
  BarChart2,
  Settings,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { authService } from "@services/api";
import { useAuth } from "@context/AuthContext";



export default function Sidebar() {
  const { user, activeWorkspace } = useAuth();
  const pathname = usePathname();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  const displayName = fullName || user?.email?.split("@")?.[0] || "Administrator";
  const displayRole = activeWorkspace?.role || "Hospital Administrator";

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!profileMenuRef.current) return;
      if (!profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout request failed", error);
    } finally {
      localStorage.clear();
      window.location.href = "/auth/login";
    }
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/admin" },
    { label: "Staff management", icon: Users, href: "/dashboard/admin/staff-management" },
    { label: "Departments", icon: Building2, href: "/dashboard/admin/departments" },
    {
      label: "Patient Transfers",
      icon: Activity,
      href: "/dashboard/admin/patients-transfers",
      children: [
        {
          label: "Sharing Permissions",
          href: "/dashboard/admin/patients-transfers/sharing-permissions",
        },
        {
          label: "Incoming Records",
          href: "/dashboard/admin/patients-transfers/incoming-records",
        },
      ],
    },
    { label: "HMO management", icon: ShieldCheck, href: "/dashboard/admin/hmo-management" },
    { label: "Compliance", icon: ShieldCheck, href: "/dashboard/admin/compliance" },
    { label: "Reports & Analytics", icon: BarChart2, href: "/dashboard/admin/reports" },
    { label: "Settings", icon: Settings, href: "/dashboard/admin/settings" },
    { label: "Help", icon: HelpCircle, href: "/dashboard/admin/help" },
  ];

  useEffect(() => {
    setOpenGroups((current) => {
      const next = { ...current };
      navItems.forEach((item) => {
        if (
          item.children?.some(
            (child) => pathname === child.href || pathname.startsWith(child.href),
          ) ||
          pathname === item.href ||
          pathname.startsWith(`${item.href}/`)
        ) {
          next[item.label] = true;
        }
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openGroups[item.label] ?? false;
          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`) ||
            item.children?.some(
              (child) => pathname === child.href || pathname.startsWith(child.href),
            );

          return (
            <div key={item.label}>
              {hasChildren ? (
                <Link
                  href={item.href}
                  onClick={() =>
                    setOpenGroups((current) => ({
                      ...current,
                      [item.label]: !isOpen,
                    }))
                  }
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition
                    ${
                      isActive
                        ? "bg-white text-[#051466] font-semibold"
                        : "text-slate-200 hover:bg-white/10"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </Link>
              ) : (
                <Link
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
              )}

              {hasChildren && isOpen && (
                <div className="mt-1 space-y-1 pl-7">
                  {item.children?.map((child) => {
                    const childActive =
                      pathname === child.href || pathname.startsWith(child.href);

                    return (
                      <Link
                        key={child.label}
                        href={child.href}
                        className={`block rounded-lg px-3 py-2 text-sm transition ${
                          childActive
                            ? "bg-white/20 text-white"
                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Bottom Card */}
      <div className="px-3 pb-6">
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="w-full flex items-center gap-3 bg-white/5 rounded-2xl px-3 py-3 text-left"
            aria-label="Open profile menu"
          >
            <Image
              src="/avatars/eleanor.png"
              alt={displayName}
              width={36}
              height={36}
              className="rounded-full"
            />
            <div>
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-[11px] text-slate-300">{displayRole}</p>
            </div>
            <span
              className={`ml-auto transition-transform ${
                isProfileMenuOpen ? "rotate-180" : ""
              }`}
            >
              <svg
                width="14"
                height="8"
                viewBox="0 0 14 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1 1.5L7 6.5L13 1.5" fill="white" />
              </svg>
            </span>
          </button>

          {isProfileMenuOpen && (
            <div className="absolute left-0 right-0 bottom-full mb-2 rounded-lg border border-white/20 bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-3 py-2 text-left text-sm text-[#0F172A] hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
