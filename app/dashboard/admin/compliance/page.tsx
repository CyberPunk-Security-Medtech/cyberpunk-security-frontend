import ComplianceSummaryCard from "@components/dashboard/admin/compliance/ComplianceSummaryCard";
import ComplianceTabs from "@components/dashboard/admin/compliance/ComplianceTabs";
import DataRetentionPoliciesCard from "@components/dashboard/admin/compliance/DataRetentionPoliciesCard";
import EncryptionSettingsCard from "@components/dashboard/admin/compliance/EncryptionSettingsCard";

export default function CompliancePage() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ComplianceSummaryCard title="NDPR Compliance" value="98%" subText="Last checked: 2 hours ago" />
        <ComplianceSummaryCard title="Access Control" value="5" subText="12 active" valueColor="text-[#6C47FF]" />
        <ComplianceSummaryCard title="Data Retention" value="0" subText="3 active" valueColor="text-[#EA580C]" />
        <ComplianceSummaryCard title="Encryption Status" value="AES-256" subText="100% coverage" valueColor="text-[#0027FF]" />
      </div>

      <ComplianceTabs />

      <div className="flex flex-col gap-4 xl:flex-row">
        <EncryptionSettingsCard />
        <DataRetentionPoliciesCard />
      </div>
    </div>
  );
}
