"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  MoreHorizontal,
  Eye,
  Send,
  ShieldCheck,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function PatientTransferDashboard() {
  const [openModal, setOpenModal] = useState(false);
  const [success, setSuccess] = useState(false);

  const patients = [
    {
      name: "Sarah Miller",
      id: "PT-1024",
      age: "45",
      gender: "Female",
      diagnosis: "Hypertension",
      status: "Stable",
    },
    {
      name: "Daniel Carter",
      id: "PT-2041",
      age: "62",
      gender: "Male",
      diagnosis: "Diabetes",
      status: "Critical",
    },
    {
      name: "Amina Yusuf",
      id: "PT-5012",
      age: "38",
      gender: "Female",
      diagnosis: "Asthma",
      status: "Stable",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7fbfb] px-6 py-5">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Transfer Management</p>
          <h1 className="text-2xl font-bold text-[#111827]">
            Patient Transfer
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-full bg-white p-2 shadow-sm">
            <Bell size={18} />
          </button>
          <div className="h-9 w-9 rounded-full bg-[#19c7b6] text-white flex items-center justify-center font-bold">
            A
          </div>
        </div>
      </div>

      {/* Top Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Total Transfers" value="128" />
        <StatCard title="Pending Consent" value="14" />
        <StatCard title="Completed Transfers" value="92" />
      </div>

      {/* Search + Action */}
      <div className="mb-5 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex w-full items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 md:max-w-md">
          <Search size={18} className="text-gray-400" />
          <input
            placeholder="Search patient by name or ID"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="rounded-xl bg-[#24128f] px-5 py-2.5 text-sm font-semibold text-white"
        >
          New Transfer
        </button>
      </div>

      {/* Patient Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b border-gray-100 p-4">
          <h2 className="font-semibold text-gray-900">Patient Overview</h2>
          <p className="text-sm text-gray-500">
            Select a patient and initiate secure transfer consent.
          </p>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-[#effafa] text-gray-600">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Patient ID</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Gender</th>
              <th className="px-4 py-3">Diagnosis</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="border-t border-gray-100">
                <td className="px-4 py-4 font-medium text-gray-900">
                  {patient.name}
                </td>
                <td className="px-4 py-4 text-gray-600">{patient.id}</td>
                <td className="px-4 py-4 text-gray-600">{patient.age}</td>
                <td className="px-4 py-4 text-gray-600">{patient.gender}</td>
                <td className="px-4 py-4 text-gray-600">
                  {patient.diagnosis}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      patient.status === "Critical"
                        ? "bg-red-50 text-red-600"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    {patient.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => setOpenModal(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#19c7b6] px-3 py-2 text-xs font-semibold text-white"
                  >
                    <Send size={14} />
                    Transfer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Preview Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <ConsentCard
          icon={<ShieldCheck size={38} />}
          title="Consent Verification Pending"
          text="Waiting for patient approval before transfer can continue."
          type="pending"
        />

        <ConsentCard
          icon={<CheckCircle2 size={42} />}
          title="Patient Record Transfer Successful"
          text="The patient record has been securely transferred."
          type="success"
        />

        <ConsentCard
          icon={<AlertCircle size={42} />}
          title="Consent Verification Declined"
          text="The patient declined consent for this transfer."
          type="declined"
        />
      </div>

      {openModal && (
        <TransferRequestModal
          onClose={() => setOpenModal(false)}
          onSubmit={() => {
            setOpenModal(false);
            setSuccess(true);
          }}
        />
      )}

      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#dff8f5] text-[#19c7b6]">
              <CheckCircle2 size={48} />
            </div>

            <h2 className="mb-2 text-xl font-bold text-gray-900">
              Patient Transfer Successful
            </h2>

            <p className="mb-6 text-sm text-gray-500">
              Transfer request has been submitted successfully.
            </p>

            <button
              onClick={() => setSuccess(false)}
              className="w-full rounded-xl bg-[#24128f] py-3 text-sm font-semibold text-white"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="mt-2 text-3xl font-bold text-[#111827]">{value}</h3>
    </div>
  );
}

function ConsentCard({
  icon,
  title,
  text,
  type,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  type: "pending" | "success" | "declined";
}) {
  const color =
    type === "success"
      ? "text-green-500 bg-green-50"
      : type === "declined"
      ? "text-red-500 bg-red-50"
      : "text-[#19c7b6] bg-[#e8fbf8]";

  return (
    <div className="rounded-3xl bg-white p-7 text-center shadow-sm">
      <div
        className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${color}`}
      >
        {icon}
      </div>

      <h3 className="mb-2 font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}

function TransferRequestModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Send Transfer Request
            </h2>
            <p className="text-sm text-gray-500">
              Fill in the receiving facility and consent details.
            </p>
          </div>

          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="space-y-4">
          <Input label="Patient Name" placeholder="Sarah Miller" />
          <Input label="Receiving Hospital" placeholder="Enter hospital name" />
          <Input label="Receiving Doctor" placeholder="Enter doctor name" />
          <Input label="Reason for Transfer" placeholder="Specialist review" />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Transfer Type
            </label>
            <select className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#19c7b6]">
              <option>Normal Transfer</option>
              <option>Emergency Transfer</option>
            </select>
          </div>

          <label className="flex items-start gap-3 rounded-xl bg-[#effafa] p-3 text-sm text-gray-600">
            <input type="checkbox" className="mt-1" />
            I confirm that patient consent is required before this record is
            transferred.
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            className="rounded-xl bg-[#24128f] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Submit Transfer
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#19c7b6]"
      />
    </div>
  );
}