// export default function Compliance(): React.ReactNode {
//     return (
//         <div className="py-6">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
//                 <h1 className="text-2xl font-semibold text-gray-900">Compliance</h1>
//             </div>
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
//                 <div className="py-4">
//                     <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
//                 </div>
//             </div>
//         </div>
//     );
// }

'use client'

import React, { useState } from "react";
import ComplianceStats from "@components/dashboard/compliance/ComplianceStats";
import OverviewTab from "@components/dashboard/compliance/Tabs/OverviewTab";
import AuditLogsTab from "@components/dashboard/compliance/Tabs/AuditLogs";
import ConsentManagementTab from "@components/dashboard/compliance/Tabs/ConsentManagement";

const ComplianceDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    "Overview",
    "Audit Logs",
    "Consent Management",
    "Role Management",
    "Risk Management"
  ];

  return (
    <div className="p-6">
      {/* Stats */}
      <ComplianceStats />

      {/* Tabs */}
      <div className="bg-gray-100 rounded-full p-1 inline-flex mb-6">
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                ${isActive
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "Overview" && <OverviewTab />}
        {activeTab === "Audit Logs" && <AuditLogsTab />}
        {activeTab === "Consent Management" && <ConsentManagementTab />}
        {activeTab === "Role Management" && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            Role Management content here...
          </div>
        )}
        {activeTab === "Risk Management" && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            Risk Management content here...
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceDashboardPage;
