"use client";

import { useRef, useState } from "react";
import AuditLogsTable from "./AuditLogsTable";
import { ConsentManagementTable } from "./ConsentManagementTable";
import { RoleAccessCard } from "./RoleAccessCard";
import DataRetentionPoliciesCard from "./DataRetentionPoliciesCard";
import EncryptionSettingsCard from "./EncryptionSettingsCard";

const TABS = [
  "Overview",
  "Audit Logs",
  "Consent Management",
  "Role Management",
] as const;

type ComplianceTab = (typeof TABS)[number];

export default function ComplianceTabs() {
  const [activeTab, setActiveTab] = useState<ComplianceTab>("Overview");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeTabIndex = TABS.indexOf(activeTab);

  const selectTab = (index: number) => {
    const normalizedIndex = (index + TABS.length) % TABS.length;
    setActiveTab(TABS[normalizedIndex]);
    const nextTab = tabRefs.current[normalizedIndex];
    nextTab?.focus();
    nextTab?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "nearest",
      inline: "nearest",
    });
  };

  return (
    <section className="min-w-0" aria-label="Compliance details">
      <div className="dashboard-table-scroll overflow-x-auto rounded-full bg-[#ECECF1] p-1">
        <div
          className="grid min-w-[42rem] grid-cols-4"
          role="tablist"
          aria-label="Compliance sections"
        >
          {TABS.map((tab, index) => (
            <button
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              key={tab}
              id={`compliance-tab-${index}`}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`compliance-panel-${index}`}
              tabIndex={activeTab === tab ? 0 : -1}
              onClick={() => setActiveTab(tab)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  selectTab(index + 1);
                } else if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  selectTab(index - 1);
                } else if (event.key === "Home") {
                  event.preventDefault();
                  selectTab(0);
                } else if (event.key === "End") {
                  event.preventDefault();
                  selectTab(TABS.length - 1);
                }
              }}
              className={`min-h-8 rounded-full px-4 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#051466] motion-reduce:transition-none ${
                activeTab === tab
                  ? "bg-white font-medium text-slate-900 shadow-sm"
                  : "text-slate-700 hover:bg-white/60"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div
        id={`compliance-panel-${activeTabIndex}`}
        role="tabpanel"
        aria-labelledby={`compliance-tab-${activeTabIndex}`}
        className="mt-6 min-w-0 focus:outline-none"
        tabIndex={-1}
      >
        {activeTab === "Overview" && (
          <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
            <EncryptionSettingsCard />
            <DataRetentionPoliciesCard />
          </div>
        )}
        {activeTab === "Audit Logs" && <AuditLogsTable />}
        {activeTab === "Consent Management" && <ConsentManagementTable />}
        {activeTab === "Role Management" && <RoleAccessCard />}
      </div>
    </section>
  );
}
