"use client";

import { useEffect, useState } from "react";
import OverviewCards from "@components/dashboard/nurse/OverviewCards";
import TodayAppointments from "@components/dashboard/nurse/TodaysAppointment";
import { authService } from "@services/api";

const formatNurseName = (user: any): string => {
  const firstName = (user?.first_name ?? "").toString().trim();
  const lastName = (user?.last_name ?? "").toString().trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  if (fullName) return fullName;

  const emailPrefix = (user?.email ?? "").toString().split("@")[0]?.trim();
  return emailPrefix || "Doctor";
};

export default function Dashboard() {
  const [nurseName, setNurseName] = useState("Nurse");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const meRes = await authService.getMe();
        const me = meRes?.data ?? meRes;
        setNurseName(formatNurseName(me));
      } catch (err) {
        console.error("Failed to load nurse profile", err);
        setNurseName("Nurse");
      }
    };

    void fetchUser();
  }, []);

  return (
    <>
      <h2 className="text-xl font-semibold text-[#1A2380] mb-1">
        Good morning, Nurse {nurseName}!
      </h2>
      <p className="text-gray-500 mb-8">Welcome back to PrivaCure dashboard</p>

      <OverviewCards />
      <TodayAppointments />
      {/* <LabTest /> */}
    </>
  );
}
