"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MenuItem, UserProfile } from "@/types/index";
import { authService } from "@services/api";

interface SidebarProps {
  sidebarMinimize: boolean;
  setSidebarMinimize: (minimize: boolean) => void;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  menuItems: MenuItem[];
  user: UserProfile;
  backgroundColor?: string;
}

export default function SideBar({
  sidebarMinimize,
  setSidebarMinimize,
  sidebarOpen = false,
  setSidebarOpen,
  menuItems,
  user,
  backgroundColor = "#060921",
}: SidebarProps) {
  const pathname = usePathname();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

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
    if (sidebarMinimize) setIsProfileMenuOpen(false);
  }, [sidebarMinimize]);

  useEffect(() => {
    // Ensure mobile drawer closes after navigation.
    setSidebarOpen?.(false);
  }, [pathname, setSidebarOpen]);

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

  const activeHref = menuItems.reduce<string | null>((best, item) => {
    const matches =
      pathname === item.href || pathname.startsWith(`${item.href}/`);
    if (!matches) return best;
    if (!best || item.href.length > best.length) return item.href;
    return best;
  }, null);

  useEffect(() => {
    setOpenGroups((current) => {
      const next = { ...current };
      menuItems.forEach((item) => {
        if (
          item.children?.some(
            (child) => pathname === child.href || pathname.startsWith(child.href),
          ) ||
          pathname === item.href ||
          pathname.startsWith(`${item.href}/`)
        ) {
          next[item.name] = true;
        }
      });
      return next;
    });
  }, [menuItems, pathname]);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen?.(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] text-white transition-all duration-300 flex flex-col py-6 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ backgroundColor }}
      >
        <div>
          <div className="px-6 mb-10 relative flex items-center justify-center min-h-[40px]">
            <div className="flex justify-center flex-1">
              {!sidebarMinimize && (
                <Image
                  src="/sidebar_logo.svg"
                  alt="PrivaCure"
                  width={110}
                  height={70}
                />
              )}
            </div>

            <button
              onClick={() => setSidebarOpen?.(false)}
              className="lg:hidden text-white/60 hover:text-white transition absolute left-0"
              aria-label="Close sidebar"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={() => setSidebarMinimize(!sidebarMinimize)}
              className="hidden lg:block text-white/60 hover:text-white transition absolute right-0"
              aria-label="Toggle sidebar width"
            >
              {sidebarMinimize ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
          </div>

          {/* <nav className="space-y-1">
            {menuItems.map(({ name, icon: Icon, href }) => {
              const isActive = activeHref === href;
              return (
                <Link
                  key={name}
                  href={href}
                  onClick={() => setSidebarOpen?.(false)}
                >
                  <div
                    className={`flex items-center gap-3 px-6 py-3 text-sm cursor-pointer transition-all border-l-4 ${
                      isActive
                        ? "bg-[rgba(0,184,168,0.9)] border-[rgba(0,184,168,0.9)] text-white"
                        : "border-transparent hover:bg-[#11143B] text-gray-400 hover:text-white"
                    }`}
                  >
                    <Icon size={18} color={isActive ? "white" : "currentColor"} />
                    {(!sidebarMinimize || sidebarOpen) && <span>{name}</span>}
                  </div>
                </Link>
              );
            })}
          </nav> */}
          <nav className="space-y-0.5">
  {menuItems.map((item) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openGroups[item.name] ?? false;

    const isParentActive =
      pathname === item.href ||
      item.children?.some((child) => pathname === child.href || pathname.startsWith(child.href));

    return (
      <div key={item.name}>
        {hasChildren ? (
          <Link
            href={item.href}
            onClick={() =>
              setOpenGroups((current) => ({
                ...current,
                [item.name]: !isOpen,
              }))
            }
            className="w-full"
          >
            <div
              className={`flex items-center gap-3 px-6 py-3 text-sm cursor-pointer transition-all border-l-4 ${
                isParentActive
                  ? "bg-[rgba(0,184,168,0.18)] border-[rgba(0,184,168,0.9)] text-white"
                  : "border-transparent hover:bg-[#11143B] text-gray-400 hover:text-white"
              }`}
            >
              <Icon
                size={18}
                color={isParentActive ? "#00B8A8" : "currentColor"}
              />

              {(!sidebarMinimize || sidebarOpen) && (
                <>
                  <span className="flex-1 text-left">{item.name}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </div>
          </Link>
        ) : (
          <Link
            href={item.href}
            onClick={() => setSidebarOpen?.(false)}
          >
          <div
            className={`flex items-center gap-3 px-6 py-3 text-sm cursor-pointer transition-all border-l-4 ${
              isParentActive
                ? "bg-[rgba(0,184,168,0.18)] border-[rgba(0,184,168,0.9)] text-white"
                : "border-transparent hover:bg-[#11143B] text-gray-400 hover:text-white"
            }`}
          >
            <Icon
              size={18}
              color={isParentActive ? "#00B8A8" : "currentColor"}
            />

            {(!sidebarMinimize || sidebarOpen) && (
              <span>{item.name}</span>
            )}
          </div>
          </Link>
        )}

        {hasChildren && isOpen && (!sidebarMinimize || sidebarOpen) && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => {
              const ChildIcon = child.icon;
              const isChildActive =
                pathname === child.href || pathname.startsWith(child.href);

              return (
                <Link
                  key={child.name}
                  href={child.href}
                  onClick={() => setSidebarOpen?.(false)}
                >
                  <div
                    className={`ml-6 mr-3 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm cursor-pointer transition-all ${
                      isChildActive
                        ? "bg-[rgba(0,184,168,0.9)] text-white"
                        : "text-gray-400 hover:bg-[#11143B] hover:text-white"
                    }`}
                  >
                    {/* <ChildIcon
                      size={16}
                      color={isChildActive ? "white" : "currentColor"}
                    /> */}
                    <span>{child.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  })}
</nav>
        </div>

        <div className="px-6 mt-auto border-t border-white/10 pt-6">
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => !sidebarMinimize && setIsProfileMenuOpen((prev) => !prev)}
              className="w-full flex items-center gap-3 text-left"
              aria-label="Open profile menu"
            >
              <Image
                src={user.avatar || "/avatars/eleanor.png"}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              {!sidebarMinimize && (
                <>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.role}</p>
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
                      <path d="M1 1.5L7 6.5L13 1.5" fill="currentColor" />
                    </svg>
                  </span>
                </>
              )}
            </button>

            {!sidebarMinimize && isProfileMenuOpen && (
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
