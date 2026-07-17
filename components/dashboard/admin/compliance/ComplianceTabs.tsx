'use client'

import { useState } from "react";
import AuditLogsTable from "./AuditLogsTable";
import { ConsentManagementTable } from "./ConsentManagementTable";
import { RoleAccessCard } from "./RoleAccessCard";




const TABS = ["Overview", "Audit Logs", "Consent Management", "Role Management", "Risk Assessment"];

export default function ComplianceTabs() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="mt-6 min-w-0">
      {/* TAB HEADERS */}
      <div className="dashboard-table-scroll overflow-x-auto rounded-full bg-gray-50 p-1" aria-label="Compliance sections">
        <div className="flex min-w-max" role="tablist">
        {TABS.map((tab, index) => (
          <button
            key={tab}
            id={`compliance-tab-${index}`}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`compliance-panel-${index}`}
            tabIndex={activeTab === tab ? 0 : -1}
            onClick={() => setActiveTab(tab)}
            className={`min-h-10 flex-none rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466] ${
              activeTab === tab
                ? "bg-white shadow font-medium text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      <div
        id={`compliance-panel-${TABS.indexOf(activeTab)}`}
        role="tabpanel"
        aria-labelledby={`compliance-tab-${TABS.indexOf(activeTab)}`}
        className="mt-6 min-w-0 focus:outline-none"
        tabIndex={0}
      >
        {activeTab === "Overview" && <div>/* Overview contents here */</div>}
        {activeTab === "Audit Logs" && <AuditLogsTable />}
        {activeTab === "Consent Management" && <ConsentManagementTable />}
        {activeTab === "Role Management" && <RoleAccessCard />}
        {activeTab === "Risk Assessment" && <div>/* Risk assessment UI */</div>}
      </div>
    </div>
  );
}
