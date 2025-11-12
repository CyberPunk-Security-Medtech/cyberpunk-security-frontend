"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ContactInfoCard from "./ContactInfoCard";
import ContactForm from "./ContactForm";

export default function ContactSection() {
  return (
    <section className="relative text-center z-10 pt-20 md:pt-28 pb-24 overflow-hidden">
      {/* --- Decorative vectors --- */}
      {/* Dots — now overlapping the ContactInfoCard */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
       className="absolute left-6 top-[13%] md:top-[16%] opacity-60 pointer-events-none z-10"

      >
        <Image
          src="/dot.svg"
          alt="decorative dots"
          width={150}
          height={150}
          className="opacity-80"
          priority
        />
      </motion.div>

      {/* Wave — positioned higher for balance */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        className="absolute right-16 top-[-4rem] md:top-[1rem] opacity-80 pointer-events-none"
      >
        <Image src="/vision-wavy-line.svg" alt="waves" width={100} height={50} priority />
      </motion.div>

      {/* --- Heading --- */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-[#1A2380] to-[#00B8A8] bg-clip-text text-transparent">
          Contact Us
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-3 text-[#717171] max-w-2xl mx-auto"
        >
          Any question or remarks? Just write us a message!
        </motion.p>
      </motion.div>

      {/* --- Contact Card + Form --- */}
      <div className="relative z-10 flex flex-col md:flex-row items-stretch justify-center max-w-6xl mx-auto bg-white shadow-2xl overflow-hidden p-2 md:p-4">
        {/* Info Card (left) */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative md:w-[40%] flex-shrink-0 z-30"
        >
          <div className="h-full bg-gradient-to-br from-[#1A2380] to-[#00B8A8] md:ml-2 md:my-2 relative">
            <ContactInfoCard />
          </div>
        </motion.div>

        {/* Form (right) */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="md:w-[60%] px-8 py-12 md:pl-14"
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}
