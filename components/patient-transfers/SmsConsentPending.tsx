"use client";

import { useEffect } from "react";
import Image from "next/image";

type Props = {
  onVerified: () => void;
};

export default function SmsConsentPending({ onVerified }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onVerified();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onVerified]);

  return (
    <section className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mb-12">
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
          Consent Verification <br /> Pending
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-2xl leading-relaxed text-gray-400">
          Sms consent verification is currently pending, this might take some
          time, please exercise patience.
        </p>
      </div>
    </section>
  );
}