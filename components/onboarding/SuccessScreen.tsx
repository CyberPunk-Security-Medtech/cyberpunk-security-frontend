"use client";

import { motion } from "framer-motion";
import Image from "next/image";


export default function SuccessScreen({ onDashboard, onAddStaff }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center text-center space-y-6"
    >
    

      {/* Confetti emoji */}
      <motion.div
        initial={{ y: -10 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="text-6xl"
      >
        🎉
      </motion.div>

      {/* Text */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Hospital Registered Successfully!
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          You can now create staff accounts and start managing patient records securely.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col w-full max-w-sm gap-3">
        <button
          onClick={onDashboard}
          className="bg-[#1A2380] text-white py-3 rounded-full font-medium hover:bg-[#151C6B] transition"
        >
          Go to Dashboard
        </button>
        <button
          onClick={onAddStaff}
          className="border border-[#1A2380] text-[#1A2380] py-3 rounded-full font-medium hover:bg-[#F8FAFB] transition"
        >
          Add Staff Accounts
        </button>
      </div>
    </motion.div>
  );
}
