"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BookAppointmentSection() {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden py-20 sm:py-24 px-4 sm:px-6 bg-white">
      {/* Decorative Dots (hidden on mobile) */}
      <div className="hidden md:block absolute right-16 top-40 w-24 h-24 grid grid-cols-4 gap-2 opacity-20">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="w-2 h-2 bg-[#A3BFFA] rounded-sm" />
        ))}
      </div>

      {/* HEADER TEXT */}
      <div className="max-w-2xl text-center mb-16 sm:mb-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-snug">
          Book Your First <span className="text-[#00A9B7]">Appointment</span>
        </h2>
        <p className="text-gray-600 text-[15px] sm:text-base">
          Connect with our professional doctors who are ready to help you.
        </p>
        <p className="text-gray-600 mt-4 text-sm sm:text-[15px] leading-relaxed">
          Schedule a consultation with a certified healthcare professional in
          just a few clicks. Pick your preferred time and hospital, and get
          confirmation instantly.
        </p>
      </div>

      {/* CARDS SECTION */}
      <div className="relative flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
        {/* MAIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="
            relative z-20 
            w-full sm:w-[340px] md:w-[360px] 
            rounded-2xl shadow-xl p-6 sm:p-8 
            text-left backdrop-blur-md
          "
          style={{
            background:
              "linear-gradient(to bottom, rgba(183,212,254,0.5), rgba(255,129,89,0.4))",
          }}
        >
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Book your first Appointment
          </h3>
          <p className="text-sm sm:text-[15px] text-gray-700 mb-5">
            Available to 97% of our customers
          </p>
          <Link href="/home/book-now" className="rounded-[30px] bg-black text-white px-6 py-2.5 text-sm sm:text-base font-medium hover:bg-[black] transition">
            Book now
          </Link>
        </motion.div>

        {/* SECONDARY CARD */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="
            relative md:absolute 
            md:left-[-180px] md:top-[120px]
            w-full sm:w-[280px] md:w-[300px]
            rounded-2xl bg-[#B7D4FE]/80 shadow-md 
            border border-gray-100 p-5 z-10
            mt-6 md:mt-0
          "
        >
          <p className="text-gray-800 font-medium mb-3 text-sm sm:text-base">
            Check schedule of doctors
          </p>
          <div className="flex items-center gap-3">
            <Image
              src="/dr_amira.svg"
              alt="Dr. Amira"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div>
              <p className="text-gray-900 text-sm sm:text-base font-semibold">
                Dr. Amira
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                1 Oct 2025 · 8:11 AM
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
