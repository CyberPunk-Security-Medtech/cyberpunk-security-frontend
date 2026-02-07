// 'use client';

// import { Bell, Search, Menu } from 'lucide-react';
// import Image from 'next/image';

// interface HeaderProps {
//   setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
//   title?: string;
//   user?: {
//     name: string;
//     role: string;
//     avatar?: string;
//   };
//   showSearch?: boolean;
// }

// export default function Header({
//   setSidebarOpen,
//   title = 'Sisyphus Medical Center',
//   user = { name: 'Dr. Alex', role: 'Physician', avatar: '' },
//   showSearch = true,
// }: HeaderProps) {
//   return (
//     <header className="w-full flex items-center justify-between px-4 md:px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-40">
//       {/* Left Section */}
//       <div className="flex items-center gap-3">
//         {/* Mobile Menu Toggle */}
//         {setSidebarOpen && (
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="md:hidden rounded-md p-2 hover:bg-gray-100 transition"
//           >
//             <Menu size={20} className="text-[#1A2380]" />
//           </button>
//         )}
//         <h2 className="text-lg font-semibold text-[#1A2380] truncate">{title}</h2>
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center gap-5">
//         {/* Search Bar */}
//         {showSearch && (
//           <div className="relative hidden md:block">
//             <Search
//               size={18}
//               className="absolute left-3 top-2.5 text-gray-400 pointer-events-none"
//             />
//             <input
//               type="text"
//               placeholder="Search patient or record"
//               className="w-64 rounded-full border border-gray-200 pl-9 pr-3 py-2 text-sm focus:ring-1 focus:ring-[#00B8A8] focus:border-[#00B8A8] outline-none"
//             />
//           </div>
//         )}

//         {/* Notification */}
//         <button className="relative p-2 rounded-md hover:bg-gray-100 transition">
//           <Bell size={20} className="text-gray-500" />
//           <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-[#00B8A8]" />
//         </button>

//         {/* User Info */}
//         <div className="flex items-center gap-2">
//           {user.avatar ? (
//             <Image
//               src={user.avatar}
//               alt={user.name}
//               width={36}
//               height={36}
//               className="rounded-full"
//             />
//           ) : (
//             <div className="h-9 w-9 rounded-full bg-[#1A2380] flex items-center justify-center text-white text-sm font-semibold">
//               {user.name.charAt(0).toUpperCase()}
//             </div>
//           )}

//           <div className="hidden md:block">
//             <p className="text-sm font-medium text-[#1A2380]">{user.name}</p>
//             <p className="text-xs text-gray-500">{user.role}</p>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }


// 'use client';

// import { Bell, Search, Menu } from 'lucide-react';
// import Image from 'next/image';
// import { useEffect, useState } from 'react';
// import { authService, organizationService } from "@services/api";

// interface HeaderProps {
//   setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
//   showSearch?: boolean;
//   organizationId?: string
// }

// export default function Header({
//   setSidebarOpen,
//   showSearch = true,
//   organizationId
// }: HeaderProps) {

//   const [doctorName, setDoctorName] = useState("");
//   const [organizationName, setOrganizationName] = useState("");
//   const [role, setRole] = useState("Doctor");
//   const [orgId, setOrgId] = useState<string | null>(null);

//   useEffect(() => {
//     const loadHeaderData = async () => {
//       try {
//         // 1️⃣ Get logged in user
//         const me = await authService.getMe(); 

//         setDoctorName(`${me.first_name} ${me.last_name}`);
//         setRole(me.role || "Doctor");

//         // 2️⃣ Get organization
//         if(!organizationId) return;
//         const orgs = await organizationService.getOrganizations();
//         const orgList = orgs?.data || orgs;
//         console.log("Organizations data:", orgList)



// // if `me` has `organization_id`
// const myOrg = orgList.find((org: { id: any; }) => org.id === organizationId);

// if(myOrg) setOrganizationName(myOrg.name);
//       } catch (error) {
//         console.error("Header fetch failed", error);
//       }
//     };

//     loadHeaderData();
//   }, [organizationId]);

//   return (
//     <header className="w-full flex items-center justify-between px-4 md:px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-40">

//       {/* LEFT */}
//       <div className="flex items-center gap-3">
//         {setSidebarOpen && (
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="md:hidden rounded-md p-2 hover:bg-gray-100 transition"
//           >
//             <Menu size={20} className="text-[#1A2380]" />
//           </button>
//         )}

//         <h2 className="text-lg font-semibold text-[#1A2380] truncate">
//           {organizationName || "Loading organization..."}
//         </h2>
//       </div>

//       {/* RIGHT */}
//       <div className="flex items-center gap-5">

//         {showSearch && (
//           <div className="relative hidden md:block">
//             <Search
//               size={18}
//               className="absolute left-3 top-2.5 text-gray-400 pointer-events-none"
//             />
//             <input
//               type="text"
//               placeholder="Search patient or record"
//               className="w-64 rounded-full border border-gray-200 pl-9 pr-3 py-2 text-sm focus:ring-1 focus:ring-[#00B8A8] focus:border-[#00B8A8] outline-none"
//             />
//           </div>
//         )}

//         <button className="relative p-2 rounded-md hover:bg-gray-100 transition">
//           <Bell size={20} className="text-gray-500" />
//           <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-[#00B8A8]" />
//         </button>

//         {/* USER */}
//         <div className="flex items-center gap-2">
//           <div className="h-9 w-9 rounded-full bg-[#1A2380] flex items-center justify-center text-white text-sm font-semibold">
//             {doctorName ? doctorName.charAt(0).toUpperCase() : "D"}
//           </div>

//           <div className="hidden md:block">
//             <p className="text-sm font-medium text-[#1A2380]">
//               {doctorName || "Loading..."}
//             </p>
//             <p className="text-xs text-gray-500">{role}</p>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }


'use client';

import { Bell, Search, Menu } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';


interface HeaderProps {
  setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  showSearch?: boolean;
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