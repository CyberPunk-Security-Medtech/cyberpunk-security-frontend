import React from "react";

const OverviewTab = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Encryption Settings */}
            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-4">Encryption Settings</h3>
                {[
                    "Patient Records Encryption - AES-256 field-level encryption",
                    "Database Encryption - TDE with automated key rotation",
                    "Transport Layer Security - TLS 1.3 for all communication",
                    "Patient Records Encryption - AES-256 field-level encryption"
                ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <span className="text-sm text-gray-700">{item}</span>
                        <span className="text-xs bg-green-100 text-black px-2 py-0.5 rounded-full">Active</span>
                    </div>
                ))}
            </div>

            {/* Data Retention Policies */}
            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-4">Data Retention Policies</h3>
                {[
                    { label: "Patient Records - 7 years post-treatment" },
                    { label: "Audit Logs - 3 years retention" },
                    { label: "Consent Records - Permanent retention" }
                ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <span className="text-sm text-gray-700">{item.label}</span>
                        <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OverviewTab;
