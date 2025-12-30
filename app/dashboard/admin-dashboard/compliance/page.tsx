import ComplianceSummaryCard from "@components/dashboard/admin-dashboard/compliance/ComplianceSummaryCard";
import ComplianceTabs from "@components/dashboard/admin-dashboard/compliance/ComplianceTabs";
import DataRetentionPoliciesCard from "@components/dashboard/admin-dashboard/compliance/DataRetentionPoliciesCard";
import EncryptionSettingsCard from "@components/dashboard/admin-dashboard/compliance/EncryptionSettingsCard";
import Sidebar from "@components/dashboard/admin-dashboard/Sidebar";
import Header from "@components/Header";

export default function CompliancePage() {
  return (
     <div className="min-h-screen flex bg-slate-50 text-slate-900">
          <Sidebar />
    
          <main className="flex-1 flex flex-col">
            <Header />
    <div className="p-6 space-y-6">
      {/* Top summary cards */}
      <div className="grid grid-cols-4 gap-4">
        <ComplianceSummaryCard title="NDPR Compliance" value="98%" subText="Last checked: 2 hours ago" />
        <ComplianceSummaryCard title="Access Control" value="5" subText="12 active" valueColor="text-[#6C47FF]" />
        <ComplianceSummaryCard title="Data Retention" value="0" subText="3 active" valueColor="text-[#EA580C]" />
        <ComplianceSummaryCard title="Encryption Status" value="AES-256" subText="100% coverage" valueColor="text-[#0027FF]" />
      </div>

      <ComplianceTabs />

      <div className="flex gap-4">
        <EncryptionSettingsCard />
        <DataRetentionPoliciesCard />
      </div>
    </div>
    </main>
    </div>
  );
}
