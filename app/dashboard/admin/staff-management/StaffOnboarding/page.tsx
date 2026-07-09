"use client";

import { useEffect, useState } from "react";
import Header from "@components/Header";
import Sidebar from "@components/dashboard/admin/Sidebar";
import Image from "next/image";
import {
  invitationService,
  organizationService,
  type Department,
} from "@services/api";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

export default function StaffOnboarding() {
  const { activeWorkspace } = useAuth(); 

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const isDoctorInvite = role === "doctor";

  useEffect(() => {
    if (!activeWorkspace?.id || !isDoctorInvite) {
      setDepartmentId("");
      return;
    }

    const loadDepartments = async () => {
      setLoadingDepartments(true);
      try {
        const rows = await organizationService.getDepartments(activeWorkspace.id);
        setDepartments(Array.isArray(rows) ? rows : []);
      } catch (error) {
        console.error("Failed to load departments", error);
        setDepartments([]);
        toast.error("Unable to load departments");
      } finally {
        setLoadingDepartments(false);
      }
    };

    loadDepartments();
  }, [activeWorkspace?.id, isDoctorInvite]);

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

    if (isDoctorInvite && !departmentId) {
      toast.error("Please select the doctor's department");
      return;
    }

    try {
      setLoading(true);

      await invitationService.sendInvitation(
        email,
        role,
        activeWorkspace.id,
        isDoctorInvite ? departmentId : null,
      );

      toast.success("Invitation sent successfully");
      setEmail("");
      setRole("");
      setDepartmentId("");
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
                  onChange={(e) => {
                    setRole(e.target.value);
                    setDepartmentId("");
                  }}
                  className="w-full rounded-full border px-4 py-3 text-sm"
                >
                  <option value="">Select role</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="record staff">Record Staff</option>
                  <option value="lab_technician">Lab Scientist</option>
                  <option value="pharmacist">Pharmacist</option>
                </select>
              </div>

              {isDoctorInvite && (
                <div className="text-left">
                  <label className="block text-sm font-medium mb-1">
                    Doctor Department
                  </label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full rounded-full border px-4 py-3 text-sm"
                    disabled={loadingDepartments}
                  >
                    <option value="">
                      {loadingDepartments
                        ? "Loading departments..."
                        : "Select doctor department"}
                    </option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                  {!loadingDepartments && departments.length === 0 && (
                    <p className="mt-2 text-xs text-gray-500">
                      No departments found. Create departments first from the
                      admin Departments page.
                    </p>
                  )}
                </div>
              )}

              <button
                disabled={
                  loading ||
                  (isDoctorInvite &&
                    (loadingDepartments ||
                      departments.length === 0 ||
                      !departmentId))
                }
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
