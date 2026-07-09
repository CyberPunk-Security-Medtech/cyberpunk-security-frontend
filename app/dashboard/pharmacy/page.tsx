"use client";

import { ComponentType, useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BellDot,
  Boxes,
  ChevronRight,
  CircleAlert,
  Pill,
  Users,
} from "lucide-react";
import { authService } from "@services/api";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getTimeGreeting } from "@utils/greeting";

const purchaseData = [
  { name: "5k", value: 18 },
  { name: "10k", value: 52 },
  { name: "15k", value: 41 },
  { name: "20k", value: 86 },
  { name: "25k", value: 49 },
  { name: "30k", value: 65 },
  { name: "35k", value: 29 },
  { name: "40k", value: 51 },
  { name: "45k", value: 44 },
  { name: "50k", value: 68 },
  { name: "55k", value: 47 },
  { name: "60k", value: 58 },
];

const formatPharmacyName = (user: any): string => {
  const firstName = (user?.first_name ?? "").toString().trim();
  const lastName = (user?.last_name ?? "").toString().trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  if (fullName) return fullName;

  const emailPrefix = (user?.email ?? "").toString().split("@")[0]?.trim();
  return emailPrefix || "Pharm Alex";
};

type Trend = {
  label: string;
  direction: "up" | "down";
};

type StatCard = {
  title: string;
  value: string;
  trend: Trend;
  icon: ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
  iconColor: string;
};

const statCards: StatCard[] = [
  {
    title: "Total User",
    value: "250",
    trend: { label: "8.9% Up from yesterday", direction: "up" },
    icon: Users,
    iconBg: "bg-[#EEF0FF]",
    iconColor: "text-[#7E8FE5]",
  },
  {
    title: "Inventory Status",
    value: "298",
    trend: { label: "1.3% Up from past week", direction: "up" },
    icon: Boxes,
    iconBg: "bg-[#FFF5DD]",
    iconColor: "text-[#E5B648]",
  },
  {
    title: "Medicines Available",
    value: "180",
    trend: { label: "4.3% Down from yesterday", direction: "down" },
    icon: Pill,
    iconBg: "bg-[#E8FBF1]",
    iconColor: "text-[#51C493]",
  },
  {
    title: "Critical Alerts",
    value: "5",
    trend: { label: "1.8% Up from yesterday", direction: "up" },
    icon: CircleAlert,
    iconBg: "bg-[#FFF1EC]",
    iconColor: "text-[#F08B66]",
  },
];

type BottomMetricCard = {
  title: string;
  rightLabel: string;
  rows: Array<{ value: string; label: string }>;
};

const bottomMetricCards: BottomMetricCard[] = [
  {
    title: "Inventory",
    rightLabel: "Go to Configuration",
    rows: [
      { value: "298", label: "Total no of Medicines" },
      { value: "24", label: "Medicine Groups" },
    ],
  },
  {
    title: "Quick Report",
    rightLabel: "January 2022",
    rows: [
      { value: "70,856", label: "Qty of Medicines Sold" },
      { value: "5,288", label: "Invoices Generated" },
    ],
  },
  {
    title: "My Pharmacy",
    rightLabel: "Go to User Management",
    rows: [
      { value: "04", label: "Total no of Suppliers" },
      { value: "05", label: "Total no of Users" },
    ],
  },
  {
    title: "Customers",
    rightLabel: "Go to Customers Page",
    rows: [
      { value: "845", label: "Total no of Customers" },
      { value: "Adalimumab", label: "Frequently bought item" },
    ],
  },
];

export default function PharmacyDashboardPage() {
  const [pharmacyName, setPharmacyName] = useState("Pharm Alex");
  const greeting = getTimeGreeting();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const meRes = await authService.getMe();
        const me = meRes?.data ?? meRes;
        setPharmacyName(formatPharmacyName(me));
      } catch (err) {
        console.error("Failed to load pharmacy profile", err);
      }
    };

    void fetchUser();
  }, []);

  const firstName = useMemo(
    () => pharmacyName.split(" ").filter(Boolean).slice(-1)[0] ?? "Alex",
    [pharmacyName]
  );

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[30px] leading-tight font-semibold text-[#151D48]">
            {greeting}, Pharm, {firstName}!
          </h1>
          <p className="text-sm text-[#737791]">
            A quick data overview of the inventory.
          </p>
        </div>

        <div className="w-full rounded-xl border border-[#E6EAF2] bg-[#F7FEFF] p-3 lg:max-w-[300px]">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-xs font-semibold text-[#00B6A0]">Notification</p>
            <BellDot size={14} className="text-[#00B6A0]" />
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#8A8FA2]">Critical alert for #P90022</span>
            <button className="text-[#00B6A0]">View all</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const TrendIcon = item.trend.direction === "up" ? ArrowUpRight : ArrowDownRight;
          const trendColor =
            item.trend.direction === "up" ? "text-[#2CCF99]" : "text-[#EE6D6D]";
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-xl border border-[#ECEFF5] bg-white p-5 shadow-[0_1px_1px_rgba(16,24,40,0.02)]"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-medium text-[#737791]">{item.title}</h3>
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${item.iconBg}`}
                >
                  <Icon size={18} className={item.iconColor} />
                </span>
              </div>
              <p className="text-[30px] leading-none font-semibold text-[#151D48]">
                {item.value}
              </p>
              <p className={`mt-3 inline-flex items-center gap-1 text-xs ${trendColor}`}>
                <TrendIcon size={13} />
                {item.trend.label}
              </p>
            </article>
          );
        })}
      </div>

      <article className="rounded-xl border border-[#ECEFF5] bg-white p-4 md:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[24px] font-semibold text-[#151D48]">Purchase Statistics</h2>
          <button className="inline-flex items-center gap-1 rounded-md border border-[#ECEFF5] px-3 py-1.5 text-xs text-[#737791]">
            October
            <ChevronRight size={14} className="rotate-90" />
          </button>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={purchaseData} margin={{ top: 8, right: 14, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#F0F2F5" strokeDasharray="2 4" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9AA3B2", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9AA3B2", fontSize: 11 }}
                ticks={[0, 20, 40, 60, 80, 100]}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4F7CFF"
                strokeWidth={2.2}
                dot={{ r: 3, fill: "#4F7CFF" }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {bottomMetricCards.map((card, cardIndex) => (
          <article
            key={card.title}
            className={`rounded-xl border border-[#E7EBF1] p-4 ${
              cardIndex === 0 ? "bg-[#F3F3F4]" : "bg-white"
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-[#23272E]">{card.title}</h3>
              <button className="inline-flex items-center gap-1 text-xs text-[#737791]">
                {card.rightLabel}
                {card.rightLabel.includes("January") ? (
                  <ChevronRight size={14} className="rotate-90" />
                ) : (
                  <ChevronRight size={14} />
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {card.rows.map((row) => (
                <div key={`${card.title}-${row.label}`}>
                  <p className="text-[24px] leading-none font-semibold text-[#23272E]">
                    {row.value}
                  </p>
                  <p className="mt-2 text-xs text-[#8D96A8]">{row.label}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

    </section>
  );
}
