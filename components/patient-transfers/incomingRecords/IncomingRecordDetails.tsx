"use client";

import { ArrowLeft, CalendarDays, Check, MoreHorizontal, Printer, X } from "lucide-react";
import { IncomingRecord } from "./IncomingRecordTypes";

const vitals = [
  { label: "Heart Rate", value: "120/80", unit: "bpm" },
  { label: "Temperature", value: "36.8", unit: "°C" },
  { label: "Pulse Rate", value: "72", unit: "bpm" },
  { label: "Weight", value: "70", unit: "kg" },
  { label: "BP Level", value: "96", unit: "mmHg" },
];

const historyItems = [
  {
    title: "Hypertension, High Cholesterol",
    description: "Patient complains of headaches...",
    doctor: "Wilson Francis",
    role: "General Doctor",
    date: "10 Oct 2025",
    status: "Active",
  },
  {
    title: "Hypertension, High Cholesterol",
    description: "Patient complains of headaches...",
    doctor: "Wilson Francis",
    role: "General Doctor",
    date: "10 Oct 2025",
    status: "Resolved",
  },
  {
    title: "Hypertension, High Cholesterol",
    description: "Patient complains of headaches...",
    doctor: "Wilson Francis",
    role: "General Doctor",
    date: "10 Oct 2025",
    status: "Resolved",
  },
];

export default function IncomingRecordDetails({
  record,
  onBack,
  onAccept,
  onReject,
}: {
  record: IncomingRecord;
  onBack: () => void;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <div className="px-6 py-6 md:px-12">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#211783]"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFFFFC] font-semibold text-[#008C83]">
            {record.initials}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#111827]">{record.patientName}</h1>
              <span className="rounded bg-red-500 px-2 py-1 text-xs font-medium text-white">
                {record.priority}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">GPID: {record.gpid}</p>

            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
              <span>Gender: {record.gender}</span>
              <span>Age: {record.age}</span>
              <span>Blood Group: {record.bloodGroup}</span>
              <span>Genotype: {record.genotype}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {record.status === "Pending" && (
            <>
              <button
                onClick={onAccept}
                className="inline-flex items-center gap-2 rounded bg-green-700 px-5 py-2 font-medium text-white hover:bg-green-800"
              >
                <Check size={18} />
                Accept
              </button>

              <button
                onClick={onReject}
                className="inline-flex items-center gap-2 rounded border border-red-500 px-5 py-2 font-medium text-red-500 hover:bg-red-50"
              >
                <X size={18} />
                Decline
              </button>
            </>
          )}

          {record.status === "Accepted" && (
            <span className="inline-flex items-center gap-2 rounded bg-green-100 px-5 py-2 font-medium text-green-700">
              <Check size={18} />
              Accepted
            </span>
          )}

          {record.status === "Rejected" && (
            <span className="inline-flex items-center gap-2 rounded bg-red-100 px-5 py-2 font-medium text-red-600">
              <X size={18} />
              Declined
            </span>
          )}

          <button className="inline-flex items-center gap-2 rounded border border-[#211783] px-5 py-2 font-medium text-[#211783] hover:bg-[#F1F0FF]">
            <Printer size={18} />
            Print
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-lg bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-5">
          {vitals.map((vital) => (
            <div key={vital.label} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-500">{vital.label}</p>
              <p className="mt-2 text-lg font-semibold text-[#111827]">
                {vital.value}
                <span className="ml-1 text-xs font-normal text-gray-500">{vital.unit}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {historyItems.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-5 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-black">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{item.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200" />
              <div>
                <p className="font-medium text-black">{item.doctor}</p>
                <p className="text-xs text-[#211783]">{item.role}</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 text-sm text-gray-500">
              <CalendarDays size={16} />
              {item.date}
            </span>

            <span
              className={`rounded-full border px-4 py-1 text-sm ${
                item.status === "Active"
                  ? "border-[#00B8A8] text-[#00B8A8]"
                  : "border-gray-400 text-gray-500"
              }`}
            >
              {item.status}
            </span>

            <button>
              <MoreHorizontal size={22} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg bg-white p-5 shadow-sm">
        <h3 className="mb-3 font-semibold text-[#111827]">Doctor’s Note</h3>
        <p className="text-sm leading-relaxed text-gray-500">
          Patient requires urgent review and possible surgical intervention. Please review
          transferred medical history and confirm availability for admission.
        </p>
      </div>
    </div>
  );
}