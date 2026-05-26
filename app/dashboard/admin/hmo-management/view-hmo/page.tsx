"use client";

import ClaimsChart from "@components/dashboard/admin/hmo-management/ClaimsChart";
import HMOStatusCard from "@components/dashboard/admin/hmo-management/HMOStatusCard";
import HMOViewHeader from "@components/dashboard/admin/hmo-management/HMOViewHeader";
import HMOViewStatsCards from "@components/dashboard/admin/hmo-management/HMOViewStatCards";
import MedicalsChart from "@components/dashboard/admin/hmo-management/MedicalChart";
import PaymentsChart from "@components/dashboard/admin/hmo-management/PaymentsChart";
import ReferralsChart from "@components/dashboard/admin/hmo-management/ReferralsChart";
import Sidebar from "@components/dashboard/admin/Sidebar";
import Header from "@components/Header";


export default function HMOViewPage() {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <Header />

  <div className="px-6 py-4">
       <div className="max-w-[1400px] mx-auto space-y-6">
          <HMOViewHeader />
          <HMOViewStatsCards />

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2"> 
              <MedicalsChart />
            </div> 

            <div>
            <ClaimsChart pending={6} approved={11} rejected={8} />
            </div> 
           </div> 

           <div className="grid grid-cols-3 gap-6">
         <PaymentsChart payments={1000} premium={40} claims={60} />
        <ReferralsChart total={1000} approved={4000} pending={1000} />
          <HMOStatusCard status="Active" />

          </div>  
        </div>
        </div>
      </main>
    </div>
  );
}
