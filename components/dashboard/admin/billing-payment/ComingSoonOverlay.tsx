import { CreditCard } from "lucide-react";

export default function ComingSoonOverlay() {
  return (
    <section
      role="status"
      aria-live="polite"
      aria-label="Billing and Payment availability"
      className="absolute inset-0 z-20 bg-[#21178C]/90 text-white"
    >
      <div className="sticky top-0 flex h-[calc(100dvh-69px)] min-h-[22rem] items-center justify-center px-6 text-center">
        <div>
          <CreditCard
            className="mx-auto h-10 w-10 text-[#71E5D4]"
            aria-hidden="true"
          />
          <h1 className="mt-5 text-2xl font-semibold sm:text-3xl">
            Billing &amp; Payment Coming soon...
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/75">
            We are preparing a secure way to review bills and make payments.
            This page is not available yet.
          </p>
        </div>
      </div>
    </section>
  );
}
