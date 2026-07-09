"use client";

import { Check } from "lucide-react";
import { timelineItems } from "./PatientTransferData";


export default function OverviewTab() {
  return (
    <div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="rounded-lg bg-white p-7 shadow-md">
          <div className="flex justify-between">
            <p className="text-lg text-gray-600">Data Completeness</p>
            <Check size={18} className="text-green-700" />
          </div>

          <h3 className="mt-4 text-3xl font-bold text-black">92%</h3>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-300">
            <div className="h-full w-[92%] bg-green-700" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-7 shadow-md">
          <p className="text-lg text-gray-600">Record Sources</p>
          <h3 className="mt-4 text-3xl font-bold text-black">3</h3>
          <p className="mt-4 text-lg text-gray-600">Hospital contributing data</p>
        </div>

        <div className="rounded-lg bg-white p-7 shadow-md">
          <p className="text-lg text-gray-600">Last Updated</p>
          <h3 className="mt-4 text-3xl font-bold text-black">Apr 5</h3>
          <p className="mt-4 text-lg text-gray-600">Most recent record sync</p>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-gray-300 bg-white p-10 shadow-md">
        <h2 className="mb-10 text-3xl font-medium text-black">Medical Timeline</h2>

        <div className="relative space-y-24">
          <div className="absolute left-[27px] top-14 h-[calc(100%-80px)] w-px bg-gray-300" />

          {timelineItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="relative flex gap-8">
                <div
                  className={`z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white ${item.color}`}
                >
                  <Icon size={24} />
                </div>

                <div className="flex-1 rounded-lg border border-gray-400 bg-[#E8E8E8] px-8 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-black">{item.title}</h3>
                      <p className="mt-2 text-gray-500">{item.description}</p>
                      <span className="mt-3 inline-block rounded border border-gray-300 bg-white px-2 py-1 text-sm text-black">
                        {item.hospital}
                      </span>
                    </div>

                    <p className="whitespace-nowrap text-sm text-gray-600">{item.date}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}