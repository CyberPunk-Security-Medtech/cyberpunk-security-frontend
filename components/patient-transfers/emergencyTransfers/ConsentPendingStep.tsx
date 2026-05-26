"use client";

import Image from "next/image";

export default function ConsentPendingStep() {
  return (
    <div className="mx-auto flex min-h-[560px] max-w-2xl flex-col items-center justify-center text-center">
      <Image
        src="/transfer-calendar.png"
        alt="Transfer pending"
        width={210}
        height={210}
        className="mb-8"
      />

      <h1 className="text-4xl font-bold leading-tight text-[#111827]">
        Consent Verification
        <br />
        Pending
      </h1>

      <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-400">
        Sms consent verification is currently pending, this might take some time, please exercise
        patience.
      </p>
    </div>
  );
}