"use client";

import { historyItems } from "./PatientTransferData";



export default function HistoryTab() {
  return (
    <div className="space-y-5">
      {historyItems.map((item, index) => (
        <div
          key={`${item.title}-${index}`}
          className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white px-8 py-7 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h3 className="text-2xl font-medium text-black">{item.title}</h3>
            <p className="mt-2 text-lg text-gray-500">{item.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-gray-200" />

            <div>
              <p className="text-lg font-medium text-black">{item.doctor}</p>
              <p className="text-sm text-[#211783]">{item.role}</p>
            </div>
          </div>

          <p className="text-lg text-gray-500">{item.date}</p>

          <span
            className={`rounded-full border px-5 py-1 text-sm ${
              item.status === "Active"
                ? "border-[#00B8A8] text-[#00B8A8]"
                : "border-gray-400 text-gray-500"
            }`}
          >
            {item.status}
          </span>

          <button className="text-black">
            <span className="text-2xl">...</span>
          </button>
        </div>
      ))}
    </div>
  );
}