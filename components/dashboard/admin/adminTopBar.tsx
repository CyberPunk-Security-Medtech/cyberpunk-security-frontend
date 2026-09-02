'use client'

import { Plus } from "lucide-react";
import Button from "@components/Button"
import { useAuth } from "@context/AuthContext";

type TopbarProps = {
  onAddPatientClick?: () => void;
};

export default function Topbar({ onAddPatientClick }: TopbarProps) {
  const { user } = useAuth();
  const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  const displayName = fullName || user?.email?.split("@")?.[0] || "Administrator";
  return (
    <header className="flex flex-col gap-4 border-b bg-white px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div>
        <h1 className="dashboard-page-title">Dashboard Overview</h1>
        <p className="text-sm text-slate-500">Welcome back, {displayName}.</p>
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:justify-end">
        <Button
          type="button"
          onSubmitHandler={onAddPatientClick}
          size="lg"
          variant="primary"
          className="rounded-full"
        >
          <Plus className="w-4 h-4" />
          Add Patient
        </Button>

      </div>
    </header>
  );
}
