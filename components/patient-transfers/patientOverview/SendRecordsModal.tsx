"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { CheckboxRow, RecordOption, SelectableBox } from "./FormControls";
import { EMRType, Patient, TransferMode } from "@components/patient-transfers/patientOverview/PatientTransferTypes"

export default function SendRecordsModal({
  patient,
  onClose,
  onSuccess,
}: {
  patient: Patient;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [transferMode, setTransferMode] = useState<TransferMode>(null);
  const [selectedEMR, setSelectedEMR] = useState<EMRType>(null);
  const [destinationHospital, setDestinationHospital] = useState("");

  const [records, setRecords] = useState({
    medicalHistory: true,
    labResults: false,
    medications: false,
  });

  const isSpecificTransfer = transferMode === "specific";
  const isNearbyTransfer = transferMode === "nearby";
  const hasSelectedRecord = Object.values(records).some(Boolean);

  const canTransfer =
    hasSelectedRecord &&
    selectedEMR &&
    (isNearbyTransfer || (isSpecificTransfer && destinationHospital.trim().length > 0));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-10 py-7">
          <h2 className="text-3xl font-medium text-black">Send Records</h2>

          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <X size={28} />
          </button>
        </div>

        <div className="space-y-8 px-10 py-8">
          <div>
            <label className="mb-4 block text-2xl font-medium text-black">
              Patient Name
            </label>

            <input
              value={patient.name}
              readOnly
              className="w-full rounded-lg border border-gray-300 bg-[#F1FFFF] px-6 py-4 text-2xl text-gray-500 outline-none"
            />
          </div>

          <div className="space-y-4">
            <CheckboxRow
              checked={transferMode === "specific"}
              label="Transfer patient to a specific hospital"
              onClick={() => setTransferMode("specific")}
            />

            <CheckboxRow
              checked={transferMode === "nearby"}
              label="Transfer patient to any nearby hospital"
              onClick={() => setTransferMode("nearby")}
            />
          </div>

          {isNearbyTransfer && (
            <p className="text-2xl italic text-black">
              Patient Record will be sent to multiple nearby hospitals
            </p>
          )}

          {(isSpecificTransfer || isNearbyTransfer) && (
            <div>
              <h3 className="mb-4 text-2xl font-medium text-black">Select EMR</h3>

              <div className="grid gap-5 md:grid-cols-2">
                <SelectableBox
                  checked={selectedEMR === "PrivaCure"}
                  label="PrivaCure"
                  onClick={() => setSelectedEMR("PrivaCure")}
                />

                <SelectableBox
                  checked={selectedEMR === "Others"}
                  label="Others"
                  onClick={() => setSelectedEMR("Others")}
                />
              </div>
            </div>
          )}

          {(isSpecificTransfer || isNearbyTransfer) && (
            <div>
              <h3 className="mb-4 text-2xl font-medium text-black">
                Destination Hospital
              </h3>

              <div className="flex items-center gap-3 rounded-full border border-gray-300 px-6 py-4">
                <Search size={24} className="text-gray-400" />

                {isSpecificTransfer ? (
                  <input
                    value={destinationHospital}
                    onChange={(event) => setDestinationHospital(event.target.value)}
                    placeholder="Search Recipient Hospital"
                    className="w-full bg-transparent text-2xl text-black outline-none placeholder:text-gray-400"
                  />
                ) : (
                  <span className="text-2xl text-gray-400">
                    Search Recipient Hospital
                  </span>
                )}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-4 text-2xl font-medium text-black">Records to Send</h3>

            <div className="space-y-3">
              <RecordOption
                checked={records.medicalHistory}
                label="Medical History"
                onClick={() =>
                  setRecords((prev) => ({
                    ...prev,
                    medicalHistory: !prev.medicalHistory,
                  }))
                }
              />

              <RecordOption
                checked={records.labResults}
                label="Lab Results"
                onClick={() =>
                  setRecords((prev) => ({
                    ...prev,
                    labResults: !prev.labResults,
                  }))
                }
              />

              <RecordOption
                checked={records.medications}
                label="Medications"
                onClick={() =>
                  setRecords((prev) => ({
                    ...prev,
                    medications: !prev.medications,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid gap-6 pt-4 md:grid-cols-2">
            <button
              onClick={onClose}
              className="rounded-lg border-2 border-gray-500 px-6 py-4 text-2xl text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={onSuccess}
              disabled={!canTransfer}
              className={`rounded-lg px-6 py-4 text-2xl text-white transition ${
                canTransfer
                  ? "bg-[#211783] hover:bg-[#18105f]"
                  : "cursor-not-allowed bg-[#9590C7]"
              }`}
            >
              Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}