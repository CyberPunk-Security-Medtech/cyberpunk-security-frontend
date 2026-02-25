'use client'

import AnalyticsOverview from "@components/dashboard/admin-dashboard/AnalyticsOverview";
import AddPatientModal from "@components/dashboard/doctor-dashboard/AddPatientModal";
import PatientTable from "@components/dashboard/admin-dashboard/patientTable";
import RecentActivity from "@components/dashboard/admin-dashboard/recentActivity";
import Sidebar from "@components/dashboard/admin-dashboard/Sidebar";
import StatCardsRow from "@components/dashboard/admin-dashboard/statRowCards";
import TotalTransfers from "@components/dashboard/admin-dashboard/totalTransfers";
import Performance from "@components/dashboard/admin-dashboard/performance";
import Header from "@components/Header";
import Topbar from "@components/dashboard/admin-dashboard/adminTopBar";
import { useAuth } from "@context/AuthContext";
import { useState } from "react";



export default function AdminDashboard() {
    const { activeWorkspace } = useAuth();
    const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
    const [patientTableRefreshVersion, setPatientTableRefreshVersion] = useState(0);


  if (!activeWorkspace?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No organization selected</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header />
        <Topbar onAddPatientClick={() => setIsAddPatientModalOpen(true)} />
        <AddPatientModal
          isOpen={isAddPatientModalOpen}
          onClose={() => setIsAddPatientModalOpen(false)}
          onCreated={() =>
            setPatientTableRefreshVersion((current) => current + 1)
          }
        />
        <div className="px-8 py-6 space-y-6">
          <AnalyticsOverview />
          <StatCardsRow />
          <div className="grid lg:grid-cols-[1.4fr,1.4fr,1fr] gap-4">
            <RecentActivity />
            <Performance />
            <TotalTransfers />
          </div>
          <PatientTable refreshVersion={patientTableRefreshVersion} />
        </div>
      </main>
    </div>
  );
}


// "use client";

// import { useAuth } from "@context/AuthContext";
// import AnalyticsOverview from "@components/dashboard/admin-dashboard/AnalyticsOverview";
// import PatientTable from "@components/dashboard/admin-dashboard/patientTable";
// import RecentActivity from "@components/dashboard/admin-dashboard/recentActivity";
// import Sidebar from "@components/dashboard/admin-dashboard/Sidebar";
// import StatCardsRow from "@components/dashboard/admin-dashboard/statRowCards";
// import TotalTransfers from "@components/dashboard/admin-dashboard/totalTransfers";
// import Performance from "@components/dashboard/admin-dashboard/performance";
// import Header from "@components/Header";
// import Topbar from "@components/dashboard/admin-dashboard/adminTopBar";

// export default function AdminDashboard() {
//   const { activeWorkspace } = useAuth();

//   // ⛔ Hard guard
//   if (!activeWorkspace?.id) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-500">No organization selected</p>
//       </div>
//     );
//   }

//   const orgId = activeWorkspace.id;

//   return (
//     <div className="min-h-screen flex bg-slate-50 text-slate-900">
//       <Sidebar />

//       <main className="flex-1 flex flex-col">
//         <Header />
//         <Topbar orgId={orgId} />

//         <div className="px-8 py-6 space-y-6">
//           <AnalyticsOverview orgId={orgId} />
//           <StatCardsRow orgId={orgId} />

//           <div className="grid lg:grid-cols-[1.4fr,1.4fr,1fr] gap-4">
//             <RecentActivity orgId={orgId} />
//             <Performance orgId={orgId} />
//             <TotalTransfers orgId={orgId} />
//           </div>

//           <PatientTable orgId={orgId} />
//         </div>
//       </main>
//     </div>
//   );
// }

