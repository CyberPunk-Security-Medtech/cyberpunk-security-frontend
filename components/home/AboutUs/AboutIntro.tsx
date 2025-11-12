"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#15BDB0]/20 via-[#F8FCFF]/40 to-white  pt-40 md:pt-56 overflow-hidden font-sans">
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-[1]" />

      {/* --- Content Container --- */}
<div className="mx-auto px-4 sm:px-6 md:px-12 lg:px-20 text-center max-w-5xl relative z-10">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-bold  mb-6"
        >
          About{" "}
          <span className="bg-gradient-to-l  from-[#00B8A8] to-[#1A2380] bg-clip-text text-transparent">
            PrivaCure
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
          className="text-[#444] text-lg leading-relaxed mb-10"
        >
          PrivaCure is a secure, role-based healthcare platform that makes it
          easy for hospitals and medical professionals to share patient data
          safely and quickly. By combining patient consent, encryption, and
          compliance with privacy regulations, PrivaCure helps doctors, nurses,
          pharmacists, and labs work together seamlessly to deliver faster,
          better care.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <button className="px-8 py-3 rounded-[15px] bg-gradient-to-l from-[#00B8A8] to-[#1A2380] text-white font-medium hover:opacity-90 transition-all duration-300 shadow-md">
            Join the Waitlist
          </button>
          <button className="px-8 py-3 rounded-[15px] bg-gradient-to-br from-[#95DDFF] to-[#C5ECFF] text-[black] font-medium hover:opacity-90 transition-all shadow-md">
            Request Early Access
          </button>
        </motion.div>
      </div>
    </section>
  );
}
