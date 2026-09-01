'use client'
import StaffActions from "@components/dashboard/admin/staff-management/StaffActions";
import StaffManagementHeader from "@components/dashboard/admin/staff-management/StaffManagementHeader";
import StaffTable from "@components/dashboard/admin/staff-management/StaffTable";

export default function StaffManagementPage() {


  return (
    <div className="space-y-6 p-4 sm:p-6">
          <StaffManagementHeader />

          <StaffActions />

          <div className="overflow-hidden rounded-xl border bg-white">
            <StaffTable />
          </div>
    </div>
  );
}
