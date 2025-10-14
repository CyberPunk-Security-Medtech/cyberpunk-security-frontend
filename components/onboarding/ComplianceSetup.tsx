"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";

interface ComplianceSetupProps {
  onBack: () => void;
  onFinish: (data: any) => Promise<void>;
}


export default function ComplianceAuthorization({ onBack, onFinish }: ComplianceSetupProps) {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
   const [loading, setLoading] = useState(false);


  const container = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleRegister = async () => {
    if (!checked1 || !checked2) return;
    setLoading(true);
    try {
      await onFinish({ docs: [] }); // ✅ calls parent onFinish
    } catch (err) {
      console.error("Finish error:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <motion.div
      className="w-full max-w-md mx-auto flex flex-col gap-6"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.h2
        variants={item}
        className="text-center text-2xl font-semibold text-[#1A2380]"
      >
        Compliance & Authorization
      </motion.h2>

      {/* Light teal info box */}
      <motion.div
        variants={item}
        className="bg-[#E6F7F7] text-gray-700 text-sm p-4 rounded-lg border border-[#C9E9E9] leading-relaxed"
      >
        By proceeding, you confirm that your hospital complies with all
        applicable health data protection regulations and that you’re authorized
        to register this institution on PrivaCure.
      </motion.div>

      {/* Checkbox 1 */}
      <motion.label
        variants={item}
        className="flex items-start gap-3 border border-gray-300 rounded-lg p-3 cursor-pointer"
      >
        <input
          type="checkbox"
          checked={checked1}
          onChange={() => setChecked1(!checked1)}
          className="mt-1 w-5 h-5 accent-[#1A2380]"
        />
        <span className="text-sm text-gray-800">
      I confirm that I am authorized to register this hospital.
        </span>
      </motion.label>

      {/* Checkbox 2 */}
      <motion.label
        variants={item}
        className="flex items-start gap-3 border border-gray-300 rounded-lg p-3 cursor-pointer"
      >
        <input
          type="checkbox"
          checked={checked2}
          onChange={() => setChecked2(!checked2)}
          className="mt-1 w-5 h-5 accent-[#1A2380]"
        />
        <span className="text-sm text-gray-800">
         I agree to the Privacy Policy and NDPR, HIPAA, GDPR compliance terms.
          
        </span>
      </motion.label>
      
 {/* Register Button */}
      <motion.button
        variants={item}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleRegister} // ✅ Added this
        disabled={!checked1 || !checked2 || loading}
        className={`mt-2 w-full py-3 rounded-lg text-white font-medium transition-colors ${
          checked1 && checked2
            ? "bg-[#1A2380] hover:bg-[#151C6B]"
            : "bg-[#AAB0D6] cursor-not-allowed"
        }`}
      >
        {loading ? "Registering..." : "Register Hospital"}
      </motion.button>
    </motion.div>
  );
}