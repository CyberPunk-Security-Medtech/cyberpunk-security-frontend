'use client'

import ToggleSwitch from "./ToggleSwitch";
import { useState } from "react";

type PolicyType = "patient" | "audit" | "consent";

interface PolicyState {
  patient: boolean;
  audit: boolean;
  consent: boolean;
}

export default function DataRetentionPoliciesCard() {
  const [policy, setPolicy] = useState<PolicyState>({
    patient: true,
    audit: false,
    consent: false,
  });

  const policies: { title: string; desc: string; key: PolicyType }[] = [
    { title: "Patient Records", desc: "7 years post-treatment", key: "patient" },
    { title: "Audit Logs", desc: "3 years retention", key: "audit" },
    { title: "Consent Records", desc: "Permanent retention", key: "consent" },
  ];

  return (
    <div className="bg-white rounded-xl border p-6 w-[380px]">
      <h3 className="font-semibold text-lg mb-4">Data Retention Policies</h3>

      {policies.map(({ title, desc, key }) => (
        <div
          key={title}
          className="flex justify-between items-center py-3 border-b last:border-none"
        >
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-slate-500">{desc}</p>
          </div>
          <ToggleSwitch
            checked={policy[key]}
            onChange={() => setPolicy((prev) => ({ ...prev, [key]: !prev[key] }))}
          />
        </div>
      ))}
    </div>
  );
}
