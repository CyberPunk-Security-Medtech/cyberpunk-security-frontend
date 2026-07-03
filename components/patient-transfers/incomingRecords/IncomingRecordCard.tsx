"use client";

import { CalendarDays, Check, FileText, MapPin, X } from "lucide-react";
import { IncomingRecord } from "./IncomingRecordTypes";

export default function IncomingRecordCard({
  record,
  onView,
  onAccept,
  onReject,
}: {
  record: IncomingRecord;
  onView: () => void;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFFFFC] text-sm font-semibold text-[#008C83]">
            {record.initials}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-semibold text-[#111827]">{record.patientName}</h3>

              <span className="rounded bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                {record.priority}
              </span>
            </div>

            <p className="mt-1 text-xs text-gray-500">GPID: {record.gpid}</p>

            <p className="mt-3 text-sm text-gray-700">
              Condition: {record.condition}
            </p>

            <div className="mt-3 flex flex-wrap gap-5 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <MapPin size={14} />
                From: {record.fromHospital}
              </span>

              <span className="inline-flex items-center gap-1">
                <CalendarDays size={14} />
                {record.requestedAt}
              </span>

              <span className="inline-flex items-center gap-1">
                <FileText size={14} />
                {record.records.join(", ")}
              </span>

              <span>{record.fileSize}</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {record.status === "Pending" && (
            <>
              <button
                onClick={onView}
                className="rounded bg-green-700 px-5 py-2 text-sm font-medium text-white hover:bg-green-800"
              >
                View More
              </button>

              <button
                onClick={onReject}
                className="inline-flex items-center gap-2 rounded border border-red-500 px-5 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
              >
                <X size={16} />
                Decline
              </button>
            </>
          )}

          {record.status === "Accepted" && (
            <>
              <button
                onClick={onView}
                className="rounded bg-green-700 px-5 py-2 text-sm font-medium text-white hover:bg-green-800"
              >
                View More
              </button>

              <span className="inline-flex items-center gap-2 rounded bg-green-100 px-5 py-2 text-sm font-medium text-green-700">
                <Check size={16} />
                Accepted
              </span>
            </>
          )}

          {record.status === "Rejected" && (
            <span className="inline-flex items-center gap-2 rounded border border-red-500 px-5 py-2 text-sm font-medium text-red-500">
              <X size={16} />
              Declined
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
