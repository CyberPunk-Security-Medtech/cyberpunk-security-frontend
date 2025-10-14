"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ConfirmationStep({ onBack }: { onBack: () => void }) {
  const router = useRouter();

  const handleFinish = () => {
    router.push("/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-2xl shadow-md text-center space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900">
        Onboarding Complete 🎉
      </h2>
      <p className="text-gray-500">
        You’ve successfully set up your PrivaCure account. You can now access your admin dashboard.
      </p>

      <div className="flex justify-center space-x-3">
        <button
          onClick={onBack}
          className="px-5 py-2 rounded-full border border-gray-400 text-gray-700 hover:bg-gray-100"
        >
          Back
        </button>
        <button
          onClick={handleFinish}
          className="px-5 py-2 rounded-full bg-blue-900 text-white font-semibold hover:bg-blue-800"
        >
          Go to Dashboard
        </button>
      </div>
    </motion.div>
  );
}
