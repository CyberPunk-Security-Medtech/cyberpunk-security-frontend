import React from "react";
import DataCard from "@components/dashboard/compliance/DataCard";

const DashboardStats = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <DataCard title="NDPR Compliance" value="98%" subtitle="Last checked: 2 hours ago" highlight />
            <DataCard title="Access Control" value={5} subtitle="12 active" />
            <DataCard title="Data Retention" value={0} subtitle="3 active" />
            <DataCard title="Encryption Status" value="AES-256" subtitle="100% coverage" highlight />
        </div>
    );
};

export default DashboardStats;
