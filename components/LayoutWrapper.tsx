// 'use client'

// import { useState } from "react";
// import Topbar from "./Header";
// import Sidebar from "./SideBar";

// export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
//   // Manage sidebar open/close state
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex min-h-screen bg-[#F9FAFB]">
//       <Sidebar />

//       <div className="flex-1 flex flex-col">
//         <Topbar setSidebarOpen={setSidebarOpen} /> 
//         <main className="flex-1 overflow-y-auto px-8 py-6">{children}</main>
//       </div>
//     </div>
//   );
// }
