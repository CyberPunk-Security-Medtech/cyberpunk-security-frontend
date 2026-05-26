'use client'

import { useState } from "react";
import AuditLogsTable from "./AuditLogsTable";
import { ConsentManagementTable } from "./ConsentManagementTable";
import { RoleAccessCard } from "./RoleAccessCard";




const TABS = ["Overview", "Audit Logs", "Consent Management", "Role Management", "Risk Assessment"];

export default function ComplianceTabs() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="mt-6">
      {/* TAB HEADERS */}
      <div className="flex bg-gray-50 rounded-full p-1 overflow-hidden">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm rounded-full transition ${
              activeTab === tab
                ? "bg-white shadow font-medium text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="mt-6">
        {activeTab === "Overview" && <div>/* Overview contents here */</div>}
        {activeTab === "Audit Logs" && <AuditLogsTable />}
        {activeTab === "Consent Management" && <ConsentManagementTable />}
        {activeTab === "Role Management" && <RoleAccessCard />}
        {activeTab === "Risk Assessment" && <div>/* Risk assessment UI */</div>}
      </div>
    </div>
  );
}
