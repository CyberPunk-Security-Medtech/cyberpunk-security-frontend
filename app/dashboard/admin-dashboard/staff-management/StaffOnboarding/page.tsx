  "use client";

import Header from "@components/Header";
import React from "react";

import Image from "next/image"
import Sidebar from "@components/dashboard/admin-dashboard/Sidebar";
import { useRouter } from "next/navigation";


export default function StaffOnboarding() {
  const router = useRouter();

// export default function StaffOnboardingSetup() {
  return (
    <div className="min-h-screen flex bg-slate-50">
 <Sidebar/>
      
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <Header />

        {/* Page Container */}
        <div className="flex justify-center items-center py-10 px-6">
          {/* Main Card */}
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm px-10 py-14 text-center">
            
            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
              <Image src="/auth_logo.svg" width={110} height={70} alt="PrivaCure" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-semibold mb-1">Staff Onboarding Setup</h1>
            <p className="text-gray-500 mb-8">Staff Invitation Links</p>

           <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault(); 
                router.push(
                  "/dashboard/admin-dashboard/staff-management/StaffOnboarding/successPage"
                );
              }}
            >
              <div className="text-left">
                <label className="block text-sm font-medium mb-1">Staff Email</label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="w-full rounded-full border px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2380]"
                />
              </div>

              <div className="text-left">
                <label className="block text-sm font-medium mb-1">Role/Department (RBAC)</label>
                <select
                  className="w-full rounded-full border px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2380] appearance-none"
                >
                  <option>Enter Role</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="lab">Lab Scientist</option>
                  <option value="pharmacist">Pharmacist</option>
                </select>
              </div>

              <button
                type="submit"
                className="rounded-full bg-[#1A2380] text-white w-full py-3 font-medium hover:opacity-90 transition"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}