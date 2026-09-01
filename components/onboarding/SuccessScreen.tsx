"use client";

import { CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

type SuccessScreenProps = {
  onContinue: () => void;
};

export default function SuccessScreen({
  onContinue,
}: SuccessScreenProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center space-y-6 text-center"
      aria-labelledby="verification-submitted-title"
    >
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle2
          className="h-11 w-11 text-emerald-600"
          aria-hidden="true"
        />
      </span>

      <div>
        <h1
          id="verification-submitted-title"
          className="text-xl font-semibold text-gray-950 sm:text-2xl"
        >
          Verification submitted
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Your hospital documents have been submitted for review. We will
          update your verification status after the review is complete.
        </p>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="min-h-11 w-full max-w-sm rounded-full bg-[#1A2380] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#151C6B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A2380] focus-visible:ring-offset-2 motion-reduce:transition-none"
      >
        Continue to workspaces
      </button>
    </motion.section>
  );
}
