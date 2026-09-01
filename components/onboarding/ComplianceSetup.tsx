"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

type ComplianceSetupProps = {
  onBack: () => void;
  onFinish: () => Promise<void>;
};

export default function ComplianceAuthorization({
  onBack,
  onFinish,
}: ComplianceSetupProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = isAuthorized && hasAcceptedTerms && !isSubmitting;

  const handleRegister = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onFinish();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit the hospital for verification. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const entrance = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <motion.section
      {...entrance}
      className="mx-auto flex w-full max-w-md flex-col gap-5"
      aria-labelledby="compliance-title"
    >
      <header className="text-center">
        <h1
          id="compliance-title"
          className="text-xl font-semibold text-[#1A2380] sm:text-2xl"
        >
          Compliance &amp; Authorization
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Confirm your authority to register this hospital
        </p>
      </header>

      <div className="rounded-xl border border-[#C9E9E9] bg-[#E6F7F7] p-4 text-sm leading-6 text-gray-700">
        By proceeding, you confirm that your hospital complies with all
        applicable health data protection regulations and that you are
        authorized to register this institution on PrivaCure.
      </div>

      <label className="flex min-h-14 cursor-pointer items-start gap-3 rounded-xl border border-gray-300 p-3 text-sm text-gray-800 transition focus-within:border-[#1A2380] focus-within:ring-2 focus-within:ring-[#1A2380]/20 motion-reduce:transition-none">
        <input
          type="checkbox"
          checked={isAuthorized}
          onChange={(event) => setIsAuthorized(event.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-[#1A2380]"
        />
        <span>I confirm that I am authorized to register this hospital.</span>
      </label>

      <label className="flex min-h-14 cursor-pointer items-start gap-3 rounded-xl border border-gray-300 p-3 text-sm text-gray-800 transition focus-within:border-[#1A2380] focus-within:ring-2 focus-within:ring-[#1A2380]/20 motion-reduce:transition-none">
        <input
          type="checkbox"
          checked={hasAcceptedTerms}
          onChange={(event) => setHasAcceptedTerms(event.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-[#1A2380]"
        />
        <span>
          I agree to the Privacy Policy and NDPR, HIPAA, and GDPR compliance
          terms.
        </span>
      </label>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => void handleRegister()}
          disabled={!canSubmit}
          className="min-h-11 w-full rounded-full bg-[#1A2380] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#151C6B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A2380] focus-visible:ring-offset-2 motion-reduce:transition-none disabled:cursor-not-allowed disabled:bg-[#AAB0D6]"
        >
          {isSubmitting ? "Submitting for review…" : "Register Hospital"}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="min-h-11 w-full rounded-full px-6 py-2 text-sm font-medium text-[#1A2380] transition hover:bg-[#1A2380]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A2380] focus-visible:ring-offset-2 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          Back to verification
        </button>
      </div>
    </motion.section>
  );
}
