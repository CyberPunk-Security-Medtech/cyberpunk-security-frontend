"use client";

import HMOActions from "@components/dashboard/admin/hmo-management/HMOActions";
import HMOHeader from "@components/dashboard/admin/hmo-management/HMOHeader";
import HMOSetupModal from "@components/dashboard/admin/hmo-management/HMOSetupModal";
import HMOTable from "@components/dashboard/admin/hmo-management/HMOTable";
import { useState } from "react";

export default function HMOManagementPage() {
  const [isAddHmoModalOpen, setIsAddHmoModalOpen] = useState(false);

  return (
    <div className="space-y-6 p-4 sm:p-6">
          <HMOHeader />

          <HMOActions onAdd={() => setIsAddHmoModalOpen(true)} />

          <HMOSetupModal
            isOpen={isAddHmoModalOpen}
            onClose={() => setIsAddHmoModalOpen(false)}
          />

         <div className="bg-white rounded-xl border overflow-hidden">
                    <HMOTable />
        </div>
    </div>
  );
}
