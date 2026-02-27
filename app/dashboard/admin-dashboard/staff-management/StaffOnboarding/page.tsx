"use client";

import { useState } from "react";
import Header from "@components/Header";
import Sidebar from "@components/dashboard/admin-dashboard/Sidebar";
import Image from "next/image";
import { invitationService } from "@services/api";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

export default function StaffOnboarding() {
  const { activeWorkspace } = useAuth(); 

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeWorkspace?.id) {
      toast.error("No active organization selected");
      return;
    }

    if (!email || !role) {
      toast.error("Email and role are required");
      return;
    }

    try {
      setLoading(true);

      await invitationService.sendInvitation(
        email,
        role,
        activeWorkspace.id, 
      );

      toast.success("Invitation sent successfully");
    } catch (err) {
      let message = "Failed to send invitation";
      if (axios.isAxiosError(err)) {
        message =
          err.response?.data?.message ||
          err.response?.data?.detail ||
          message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <Header />

        <div className="flex justify-center items-center py-10 px-6">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm px-10 py-14 text-center">
            <div className="flex flex-col items-center mb-6">
              <Image src="/auth_logo.svg" width={110} height={70} alt="PrivaCure" />
            </div>

            <h1 className="text-2xl font-semibold mb-1">
              Staff Onboarding Setup
            </h1>
            <p className="text-gray-500 mb-8">
              Staff Invitation Links
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="text-left">
                <label className="block text-sm font-medium mb-1">
                  Staff Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full border px-4 py-3 text-sm"
                />
              </div>

              <div className="text-left">
                <label className="block text-sm font-medium mb-1">
                  Role / Department
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-full border px-4 py-3 text-sm"
                >
                  <option value="">Select role</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="lab_technician">Lab Scientist</option>
                  <option value="pharmacist">Pharmacist</option>
                </select>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="rounded-full bg-[#1A2380] text-white w-full py-3 font-medium"
              >
                {loading ? "Sending..." : "Continue"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
