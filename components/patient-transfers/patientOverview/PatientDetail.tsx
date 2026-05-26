"use client";

import { ArrowLeft, Printer, Send } from "lucide-react";
import { ConsentStatusBadge } from "./Badges";
import { Patient, PatientTab } from "./PatientTransferTypes";
import OverviewTab from "./OverviewTab";
import HistoryTab from "./HistoryTab";
import LabsTab from "./LabTab";
import MedicationsTab from "./MedicationsTab";


export default function PatientDetails({
  patient,
  activeTab,
  setActiveTab,
  onBack,
  onTransfer,
}: {
  patient: Patient;
  activeTab: PatientTab;
  setActiveTab: (tab: PatientTab) => void;
  onBack: () => void;
  onTransfer: () => void;
}) {
  return (
    <>
      <section className="bg-white px-6 py-5 md:px-8">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#211783]"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#211783] text-xl font-semibold text-white">
              {patient.initials}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold text-black">{patient.name}</h1>
                <ConsentStatusBadge status={patient.status} />
              </div>

              <p className="mt-1 text-sm text-gray-500">GPID: {patient.gpid}</p>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span>{patient.age} years</span>
                <span>•</span>
                <span>{patient.gender}</span>
                <span>•</span>
                <span>Blood Type: {patient.bloodType}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {activeTab !== "Overview" && (
              <button className="inline-flex items-center gap-2 rounded border-2 border-[#211783] px-5 py-3 font-medium text-[#211783] hover:bg-[#F1F0FF]">
                <Printer size={20} />
                Print
              </button>
            )}

            <button
              onClick={onTransfer}
              className="inline-flex items-center gap-2 rounded bg-[#211783] px-5 py-3 font-medium text-white hover:bg-[#18105f]"
            >
              <Send size={20} />
              Transfer Patient
            </button>
          </div>
        </div>

        <div className="mt-8 flex gap-10">
          {(["Overview", "History", "Labs", "Medications"] as PatientTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 pb-3 text-sm transition ${
                activeTab === tab
                  ? "border-[#211783] text-[#211783]"
                  : "border-transparent text-gray-500 hover:text-[#211783]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 py-8 md:px-12">
        {activeTab === "Overview" && <OverviewTab />}
        {activeTab === "History" && <HistoryTab />}
        {activeTab === "Labs" && <LabsTab />}
        {activeTab === "Medications" && <MedicationsTab />}
      </section>
    </>
  );
}