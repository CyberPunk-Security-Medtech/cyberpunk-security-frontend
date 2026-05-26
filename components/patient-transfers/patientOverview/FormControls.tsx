"use client";

import { Check } from "lucide-react";

export function CheckboxRow({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 text-left">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg border-2 ${
          checked
            ? "border-[#211783] bg-[#211783] text-white"
            : "border-gray-400 bg-white text-transparent"
        }`}
      >
        <Check size={24} />
      </span>

      <span className="text-xl font-medium text-black">{label}</span>
    </button>
  );
}

export function SelectableBox({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 rounded-lg border-2 px-5 py-5 text-left ${
        checked ? "border-[#211783] bg-[#F1F0FF]" : "border-gray-300 bg-white"
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 ${
          checked
            ? "border-[#211783] bg-[#211783] text-white"
            : "border-gray-400 bg-white text-transparent"
        }`}
      >
        <Check size={20} />
      </span>

      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF0FF] text-[#211783]">
        {label === "PrivaCure" ? "🛡️" : "🏥"}
      </span>

      <span className="text-2xl font-medium text-black">{label}</span>
    </button>
  );
}

export function RecordOption({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-5 rounded-lg border-2 px-5 py-5 text-left transition ${
        checked
          ? "border-[#7C83E8] bg-[#EEF0FF]"
          : "border-gray-300 bg-white hover:bg-gray-50"
      }`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 ${
          checked
            ? "border-[#211783] bg-[#211783] text-white"
            : "border-gray-400 bg-white text-transparent"
        }`}
      >
        <Check size={26} />
      </span>

      <span className="text-2xl font-medium text-black">{label}</span>
    </button>
  );
}