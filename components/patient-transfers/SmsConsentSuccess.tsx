"use client";

import Image from "next/image";

type Props = {
  onContinue: () => void;
};

export default function SmsConsentSuccess({ onContinue }: Props) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-white px-10">
      <div className="relative min-h-[90vh] w-full text-center">
        <div className="mb-12 pt-10">
          <h1 className="text-4xl font-bold">
            <span className="text-[#201985]">Priva</span>
            <span className="text-[#11bdb2]">Cure</span>
          </h1>
        </div>

        <Image
          src="/transfer-calendar.png"
          alt="Transfer consent"
          width={320}
          height={320}
          className="mx-auto mb-12"
        />

        <h2 className="text-5xl font-bold leading-tight text-gray-950">
          Consent Verification <br /> Successfully!
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-2xl leading-relaxed text-gray-400">
          Sms consent verification successful, click on continue to give admin
          authorization for the patient transfer
        </p>

        <button
          onClick={onContinue}
          className="absolute bottom-10 right-10 rounded-full bg-[#201985] px-16 py-5 text-2xl font-medium text-white"
        >
          Continue
        </button>
      </div>
    </section>
  );
}