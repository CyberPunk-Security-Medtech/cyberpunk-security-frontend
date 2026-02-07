// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { LayoutDashboard, Users, Sparkles } from "lucide-react";

// const menu = [
//   { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
//   { name: "Patients Records", icon: Users, href: "/dashboard/doctor-dashboard/patient-records" },
//   { name: "AI Assistant", icon: Sparkles, href: "/assistant" },
// ];

// export default function Sidebar() {
//   const pathname = usePathname();

//   return (
//     <aside className="bg-[#0B0D27] text-white w-64 min-h-screen flex flex-col justify-between py-6">
//       <div>
//         <div className="px-6 mb-10">
//           <Image src="/logo.svg" alt="PrivaCure" width={140} height={40} />
//         </div>
//         <nav className="space-y-1">
//           {menu.map(({ name, icon: Icon, href }) => (
//             <Link key={name} href={href}>
//               <div
//                 className={`flex items-center gap-3 px-6 py-3 text-sm cursor-pointer transition-all ${
//                   pathname === href ? "bg-[#043933]" : "hover:bg-[#11143B]"
//                 }`}
//               >
//                 <Icon size={18} />
//                 <span>{name}</span>
//               </div>
//             </Link>
//           ))}
//         </nav>
//       </div>

//       <div className="px-6 mt-auto border-t border-white/10 pt-6">
//         <div className="flex items-center gap-3">
//           <Image
//             src="/avatars/eleanor.png"
//             alt="Eleanor Pena"
//             width={40}
//             height={40}
//             className="rounded-full"
//           />
//           <div>
//             <p className="font-medium">Eleanor Pena</p>
//             <p className="text-xs text-gray-400">Hospital Administrator</p>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }


// import Image from "next/image";
// import Link from "next/link";

// import { LayoutDashboard, Users, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
// import { usePathname } from "next/navigation";

// const menu = [
//   { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard/doctor-dashboard" },
//   { name: "Patients Records", icon: Users, href: "/dashboard/doctor-dashboard/patient-records" },
//   { name: "AI Assistant", icon: Sparkles, href: "/dashboard/doctor-dashboard/ai-assistant" },
// ];

// export default function Sidebar({ sidebarMinimize, setSidebarMinimize }: any) {
//   const pathname = usePathname();

//   return (
//     <aside
//       className={`bg-[#060921] text-white transition-all duration-300 flex flex-col justify-between py-6 ${
//         sidebarMinimize ? "w-20" : "w-64"
//       }`}
//     >
//       <div>
//         <div className="px-6 mb-10 flex items-center justify-between">
//           {!sidebarMinimize && (
//             <Image src="/sidebar_logo.svg" alt="PrivaCure" width={110} height={70} />
//           )}
//           <button
//             onClick={() => setSidebarMinimize(!sidebarMinimize)}
//             className="text-white/60 hover:text-white transition"
//           >
//             {sidebarMinimize ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
//           </button>
//         </div>

//         <nav className="space-y-1">
//           {menu.map(({ name, icon: Icon, href }) => (
//             <Link key={name} href={href}>
//             <div
//                  className={`flex items-center gap-3 px-6 py-3 text-sm cursor-pointer transition-all ${
//                    pathname === href ? "bg-[#043933]" : "hover:bg-[#11143B]"
//                }`}
//                >
//                 <Icon size={18} />
//                 {!sidebarMinimize && <span>{name}</span>}
//               </div>
//             </Link>
//           ))}
//         </nav>
//       </div>

//       <div className="px-6 mt-auto border-t border-white/10 pt-6">
//         <div className="flex items-center gap-3">
//           <Image
//             src="/avatars/eleanor.png"
//             alt="Eleanor Pena"
//             width={40}
//             height={40}
//             className="rounded-full"
//           />
//           {!sidebarMinimize && (
//             <div>
//               <p className="font-medium">Eleanor Pena</p>
//               <p className="text-xs text-gray-400">Hospital Administrator</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </aside>
//   );
// }


"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, Users, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { authService, organizationService } from "@services/api";


const menu = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard/doctor-dashboard" },
  { name: "Patients Records", icon: Users, href: "/dashboard/doctor-dashboard/patient-records" },
  { name: "AI Assistant", icon: Sparkles, href: "/dashboard/doctor-dashboard/ai-assistant" },
];

export default function Sidebar({ sidebarMinimize, setSidebarMinimize }: any) {
  const pathname = usePathname();

  const [doctorName, setDoctorName] = useState("");
  const [orgId, setOrgId] = useState("");
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const loadSidebarData = async () => {
      try {
        // 1️⃣ Get logged in doctor
        const me = await authService.getMe();
        setDoctorName(`${me.first_name} ${me.last_name}`);

        const organizationId = me.organization?.id || me.organization_id;
        setOrgId(organizationId);

        // 2️⃣ Get membership (contains admin)
        if (organizationId) {
          const membership = await organizationService.getMyMembership(organizationId);
          console.log("Membership data:", membership)

          setAdminName(
            `${membership.first_name} ${membership.last_name}`
          );
        }
      } catch (error) {
        console.error("Sidebar load failed", error);
      }
    };

    loadSidebarData();
  }, []);

  return (
    <aside
      className={`bg-[#060921] text-white transition-all duration-300 flex flex-col justify-between py-6 ${
        sidebarMinimize ? "w-20" : "w-64"
      }`}
    >
      <div>
        <div className="px-6 mb-10 flex items-center justify-between">
          {!sidebarMinimize && (
            <Image src="/sidebar_logo.svg" alt="PrivaCure" width={110} height={70} />
          )}
          <button
            onClick={() => setSidebarMinimize(!sidebarMinimize)}
            className="text-white/60 hover:text-white transition"
          >
            {sidebarMinimize ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Org ID display */}
        {!sidebarMinimize && orgId && (
          <p className="px-6 text-xs text-gray-400 mb-4">
            Org ID: {orgId}
          </p>
        )}

        <nav className="space-y-1">
          {menu.map(({ name, icon: Icon, href }) => (
            <Link key={name} href={href}>
              <div
                className={`flex items-center gap-3 px-6 py-3 text-sm cursor-pointer transition-all ${
                  pathname === href ? "bg-[#043933]" : "hover:bg-[#11143B]"
                }`}
              >
                <Icon size={18} />
                {!sidebarMinimize && <span>{name}</span>}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="px-6 mt-auto border-t border-white/10 pt-6">
        <div className="flex items-center gap-3">
          <Image
            src="/avatars/eleanor.png"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />

          {!sidebarMinimize && (
            <div>
              {/* Doctor name */}
              <p className="font-medium">{doctorName || "Loading..."}</p>

              {/* Org admin */}
              <p className="text-xs text-gray-400">
                Admin: {adminName || "Fetching..."}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
