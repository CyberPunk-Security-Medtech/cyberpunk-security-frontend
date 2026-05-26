"use client";

import { useState } from "react";
import IncomingRecordDetails from "@components/patient-transfers/incomingRecords/IncomingRecordDetails";
import IncomingRecordsList from "@components/patient-transfers/incomingRecords/IncomingRecordsList";
import { IncomingRecord, IncomingRecordStatus } from "@components/patient-transfers/incomingRecords/IncomingRecordTypes";
import RejectTransferModal from "@components/patient-transfers/incomingRecords/RejectTransferModal";
import { incomingRecords as initialIncomingRecords } from "@components/patient-transfers/incomingRecords/IncomingRecordData";


type FilterType = "All" | IncomingRecordStatus;

export default function IncomingRecordsPage() {
  const [records, setRecords] = useState(initialIncomingRecords);
  const [filter, setFilter] = useState<FilterType>("All");
  const [selectedRecord, setSelectedRecord] = useState<IncomingRecord | null>(null);
  const [recordToReject, setRecordToReject] = useState<IncomingRecord | null>(null);

  const updateRecordStatus = (id: string, status: IncomingRecordStatus) => {
    setRecords((prev: any[]) =>
      prev.map((record) =>
        record.id === id
          ? {
              ...record,
              status,
            }
          : record
      )
    );

    setSelectedRecord((prev) =>
      prev?.id === id
        ? {
            ...prev,
            status,
          }
        : prev
    );
  };

  const handleAccept = (id: string) => {
    updateRecordStatus(id, "Accepted");
  };

  const handleRejectSubmit = (reason: string) => {
    if (!recordToReject) return;

    console.log("Rejection reason:", reason);
    updateRecordStatus(recordToReject.id, "Rejected");
    setRecordToReject(null);
  };

  return (
    <div className="-mx-4 -my-4 min-h-full bg-[#F4FAFA] md:-mx-12">
      {!selectedRecord ? (
        <IncomingRecordsList
          records={records}
          filter={filter}
          setFilter={setFilter}
          onView={setSelectedRecord}
          onAccept={handleAccept}
          onReject={setRecordToReject}
        />
      ) : (
        <IncomingRecordDetails
          record={selectedRecord}
          onBack={() => setSelectedRecord(null)}
          onAccept={() => handleAccept(selectedRecord.id)}
          onReject={() => setRecordToReject(selectedRecord)}
        />
      )}

      {recordToReject && (
        <RejectTransferModal
          record={recordToReject}
          onClose={() => setRecordToReject(null)}
          onDecline={handleRejectSubmit}
        />
      )}
    </div>
  );
}