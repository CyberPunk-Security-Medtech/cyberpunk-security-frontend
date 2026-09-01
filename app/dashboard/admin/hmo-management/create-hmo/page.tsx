"use client";

import { useState } from "react";

import HMOHeader from "@components/dashboard/admin/hmo-management/HMOHeader";
import HMOActions from "@components/dashboard/admin/hmo-management/HMOActions";
import HMOTable from "@components/dashboard/admin/hmo-management/HMOTable";

import CreateHMOPage from "@components/dashboard/admin/hmo-management/CreateHMOPage";


export default function HMOManagementPage() {

  const [isAddHmoModalOpen, setIsAddHmoModalOpen] =
    useState(false);


  return (

    <div className="p-6 space-y-6">


          <HMOHeader />


          <HMOActions
            onAdd={() => setIsAddHmoModalOpen(true)}
          />



          <CreateHMOPage
            isOpen={isAddHmoModalOpen}
            onClose={() =>
              setIsAddHmoModalOpen(false)
            }
          />



          <div className="bg-white rounded-xl border overflow-hidden">

            <HMOTable />

          </div>


    </div>

  );
}
