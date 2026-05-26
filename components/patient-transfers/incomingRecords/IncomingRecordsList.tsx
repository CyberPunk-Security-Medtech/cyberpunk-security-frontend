"use client";

import { useMemo } from "react";
import { IncomingRecord, IncomingRecordStatus } from "./IncomingRecordTypes";
import IncomingRecordCard from "./IncomingRecordCard";




type FilterType = "All" | IncomingRecordStatus;

export default function IncomingRecordsList({
  records,
  filter,
  setFilter,
  onView,
  onAccept,
  onReject,
}: {
  records: IncomingRecord[];
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  onView: (record: IncomingRecord) => void;
  onAccept: (id: string) => void;
  onReject: (record: IncomingRecord) => void;
}) {
  const filteredRecords = useMemo(() => {
    if (filter === "All") return records;
    return records.filter((record) => record.status === filter);
  }, [records, filter]);

  return (
    <div className="px-6 py-8 md:px-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#211783]">Incoming Records</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and manage patient records sent from other hospitals
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {(["All", "Pending", "Accepted", "Rejected"] as FilterType[]).map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-md px-4 py-2 text-xs font-medium transition ${
              filter === item
                ? "bg-[#211783] text-white"
                : "bg-[#E8EAF8] text-gray-600 hover:bg-[#dfe2f3]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <IncomingRecordCard
            key={record.id}
            record={record}
            onView={() => onView(record)}
            onAccept={() => onAccept(record.id)}
            onReject={() => onReject(record)}
          />
        ))}

        {filteredRecords.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center text-gray-500">
            No incoming records found.
          </div>
        )}
      </div>
    </div>
  );
}