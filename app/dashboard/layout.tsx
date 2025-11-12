// 'use client';

// import { useState } from 'react';
// import MobileMenu from '@components/MobileMenu';
// import MdMenu from '@components/MdMenu';
// import Header from '@components/Header';

// export default function DashboardLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>): React.ReactNode {
//     const [sidebarOpen, setSidebarOpen] = useState(false);
//     const [sidebarMinimize, setSidebarMinimize] = useState(true);

//     return (
//         <div className="font-sans">
//             <MobileMenu sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//             <div
//                 className={`grid grid-cols-1 ${sidebarMinimize ? 'md:grid-cols-[0.1fr_4fr]' : 'md:grid-cols-[0.5fr_4fr]'} h-screen`}
//             >
//                 <MdMenu
//                     setSidebarMinimize={setSidebarMinimize}
//                     sidebarMinimize={sidebarMinimize}
//                 />
//                 <div className="flex flex-col px-4 lg:px-4">
//                     <Header setSidebarOpen={setSidebarOpen} />
//                     <main className="flex-1">{children}</main>
//                 </div>
//             </div>
//         </div>
//     );
// }


// 'use client'

// import Header from "@components/Header";
// import Sidebar from "@components/SideBar";
// import { useState } from "react";


// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   // Manage sidebar open/close state
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex min-h-screen bg-[#F9FAFB]">
//       <Sidebar />

//       <div className="flex-1 flex flex-col">
//         <Header setSidebarOpen={setSidebarOpen} /> 
//         <main className="flex-1 overflow-y-auto px-8 py-6">{children}</main>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import Sidebar from '@components/SideBar';
import Header from '@components/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarMinimize, setSidebarMinimize] = useState(false);
const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="font-sans h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarMinimize={sidebarMinimize} setSidebarMinimize={setSidebarMinimize} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 bg-[#F9FAFB]">
       <Header setSidebarOpen={setSidebarOpen} /> 
        <main className="flex-1 overflow-y-auto px-6 py-4">{children}</main>
      </div>
    </div>
  );
}
