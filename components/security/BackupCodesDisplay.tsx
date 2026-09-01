"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

type BackupCodesDisplayProps = {
  codes: string[];
};

export default function BackupCodesDisplay({ codes }: BackupCodesDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const copyCodes = async () => {
    try {
      await navigator.clipboard.writeText(codes.join("\n"));
      setCopied(true);
      setCopyError("");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError("Unable to copy automatically. Select and save the codes manually.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-4 font-mono text-sm text-slate-900 sm:grid-cols-3">
        {codes.map((code) => (
          <code key={code} className="rounded-md bg-white px-2 py-2 text-center shadow-sm">
            {code}
          </code>
        ))}
      </div>

      <button
        type="button"
        onClick={() => void copyCodes()}
        className="mx-auto flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-[#1A2380] hover:bg-[#1A2380]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A2380] focus-visible:ring-offset-2"
      >
        {copied ? <Check aria-hidden="true" size={18} /> : <Copy aria-hidden="true" size={18} />}
        {copied ? "Copied" : "Copy all codes"}
      </button>

      <div aria-live="polite" className="min-h-5 text-center text-xs text-red-700">
        {copyError}
      </div>
    </div>
  );
}
