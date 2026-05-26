"use client";

import { EyeOff } from "lucide-react";
import { PatientBioData } from "./EmergencyTransferTypes";

export default function PatientContactStep({
  form,
  setForm,
  onPrevious,
  onNext,
}: {
  form: PatientBioData;
  setForm: React.Dispatch<React.SetStateAction<PatientBioData>>;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mx-auto mt-10 max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-black">Patient Transfer Setup</h1>
        <p className="mt-2 text-gray-500">Create Your Patient Bio-data</p>
      </div>

      <div className="space-y-5">
        <InputField
          label="Address Info"
          placeholder="Enter Address Info"
          value={form.address}
          onChange={(value) => setForm((prev) => ({ ...prev, address: value }))}
        />

        <InputField
          label="State Of Origin"
          placeholder="Enter State Of Origin"
          value={form.stateOfOrigin}
          onChange={(value) => setForm((prev) => ({ ...prev, stateOfOrigin: value }))}
        />

        <InputField
          label="Phone Number"
          placeholder="Enter Phone Number"
          value={form.phoneNumber}
          onChange={(value) => setForm((prev) => ({ ...prev, phoneNumber: value }))}
        />

        <label className="block">
          <span className="mb-2 block text-sm text-gray-700">Email Info</span>
          <div className="flex items-center rounded-full border border-gray-300 px-5 py-3 focus-within:border-[#211783]">
            <input
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              placeholder="Enter Email"
              className="w-full bg-transparent outline-none"
            />
            <EyeOff size={18} className="text-gray-400" />
          </div>
        </label>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={onPrevious} className="text-[#00B8A8]">
          ↢ Previous Page
        </button>

        <button
          onClick={onNext}
          className="rounded-full bg-[#211783] px-10 py-3 text-white hover:bg-[#18105f]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-gray-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-gray-300 px-5 py-3 outline-none focus:border-[#211783]"
      />
    </label>
  );
}