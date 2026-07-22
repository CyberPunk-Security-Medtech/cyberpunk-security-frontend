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
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import { authService } from "@services/api";
import { useAuth } from "@context/AuthContext";



type AdminSidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: AdminSidebarProps) {
  const { user, activeWorkspace } = useAuth();
  const pathname = usePathname();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [isDesktop, setIsDesktop] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncViewport = () => setIsDesktop(mediaQuery.matches);
    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);
    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  useEffect(() => {
    if (!sidebarOpen || isDesktop) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
        window.setTimeout(() => {
          document
            .querySelector<HTMLButtonElement>('[aria-controls="admin-sidebar"]')
            ?.focus();
        }, 0);
        return;
      }

      if (event.key !== "Tab" || !sidebarRef.current) return;
      const focusable = Array.from(
        sidebarRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isDesktop, setSidebarOpen, sidebarOpen]);

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

  const matchesRoute = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    setOpenGroups((current) => {
      const next = { ...current };
      navItems.forEach((item) => {
        if (
          item.children?.some((child) => matchesRoute(child.href)) ||
          matchesRoute(item.href)
        ) {
          next[item.label] = true;
        }
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-hidden="true"
          onClick={() => {
            setSidebarOpen(false);
            window.setTimeout(() => {
              document
                .querySelector<HTMLButtonElement>('[aria-controls="admin-sidebar"]')
                ?.focus();
            }, 0);
          }}
        />
      )}

      <aside
        id="admin-sidebar"
        ref={sidebarRef}
        aria-hidden={!isDesktop && !sidebarOpen}
        inert={!isDesktop && !sidebarOpen}
        className={`fixed inset-y-0 left-0 z-50 flex h-[100dvh] w-72 shrink-0 flex-col bg-[#051466] text-slate-100 transition-transform duration-300 motion-reduce:transition-none lg:sticky lg:top-0 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
      {/* Logo Area */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
        <Image src="/sidebar_logo.svg" alt="PrivaCure" width={110} height={70} />
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => {
            setSidebarOpen(false);
            window.setTimeout(() => {
              document
                .querySelector<HTMLButtonElement>('[aria-controls="admin-sidebar"]')
                ?.focus();
            }, 0);
          }}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:hidden"
          aria-label="Close sidebar"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-y-1 px-3 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openGroups[item.label] ?? false;
          const isCurrentPage = pathname === item.href;
          const hasActiveChild = Boolean(
            item.children?.some((child) => matchesRoute(child.href)),
          );
          const isActive = hasChildren
            ? isCurrentPage
            : item.href === "/dashboard/admin"
              ? isCurrentPage
              : matchesRoute(item.href);

          return (
            <div key={item.label}>
              {hasChildren ? (
                <Link
                  href={item.href}
                  aria-current={isCurrentPage ? "page" : undefined}
                  onClick={() =>
                    setOpenGroups((current) => ({
                      ...current,
                      [item.label]: !isOpen,
                    }))
                  }
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors motion-reduce:transition-none
                    ${
                      isActive
                        ? "bg-white text-[#051466] font-semibold"
                        : hasActiveChild
                          ? "bg-white/10 text-white font-semibold"
                        : "text-slate-200 hover:bg-white/10"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform motion-reduce:transition-none ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </Link>
              ) : (
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors motion-reduce:transition-none
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
                    const childActive = matchesRoute(child.href);

                    return (
                      <Link
                        key={child.label}
                        href={child.href}
                        aria-current={childActive ? "page" : undefined}
                        className={`block rounded-lg px-3 py-2 text-sm transition-colors motion-reduce:transition-none ${
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
            aria-haspopup="menu"
            aria-expanded={isProfileMenuOpen}
          >
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white"
            >
              {displayName
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join("") || "A"}
            </span>
            <div>
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-slate-300">{displayRole}</p>
            </div>
            <span
                className={`ml-auto transition-transform motion-reduce:transition-none ${
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
    </>
  );
}
