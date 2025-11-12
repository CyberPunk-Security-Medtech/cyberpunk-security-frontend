'use client'

import { classNames } from '@utils/helper'
import { LayoutDashboard, Users, FlaskConical, Activity } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface MdMenuProps {
  sidebarMinimize: boolean
  setSidebarMinimize: (v: boolean) => void
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Patients', icon: Users, href: '/patients-records' },
  { label: 'Lab Tests', icon: FlaskConical, href: '/lab-tests' },
  { label: 'Activities', icon: Activity, href: '/activities' },
]

export default function MdMenu({ sidebarMinimize, setSidebarMinimize }: MdMenuProps) {
  const router = useRouter()

  return (
    <aside
      className={classNames(
        'relative flex flex-col h-screen border-r border-gray-100 bg-[#1A2380] text-white transition-all duration-300',
        sidebarMinimize ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
        <h1
          className={classNames(
            'text-2xl font-semibold text-white transition-opacity',
            sidebarMinimize && 'opacity-0 pointer-events-none'
          )}
        >
          Priva<span className="text-[#00B8A8]">Cure</span>
        </h1>

        <button
          onClick={() => setSidebarMinimize(!sidebarMinimize)}
          className="rounded-md p-2 hover:bg-white/10 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={classNames('transition-transform', sidebarMinimize ? 'rotate-180' : '')}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto mt-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = typeof window !== 'undefined' && window.location.pathname === item.href
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className={classNames(
                'flex items-center w-full gap-3 px-5 py-3 text-sm font-medium transition rounded-md',
                active ? 'bg-[#00B8A8]/20 text-[#00B8A8]' : 'text-gray-100 hover:bg-white/10'
              )}
            >
              <Icon size={18} />
              {!sidebarMinimize && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-white/10 p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-[#00B8A8] flex items-center justify-center text-white font-semibold">
          A
        </div>
        {!sidebarMinimize && (
          <div>
            <p className="text-sm font-medium">Dr. Alex</p>
            <p className="text-xs text-white/60">General Practitioner</p>
          </div>
        )}
      </div>
    </aside>
  )
}
