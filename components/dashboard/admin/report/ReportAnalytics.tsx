'use client';

import {
  Download,
} from "lucide-react";
import StatCard from "./StatCard";
import MiniStat from "./MiniStat";
import ActivityList from "./ActivityList";
import TopicCard from "./TopicCard";
import ActivityChart from "./ActivityChart";

export default function ReportsAnalytics() {
  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="dashboard-page-title text-slate-900">
          Reports / Analytics
        </h1>

        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white border rounded-lg hover:bg-slate-100">
          <Download size={16} />
          Download
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {[
          "Timeframe: All-time",
          "Medical Personnel: All",
          "Transfer Quarter: All",
        ].map((filter) => (
          <select
            key={filter}
            className="px-4 py-2 text-sm bg-white border rounded-full outline-none"
          >
            <option>{filter}</option>
          </select>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Active Users" value="27/80" />
        <StatCard title="Monthly Usage" value="3,298" />
        <StatCard title="Av. Daily Session Length" value="12hr 34s" />
        <StatCard title="Total Patients Transfer" value="624" />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MiniStat title="Patients Transfer" value="86%" />
        <MiniStat title="Daily Active Staffs" value="+34%" />
        <ActivityChart />
      </div>

      {/* Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopicCard
          title="Weakest Topics"
          items={[
            { label: "Food Safety", value: 74, color: "bg-orange-500" },
            { label: "Compliance Basics Procedures", value: 52, color: "bg-orange-400" },
            { label: "Company Networking", value: 36, color: "bg-orange-300" },
          ]}
        />

        <TopicCard
          title="Strongest Topics"
          items={[
            { label: "Covid Protocols", value: 95, color: "bg-green-500" },
            { label: "Cyber Security Basics", value: 92, color: "bg-green-400" },
            { label: "Social Media Policies", value: 89, color: "bg-green-300" },
          ]}
        />
      </div>

      {/* Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityList title="Doctors / Nurse Activity" />
        <ActivityList title="Lab Technician Activity" />
      </div>

    </div>
  );
}
