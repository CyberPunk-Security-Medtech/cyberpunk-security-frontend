"use client";

import { PatientBioData } from "./EmergencyTransferTypes";

export default function PatientBioDataStep({
  form,
  setForm,
  onNext,
}: {
  form: PatientBioData;
  setForm: React.Dispatch<React.SetStateAction<PatientBioData>>;
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
          label="Full Name"
          placeholder="Enter Full Name"
          value={form.fullName}
          onChange={(value) => setForm((prev) => ({ ...prev, fullName: value }))}
        />

        <InputField
          label="D.O.B"
          placeholder="Enter D.O.B"
          value={form.dob}
          onChange={(value) => setForm((prev) => ({ ...prev, dob: value }))}
        />

        <InputField
          label="Marital Status"
          placeholder="Enter Marital Status"
          value={form.maritalStatus}
          onChange={(value) => setForm((prev) => ({ ...prev, maritalStatus: value }))}
        />

        <InputField
          label="Gender"
          placeholder="Enter Gender"
          value={form.gender}
          onChange={(value) => setForm((prev) => ({ ...prev, gender: value }))}
        />
      </div>

      <div className="mt-8 flex justify-end">
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