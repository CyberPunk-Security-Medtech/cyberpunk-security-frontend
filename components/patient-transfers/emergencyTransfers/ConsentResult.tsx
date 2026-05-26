"use client";

import Image from "next/image";

export default function ConsentResultStep({
  status,
  onPrevious,
  onContinue,
}: {
  status: "success" | "declined";
  onPrevious: () => void;
  onContinue?: () => void;
}) {
  const isSuccess = status === "success";

  return (
    <div className="mx-auto flex min-h-[560px] max-w-2xl flex-col items-center justify-center text-center">
      {isSuccess ? (
        <Image
          src="/transfer-calendar.png"
          alt="Consent successful"
          width={210}
          height={210}
          className="mb-8"
        />
      ) : (
        <div className="mb-8 flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-600 text-7xl font-bold text-white">
          ×
        </div>
      )}

      <h1 className="text-4xl font-bold leading-tight text-[#111827]">
        Consent Verification
        <br />
        {isSuccess ? "Successfully!" : "Declined"}
      </h1>

      <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-400">
        {isSuccess
          ? "Sms consent verification successful, click on continue to give admin authorization for the patient transfer"
          : "Sms consent verification declined, click on continue to give admin authorization for the patient transfer"}
      </p>

      <div className="mt-20 flex w-full items-center justify-between">
        <button onClick={onPrevious} className="text-[#00B8A8]">
          ↢ Previous Page
        </button>

        {isSuccess && (
          <button
            onClick={onContinue}
            className="rounded-full bg-[#211783] px-10 py-3 text-white hover:bg-[#18105f]"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}