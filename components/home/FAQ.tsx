"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

export default function FAQSection() {
  const faqs = [
    { question: "How does patient consent work?" },
    { question: "Is PrivaCure compliant with privacy laws?" },
    { question: "Can hospitals not on PrivaCure receive records?" },
    { question: "Who can use or access PrivaCure?" },
    { question: "How efficient can PrivaCure handle data records?" },
  ];

  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative bg-white py-24 overflow-hidden">
      {/* Decorative dotted vector */}
      <Image
        src="/vision-splash.svg"
        alt="decorative dots"
        width={160}
        height={160}
        className="absolute left-0 top-[30%] opacity-40 pointer-events-none"
      />

      {/* Footer left-side decorative splash */}
      <Image
        src="/footer-leftside.svg"
        alt="footer splash"
        width={280}
        height={280}
        className="absolute left-0 top-[65%] opacity-40 pointer-events-none"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Centered Header */}
        <h2 className="text-[28px] md:text-[34px] font-bold text-[#0F1C2E] mb-14 text-center">
          Frequently <span className="text-[#00A9B7]">Asked Questions</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* FAQ List */}
          <div>
            <div className="space-y-4">
              {faqs.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="border border-[#E0EEF4] rounded-xl p-4 shadow-sm bg-white relative z-10"
                >
                  <button
                    onClick={() => setActive(active === i ? null : i)}
                    className="flex justify-between items-center w-full text-left"
                  >
                    <span className="text-[15px] font-medium text-[#1E2E3B]">
                      {item.question}
                    </span>
                    <span className="text-black font-bold text-xl">
                      {active === i ? "–" : "+"}
                    </span>
                  </button>
                  {active === i && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 text-sm text-gray-600"
                    >
                      This will contain a detailed explanation for the selected question.
                    </motion.p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Question Mark Side Card */}
          <div className="relative flex flex-col items-center justify-center text-center">
            <Image
              src="/question-blob.svg"
              alt="question blob"
              width={293}
              height={267}
              className="mb-4"
            />

            <h3 className="text-lg font-semibold text-[#0F1C2E]">Any Question?</h3>
            <p className="text-sm text-gray-600 mb-6">
              You can ask anything you want to know. Feedback welcome.
            </p>

            <form className="w-full max-w-sm">
              <input
                type="text"
                placeholder="Let me know"
                className="w-full border border-[#E0EEF4] rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00A9B7]"
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
