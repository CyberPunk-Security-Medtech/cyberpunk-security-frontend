"use client";

import { AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { IncomingRecord } from "./IncomingRecordTypes";

export default function RejectTransferModal({
  record,
  onClose,
  onDecline,
}: {
  record: IncomingRecord;
  onClose: () => void;
  onDecline: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  const canSubmit = reason.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-xl font-semibold text-[#111827]">
            Reject Patients Transfer
          </h2>

          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={20} />
          </button>
        </div>

        <div className="border-t border-gray-200 px-6 py-6">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#111827]">
              Reason for Rejection *
            </span>

            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Please provide a detailed reason for rejection..."
              className="h-36 w-full resize-none rounded border border-gray-300 bg-[#F4FFFF] p-4 text-sm outline-none focus:border-red-500"
            />
          </label>

          <div className="mt-4 flex items-center gap-2 rounded bg-red-100 px-4 py-3 text-sm text-red-600">
            <AlertCircle size={16} />
            The sending hospital will be notified of the rejection and your reason.
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6">
            <button
              onClick={onClose}
              className="rounded border border-gray-400 px-6 py-3 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={() => onDecline(reason)}
              disabled={!canSubmit}
              className={`rounded px-6 py-3 text-white ${
                canSubmit
                  ? "bg-red-600 hover:bg-red-700"
                  : "cursor-not-allowed bg-red-300"
              }`}
            >
              Decline
            </button>
          </div>

          <p className="mt-5 text-xs text-gray-400">
            Rejecting transfer request for {record.patientName}.
          </p>
        </div>
      </div>
    </div>
  );
}