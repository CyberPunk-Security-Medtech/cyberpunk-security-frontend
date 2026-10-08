"use client";

import React from "react";
import ResponsiveTableRegion from "@components/dashboard/ResponsiveTableRegion";

interface Prescription {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route?: string;
  status?: string;
  created_at?: string;
  patient?: {
    first_name: string;
    last_name: string;
  };
  patient_name?: string;
}

interface Props {
  prescriptions: Prescription[];
  loading?: boolean;
  onView?: (prescriptionId: string) => void;
  onDispense?: (prescriptionId: string) => void;
  onCorrectDispense?: (prescriptionId: string) => void;
  dispensingId?: string | null;
}

export default function PrescriptionTable({
  prescriptions,
  loading = false,
  onView,
  onDispense,
}: Props) {
  const handleView = (prescriptionId: string) => {
    if (onView) {
      onView(prescriptionId);
      return;
    }
    onDispense?.(prescriptionId);
  };

  return (
    <ResponsiveTableRegion label="Patient prescriptions">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b text-left text-[#596174]">
            <th scope="col" className="min-w-[180px] bg-white px-4 py-3">Patient</th>
            <th className="px-4 py-3">Medication</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <tr key={`skeleton-${index}`} className="border-b">
                <td className="px-4 py-3"><div className="h-4 w-28 animate-pulse rounded bg-gray-200" /></td>
                <td className="px-4 py-3"><div className="h-4 w-28 animate-pulse rounded bg-gray-200" /></td>
                <td className="px-4 py-3"><div className="h-6 w-20 animate-pulse rounded-md bg-gray-200" /></td>
                <td className="px-4 py-3"><div className="h-4 w-20 animate-pulse rounded bg-gray-200" /></td>
                <td className="px-4 py-3 text-right"><div className="ml-auto h-8 w-16 animate-pulse rounded-md bg-gray-200" /></td>
              </tr>
            ))
          ) : prescriptions.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-10 text-center text-gray-600">No prescriptions found</td>
            </tr>
          ) : (
            prescriptions.map((item) => (
              <tr
                key={item.id}
                className="cursor-pointer border-b hover:bg-gray-50"
                onClick={() => handleView(item.id)}
              >
                <td className="px-4 py-3">{`${item.patient?.first_name ?? ""} ${item.patient?.last_name ?? ""}`.trim() || item.patient_name || "-"}</td>
                <td className="px-4 py-3 font-medium">{item.medication_name}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-md bg-[#F3F4F6] px-2 py-1 text-[11px] font-semibold text-[#374151]">
                    {item.status ?? "Unknown"}
                  </span>
                </td>
                <td className="px-4 py-3">{item.created_at ? new Date(item.created_at).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="rounded-md border border-[#D1D5DB] bg-white px-3 py-1 text-xs font-medium text-[#1F2937] transition hover:bg-[#F9FAFB]"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleView(item.id);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </ResponsiveTableRegion>
  );
}
