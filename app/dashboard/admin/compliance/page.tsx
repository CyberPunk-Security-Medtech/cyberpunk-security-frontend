import { CalendarDays, Clock3, Download, Plus } from "lucide-react";
import ComplianceSummaryCard from "@components/dashboard/admin/compliance/ComplianceSummaryCard";
import ComplianceTabs from "@components/dashboard/admin/compliance/ComplianceTabs";

export default function CompliancePage() {
  return (
    <div className="min-h-full bg-gradient-to-br from-[#EFFBFA] via-[#F7F8F8] to-[#F7F8F8] px-4 py-6 md:px-8">
      <div className="w-full space-y-6">
        <header className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="dashboard-page-title text-slate-950">
              Compliance Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor NDPR compliance, security settings, and audit trails
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled
              title="Report export is not connected yet"
              className="dashboard-button min-h-11 border border-slate-200 bg-white px-5 text-slate-800 disabled:opacity-100"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export Report
            </button>
            <button
              type="button"
              disabled
              title="Full audit runs are not connected yet"
              className="dashboard-button min-h-11 bg-[#21178C] px-5 text-white disabled:opacity-100"
            >
              <Plus className="h-5 w-5" aria-hidden="true" />
              Run Full Audit
            </button>
          </div>
        </header>

        <div className="grid max-w-[35rem] grid-cols-1 gap-4 sm:grid-cols-2">
          <ComplianceSummaryCard
            title="Access Control"
            value="Active Access Control"
            valueColor="text-[#8A00FF]"
            icon={<CalendarDays className="h-6 w-6" />}
          />
          <ComplianceSummaryCard
            title="Encryption Status"
            value="Active Encryption of Data"
            valueColor="text-[#064BFF]"
            icon={<Clock3 className="h-6 w-6" />}
          />
        </div>

        <ComplianceTabs />
      </div>
    </div>
  );
}
