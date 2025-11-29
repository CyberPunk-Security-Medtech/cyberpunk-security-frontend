"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@context/AuthContext";

export default function WorkspaceSelectPage() {
  const router = useRouter();
  const { user, workspaces, setWorkspace } = useAuth();

  const handleSelect = (workspace: any) => {
    setWorkspace(workspace);
    router.push(`/dashboard/${workspace.role}-dashboard`);
  };

  return (
    <div className="min-h-screen w-full bg-white px-6 md:px-[140px] lg:px-[160px] py-12">
      
      {/* Logo */}
      <div className="mb-6">
        <Image src="/auth_logo.svg" width={160} height={50} alt="PrivaCure" />
      </div>

      {/* Confirm Email Badge */}
      <div className="inline-flex items-center gap-2 bg-[#E9FFFB] px-4 py-2 rounded-full text-sm text-gray-700 mb-10">
        <span className="font-medium text-[#0A8377]">Confirm as</span>
        <span>{user?.email}</span>
        <button className="text-[#1E237E] text-xs underline ml-2">Change</button>
      </div>

      {/* Welcome Header */}
      <h1 className="text-[30px] font-semibold text-gray-900">
        Welcome back! You look nice today.
      </h1>
      <p className="text-gray-500 text-[15px] mt-1">
        Choose a workspace below to get back to working with your team.
      </p>

      {/* Workspace Cards */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((ws: any) => (
          <div
            key={ws.id}
            onClick={() => handleSelect(ws)}
            className="cursor-pointer bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            
            {/* Title Row */}
            <div className="flex items-center mb-6">
              <div className="bg-[#E9FFFB] w-[42px] h-[42px] rounded-full flex items-center justify-center">
                <Image
                  src= {ws.img}
                  width={20}
                  height={20}
                  alt="Lightning"
                />
              </div>

              <h3 className="ml-3 text-[17px] font-medium text-gray-800">
                {ws.name}
              </h3>
            </div>

            {/* Details */}
            <div className="text-[14px] text-gray-600 mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-gray-500">Role</span>
                <span className="font-medium">{ws.role}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Last Active</span>
                <span className="font-medium">
                  {ws.lastActive || "Last visited 2 days ago"}
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-end">
              <span className="text-[#1E237E] text-sm font-medium hover:underline flex items-center gap-1">
                Enter Workspace →
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-16">
        Not seeing your workspace?
        <button className="text-[#1E237E] underline ml-1">
          Try a different email.
        </button>
      </div>
    </div>
  );
}