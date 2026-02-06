import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { MenuItem, UserProfile } from "../types/index";

interface SidebarProps {
  sidebarMinimize: boolean;
  setSidebarMinimize: (minimize: boolean) => void;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  menuItems: MenuItem[];
  user: UserProfile;
  backgroundColor?: string;
  logo?: React.ReactNode;
}

export default function Sidebar({
  sidebarMinimize,
  setSidebarMinimize,
  sidebarOpen,
  setSidebarOpen,
  menuItems,
  user,
  backgroundColor = "#050517",
  logo
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 text-white transition-all duration-300 flex flex-col justify-between py-6 ${sidebarMinimize ? "lg:w-20" : "lg:w-[260px]"
          } ${sidebarOpen ? "translate-x-0 w-[260px]" : "-translate-x-full lg:translate-x-0"}`}
        style={{ backgroundColor: backgroundColor }}
      >
        <div>
          <div className="px-6 mb-10 relative flex items-center justify-center min-h-[40px]">
            {/* Logo Centered */}
            <div className="flex justify-center flex-1">
              {!sidebarMinimize && (
                logo ? logo : <Image src="/sidebar_logo.svg" alt="PrivaCure" width={110} height={70} />
              )}
            </div>

            {/* Mobile Toggle - Absolute Left */}
            <button
              onClick={() => setSidebarOpen && setSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-white transition absolute left-0"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Desktop Toggle - Absolute Right */}
            <button
              onClick={() => setSidebarMinimize(!sidebarMinimize)}
              className="hidden lg:block text-white/60 hover:text-white transition absolute right-0"
            >
              {sidebarMinimize ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map(({ name, icon: Icon, href }) => {
              const isActive = pathname === href;
              return (
                <Link key={name} href={href} onClick={() => setSidebarOpen && setSidebarOpen(false)}>
                  <div
                    className={`flex items-center gap-3 px-6 py-3 text-sm cursor-pointer transition-all border-l-4 ${isActive
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
          </nav>
        </div>

        <div className="px-6 mt-auto border-t border-white/10 pt-6">
          <div className="flex items-center gap-3">
            <Image
              src={user.avatar || "/images/woman-image.png"}
              alt={user.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            {(!sidebarMinimize || sidebarOpen) && (
              <div className="flex items-center justify-between flex-1">
                <div>
                  <p className="font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.role}</p>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
