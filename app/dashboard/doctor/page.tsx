"use client";

import { useEffect, useState } from "react";
import OverviewCards from "@components/dashboard/doctor/OverviewCards";
import TodayAppointments from "@components/dashboard/doctor/TodaysAppointment";
import { authService } from "@services/api";
import { getTimeGreeting } from "@utils/greeting";

const formatDoctorName = (user: any): string => {
  const firstName = (user?.first_name ?? "").toString().trim();
  const lastName = (user?.last_name ?? "").toString().trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  if (fullName) return fullName;

  const emailPrefix = (user?.email ?? "").toString().split("@")[0]?.trim();
  return emailPrefix || "Doctor";
};

export default function Dashboard() {
  const [doctorName, setDoctorName] = useState("Doctor");
  const greeting = getTimeGreeting();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const meRes = await authService.getMe();
        const me = meRes?.data ?? meRes;
        setDoctorName(formatDoctorName(me));
      } catch (err) {
        console.error("Failed to load doctor profile", err);
        setDoctorName("Doctor");
      }
    };

    void fetchUser();
  }, []);

  return (
    <>
      <h2 className="text-xl font-semibold text-[#1A2380] mb-1">
        {greeting}, Dr. {doctorName}!
      </h2>
      <p className="text-gray-500 mb-8">Welcome back to PrivaCure dashboard</p>

      <OverviewCards />
      <TodayAppointments />
      {/* <LabTest /> */}
    </>
  );
}
