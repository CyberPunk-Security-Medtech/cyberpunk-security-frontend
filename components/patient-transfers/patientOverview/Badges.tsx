"use client";

import { Check } from "lucide-react";
import { ConsentStatus } from "./PatientTransferTypes";


export function ConsentStatusBadge({ status }: { status: ConsentStatus }) {
  return (
    <span
      className={`inline-flex rounded px-3 py-1 text-sm font-medium ${
        status === "Granted"
          ? "bg-green-100 text-green-700"
          : "bg-red-200 text-red-600"
      }`}
    >
      {status === "Declined" ? "Denied" : status}
    </span>
  );
}

export function LabStatusBadge({ status }: { status: string }) {
  const styles =
    status === "Good"
      ? "border-[#00B8A8] text-[#00B8A8]"
      : status === "Bad"
        ? "border-orange-400 text-orange-500"
        : "border-[#7C83E8] text-[#4F56B3]";

  return (
    <span className={`inline-flex rounded-full border px-4 py-1 text-sm ${styles}`}>
      {status}
    </span>
  );
}

export function MedicationStatusBadge({ status }: { status: string }) {
  const isCompleted = status === "Completed";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs ${
        isCompleted
          ? "bg-green-100 text-green-700"
          : "bg-orange-100 text-orange-500"
      }`}
    >
      <Check size={12} />
      {status}
    </span>
  );
}